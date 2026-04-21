import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/serpapi';
import { generateMockFlights } from '@/lib/mockData';
import { rankFlights, generateRecommendation } from '@/lib/scoring';
import { getServerConfig } from '@/lib/config';
import { FlightSearchParams, SearchResults } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { origin, destination, departureDate, returnDate } = body as FlightSearchParams;

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: origin, destination, departureDate' },
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

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (returnDate && !dateRegex.test(returnDate)) {
      return NextResponse.json(
        { error: 'Invalid return date format. Use YYYY-MM-DD' },
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
    let rawFlights;
    let isMockData = false;

    // Try SerpAPI first, fall back to mock data
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

    // If SerpAPI returned empty results, use mock data
    if (!rawFlights || rawFlights.length === 0) {
      rawFlights = generateMockFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);
      isMockData = true;
    }

    // Rank and score flights
    const rankedFlights = rankFlights(rawFlights);

    // Generate recommendation
    const recommendation = generateRecommendation(rankedFlights);

    const results: SearchResults = {
      flights: rankedFlights,
      recommendation,
      searchParams: {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate,
      },
      isMockData,
    };

    return NextResponse.json(results);
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
