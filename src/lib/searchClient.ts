/**
 * FindaFlight — Client-Side Search Service
 * 
 * Handles all flight search logic in the browser since Azure SWA free tier
 * doesn't support server-side API routes. Uses mock data for all searches.
 */

import { generateMockFlights, generateMockLayoverFlights, generateAnywhereFlights } from '@/lib/mockData';
import { rankFlights, rankPairedItineraries, generateRecommendation, buildDestinationCards } from '@/lib/scoring';
import { FlightSearchParams, SearchResults, SearchMode, RankedFlight } from '@/types/flight';

export async function searchFlightsClient(params: FlightSearchParams & { preference?: string; maxPrice?: number }): Promise<SearchResults> {
  const { origin, destination, departureDate, returnDate, mode = 'standard', preference = 'best', maxPrice } = params;

  // Validate
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

    const { outbound, returns } = generateAnywhereFlights(
      origin.toUpperCase(), departureDate, returnDate, maxPrice
    );

    const rankedOutbound: Record<string, RankedFlight[]> = {};
    const rankedReturns: Record<string, RankedFlight[]> = {};

    for (const [dest, flights] of Object.entries(outbound)) {
      rankedOutbound[dest] = rankFlights(flights);
    }
    for (const [dest, flights] of Object.entries(returns)) {
      rankedReturns[dest] = rankFlights(flights);
    }

    const destinations = buildDestinationCards(
      rankedOutbound, rankedReturns,
      departureDate, returnDate,
      preference,
    );

    return {
      mode: 'anywhere' as SearchMode,
      destinations,
      recommendation: null,
      searchParams: {
        origin: origin.toUpperCase(),
        destination: 'Anywhere',
        departureDate,
        returnDate,
        mode: 'anywhere',
      },
      isMockData: true,
      dataSource: 'mock',
    };
  }

  // ================================================================
  // LAYOVER MODE
  // ================================================================
  if (mode === 'layover') {
    if (!returnDate) throw new Error('Return date is required for layover destination searches');

    const outbounds = generateMockLayoverFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
    const returns = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate);

    const rankedOutbounds = rankFlights(outbounds);
    const rankedReturns = rankFlights(returns);

    const pairedItineraries = rankPairedItineraries(rankedOutbounds, rankedReturns);
    const recommendation = generateRecommendation(pairedItineraries, true);

    return {
      mode,
      pairedItineraries,
      recommendation,
      searchParams: {
        origin: origin.toUpperCase(),
        destination: destination!.toUpperCase(),
        departureDate,
        returnDate,
        mode
      },
      isMockData: true,
      dataSource: 'mock',
    };
  }

  // ================================================================
  // STANDARD SEARCH
  // ================================================================
  const rawFlights = generateMockFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
  const rankedFlights = rankFlights(rawFlights);

  // Round-trip pairing if returnDate provided
  if (returnDate) {
    const returnRawFlights = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate);
    const rankedReturns = rankFlights(returnRawFlights);
    const pairedItineraries = rankPairedItineraries(rankedFlights, rankedReturns);
    const recommendation = generateRecommendation(pairedItineraries, true);

    return {
      mode,
      pairedItineraries,
      recommendation,
      searchParams: {
        origin: origin.toUpperCase(),
        destination: destination!.toUpperCase(),
        departureDate,
        returnDate,
        mode
      },
      isMockData: true,
      dataSource: 'mock',
    };
  }

  // One-way
  const recommendation = generateRecommendation(rankedFlights, false);

  return {
    mode,
    flights: rankedFlights,
    recommendation,
    searchParams: {
      origin: origin.toUpperCase(),
      destination: destination!.toUpperCase(),
      departureDate,
      returnDate,
      mode
    },
    isMockData: true,
    dataSource: 'mock',
  };
}
