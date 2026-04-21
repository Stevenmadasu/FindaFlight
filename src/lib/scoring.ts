/**
 * FindaFlight — Smart Ranking & Scoring Engine
 *
 * Scores flights on a 0-100 scale using weighted combination of:
 *   - Price (40% weight)
 *   - Duration (35% weight)
 *   - Stops (25% weight)
 *
 * Lower price / duration / stops → higher score.
 */

import { FlightOption, RankedFlight, FlightBadge, Recommendation } from '@/types/flight';

// Scoring weights
const WEIGHT_PRICE = 0.40;
const WEIGHT_DURATION = 0.35;
const WEIGHT_STOPS = 0.25;

/**
 * Normalize a value to a 0-100 score where lower input = higher score.
 * Uses min-max normalization inverted.
 */
function normalizeInverse(value: number, min: number, max: number): number {
  if (max === min) return 100; // All values identical → perfect score
  const normalized = 1 - (value - min) / (max - min);
  return Math.round(normalized * 100);
}

/**
 * Score and rank a list of flights.
 * Returns flights sorted by composite score (best first).
 */
export function rankFlights(flights: FlightOption[]): RankedFlight[] {
  if (flights.length === 0) return [];

  // Find min/max for normalization
  const prices = flights.map(f => f.price);
  const durations = flights.map(f => f.total_duration);
  const stops = flights.map(f => f.stops);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minStops = Math.min(...stops);
  const maxStops = Math.max(...stops);

  // Score each flight
  const scored: RankedFlight[] = flights.map(flight => {
    const priceScore = normalizeInverse(flight.price, minPrice, maxPrice);
    const durationScore = normalizeInverse(flight.total_duration, minDuration, maxDuration);
    const stopsScore = normalizeInverse(flight.stops, minStops, maxStops);

    const score = Math.round(
      priceScore * WEIGHT_PRICE +
      durationScore * WEIGHT_DURATION +
      stopsScore * WEIGHT_STOPS
    );

    return {
      ...flight,
      score,
      priceScore,
      durationScore,
      stopsScore,
      badges: [],
    };
  });

  // Sort by composite score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Assign badges
  assignBadges(scored);

  return scored;
}

/**
 * Assign "Best Overall", "Cheapest", and "Fastest" badges to flights.
 * Each badge is assigned to exactly one flight (the top one in that category).
 */
function assignBadges(flights: RankedFlight[]): void {
  if (flights.length === 0) return;

  // Best Overall = highest composite score (already sorted, so index 0)
  flights[0].badges.push('best_overall');

  // Cheapest = lowest price
  const cheapest = flights.reduce((min, f) => f.price < min.price ? f : min, flights[0]);
  if (!cheapest.badges.includes('best_overall')) {
    cheapest.badges.push('cheapest');
  } else {
    // If best overall is also cheapest, still mark it
    cheapest.badges.push('cheapest');
  }

  // Fastest = shortest duration
  const fastest = flights.reduce((min, f) => f.total_duration < min.total_duration ? f : min, flights[0]);
  if (!fastest.badges.includes('best_overall')) {
    fastest.badges.push('fastest');
  } else {
    fastest.badges.push('fastest');
  }
}

/**
 * Generate a recommendation with reasoning text.
 */
export function generateRecommendation(flights: RankedFlight[]): Recommendation | null {
  if (flights.length === 0) return null;

  const best = flights[0]; // Already sorted by score
  const reason = buildReasonText(best, flights);

  return {
    flight: best,
    reason,
  };
}

/**
 * Build human-readable reason text explaining why a flight is recommended.
 */
function buildReasonText(flight: RankedFlight, allFlights: RankedFlight[]): string {
  const badges = flight.badges;
  const avgPrice = allFlights.reduce((sum, f) => sum + f.price, 0) / allFlights.length;
  const avgDuration = allFlights.reduce((sum, f) => sum + f.total_duration, 0) / allFlights.length;

  // If it has all three badges
  if (badges.includes('cheapest') && badges.includes('fastest')) {
    return 'This flight is both the cheapest and fastest option available — a clear winner.';
  }

  // If it's the cheapest
  if (badges.includes('cheapest')) {
    return `The most affordable option at $${flight.price}, with a reasonable travel time of ${formatDuration(flight.total_duration)}.`;
  }

  // If it's the fastest
  if (badges.includes('fastest')) {
    return `The quickest route at ${formatDuration(flight.total_duration)}, at a competitive price point.`;
  }

  // General "best overall" reasoning
  const priceDiff = Math.round(((avgPrice - flight.price) / avgPrice) * 100);
  const durationDiff = Math.round(((avgDuration - flight.total_duration) / avgDuration) * 100);

  if (priceDiff > 0 && durationDiff > 0) {
    return `Best balance of price and duration — ${priceDiff}% below average cost and ${durationDiff}% faster than the average flight.`;
  }

  if (priceDiff > 0) {
    return `Strong overall value — ${priceDiff}% below the average price with ${flight.stops === 0 ? 'a direct route' : `only ${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}.`;
  }

  if (flight.stops === 0) {
    return 'A direct flight offering the best combination of convenience, price, and travel time.';
  }

  return 'Best overall combination of price, travel time, and number of stops across all available options.';
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
