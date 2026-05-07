/**
 * FindaFlight — Deal Scoring Engine
 *
 * Computes a 0-100 "deal score" for each flight using real data only.
 * Weights: Price Value 35%, Speed 25%, Convenience 20%, Savings 20%.
 */

import { FlightOption, PriceInsights } from '@/types/flight';

export interface DealScoreBreakdown {
  priceValue: number;   // 0-100
  speed: number;        // 0-100
  convenience: number;  // 0-100
  savings: number;      // 0-100 (only >0 for layover deals)
}

export interface DealScore {
  total: number;       // 0-100
  breakdown: DealScoreBreakdown;
  explanation: string;
}

/**
 * Compute a deal score for a single flight.
 */
export function computeDealScore(
  flight: FlightOption,
  allFlights: FlightOption[],
  priceInsights?: PriceInsights | null,
): DealScore {
  const breakdown: DealScoreBreakdown = {
    priceValue: computePriceValue(flight, allFlights, priceInsights),
    speed: computeSpeed(flight, allFlights),
    convenience: computeConvenience(flight),
    savings: computeSavings(flight),
  };

  const total = Math.round(
    breakdown.priceValue * 0.35 +
    breakdown.speed * 0.25 +
    breakdown.convenience * 0.20 +
    breakdown.savings * 0.20,
  );

  const explanation = buildExplanation(breakdown, flight);

  return { total, breakdown, explanation };
}

function computePriceValue(
  flight: FlightOption,
  allFlights: FlightOption[],
  priceInsights?: PriceInsights | null,
): number {
  // Use price_insights if available
  if (priceInsights?.typical_price_range) {
    const [low, high] = priceInsights.typical_price_range;
    if (flight.price <= low) return 100;
    if (flight.price >= high) return 20;
    return Math.round(100 - ((flight.price - low) / (high - low)) * 80);
  }

  // Fallback: position within result set
  if (allFlights.length <= 1) return 70;
  const prices = allFlights.map(f => f.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (max === min) return 80;
  return Math.round(100 - ((flight.price - min) / (max - min)) * 80);
}

function computeSpeed(flight: FlightOption, allFlights: FlightOption[]): number {
  if (allFlights.length <= 1) return 70;
  const durations = allFlights.map(f => f.total_duration);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  if (max === min) return 80;
  return Math.round(100 - ((flight.total_duration - min) / (max - min)) * 80);
}

function computeConvenience(flight: FlightOption): number {
  let score = 100;
  // Stops penalty
  score -= flight.stops * 25;
  // Long layover penalty
  if (flight.layovers) {
    for (const layover of flight.layovers) {
      if (layover.duration > 180) score -= 10; // >3h layover
      if (layover.duration > 360) score -= 10; // >6h layover
    }
  }
  return Math.max(0, Math.min(100, score));
}

function computeSavings(flight: FlightOption): number {
  if (!flight.isLayoverMatch || !flight.savings || !flight.normalRoutePrice) return 50;
  const pct = (flight.savings / flight.normalRoutePrice) * 100;
  if (pct >= 40) return 100;
  if (pct >= 25) return 85;
  if (pct >= 15) return 70;
  if (pct >= 5) return 55;
  return 40;
}

function buildExplanation(breakdown: DealScoreBreakdown, flight: FlightOption): string {
  const parts: string[] = [];
  if (breakdown.priceValue >= 75) parts.push('Great price');
  else if (breakdown.priceValue >= 50) parts.push('Fair price');
  if (breakdown.speed >= 75) parts.push('Fast route');
  if (breakdown.convenience >= 85) parts.push(flight.stops === 0 ? 'Direct flight' : 'Few stops');
  if (breakdown.savings >= 70 && flight.isLayoverMatch) parts.push('Layover savings');
  return parts.length > 0 ? parts.join(' • ') : 'Solid option';
}
