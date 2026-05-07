/**
 * FindaFlight — Server-Side Cache
 *
 * In-memory cache for SerpApi responses. Caches identical queries for
 * up to 1 hour. SerpApi itself caches identical queries for free,
 * so this avoids redundant network calls entirely.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Default TTL: 1 hour (ms)
const DEFAULT_TTL = 60 * 60 * 1000;

/**
 * Generate a stable cache key from a params object.
 * Sorts keys alphabetically and stringifies for determinism.
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
export function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL): void {
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
