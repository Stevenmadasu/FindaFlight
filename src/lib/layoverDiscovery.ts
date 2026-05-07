/**
 * FindaFlight — Layover-Destination Detection
 *
 * Detects layover opportunities from real SerpApi flight data.
 * Computes savings percentages and sorts by value.
 */

import { FlightOption } from '@/types/flight';

/**
 * Detect layover opportunities in a set of flight results.
 */
export function detectLayoverOpportunities(
  flights: FlightOption[],
  intendedDest: string,
  standardPrice: number | null,
): FlightOption[] {
  const normalizedDest = intendedDest.toUpperCase();

  const annotated = flights.map(flight => {
    const isLayoverMatch = checkLayoverMatch(flight, normalizedDest);
    if (!isLayoverMatch) return flight;

    const lastLeg = flight.flights[flight.flights.length - 1];
    const ticketedDestination = lastLeg
      ? { id: lastLeg.arrival_airport.id, name: lastLeg.arrival_airport.name }
      : undefined;

    const isCheaper = standardPrice === null || flight.price < standardPrice;
    if (!isCheaper) return flight;

    const savings = standardPrice !== null ? standardPrice - flight.price : 0;
    const savingsPercent = standardPrice !== null && standardPrice > 0
      ? Math.round((savings / standardPrice) * 100)
      : 0;

    return {
      ...flight,
      isLayoverMatch: true,
      ticketedDestination,
      savings: savings > 0 ? savings : undefined,
      savingsPercent: savingsPercent > 0 ? savingsPercent : undefined,
      normalRoutePrice: standardPrice ?? undefined,
    };
  });

  // Sort: layover matches first, then by savings descending
  return annotated.sort((a, b) => {
    if (a.isLayoverMatch && !b.isLayoverMatch) return -1;
    if (!a.isLayoverMatch && b.isLayoverMatch) return 1;
    return (b.savings ?? 0) - (a.savings ?? 0);
  });
}

function checkLayoverMatch(flight: FlightOption, intendedDest: string): boolean {
  if (flight.layovers) {
    for (const layover of flight.layovers) {
      if (layover.id.toUpperCase() === intendedDest) return true;
    }
  }
  if (flight.flights.length > 1) {
    for (let i = 0; i < flight.flights.length - 1; i++) {
      if (flight.flights[i].arrival_airport.id.toUpperCase() === intendedDest) return true;
    }
  }
  return false;
}

/**
 * Disclaimer bullets for layover strategy results.
 */
export const LAYOVER_STRATEGY_DISCLAIMER_BULLETS = [
  'Airlines may restrict or penalize skipped-leg travel.',
  'Checked bags will continue to the final ticketed destination — carry-on only.',
  'Return legs on the same booking may be canceled if you skip a segment.',
  "Review your airline's contract of carriage before booking.",
];

export const LAYOVER_STRATEGY_DISCLAIMER =
  'Layover strategies involve booking a flight with a connection at your desired destination and skipping the final leg. ' +
  LAYOVER_STRATEGY_DISCLAIMER_BULLETS.map((b, i) => `(${i + 1}) ${b}`).join(' ');
