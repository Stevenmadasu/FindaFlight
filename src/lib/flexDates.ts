/**
 * FindaFlight — Flexible Date Search Utilities
 *
 * Generates date ranges and aggregates results across nearby dates.
 * Triggered by "Check nearby dates" button (not automatic).
 */

export type FlexRange = 'exact' | '1' | '3';

export interface FlexDateResult {
  date: string;
  bestPrice: number;
  flightCount: number;
}

/**
 * Generate an array of date strings centered on baseDate.
 * 'exact' → [baseDate]
 * '1' → [baseDate-1, baseDate, baseDate+1]
 * '3' → 7 dates centered on baseDate
 */
export function generateFlexDates(baseDate: string, range: FlexRange): string[] {
  if (range === 'exact') return [baseDate];

  const dayRange = range === '1' ? 1 : 3;
  const center = new Date(baseDate + 'T12:00:00');
  const dates: string[] = [];

  for (let offset = -dayRange; offset <= dayRange; offset++) {
    const d = new Date(center);
    d.setDate(d.getDate() + offset);
    // Don't include past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d >= today) {
      dates.push(formatDateISO(d));
    }
  }

  return dates;
}

/**
 * Aggregate flex search results to find the cheapest date.
 */
export function aggregateFlexResults(
  results: Map<string, { bestPrice: number; flightCount: number }>,
): { cheapestDate: string; cheapestPrice: number; allDates: FlexDateResult[] } {
  const allDates: FlexDateResult[] = [];
  let cheapestDate = '';
  let cheapestPrice = Infinity;

  for (const [date, data] of results.entries()) {
    allDates.push({ date, bestPrice: data.bestPrice, flightCount: data.flightCount });
    if (data.bestPrice < cheapestPrice) {
      cheapestPrice = data.bestPrice;
      cheapestDate = date;
    }
  }

  allDates.sort((a, b) => a.date.localeCompare(b.date));

  return { cheapestDate, cheapestPrice, allDates };
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
