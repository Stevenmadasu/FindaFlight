/**
 * FindaFlight — Airport Database for Autocomplete
 *
 * Contains common US airports with IATA codes, city names, and state.
 * Used for the search form autocomplete dropdown.
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  state: string;
}

export const AIRPORTS: Airport[] = [
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', state: 'GA' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', state: 'CA' },
  { code: 'ORD', name: "O'Hare Intl", city: 'Chicago', state: 'IL' },
  { code: 'DFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', state: 'TX' },
  { code: 'DEN', name: 'Denver Intl', city: 'Denver', state: 'CO' },
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', state: 'NY' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', state: 'CA' },
  { code: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', state: 'WA' },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', state: 'NV' },
  { code: 'MCO', name: 'Orlando Intl', city: 'Orlando', state: 'FL' },
  { code: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', state: 'NJ' },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', state: 'FL' },
  { code: 'PHX', name: 'Phoenix Sky Harbor Intl', city: 'Phoenix', state: 'AZ' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', state: 'TX' },
  { code: 'BOS', name: 'Boston Logan Intl', city: 'Boston', state: 'MA' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul Intl', city: 'Minneapolis', state: 'MN' },
  { code: 'DTW', name: 'Detroit Metro Wayne County', city: 'Detroit', state: 'MI' },
  { code: 'CLT', name: 'Charlotte Douglas Intl', city: 'Charlotte', state: 'NC' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood Intl', city: 'Fort Lauderdale', state: 'FL' },
  { code: 'BWI', name: 'Baltimore/Washington Intl', city: 'Baltimore', state: 'MD' },
  { code: 'SLC', name: 'Salt Lake City Intl', city: 'Salt Lake City', state: 'UT' },
  { code: 'SAN', name: 'San Diego Intl', city: 'San Diego', state: 'CA' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington D.C.', state: 'DC' },
  { code: 'IAD', name: 'Washington Dulles Intl', city: 'Washington D.C.', state: 'VA' },
  { code: 'TPA', name: 'Tampa Intl', city: 'Tampa', state: 'FL' },
  { code: 'AUS', name: 'Austin-Bergstrom Intl', city: 'Austin', state: 'TX' },
  { code: 'BNA', name: 'Nashville Intl', city: 'Nashville', state: 'TN' },
  { code: 'PDX', name: 'Portland Intl', city: 'Portland', state: 'OR' },
  { code: 'STL', name: 'St. Louis Lambert Intl', city: 'St. Louis', state: 'MO' },
  { code: 'MCI', name: 'Kansas City Intl', city: 'Kansas City', state: 'MO' },
  { code: 'RDU', name: 'Raleigh-Durham Intl', city: 'Raleigh', state: 'NC' },
  { code: 'SJC', name: 'San José Mineta Intl', city: 'San José', state: 'CA' },
  { code: 'SMF', name: 'Sacramento Intl', city: 'Sacramento', state: 'CA' },
  { code: 'IND', name: 'Indianapolis Intl', city: 'Indianapolis', state: 'IN' },
  { code: 'PIT', name: 'Pittsburgh Intl', city: 'Pittsburgh', state: 'PA' },
  { code: 'CMH', name: 'John Glenn Columbus Intl', city: 'Columbus', state: 'OH' },
  { code: 'MKE', name: 'Milwaukee Mitchell Intl', city: 'Milwaukee', state: 'WI' },
  { code: 'CLE', name: 'Cleveland Hopkins Intl', city: 'Cleveland', state: 'OH' },
  { code: 'PHL', name: 'Philadelphia Intl', city: 'Philadelphia', state: 'PA' },
  { code: 'HNL', name: 'Daniel K. Inouye Intl', city: 'Honolulu', state: 'HI' },
  { code: 'OAK', name: 'Oakland Intl', city: 'Oakland', state: 'CA' },
  { code: 'MDW', name: 'Chicago Midway Intl', city: 'Chicago', state: 'IL' },
  { code: 'HOU', name: 'William P. Hobby', city: 'Houston', state: 'TX' },
  { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', state: 'TX' },
  { code: 'RSW', name: 'Southwest Florida Intl', city: 'Fort Myers', state: 'FL' },
  { code: 'JAX', name: 'Jacksonville Intl', city: 'Jacksonville', state: 'FL' },
  { code: 'CID', name: 'The Eastern Iowa Airport', city: 'Cedar Rapids', state: 'IA' },
  { code: 'DSM', name: 'Des Moines Intl', city: 'Des Moines', state: 'IA' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', state: 'NY' },
  { code: 'MSY', name: 'Louis Armstrong New Orleans Intl', city: 'New Orleans', state: 'LA' },
  { code: 'OMA', name: 'Eppley Airfield', city: 'Omaha', state: 'NE' },
  { code: 'ABQ', name: 'Albuquerque Intl Sunport', city: 'Albuquerque', state: 'NM' },
  { code: 'RNO', name: 'Reno-Tahoe Intl', city: 'Reno', state: 'NV' },
  { code: 'BOI', name: 'Boise Airport', city: 'Boise', state: 'ID' },
  { code: 'BUF', name: 'Buffalo Niagara Intl', city: 'Buffalo', state: 'NY' },
  { code: 'SNA', name: 'John Wayne Airport', city: 'Santa Ana', state: 'CA' },
  { code: 'BUR', name: 'Hollywood Burbank', city: 'Burbank', state: 'CA' },
  { code: 'ONT', name: 'Ontario Intl', city: 'Ontario', state: 'CA' },
  { code: 'SAT', name: 'San Antonio Intl', city: 'San Antonio', state: 'TX' },
  { code: 'OKC', name: 'Will Rogers World', city: 'Oklahoma City', state: 'OK' },
  { code: 'MEM', name: 'Memphis Intl', city: 'Memphis', state: 'TN' },
  { code: 'RIC', name: 'Richmond Intl', city: 'Richmond', state: 'VA' },
  { code: 'ORF', name: 'Norfolk Intl', city: 'Norfolk', state: 'VA' },
  { code: 'CVG', name: 'Cincinnati/Northern Kentucky Intl', city: 'Cincinnati', state: 'OH' },
  { code: 'BDL', name: 'Bradley Intl', city: 'Hartford', state: 'CT' },
  { code: 'ANC', name: 'Ted Stevens Anchorage Intl', city: 'Anchorage', state: 'AK' },
];

/**
 * Search airports by query string.
 * Matches against code, city name, and airport name.
 */
export function searchAirports(query: string, limit: number = 8): Airport[] {
  if (!query || query.length < 1) return [];

  const q = query.toLowerCase().trim();

  // Exact code match first
  const exactMatch = AIRPORTS.filter(a => a.code.toLowerCase() === q);
  if (exactMatch.length > 0) return exactMatch;

  // Then prefix match on code
  const codeMatches = AIRPORTS.filter(a => a.code.toLowerCase().startsWith(q));

  // Then city/name matches
  const cityMatches = AIRPORTS.filter(a =>
    !a.code.toLowerCase().startsWith(q) &&
    (a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
  );

  return [...codeMatches, ...cityMatches].slice(0, limit);
}
