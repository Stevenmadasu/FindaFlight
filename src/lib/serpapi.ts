/**
 * FindaFlight — SerpAPI Flight Search Client (Simplified)
 *
 * Searches Google Flights via SerpAPI. Used as the real data source
 * when an API key is available; otherwise falls back to mock data.
 */

import { FlightOption, SerpApiFlightResponse } from '@/types/flight';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

interface SerpApiParams {
  engine: string;
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  type?: number;
  currency?: string;
  gl?: string;
  hl?: string;
  api_key: string;
}

/**
 * Build SerpApi request params for a one-way flight search.
 */
function buildParams(
  origin: string,
  destination: string,
  date: string,
  apiKey: string,
): SerpApiParams {
  return {
    engine: 'google_flights',
    departure_id: origin.toUpperCase(),
    arrival_id: destination.toUpperCase(),
    outbound_date: date,
    type: 2, // one-way
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: apiKey,
  };
}

/**
 * Fetch flights from SerpApi.
 */
async function fetchFlights(params: SerpApiParams): Promise<SerpApiFlightResponse> {
  const url = new URL(SERPAPI_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`SerpApi request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Parse SerpApi response into normalized FlightOption array.
 * Adds `stops` count computed from legs.
 */
function parseFlightOptions(data: SerpApiFlightResponse): FlightOption[] {
  const flights: FlightOption[] = [];

  if (data.best_flights) {
    data.best_flights.forEach((flight, index) => {
      const legs = flight.flights || [];
      flights.push({
        ...flight,
        id: `best-${index}`,
        stops: Math.max(0, legs.length - 1),
      });
    });
  }

  if (data.other_flights) {
    data.other_flights.forEach((flight, index) => {
      const legs = flight.flights || [];
      flights.push({
        ...flight,
        id: `other-${index}`,
        stops: Math.max(0, legs.length - 1),
      });
    });
  }

  return flights;
}

/**
 * Search for flights from origin to destination on a given date.
 */
export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  apiKey: string,
): Promise<FlightOption[]> {
  const params = buildParams(origin, destination, date, apiKey);
  const data = await fetchFlights(params);
  return parseFlightOptions(data);
}
