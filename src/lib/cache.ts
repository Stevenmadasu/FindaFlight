/**
 * FindaFlight — Server-Side Cache
 *
 * In-memory cache with separate TTLs:
 *   - Autocomplete: 24 hours
 *   - Flight search: 1 hour
 * Includes request deduplication for in-flight identical queries.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

// TTL constants
export const TTL_FLIGHTS = 60 * 60 * 1000;       // 1 hour
export const TTL_AUTOCOMPLETE = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a stable cache key from a params object.
 */
export function generateCacheKey(params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  return JSON.stringify(sorted);
}

/**
 * Get a cached response, or null if expired/missing.
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Store a response in cache.
 */
export function setCache<T>(key: string, data: T, ttlMs: number = TTL_FLIGHTS): void {
  // Prevent unbounded growth: evict expired entries periodically
  if (cache.size > 500) {
    evictExpired();
  }

  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Deduplicate in-flight requests. If an identical request is already
 * in progress, return its promise instead of making a new one.
 */
export async function deduplicatedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  // Check cache first
  const cached = getCached<T>(key);
  if (cached) return cached;

  // Check if request is already in flight
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  // Start new request
  const promise = fetcher().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise;
}

/**
 * Remove all expired entries.
 */
function evictExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}

/**
 * Clear the entire cache (for testing).
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache size (for debugging).
 */
export function getCacheSize(): number {
  return cache.size;
}
