import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/serpapi';
import { generateMockFlights, generateMockLayoverFlights } from '@/lib/mockData';
import { rankFlights, rankPairedItineraries, generateRecommendation } from '@/lib/scoring';
import { getServerConfig } from '@/lib/config';
import { FlightSearchParams, SearchResults, SearchMode } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { origin, destination, departureDate, returnDate, mode = 'standard' } = body as FlightSearchParams;

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: origin, destination, departureDate' },
        { status: 400 }
      );
    }

    if (mode === 'layover' && !returnDate) {
      return NextResponse.json(
        { error: 'Return date is required for layover destination searches' },
        { status: 400 }
      );
    }

    // Validate airport codes (3 letters)
    const airportRegex = /^[A-Za-z]{3}$/;
    if (!airportRegex.test(origin) || !airportRegex.test(destination)) {
      return NextResponse.json(
        { error: 'Invalid airport code. Use 3-letter IATA codes (e.g., CID, MIA)' },
        { status: 400 }
      );
    }

    // Same origin and destination check
    if (origin.toUpperCase() === destination.toUpperCase()) {
      return NextResponse.json(
        { error: 'Origin and destination cannot be the same' },
        { status: 400 }
      );
    }

    const config = getServerConfig();
    let isMockData = config.useMockData;

    if (mode === 'layover') {
      // FOR LAYOVER MODE (HYBRID/MOCK APPROACH)
      // To keep demos reliable and fast, outbound layovers are mocked, while return can be live.
      
      let outbounds = generateMockLayoverFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);
      let returns;

      if (!config.useMockData && returnDate) {
        try {
          returns = await searchFlights(destination.toUpperCase(), origin.toUpperCase(), returnDate, config.serpApiKey);
          if (!returns || returns.length === 0) throw new Error("Empty return flights");
        } catch (err) {
          console.warn('SerpAPI failed for return leg, using mock', err);
          returns = generateMockFlights(destination.toUpperCase(), origin.toUpperCase(), returnDate);
          isMockData = true;
        }
      } else {
        returns = generateMockFlights(destination.toUpperCase(), origin.toUpperCase(), returnDate!);
        isMockData = true;
      }

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
          destination: destination.toUpperCase(),
          departureDate,
          returnDate,
          mode
        },
        isMockData,
      };

      return NextResponse.json(results);

    } else {
      // STANDARD SEARCH
      let rawFlights;

      if (!config.useMockData) {
        try {
          rawFlights = await searchFlights(
            origin.toUpperCase(),
            destination.toUpperCase(),
            departureDate,
            config.serpApiKey,
          );
        } catch (apiError) {
          console.warn('SerpAPI failed, falling back to mock data:', apiError);
          rawFlights = generateMockFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);
          isMockData = true;
        }
      } else {
        rawFlights = generateMockFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);
        isMockData = true;
      }

      if (!rawFlights || rawFlights.length === 0) {
        rawFlights = generateMockFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);
        isMockData = true;
      }

      const rankedFlights = rankFlights(rawFlights);
      const recommendation = generateRecommendation(rankedFlights, false);

      const results: SearchResults = {
        mode,
        flights: rankedFlights,
        recommendation,
        searchParams: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departureDate,
          returnDate,
          mode
        },
        isMockData,
      };

      return NextResponse.json(results);
    }

  } catch (error) {
    console.error('Search API error:', error);
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
