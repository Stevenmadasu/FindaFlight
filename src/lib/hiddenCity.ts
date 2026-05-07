/**
 * FindaFlight — Hidden-City / Layover-Destination Detection
 *
 * Detects hidden-city opportunities from real SerpApi flight data.
 * A hidden-city candidate is a flight where the user's intended destination
 * appears as a layover before the final ticketed destination.
 *
 * Only flags results where the longer itinerary is CHEAPER than
 * the standard route to the intended destination.
 */

import { FlightOption } from '@/types/flight';

/**
 * Detect hidden-city opportunities in a set of flight results.
 *
 * @param flights          - Flight results from a search that goes THROUGH the intended destination
 * @param intendedDest     - The airport code the user actually wants to reach (their "destination")
 * @param standardPrice    - The cheapest price for a direct/standard route to the intended destination
 * @returns                - The same flights array with hidden-city matches annotated
 */
export function detectHiddenCityOpportunities(
  flights: FlightOption[],
  intendedDest: string,
  standardPrice: number | null,
): FlightOption[] {
  const normalizedDest = intendedDest.toUpperCase();

  return flights.map(flight => {
    // Check if the intended destination appears as a layover
    const isLayoverMatch = checkLayoverMatch(flight, normalizedDest);

    if (!isLayoverMatch) return flight;

    // Find the final ticketed destination (last segment's arrival)
    const lastLeg = flight.flights[flight.flights.length - 1];
    const ticketedDestination = lastLeg
      ? { id: lastLeg.arrival_airport.id, name: lastLeg.arrival_airport.name }
      : undefined;

    // Only flag if the hidden-city flight is cheaper than the standard route
    const isCheaper = standardPrice === null || flight.price < standardPrice;

    if (!isCheaper) return flight;

    const savings = standardPrice !== null ? standardPrice - flight.price : 0;

    return {
      ...flight,
      isLayoverMatch: true,
      ticketedDestination,
      savings: savings > 0 ? savings : undefined,
    };
  });
}

/**
 * Check if a flight has the intended destination as a layover stop.
 * Looks at both the layovers array and intermediate segment arrival airports.
 */
function checkLayoverMatch(flight: FlightOption, intendedDest: string): boolean {
  // Check layovers array
  if (flight.layovers) {
    for (const layover of flight.layovers) {
      if (layover.id.toUpperCase() === intendedDest) {
        return true;
      }
    }
  }

  // Check intermediate segment arrival airports (all except the last segment)
  if (flight.flights.length > 1) {
    for (let i = 0; i < flight.flights.length - 1; i++) {
      if (flight.flights[i].arrival_airport.id.toUpperCase() === intendedDest) {
        return true;
      }
    }
  }

  return false;
}

/**
 * The disclaimer text shown to users for hidden-city results.
 */
export const HIDDEN_CITY_DISCLAIMER =
  'Hidden-city ticketing involves booking a flight with a connection at your desired destination and skipping the final leg. ' +
  'Please be aware: (1) Airlines may restrict or penalize skipped-leg travel. ' +
  '(2) Checked bags will continue to the final ticketed destination. ' +
  '(3) Return legs on the same booking may be canceled if you skip a segment. ' +
  '(4) Only use carry-on luggage. ' +
  '(5) Review your airline\'s contract of carriage before booking.';
