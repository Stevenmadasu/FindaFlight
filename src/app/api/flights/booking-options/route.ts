/**
 * POST /api/flights/booking-options
 *
 * Fetches booking options for a selected flight using its booking_token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBookingOptions } from '@/lib/serpapi';
import { ApiErrorResponse, BookingOptionsResponse } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const { booking_token } = body as { booking_token: string };

    if (!booking_token) {
      return NextResponse.json(
        { error: 'booking_token is required', code: 'VALIDATION_ERROR' } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const rawResponse = await fetchBookingOptions(booking_token);

    const response: BookingOptionsResponse = {
      booking_options: rawResponse.booking_options || [],
      search_metadata: rawResponse.search_metadata,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API /flights/booking-options] Error:', message);

    if (message.includes('SERPAPI_API_KEY')) {
      return NextResponse.json(
        { error: 'Flight search service is not configured.', code: 'MISSING_API_KEY' } as ApiErrorResponse,
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch booking options.', code: 'API_ERROR' } as ApiErrorResponse,
      { status: 500 },
    );
  }
}
