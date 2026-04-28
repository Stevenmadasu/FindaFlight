import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/serpapi';
import { generateMockFlights, generateMockLayoverFlights, generateAnywhereFlights } from '@/lib/mockData';
import { rankFlights, rankPairedItineraries, generateRecommendation, buildDestinationCards } from '@/lib/scoring';
import { getServerConfig } from '@/lib/config';
import { FlightSearchParams, SearchResults, SearchMode } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { origin, destination, departureDate, returnDate, mode = 'standard', preference = 'best', maxPrice } = body as FlightSearchParams & { preference?: string; maxPrice?: number };

    if (!origin || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: origin, departureDate' },
        { status: 400 }
      );
    }

    if (mode !== 'anywhere' && !destination) {
      return NextResponse.json(
        { error: 'Missing required field: destination' },
        { status: 400 }
      );
    }

    if (mode === 'layover' && !returnDate) {
      return NextResponse.json(
        { error: 'Return date is required for layover destination searches' },
        { status: 400 }
      );
    }

    if (mode === 'anywhere' && !returnDate) {
      return NextResponse.json(
        { error: 'Return date is required for Take Me Anywhere searches' },
        { status: 400 }
      );
    }

    // Validate airport codes (3 letters)
    const airportRegex = /^[A-Za-z]{3}$/;
    if (!airportRegex.test(origin)) {
      return NextResponse.json(
        { error: 'Invalid origin airport code. Use 3-letter IATA codes (e.g., CID, MIA)' },
        { status: 400 }
      );
    }

    if (mode !== 'anywhere' && destination && !airportRegex.test(destination)) {
      return NextResponse.json(
        { error: 'Invalid destination airport code. Use 3-letter IATA codes (e.g., CID, MIA)' },
        { status: 400 }
      );
    }

    // Same origin and destination check
    if (mode !== 'anywhere' && destination && origin.toUpperCase() === destination.toUpperCase()) {
      return NextResponse.json(
        { error: 'Origin and destination cannot be the same' },
        { status: 400 }
      );
    }

    const config = getServerConfig();
    let isMockData = config.useMockData;
    let dataSource = 'mock';

    // ================================================================
    // TAKE ME ANYWHERE MODE
    // ================================================================
    if (mode === 'anywhere') {
      console.log(`[FindaFlight] Anywhere search from ${origin} on ${departureDate} → ${returnDate}`);

      const { outbound, returns } = generateAnywhereFlights(
        origin.toUpperCase(), departureDate, returnDate!, maxPrice
      );

      // Rank all flights for each destination
      const rankedOutbound: Record<string, import('@/types/flight').RankedFlight[]> = {};
      const rankedReturns: Record<string, import('@/types/flight').RankedFlight[]> = {};

      for (const [dest, flights] of Object.entries(outbound)) {
        rankedOutbound[dest] = rankFlights(flights);
      }
      for (const [dest, flights] of Object.entries(returns)) {
        rankedReturns[dest] = rankFlights(flights);
      }

      const destinations = buildDestinationCards(
        rankedOutbound, rankedReturns,
        departureDate, returnDate!,
        preference,
      );

      isMockData = true;
      dataSource = 'mock';
      console.log(`[FindaFlight] Data source: ${dataSource} | ${destinations.length} destinations found`);

      const results: SearchResults = {
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
        isMockData,
        dataSource,
      };

      return NextResponse.json(results);
    }

    // ================================================================
    // LAYOVER MODE
    // ================================================================
    if (mode === 'layover') {
      console.log(`[FindaFlight] Layover search: ${origin} → layover in ${destination} on ${departureDate}`);

      let outbounds = generateMockLayoverFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
      let returns;

      if (!config.useMockData && returnDate) {
        try {
          returns = await searchFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate, config.serpApiKey);
          if (!returns || returns.length === 0) throw new Error("Empty return flights");
          dataSource = 'hybrid';
          console.log(`[FindaFlight] Data source: ${dataSource} (outbound=mock, return=API)`);
        } catch (err) {
          console.warn('[FindaFlight] SerpAPI failed for return leg, using mock', err);
          returns = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate);
          isMockData = true;
          dataSource = 'mock';
        }
      } else {
        returns = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate!);
        isMockData = true;
        dataSource = 'mock';
      }

      console.log(`[FindaFlight] Data source: ${dataSource}`);

      const rankedOutbounds = rankFlights(outbounds);
      const rankedReturns = rankFlights(returns);
      
      const pairedItineraries = rankPairedItineraries(rankedOutbounds, rankedReturns);
      const recommendation = generateRecommendation(pairedItineraries, true);

      const results: SearchResults = {
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
        isMockData,
        dataSource,
      };

      return NextResponse.json(results);

    } else {
      // ================================================================
      // STANDARD SEARCH
      // ================================================================
      console.log(`[FindaFlight] Standard search: ${origin} → ${destination} on ${departureDate}${returnDate ? ` (return: ${returnDate})` : ''}`);

      let rawFlights;

      if (!config.useMockData) {
        try {
          rawFlights = await searchFlights(
            origin.toUpperCase(),
            destination!.toUpperCase(),
            departureDate,
            config.serpApiKey,
          );
          dataSource = 'api';
          console.log(`[FindaFlight] Data source: API | ${rawFlights?.length || 0} flights`);
        } catch (apiError) {
          console.warn('[FindaFlight] SerpAPI failed, falling back to mock data:', apiError);
          rawFlights = generateMockFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
          isMockData = true;
          dataSource = 'mock';
        }
      } else {
        rawFlights = generateMockFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
        isMockData = true;
        dataSource = 'mock';
      }

      if (!rawFlights || rawFlights.length === 0) {
        rawFlights = generateMockFlights(origin.toUpperCase(), destination!.toUpperCase(), departureDate);
        isMockData = true;
        dataSource = 'mock';
      }

      const rankedFlights = rankFlights(rawFlights);

      // If returnDate is provided, also generate return flights and pair them
      if (returnDate) {
        console.log(`[FindaFlight] Pairing round-trip with return on ${returnDate}`);

        let returnRawFlights;
        if (!config.useMockData) {
          try {
            returnRawFlights = await searchFlights(
              destination!.toUpperCase(),
              origin.toUpperCase(),
              returnDate,
              config.serpApiKey,
            );
            if (!returnRawFlights || returnRawFlights.length === 0) throw new Error("Empty return");
          } catch {
            returnRawFlights = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate);
            if (dataSource === 'api') dataSource = 'hybrid';
          }
        } else {
          returnRawFlights = generateMockFlights(destination!.toUpperCase(), origin.toUpperCase(), returnDate);
        }

        const rankedReturns = rankFlights(returnRawFlights);
        const pairedItineraries = rankPairedItineraries(rankedFlights, rankedReturns);
        const recommendation = generateRecommendation(pairedItineraries, true);

        console.log(`[FindaFlight] Data source: ${dataSource} | ${pairedItineraries.length} round-trip pairs`);

        const results: SearchResults = {
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
          isMockData,
          dataSource,
        };

        return NextResponse.json(results);
      }

      // One-way results
      const recommendation = generateRecommendation(rankedFlights, false);

      console.log(`[FindaFlight] Data source: ${dataSource} | ${rankedFlights.length} one-way flights`);

      const results: SearchResults = {
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
        isMockData,
        dataSource,
      };

      return NextResponse.json(results);
    }

  } catch (error) {
    console.error('[FindaFlight] Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search flights. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
