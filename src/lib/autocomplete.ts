/**
 * FindaFlight — SerpApi Autocomplete Normalizer
 * Normalizes raw SerpApi google_flights_autocomplete responses.
 */

export interface AutocompleteAirport {
  name: string;
  id: string;       // IATA code
  city: string;
  cityId: string;   // Google KG ID
  distance?: string;
}

export interface AutocompleteSuggestion {
  position: number;
  name: string;
  type: 'city' | 'region';
  description: string;
  id: string;        // Google KG ID
  airports: AutocompleteAirport[];
}

interface RawSuggestion {
  position?: number;
  name?: string;
  type?: string;
  description?: string;
  id?: string;
  airports?: Array<{
    name?: string;
    id?: string;
    city?: string;
    city_id?: string;
    distance?: string;
  }>;
}

/**
 * Normalize raw SerpApi autocomplete response into typed suggestions.
 */
export function normalizeAutocompleteSuggestions(
  rawResponse: { suggestions?: RawSuggestion[] },
): AutocompleteSuggestion[] {
  if (!rawResponse?.suggestions || !Array.isArray(rawResponse.suggestions)) {
    return [];
  }

  return rawResponse.suggestions
    .filter((s): s is RawSuggestion => !!s.name && !!s.id)
    .map((s) => ({
      position: s.position ?? 0,
      name: s.name!,
      type: (s.type === 'region' ? 'region' : 'city') as 'city' | 'region',
      description: s.description ?? '',
      id: s.id!,
      airports: (s.airports ?? [])
        .filter((a) => !!a.id && !!a.name)
        .map((a) => ({
          name: a.name!,
          id: a.id!,
          city: a.city ?? '',
          cityId: a.city_id ?? '',
          distance: a.distance,
        })),
    }));
}
