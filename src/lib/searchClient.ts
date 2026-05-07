/**
 * FindaFlight — Client-Side Search Service
 *
 * Calls the backend API routes which securely proxy to SerpApi.
 * Handles scoring, ranking, and result assembly for the frontend.
 */

import { rankFlights, rankPairedItineraries, generateRecommendation, buildDestinationCards } from '@/lib/scoring';
import { FlightSearchParams, FlightOption, SearchResults, SearchMode, RankedFlight, PriceInsights } from '@/types/flight';
import { ANYWHERE_DESTINATIONS } from '@/lib/utils';
import { detectHiddenCityOpportunities } from '@/lib/hiddenCity';

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
  params: FlightSearchParams & { preference?: string; maxPrice?: number },
): Promise<SearchResults> {
  const { origin, destination, departureDate, returnDate, mode = 'standard', preference = 'best', maxPrice } = params;

  // ─── Basic client-side validation ─────────────────────────────────
  if (!origin || !departureDate) {
    throw new Error('Missing required fields: origin, departureDate');
  }
  if (mode !== 'anywhere' && !destination) {
    throw new Error('Missing required field: destination');
  }
  const airportRegex = /^[A-Za-z]{3}$/;
  if (!airportRegex.test(origin)) {
    throw new Error('Invalid origin airport code. Use 3-letter IATA codes (e.g., CID, MIA)');
  }
  if (mode !== 'anywhere' && destination && !airportRegex.test(destination)) {
    throw new Error('Invalid destination airport code');
  }
  if (mode !== 'anywhere' && destination && origin.toUpperCase() === destination.toUpperCase()) {
    throw new Error('Origin and destination cannot be the same');
  }

  // ================================================================
  // TAKE ME ANYWHERE MODE
  // ================================================================
  if (mode === 'anywhere') {
    if (!returnDate) throw new Error('Return date is required for Take Me Anywhere searches');
    return searchAnywhere(origin, departureDate, returnDate, preference, maxPrice);
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
    // For round-trip, search for return flights separately
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

  // One-way results
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
  // 1. Search for standard flights TO the destination (for price baseline)
  // 2. Search for flights THROUGH the destination (where it's a layover)
  // Then compare prices to detect hidden-city opportunities

  // Standard price baseline
  const standardParams: FlightSearchParams = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate,
    type: 2,
  };

  let standardPrice: number | null = null;
  try {
    const standardData = await callSearchApi(standardParams);
    if (standardData.flights.length > 0) {
      standardPrice = Math.min(...standardData.flights.map(f => f.price));
    }
  } catch (err) {
    console.warn('[SearchClient] Standard route search failed for baseline:', err);
  }

  // Search for flights that go through the destination using show_hidden
  const throughParams: FlightSearchParams = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate,
    type: 2,
    show_hidden: true,
    deep_search: true,
  };

  const throughData = await callSearchApi(throughParams);

  // Run hidden-city detection
  const annotatedFlights = detectHiddenCityOpportunities(
    throughData.flights,
    destination.toUpperCase(),
    standardPrice,
  );

  const rankedOutbounds = rankFlights(annotatedFlights);

  // Search for return flights (standard one-way back)
  const returnParams: FlightSearchParams = {
    origin: destination.toUpperCase(),
    destination: origin.toUpperCase(),
    departureDate: returnDate,
    type: 2,
  };

  let rankedReturns: RankedFlight[] = [];
  try {
    const returnData = await callSearchApi(returnParams);
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
    };
  }

  // Fallback to one-way results if pairing fails
  const recommendation = generateRecommendation(rankedOutbounds, false);
  return {
    mode: 'layover',
    flights: rankedOutbounds,
    recommendation,
    priceInsights: throughData.priceInsights,
    searchParams: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), departureDate, returnDate, mode: 'layover' },
    isMockData: false,
    dataSource: 'api',
  };
}

/**
 * Take Me Anywhere search — searches multiple destinations.
 */
async function searchAnywhere(
  origin: string,
  departureDate: string,
  returnDate: string,
  preference: string,
  maxPrice?: number,
): Promise<SearchResults> {
  const from = origin.toUpperCase();
  const allDests = Object.keys(ANYWHERE_DESTINATIONS).filter(d => d !== from);

  // Search destinations in parallel (batched to avoid hammering the API)
  const BATCH_SIZE = 4;
  const rankedOutbound: Record<string, RankedFlight[]> = {};
  const rankedReturns: Record<string, RankedFlight[]> = {};

  for (let i = 0; i < allDests.length; i += BATCH_SIZE) {
    const batch = allDests.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async dest => {
        const outParams: FlightSearchParams = {
          origin: from,
          destination: dest,
          departureDate,
          type: 2,
          maxPrice,
        };

        const retParams: FlightSearchParams = {
          origin: dest,
          destination: from,
          departureDate: returnDate,
          type: 2,
        };

        const [outData, retData] = await Promise.all([
          callSearchApi(outParams),
          callSearchApi(retParams),
        ]);

        return { dest, outData, retData };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { dest, outData, retData } = result.value;
        let outFlights = outData.flights;

        // Apply max price filter
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
  };
}
