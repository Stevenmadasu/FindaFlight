/**
 * FindaFlight — SerpApi Response Normalization
 *
 * Transforms raw SerpApi Google Flights responses into normalized
 * FlightOption objects for the scoring and ranking engine.
 */

import {
  FlightOption,
  FlightLeg,
  Layover,
  CarbonEmissions,
  PriceInsights,
  SerpApiFlightResponse,
  SerpApiFlightResult,
} from '@/types/flight';

/**
 * Generate a stable ID for a flight result based on its key attributes.
 */
function generateStableId(raw: SerpApiFlightResult): string {
  if (!raw.flights || raw.flights.length === 0) return Math.random().toString(36).substring(7);
  
  // Combine airline, flight numbers, and departure times for a stable key
  const flightKey = raw.flights.map(f => 
    `${f.airline}-${f.flight_number}-${f.departure_airport?.time}`
  ).join('|');
  
  return btoa(flightKey).substring(0, 16);
}

/**
 * Normalize the full SerpApi response into a list of FlightOptions.
 * Processes both best_flights and other_flights arrays.
 */
export function normalizeFlightResults(data: SerpApiFlightResponse): FlightOption[] {
  const flights: FlightOption[] = [];

  if (data.best_flights) {
    data.best_flights.forEach((raw) => {
      flights.push(normalizeFlightResult(raw, generateStableId(raw)));
    });
  }

  if (data.other_flights) {
    data.other_flights.forEach((raw) => {
      flights.push(normalizeFlightResult(raw, generateStableId(raw)));
    });
  }

  return flights;
}

/**
 * Normalize a single SerpApi flight result into a FlightOption.
 */
function normalizeFlightResult(raw: SerpApiFlightResult, id: string): FlightOption {
  const legs: FlightLeg[] = (raw.flights || []).map(normalizeLeg);
  const layovers: Layover[] = (raw.layovers || []).map(normalizeLayover);
  const stops = Math.max(0, legs.length - 1);

  const carbonEmissions: CarbonEmissions | undefined = raw.carbon_emissions
    ? {
        this_flight: raw.carbon_emissions.this_flight,
        typical_for_this_route: raw.carbon_emissions.typical_for_this_route,
        difference_percent: raw.carbon_emissions.difference_percent,
      }
    : undefined;

  return {
    id,
    flights: legs,
    layovers: layovers.length > 0 ? layovers : undefined,
    total_duration: raw.total_duration || 0,
    price: raw.price || 0,
    type: raw.type || (stops === 0 ? 'direct' : 'connecting'),
    airline_logo: raw.airline_logo || legs[0]?.airline_logo || '',
    stops,
    carbon_emissions: carbonEmissions,
    departure_token: raw.departure_token,
    booking_token: raw.booking_token,
    extensions: raw.extensions,

    // Trust Signal / Metadata fields
    lastUpdated: new Date().toISOString(),
    fareType: legs[0]?.travel_class || 'Main Cabin',
    includesCarryOn: raw.extensions?.some(ext => 
      ext.toLowerCase().includes('carry-on') && !ext.toLowerCase().includes('not included')
    ) ?? true,
    isSelfTransfer: raw.extensions?.some(ext => 
      ext.toLowerCase().includes('separate tickets') || ext.toLowerCase().includes('self-transfer')
    ) ?? false,
  };
}

/**
 * Normalize a flight leg/segment.
 */
function normalizeLeg(raw: SerpApiFlightResult['flights'][0]): FlightLeg {
  return {
    departure_airport: {
      name: raw.departure_airport?.name || '',
      id: raw.departure_airport?.id || '',
      time: raw.departure_airport?.time || '',
    },
    arrival_airport: {
      name: raw.arrival_airport?.name || '',
      id: raw.arrival_airport?.id || '',
      time: raw.arrival_airport?.time || '',
    },
    duration: raw.duration || 0,
    airplane: raw.airplane || '',
    airline: raw.airline || '',
    airline_logo: raw.airline_logo || '',
    flight_number: raw.flight_number || '',
    travel_class: raw.travel_class,
    legroom: raw.legroom,
    extensions: raw.extensions,
    overnight: raw.overnight,
    often_delayed_by_over_30_min: raw.often_delayed_by_over_30_min,
    ticket_also_sold_by: raw.ticket_also_sold_by,
  };
}

/**
 * Normalize a layover.
 */
function normalizeLayover(raw: { duration: number; name: string; id: string; overnight?: boolean }): Layover {
  return {
    duration: raw.duration || 0,
    name: raw.name || '',
    id: raw.id || '',
    overnight: raw.overnight,
  };
}

/**
 * Normalize price insights from SerpApi response.
 */
export function normalizePriceInsights(
  raw: SerpApiFlightResponse['price_insights'],
): PriceInsights | undefined {
  if (!raw) return undefined;

  return {
    lowest_price: raw.lowest_price || 0,
    price_level: raw.price_level,
    typical_price_range: raw.typical_price_range,
    price_history: raw.price_history,
  };
}
