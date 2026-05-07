/**
 * FindaFlight — SerpApi Google Flights Client
 *
 * Server-side only. Makes requests to SerpApi using the secret API key
 * from environment variables. Never import this in client components.
 */

import { SerpApiFlightResponse, SerpApiRequestParams, FlightSearchParams } from '@/types/flight';
import { generateCacheKey, getCached, setCache } from '@/lib/cache';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

/**
 * Get the SerpApi key from environment. Throws if missing.
 */
function getApiKey(): string {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) {
    throw new Error('SERPAPI_API_KEY environment variable is not set');
  }
  return key;
}

/**
 * Build SerpApi query params from a FlightSearchParams object.
 * Strips undefined/null/empty values so they aren't sent.
 */
export function buildSearchParams(params: FlightSearchParams): Omit<SerpApiRequestParams, 'api_key'> {
  // Determine trip type: if returnDate provided and mode is standard, use round-trip
  const tripType = params.type ?? (params.returnDate ? 1 : 2);

  const searchParams: Record<string, unknown> = {
    engine: 'google_flights' as const,
    departure_id: params.origin.toUpperCase(),
    arrival_id: params.destination.toUpperCase(),
    outbound_date: params.departureDate,
    return_date: tripType === 1 ? params.returnDate : undefined,
    type: tripType,
    currency: params.currency || 'USD',
    hl: params.hl || 'en',
    gl: params.gl || 'us',
    travel_class: params.travel_class || 1,
    adults: params.adults || 1,
    children: params.children,
    infants_in_seat: params.infants_in_seat,
    infants_on_lap: params.infants_on_lap,
    stops: params.stops,
    sort_by: params.sort_by,
    bags: params.bags,
    max_price: params.maxPrice,
    outbound_times: params.outbound_times,
    return_times: tripType === 1 ? params.return_times : undefined,
    layover_duration: params.layover_duration,
    exclude_airlines: params.exclude_airlines,
    include_airlines: params.include_airlines,
    exclude_conns: params.exclude_conns,
    max_duration: params.max_duration,
    deep_search: params.deep_search,
    show_hidden: params.show_hidden,
    exclude_basic: params.exclude_basic,
  };

  // Strip undefined/null/empty values
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned as Omit<SerpApiRequestParams, 'api_key'>;
}

/**
 * Execute a request against SerpApi.
 * Handles caching, rate limits, and network errors.
 */
export async function fetchFromSerpApi(
  params: Omit<SerpApiRequestParams, 'api_key'>,
): Promise<SerpApiFlightResponse> {
  const apiKey = getApiKey();

  // Check cache first
  const cacheKey = generateCacheKey(params as Record<string, unknown>);
  const cached = getCached<SerpApiFlightResponse>(cacheKey);
  if (cached) {
    console.log('[SerpApi] Cache hit:', cacheKey.slice(0, 80) + '...');
    return cached;
  }

  // Build URL
  const url = new URL(SERPAPI_BASE_URL);
  const fullParams = { ...params, api_key: apiKey };

  for (const [key, value] of Object.entries(fullParams)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  }

  console.log('[SerpApi] Fetching:', url.toString().replace(apiKey, '***'));

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (response.status === 429) {
      throw new Error('RATE_LIMIT:SerpApi rate limit exceeded. Please try again later.');
    }

    if (response.status === 401) {
      throw new Error('API_ERROR:Invalid SerpApi API key.');
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[SerpApi] HTTP ${response.status}: ${body}`);
      throw new Error(`API_ERROR:SerpApi returned status ${response.status}`);
    }

    const data: SerpApiFlightResponse = await response.json();

    // Check for SerpApi-level errors
    if (data.error) {
      console.error('[SerpApi] API error:', data.error);
      throw new Error(`API_ERROR:${data.error}`);
    }

    // Cache successful responses for 1 hour
    setCache(cacheKey, data);

    return data;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('RATE_LIMIT:')) throw error;
    if (error instanceof Error && error.message.startsWith('API_ERROR:')) throw error;

    // Network error
    console.error('[SerpApi] Network error:', error);
    throw new Error('NETWORK_ERROR:Failed to connect to flight search service. Please try again.');
  }
}

/**
 * Main search function: build params and fetch.
 */
export async function searchFlights(
  params: FlightSearchParams,
): Promise<SerpApiFlightResponse> {
  const searchParams = buildSearchParams(params);
  return fetchFromSerpApi(searchParams);
}

/**
 * Fetch return flights using a departure_token from a previous search.
 */
export async function fetchReturnFlights(
  departureToken: string,
  baseParams: FlightSearchParams,
): Promise<SerpApiFlightResponse> {
  const built = buildSearchParams(baseParams);
  return fetchFromSerpApi({
    ...built,
    departure_token: departureToken,
  });
}

/**
 * Fetch booking options using a booking_token.
 */
export async function fetchBookingOptions(
  bookingToken: string,
): Promise<SerpApiFlightResponse> {
  const apiKey = getApiKey();

  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.append('engine', 'google_flights');
  url.searchParams.append('booking_token', bookingToken);
  url.searchParams.append('api_key', apiKey);

  console.log('[SerpApi] Fetching booking options');

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API_ERROR:Failed to fetch booking options (HTTP ${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('API_ERROR:')) throw error;
    throw new Error('NETWORK_ERROR:Failed to fetch booking options.');
  }
}
