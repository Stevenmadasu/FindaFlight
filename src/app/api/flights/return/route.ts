/**
 * POST /api/flights/return
 *
 * Fetches return flight options using a departure_token from a previous search.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchReturnFlights } from '@/lib/serpapi';
import { normalizeFlightResults, normalizePriceInsights } from '@/lib/normalize';
import { ApiErrorResponse, FlightSearchParams } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const { departure_token, searchParams } = body as {
      departure_token: string;
      searchParams: FlightSearchParams;
    };

    if (!departure_token) {
      return NextResponse.json(
        { error: 'departure_token is required', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    if (!searchParams || !searchParams.origin || !searchParams.destination) {
      return NextResponse.json(
        { error: 'searchParams with origin and destination are required', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const rawResponse = await fetchReturnFlights(departure_token, searchParams);
    const flights = normalizeFlightResults(rawResponse);
    const priceInsights = normalizePriceInsights(rawResponse.price_insights);

    return NextResponse.json({
      flights,
      priceInsights,
      searchMetadata: rawResponse.search_metadata,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API /flights/return] Error:', message);

    if (message.includes('SERPAPI_API_KEY')) {
      return NextResponse.json(
        { error: 'Flight search service is not configured.', code: 'MISSING_API_KEY' } as ApiErrorResponse,
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch return flights.', code: 'API_ERROR' } as ApiErrorResponse,
      { status: 500 },
    );
  }
}
