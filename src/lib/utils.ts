/**
 * FindaFlight — Shared Utilities
 *
 * Utility functions used across both client and server code.
 */

/**
 * Format a duration in minutes to a human-readable string.
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Compute a "weekend score" for a trip.
 * Higher score = better for weekend trips (depart Fri/Sat, return Sun/Mon).
 */
export function computeWeekendScore(departureDate: string, returnDate: string): number {
  const dep = new Date(departureDate + 'T12:00:00');
  const ret = new Date(returnDate + 'T12:00:00');
  const depDay = dep.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const retDay = ret.getDay();

  let score = 0;

  // Departure: Friday(5) or Saturday(6) is ideal
  if (depDay === 5) score += 40;
  else if (depDay === 6) score += 35;
  else if (depDay === 4) score += 20; // Thursday
  else score += 5;

  // Return: Sunday(0) or Monday(1) is ideal
  if (retDay === 0) score += 40;
  else if (retDay === 1) score += 35;
  else if (retDay === 2) score += 15; // Tuesday
  else score += 5;

  // Trip length: 2-4 days is ideal for a weekend
  const diffDays = Math.round((ret.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays >= 2 && diffDays <= 4) score += 20;
  else if (diffDays >= 1 && diffDays <= 6) score += 10;

  return Math.min(100, score);
}

// ─── Domestic destinations for "Take Me Anywhere" ───────────────────────
export const DOMESTIC_DESTINATIONS: Record<string, string> = {
  'MIA': 'Miami',
  'LAX': 'Los Angeles',
  'LAS': 'Las Vegas',
  'MCO': 'Orlando',
  'SFO': 'San Francisco',
  'SEA': 'Seattle',
  'DEN': 'Denver',
  'BNA': 'Nashville',
  'AUS': 'Austin',
  'SAN': 'San Diego',
  'BOS': 'Boston',
  'JFK': 'New York',
  'PHX': 'Phoenix',
  'TPA': 'Tampa',
  'PDX': 'Portland',
  'HNL': 'Honolulu',
};

// ─── International destinations for "Take Me Anywhere" ──────────────────
// Anonymous users: 1 random international destination
// Authenticated users: all international destinations
export const INTERNATIONAL_DESTINATIONS: Record<string, string> = {
  'CUN': 'Cancún',
  'LHR': 'London',
  'CDG': 'Paris',
  'NRT': 'Tokyo',
  'BCN': 'Barcelona',
  'FCO': 'Rome',
  'AMS': 'Amsterdam',
  'DXB': 'Dubai',
  'ICN': 'Seoul',
  'SIN': 'Singapore',
  'LIS': 'Lisbon',
  'YYZ': 'Toronto',
};

// Legacy compat
export const ANYWHERE_DESTINATIONS: Record<string, string> = {
  ...DOMESTIC_DESTINATIONS,
};

// City name lookup (extended)
export const CITY_NAMES: Record<string, string> = {
  ...DOMESTIC_DESTINATIONS,
  ...INTERNATIONAL_DESTINATIONS,
  'ATL': 'Atlanta', 'ORD': 'Chicago', 'DFW': 'Dallas', 'MSP': 'Minneapolis',
  'DTW': 'Detroit', 'CLT': 'Charlotte', 'IAH': 'Houston', 'SLC': 'Salt Lake City',
  'FRA': 'Frankfurt', 'MUC': 'Munich', 'MAD': 'Madrid', 'IST': 'Istanbul',
  'SYD': 'Sydney', 'MEL': 'Melbourne', 'GRU': 'São Paulo', 'MEX': 'Mexico City',
  'HKG': 'Hong Kong', 'BKK': 'Bangkok', 'DEL': 'Delhi', 'DOH': 'Doha',
};
