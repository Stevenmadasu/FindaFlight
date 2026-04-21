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

import { FlightOption, RankedFlight, FlightBadge, Recommendation, PairedItinerary } from '@/types/flight';

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
 * Assign "Best Overall", "Cheapest", and "Fastest" badges to items.
 */
function assignBadges(items: { price: number; totalDuration?: number; total_duration?: number; badges: FlightBadge[] }[]): void {
  if (items.length === 0) return;

  // Best Overall = highest composite score (already sorted, so index 0)
  items[0].badges.push('best_overall');

  // Cheapest = lowest price
  const cheapest = items.reduce((min, f) => f.price < min.price ? f : min, items[0]);
  if (!cheapest.badges.includes('best_overall')) {
    cheapest.badges.push('cheapest');
  }

  // Fastest = shortest duration
  const fastest = items.reduce((min, f) => {
    const minDur = min.totalDuration ?? min.total_duration ?? 0;
    const curDur = f.totalDuration ?? f.total_duration ?? 0;
    return curDur < minDur ? f : min;
  }, items[0]);
  
  if (!fastest.badges.includes('best_overall')) {
    fastest.badges.push('fastest');
  }
}

/**
 * Pair and score combined itineraries
 */
export function rankPairedItineraries(outbounds: RankedFlight[], returns: RankedFlight[]): PairedItinerary[] {
  if (outbounds.length === 0 || returns.length === 0) return [];

  // Generate naive permutations of the best options to keep counts reasonable (max ~25)
  const topOut = outbounds.slice(0, 5);
  const topRet = returns.slice(0, 5);
  
  const paired: Omit<PairedItinerary, 'score'|'priceScore'|'durationScore'|'stopsScore'|'badges'>[] = [];
  
  for (const outbound of topOut) {
    for (const returnFlight of topRet) {
      paired.push({
        id: `pair-${outbound.id}-${returnFlight.id}`,
        outbound,
        returnFlight,
        combinedPrice: outbound.price + returnFlight.price,
        totalDuration: outbound.total_duration + returnFlight.total_duration,
      });
    }
  }

  const prices = paired.map(p => p.combinedPrice);
  const durations = paired.map(p => p.totalDuration);
  const outboundStops = paired.map(p => p.outbound.stops); // Penalize complex outbounds more

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minStops = Math.min(...outboundStops);
  const maxStops = Math.max(...outboundStops);

  const scoredPairs: PairedItinerary[] = paired.map(pair => {
    const priceScore = normalizeInverse(pair.combinedPrice, minPrice, maxPrice);
    const durationScore = normalizeInverse(pair.totalDuration, minDuration, maxDuration);
    const stopsScore = normalizeInverse(pair.outbound.stops, minStops, maxStops);

    const score = Math.round(
      priceScore * WEIGHT_PRICE +
      durationScore * WEIGHT_DURATION +
      stopsScore * WEIGHT_STOPS
    );

    return {
      ...pair,
      score,
      priceScore,
      durationScore,
      stopsScore,
      badges: [],
    };
  });

  scoredPairs.sort((a, b) => b.score - a.score);

  // We assign badges on the mapping object so the util function can read `.price` and `.totalDuration`
  const wrappedItems = scoredPairs.map(p => ({
    ...p,
    price: p.combinedPrice,
    totalDuration: p.totalDuration,
    badges: p.badges
  }));
  assignBadges(wrappedItems);

  // Re-sync badges back
  wrappedItems.forEach((w, i) => {
    scoredPairs[i].badges = w.badges;
  });

  return scoredPairs;
}


/**
 * Generate a recommendation.
 */
export function generateRecommendation(items: RankedFlight[] | PairedItinerary[], isPaired: boolean = false): Recommendation | null {
  if (items.length === 0) return null;

  const best = items[0]; // Already sorted by score
  const reason = isPaired 
    ? buildPairedReasonText(best as PairedItinerary, items as PairedItinerary[])
    : buildReasonText(best as RankedFlight, items as RankedFlight[]);

  return {
    item: best,
    reason,
    isPaired
  };
}

function buildReasonText(flight: RankedFlight, allFlights: RankedFlight[]): string {
  const badges = flight.badges;
  const avgPrice = allFlights.reduce((sum, f) => sum + f.price, 0) / allFlights.length;
  const avgDuration = allFlights.reduce((sum, f) => sum + f.total_duration, 0) / allFlights.length;

  if (badges.includes('cheapest') && badges.includes('fastest')) {
    return 'This flight is both the cheapest and fastest option available — a clear winner.';
  }

  if (badges.includes('cheapest')) {
    return `The most affordable option at $${flight.price}, with a reasonable travel time of ${formatDuration(flight.total_duration)}.`;
  }

  if (badges.includes('fastest')) {
    return `The quickest route at ${formatDuration(flight.total_duration)}, at a competitive price point.`;
  }

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

function buildPairedReasonText(pair: PairedItinerary, allPairs: PairedItinerary[]): string {
  const badges = pair.badges;
  const avgPrice = allPairs.reduce((sum, p) => sum + p.combinedPrice, 0) / allPairs.length;
  
  if (badges.includes('cheapest')) {
    return `The lowest combined fare at $${pair.combinedPrice}, using your desired city as a layover to save money.`;
  }
  
  if (badges.includes('fastest')) {
    return `Gets you to your layover and back home faster than any other option, minimizing wasted transit time.`;
  }
  
  const priceDiff = Math.round(((avgPrice - pair.combinedPrice) / avgPrice) * 100);
  if (priceDiff > 5) {
    return `This option uses your desired city as the layover, keeps the combined outbound and return fare low (${priceDiff}% cheaper than average), and avoids excessive extra travel time.`;
  }
  
  return 'The smartest balance of a round-trip disguised as two one-way tickets, optimizing for layover access and total price.';
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
