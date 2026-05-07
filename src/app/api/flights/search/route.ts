/**
 * POST /api/flights/search
 *
 * Main flight search endpoint. Validates inputs, calls SerpApi,
 * normalizes results, and returns scored flight data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSearchParams } from '@/lib/validation';
import { searchFlights } from '@/lib/serpapi';
import { normalizeFlightResults, normalizePriceInsights } from '@/lib/normalize';
import { FlightSearchParams, ApiErrorResponse } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const params: FlightSearchParams = body;

    // Validate
    const validation = validateSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      type: params.type,
      travel_class: params.travel_class,
      adults: params.adults,
      children: params.children,
      infants_in_seat: params.infants_in_seat,
      infants_on_lap: params.infants_on_lap,
      sort_by: params.sort_by,
      exclude_airlines: params.exclude_airlines,
      include_airlines: params.include_airlines,
      return_times: params.return_times,
      exclude_basic: params.exclude_basic,
      gl: params.gl,
      mode: params.mode,
      includeNearby: params.includeNearby,
      flexDates: params.flexDates,
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.errors.map(e => e.message).join('; '),
          code: 'VALIDATION_ERROR',
          details: JSON.stringify(validation.errors),
        } as ApiErrorResponse,
        { status: 400 },
      );
    }

    // Search via SerpApi
    const rawResponse = await searchFlights(params);

    // Normalize results
    const flights = normalizeFlightResults(rawResponse);
    const priceInsights = normalizePriceInsights(rawResponse.price_insights);

    // Check for empty results
    if (flights.length === 0) {
      return NextResponse.json({
        flights: [],
        priceInsights: null,
        searchMetadata: rawResponse.search_metadata,
        message: 'No flights found for this route and date combination.',
      });
    }

    return NextResponse.json({
      flights,
      priceInsights,
      searchMetadata: rawResponse.search_metadata,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'Unknown error';

  if (message.startsWith('RATE_LIMIT:')) {
    return NextResponse.json(
      { error: message.replace('RATE_LIMIT:', ''), code: 'RATE_LIMIT' } as ApiErrorResponse,
      { status: 429 },
    );
  }

  if (message.startsWith('API_ERROR:')) {
    return NextResponse.json(
      { error: message.replace('API_ERROR:', ''), code: 'API_ERROR' } as ApiErrorResponse,
      { status: 502 },
    );
  }

  if (message.startsWith('NETWORK_ERROR:')) {
    return NextResponse.json(
      { error: message.replace('NETWORK_ERROR:', ''), code: 'NETWORK_ERROR' } as ApiErrorResponse,
      { status: 503 },
    );
  }

  if (message.includes('SERPAPI_API_KEY')) {
    return NextResponse.json(
      { 
        error: 'SerpApi key is missing. Please set the SERPAPI_API_KEY environment variable in your Azure Static Web App settings.', 
        code: 'MISSING_API_KEY' 
      } as ApiErrorResponse,
      { status: 500 },
    );
  }

  console.error('[API /flights/search] Unhandled error:', error);
  return NextResponse.json(
    { error: 'An unexpected error occurred while searching for flights.', code: 'API_ERROR' } as ApiErrorResponse,
    { status: 500 },
  );
}
