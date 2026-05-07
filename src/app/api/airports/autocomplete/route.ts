/**
 * FindaFlight — Airport Autocomplete API Route
 * GET /api/airports/autocomplete?q=<query>&gl=us&hl=en
 *
 * Server-side SerpApi call using engine=google_flights_autocomplete.
 * 24-hour cache. Only fires when q.length >= 3.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCacheKey, getCached, setCache, TTL_AUTOCOMPLETE } from '@/lib/cache';
import { normalizeAutocompleteSuggestions } from '@/lib/autocomplete';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

function getApiKey(): string {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) throw new Error('SERPAPI_API_KEY environment variable is not set');
  return key;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || '';
  const gl = searchParams.get('gl') || 'us';
  const hl = searchParams.get('hl') || 'en';

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  // Check cache
  const cacheKey = generateCacheKey({ engine: 'autocomplete', q: query, gl, hl });
  const cached = getCached<ReturnType<typeof normalizeAutocompleteSuggestions>>(cacheKey);
  if (cached) {
    return NextResponse.json({ suggestions: cached, cached: true });
  }

  try {
    const apiKey = getApiKey();
    const url = new URL(SERPAPI_BASE_URL);
    url.searchParams.set('engine', 'google_flights_autocomplete');
    url.searchParams.set('q', query);
    url.searchParams.set('gl', gl);
    url.searchParams.set('hl', hl);
    url.searchParams.set('api_key', apiKey);

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.error(`[Autocomplete] SerpApi returned ${res.status}`);
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const raw = await res.json();
    const suggestions = normalizeAutocompleteSuggestions(raw);

    // Cache for 24 hours
    setCache(cacheKey, suggestions, TTL_AUTOCOMPLETE);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('[Autocomplete] Error:', error);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
