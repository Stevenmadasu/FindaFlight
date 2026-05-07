/**
 * FindaFlight — Client-Side Search Service
 *
 * Calls the backend API routes which securely proxy to SerpApi.
 * Handles scoring, ranking, and result assembly for the frontend.
 * Supports auth-gated international "Take Me Anywhere" search.
 */

import { rankFlights, rankPairedItineraries, generateRecommendation, buildDestinationCards } from '@/lib/scoring';
import { FlightSearchParams, FlightOption, SearchResults, RankedFlight, PriceInsights } from '@/types/flight';
import { DOMESTIC_DESTINATIONS, INTERNATIONAL_DESTINATIONS, ANYWHERE_DESTINATIONS } from '@/lib/utils';
import { detectHiddenCityOpportunities } from '@/lib/hiddenCity';
import { generateFlexDates, aggregateFlexResults, type FlexRange } from '@/lib/flexDates';

/** Response shape from our API routes */
interface FlightApiResponse {
  flights: FlightOption[];
  priceInsights?: PriceInsights;
  searchMetadata?: unknown;
  message?: string;
  error?: string;
  code?: string;
}

/**
 * Call the backend search API.
 */
async function callSearchApi(params: FlightSearchParams): Promise<FlightApiResponse> {
  const res = await fetch('/api/flights/search/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Search failed (HTTP ${res.status})`);
  }

  return data;
}

/**
 * Main entry point for all flight searches.
 */
export async function searchFlightsClient(
  params: FlightSearchParams & { preference?: string; maxPrice?: number; isAuthenticated?: boolean },
): Promise<SearchResults> {
  const { origin, destination, departureDate, returnDate, mode = 'standard', preference = 'best', maxPrice, isAuthenticated = false } = params;

  // ─── Basic client-side validation ─────────────────────────────────
  if (!origin || !departureDate) {
    throw new Error('Missing required fields: origin, departureDate');
  }
  if (mode !== 'anywhere' && !destination) {
    throw new Error('Missing required field: destination');
  }

  // Accept comma-separated codes and single IATA codes
  const originCodes = origin.split(',').map(c => c.trim().toUpperCase());
  for (const c of originCodes) {
    if (!/^[A-Z]{3}$/.test(c) && !c.startsWith('/')) {
      throw new Error(`Invalid origin airport code: ${c}`);
    }
  }
  if (mode !== 'anywhere' && destination) {
    const destCodes = destination.split(',').map(c => c.trim().toUpperCase());
    for (const c of destCodes) {
      if (!/^[A-Z]{3}$/.test(c) && !c.startsWith('/')) {
        throw new Error(`Invalid destination airport code: ${c}`);
      }
    }
    if (originCodes[0] === destination.split(',')[0]?.trim().toUpperCase()) {
      throw new Error('Origin and destination cannot be the same');
    }
  }

  // ================================================================
  // TAKE ME ANYWHERE MODE
  // ================================================================
  if (mode === 'anywhere') {
    if (!returnDate) throw new Error('Return date is required for Take Me Anywhere searches');
    return searchAnywhere(origin, departureDate, returnDate, preference, maxPrice, isAuthenticated);
  }

  // ================================================================
  // LAYOVER MODE
  // ================================================================
  if (mode === 'layover') {
    if (!returnDate) throw new Error('Return date is required for layover destination searches');
    return searchLayover(origin, destination!, departureDate, returnDate);
  }

  // ================================================================
  // STANDARD SEARCH
  // ================================================================
  return searchStandard(origin, destination!, departureDate, returnDate);
}

/**
 * Flex-date search (triggered by "Check nearby dates" button).
 */
export async function searchFlexDates(
  origin: string,
  destination: string,
  baseDate: string,
  range: FlexRange = '3',
): Promise<{ cheapestDate: string; cheapestPrice: number; allDates: { date: string; bestPrice: number; flightCount: number }[] }> {
  const dates = generateFlexDates(baseDate, range);
  const results = new Map<string, { bestPrice: number; flightCount: number }>();

  // Search each date (batched to avoid API hammering)
  const BATCH = 3;
  for (let i = 0; i < dates.length; i += BATCH) {
    const batch = dates.slice(i, i + BATCH);
    const batchResults = await Promise.allSettled(
      batch.map(async date => {
        const data = await callSearchApi({
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departureDate: date,
          type: 2,
        });
        return { date, data };
      }),
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        const { date, data } = result.value;
        const prices = data.flights.map(f => f.price);
        results.set(date, {
          bestPrice: prices.length > 0 ? Math.min(...prices) : 0,
          flightCount: data.flights.length,
        });
      }
    }
  }

  return aggregateFlexResults(results);
}

/**
 * Standard flight search (one-way or round-trip).
 */
async function searchStandard(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
): Promise<SearchResults> {
  const searchParams: FlightSearchParams = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate,
    returnDate,
    type: returnDate ? 1 : 2,
  };

  const data = await callSearchApi(searchParams);
  const rankedFlights = rankFlights(data.flights);

  // Round-trip pairing
  if (returnDate && rankedFlights.length > 0) {
    const returnParams: FlightSearchParams = {
      origin: destination.toUpperCase(),
      destination: origin.toUpperCase(),
      departureDate: returnDate,
      type: 2,
    };

    try {
      const returnData = await callSearchApi(returnParams);
      const rankedReturns = rankFlights(returnData.flights);

      if (rankedReturns.length > 0) {
        const pairedItineraries = rankPairedItineraries(rankedFlights, rankedReturns);
        const recommendation = generateRecommendation(pairedItineraries, true);

        return {
          mode: 'standard',
          pairedItineraries,
          recommendation,
          priceInsights: data.priceInsights,
          searchParams: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, returnDate, mode: 'standard' },
          isMockData: false,
          dataSource: 'api',
        };
      }
    } catch (err) {
      console.warn('[SearchClient] Return flight search failed, showing one-way results:', err);
    }
  }

  const recommendation = generateRecommendation(rankedFlights, false);
  return {
    mode: 'standard',
    flights: rankedFlights,
    recommendation,
    priceInsights: data.priceInsights,
    searchParams: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, returnDate, mode: 'standard' },
    isMockData: false,
    dataSource: 'api',
  };
}

/**
 * Layover destination search (hidden-city detection).
 */
async function searchLayover(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
): Promise<SearchResults> {
  // Standard price baseline
  let standardPrice: number | null = null;
  try {
    const standardData = await callSearchApi({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      type: 2,
    });
    if (standardData.flights.length > 0) {
      standardPrice = Math.min(...standardData.flights.map(f => f.price));
    }
  } catch (err) {
    console.warn('[SearchClient] Standard route search failed for baseline:', err);
  }

  // Search with show_hidden + deep_search
  const throughData = await callSearchApi({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate,
    type: 2,
    show_hidden: true,
    deep_search: true,
  });

  const annotatedFlights = detectHiddenCityOpportunities(
    throughData.flights,
    destination.toUpperCase(),
    standardPrice,
  );

  const rankedOutbounds = rankFlights(annotatedFlights);

  // Return flights
  let rankedReturns: RankedFlight[] = [];
  try {
    const returnData = await callSearchApi({
      origin: destination.toUpperCase(),
      destination: origin.toUpperCase(),
      departureDate: returnDate,
      type: 2,
    });
    rankedReturns = rankFlights(returnData.flights);
  } catch (err) {
    console.warn('[SearchClient] Return flight search failed:', err);
  }

  if (rankedOutbounds.length > 0 && rankedReturns.length > 0) {
    const pairedItineraries = rankPairedItineraries(rankedOutbounds, rankedReturns);
    const recommendation = generateRecommendation(pairedItineraries, true);

    return {
      mode: 'layover',
      pairedItineraries,
      recommendation,
      priceInsights: throughData.priceInsights,
      searchParams: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, returnDate, mode: 'layover' },
      isMockData: false,
      dataSource: 'api',
      resultType: 'layover_deal',
    };
  }

  const recommendation = generateRecommendation(rankedOutbounds, false);
  return {
    mode: 'layover',
    flights: rankedOutbounds,
    recommendation,
    priceInsights: throughData.priceInsights,
    searchParams: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, returnDate, mode: 'layover' },
    isMockData: false,
    dataSource: 'api',
    resultType: 'layover_deal',
  };
}

/**
 * Take Me Anywhere — auth-gated international destinations.
 * Anonymous: all domestic + 1 random international
 * Authenticated: all domestic + all international
 */
async function searchAnywhere(
  origin: string,
  departureDate: string,
  returnDate: string,
  preference: string,
  maxPrice?: number,
  isAuthenticated: boolean = false,
): Promise<SearchResults> {
  const from = origin.toUpperCase();

  // Build destination list based on auth status
  const domesticDests = Object.keys(DOMESTIC_DESTINATIONS).filter(d => d !== from);

  let internationalDests: string[];
  let requiresAuth = false;

  if (isAuthenticated) {
    // Full international access
    internationalDests = Object.keys(INTERNATIONAL_DESTINATIONS).filter(d => d !== from);
  } else {
    // 1 random international destination for anonymous users
    const allIntl = Object.keys(INTERNATIONAL_DESTINATIONS).filter(d => d !== from);
    const randomIdx = Math.floor(Math.random() * allIntl.length);
    internationalDests = allIntl.length > 0 ? [allIntl[randomIdx]] : [];
    requiresAuth = allIntl.length > 1; // Flag that more are available
  }

  const allDests = [...domesticDests, ...internationalDests];

  // Search destinations in parallel (batched)
  const BATCH_SIZE = 4;
  const rankedOutbound: Record<string, RankedFlight[]> = {};
  const rankedReturns: Record<string, RankedFlight[]> = {};

  for (let i = 0; i < allDests.length; i += BATCH_SIZE) {
    const batch = allDests.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async dest => {
        const [outData, retData] = await Promise.all([
          callSearchApi({ origin: from, destination: dest, departureDate, type: 2, maxPrice }),
          callSearchApi({ origin: dest, destination: from, departureDate: returnDate, type: 2 }),
        ]);
        return { dest, outData, retData };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { dest, outData, retData } = result.value;
        let outFlights = outData.flights;

        if (maxPrice) {
          const filtered = outFlights.filter(f => f.price <= maxPrice);
          outFlights = filtered.length > 0 ? filtered : outFlights.slice(0, 2);
        }

        rankedOutbound[dest] = rankFlights(outFlights);
        rankedReturns[dest] = rankFlights(retData.flights);
      } else {
        console.warn('[SearchClient] Anywhere search failed for a destination:', result.reason);
      }
    }
  }

  const destinations = buildDestinationCards(
    rankedOutbound,
    rankedReturns,
    departureDate,
    returnDate,
    preference,
  );

  return {
    mode: 'anywhere',
    destinations,
    recommendation: null,
    searchParams: { origin: from, destination: 'Anywhere', departureDate, returnDate, mode: 'anywhere' },
    isMockData: false,
    dataSource: 'api',
    requiresAuth,
  };
}
