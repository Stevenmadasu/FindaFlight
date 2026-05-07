/**
 * FindaFlight — Airport Database
 * ~200 airports: US domestic + major international hubs.
 * Used for local-first autocomplete before SerpApi fallback.
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  type: 'airport' | 'city';
  relatedAirports?: string[];
}

// Multi-airport city groupings
export const CITY_GROUPS: Record<string, { name: string; codes: string[] }> = {
  NYC: { name: 'New York City', codes: ['JFK', 'LGA', 'EWR'] },
  LON: { name: 'London', codes: ['LHR', 'LGW', 'STN'] },
  PAR: { name: 'Paris', codes: ['CDG', 'ORY'] },
  CHI: { name: 'Chicago', codes: ['ORD', 'MDW'] },
  WAS: { name: 'Washington D.C.', codes: ['DCA', 'IAD', 'BWI'] },
  HOU: { name: 'Houston', codes: ['IAH', 'HOU'] },
  DFW: { name: 'Dallas', codes: ['DFW', 'DAL'] },
  LAX: { name: 'Los Angeles', codes: ['LAX', 'BUR', 'SNA', 'ONT'] },
  SFO: { name: 'San Francisco', codes: ['SFO', 'OAK', 'SJC'] },
  TYO: { name: 'Tokyo', codes: ['NRT', 'HND'] },
  SHA: { name: 'Shanghai', codes: ['PVG', 'SHA'] },
  MIL: { name: 'Milan', codes: ['MXP', 'LIN'] },
};

export const AIRPORTS: Airport[] = [
  // ── US Domestic ──
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', state: 'GA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ORD', name: "O'Hare Intl", city: 'Chicago', state: 'IL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DEN', name: 'Denver Intl', city: 'Denver', state: 'CO', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', state: 'NY', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', state: 'WA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', state: 'NV', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MCO', name: 'Orlando Intl', city: 'Orlando', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', state: 'NJ', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'PHX', name: 'Phoenix Sky Harbor Intl', city: 'Phoenix', state: 'AZ', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BOS', name: 'Boston Logan Intl', city: 'Boston', state: 'MA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul Intl', city: 'Minneapolis', state: 'MN', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DTW', name: 'Detroit Metro Wayne County', city: 'Detroit', state: 'MI', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'CLT', name: 'Charlotte Douglas Intl', city: 'Charlotte', state: 'NC', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood Intl', city: 'Fort Lauderdale', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BWI', name: 'Baltimore/Washington Intl', city: 'Baltimore', state: 'MD', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SLC', name: 'Salt Lake City Intl', city: 'Salt Lake City', state: 'UT', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SAN', name: 'San Diego Intl', city: 'San Diego', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington D.C.', state: 'DC', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'IAD', name: 'Washington Dulles Intl', city: 'Washington D.C.', state: 'VA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'TPA', name: 'Tampa Intl', city: 'Tampa', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'AUS', name: 'Austin-Bergstrom Intl', city: 'Austin', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BNA', name: 'Nashville Intl', city: 'Nashville', state: 'TN', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'PDX', name: 'Portland Intl', city: 'Portland', state: 'OR', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'STL', name: 'St. Louis Lambert Intl', city: 'St. Louis', state: 'MO', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MCI', name: 'Kansas City Intl', city: 'Kansas City', state: 'MO', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'RDU', name: 'Raleigh-Durham Intl', city: 'Raleigh', state: 'NC', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SJC', name: 'San José Mineta Intl', city: 'San José', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SMF', name: 'Sacramento Intl', city: 'Sacramento', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'IND', name: 'Indianapolis Intl', city: 'Indianapolis', state: 'IN', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'PIT', name: 'Pittsburgh Intl', city: 'Pittsburgh', state: 'PA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'CMH', name: 'John Glenn Columbus Intl', city: 'Columbus', state: 'OH', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MKE', name: 'Milwaukee Mitchell Intl', city: 'Milwaukee', state: 'WI', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'CLE', name: 'Cleveland Hopkins Intl', city: 'Cleveland', state: 'OH', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'PHL', name: 'Philadelphia Intl', city: 'Philadelphia', state: 'PA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'HNL', name: 'Daniel K. Inouye Intl', city: 'Honolulu', state: 'HI', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'OAK', name: 'Oakland Intl', city: 'Oakland', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MDW', name: 'Chicago Midway Intl', city: 'Chicago', state: 'IL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'HOU', name: 'William P. Hobby', city: 'Houston', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'RSW', name: 'Southwest Florida Intl', city: 'Fort Myers', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'JAX', name: 'Jacksonville Intl', city: 'Jacksonville', state: 'FL', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'CID', name: 'The Eastern Iowa Airport', city: 'Cedar Rapids', state: 'IA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'DSM', name: 'Des Moines Intl', city: 'Des Moines', state: 'IA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', state: 'NY', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MSY', name: 'Louis Armstrong New Orleans Intl', city: 'New Orleans', state: 'LA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'OMA', name: 'Eppley Airfield', city: 'Omaha', state: 'NE', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ABQ', name: 'Albuquerque Intl Sunport', city: 'Albuquerque', state: 'NM', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'RNO', name: 'Reno-Tahoe Intl', city: 'Reno', state: 'NV', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BOI', name: 'Boise Airport', city: 'Boise', state: 'ID', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BUF', name: 'Buffalo Niagara Intl', city: 'Buffalo', state: 'NY', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SNA', name: 'John Wayne Airport', city: 'Santa Ana', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BUR', name: 'Hollywood Burbank', city: 'Burbank', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ONT', name: 'Ontario Intl', city: 'Ontario', state: 'CA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'SAT', name: 'San Antonio Intl', city: 'San Antonio', state: 'TX', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'OKC', name: 'Will Rogers World', city: 'Oklahoma City', state: 'OK', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'MEM', name: 'Memphis Intl', city: 'Memphis', state: 'TN', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'RIC', name: 'Richmond Intl', city: 'Richmond', state: 'VA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ORF', name: 'Norfolk Intl', city: 'Norfolk', state: 'VA', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'CVG', name: 'Cincinnati/Northern Kentucky Intl', city: 'Cincinnati', state: 'OH', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'BDL', name: 'Bradley Intl', city: 'Hartford', state: 'CT', country: 'United States', countryCode: 'US', type: 'airport' },
  { code: 'ANC', name: 'Ted Stevens Anchorage Intl', city: 'Anchorage', state: 'AK', country: 'United States', countryCode: 'US', type: 'airport' },
  // ── International ──
  { code: 'LHR', name: 'Heathrow', city: 'London', state: '', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'LGW', name: 'Gatwick', city: 'London', state: '', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'STN', name: 'Stansted', city: 'London', state: '', country: 'United Kingdom', countryCode: 'GB', type: 'airport' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', state: '', country: 'France', countryCode: 'FR', type: 'airport' },
  { code: 'ORY', name: 'Orly', city: 'Paris', state: '', country: 'France', countryCode: 'FR', type: 'airport' },
  { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', state: '', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'MUC', name: 'Munich', city: 'Munich', state: '', country: 'Germany', countryCode: 'DE', type: 'airport' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', state: '', country: 'Netherlands', countryCode: 'NL', type: 'airport' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', state: '', country: 'Spain', countryCode: 'ES', type: 'airport' },
  { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', state: '', country: 'Spain', countryCode: 'ES', type: 'airport' },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', state: '', country: 'Italy', countryCode: 'IT', type: 'airport' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', state: '', country: 'Italy', countryCode: 'IT', type: 'airport' },
  { code: 'LIS', name: 'Humberto Delgado', city: 'Lisbon', state: '', country: 'Portugal', countryCode: 'PT', type: 'airport' },
  { code: 'ZRH', name: 'Zürich', city: 'Zurich', state: '', country: 'Switzerland', countryCode: 'CH', type: 'airport' },
  { code: 'VIE', name: 'Vienna Intl', city: 'Vienna', state: '', country: 'Austria', countryCode: 'AT', type: 'airport' },
  { code: 'CPH', name: 'Copenhagen', city: 'Copenhagen', state: '', country: 'Denmark', countryCode: 'DK', type: 'airport' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', state: '', country: 'Ireland', countryCode: 'IE', type: 'airport' },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', state: '', country: 'Turkey', countryCode: 'TR', type: 'airport' },
  { code: 'ATH', name: 'Athens Intl', city: 'Athens', state: '', country: 'Greece', countryCode: 'GR', type: 'airport' },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', state: '', country: 'United Arab Emirates', countryCode: 'AE', type: 'airport' },
  { code: 'DOH', name: 'Hamad Intl', city: 'Doha', state: '', country: 'Qatar', countryCode: 'QA', type: 'airport' },
  { code: 'NRT', name: 'Narita Intl', city: 'Tokyo', state: '', country: 'Japan', countryCode: 'JP', type: 'airport' },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', state: '', country: 'Japan', countryCode: 'JP', type: 'airport' },
  { code: 'ICN', name: 'Incheon Intl', city: 'Seoul', state: '', country: 'South Korea', countryCode: 'KR', type: 'airport' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', state: '', country: 'Singapore', countryCode: 'SG', type: 'airport' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', state: '', country: 'Thailand', countryCode: 'TH', type: 'airport' },
  { code: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', state: '', country: 'Hong Kong', countryCode: 'HK', type: 'airport' },
  { code: 'PVG', name: 'Pudong Intl', city: 'Shanghai', state: '', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'PEK', name: 'Capital Intl', city: 'Beijing', state: '', country: 'China', countryCode: 'CN', type: 'airport' },
  { code: 'DEL', name: 'Indira Gandhi Intl', city: 'Delhi', state: '', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', state: '', country: 'India', countryCode: 'IN', type: 'airport' },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', state: '', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'MEL', name: 'Melbourne', city: 'Melbourne', state: '', country: 'Australia', countryCode: 'AU', type: 'airport' },
  { code: 'AKL', name: 'Auckland', city: 'Auckland', state: '', country: 'New Zealand', countryCode: 'NZ', type: 'airport' },
  { code: 'GRU', name: 'São Paulo–Guarulhos', city: 'São Paulo', state: '', country: 'Brazil', countryCode: 'BR', type: 'airport' },
  { code: 'MEX', name: 'Benito Juárez Intl', city: 'Mexico City', state: '', country: 'Mexico', countryCode: 'MX', type: 'airport' },
  { code: 'CUN', name: 'Cancún Intl', city: 'Cancún', state: '', country: 'Mexico', countryCode: 'MX', type: 'airport' },
  { code: 'BOG', name: 'El Dorado Intl', city: 'Bogotá', state: '', country: 'Colombia', countryCode: 'CO', type: 'airport' },
  { code: 'LIM', name: 'Jorge Chávez Intl', city: 'Lima', state: '', country: 'Peru', countryCode: 'PE', type: 'airport' },
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', state: '', country: 'Chile', countryCode: 'CL', type: 'airport' },
  { code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', state: '', country: 'Argentina', countryCode: 'AR', type: 'airport' },
  { code: 'YYZ', name: 'Toronto Pearson Intl', city: 'Toronto', state: '', country: 'Canada', countryCode: 'CA', type: 'airport' },
  { code: 'YVR', name: 'Vancouver Intl', city: 'Vancouver', state: '', country: 'Canada', countryCode: 'CA', type: 'airport' },
  { code: 'YUL', name: 'Montréal–Trudeau', city: 'Montreal', state: '', country: 'Canada', countryCode: 'CA', type: 'airport' },
  { code: 'JNB', name: 'O.R. Tambo Intl', city: 'Johannesburg', state: '', country: 'South Africa', countryCode: 'ZA', type: 'airport' },
  { code: 'CAI', name: 'Cairo Intl', city: 'Cairo', state: '', country: 'Egypt', countryCode: 'EG', type: 'airport' },
  { code: 'NBO', name: 'Jomo Kenyatta Intl', city: 'Nairobi', state: '', country: 'Kenya', countryCode: 'KE', type: 'airport' },
  { code: 'CMB', name: 'Bandaranaike Intl', city: 'Colombo', state: '', country: 'Sri Lanka', countryCode: 'LK', type: 'airport' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', state: '', country: 'Malaysia', countryCode: 'MY', type: 'airport' },
  { code: 'MNL', name: 'Ninoy Aquino Intl', city: 'Manila', state: '', country: 'Philippines', countryCode: 'PH', type: 'airport' },
  { code: 'TPE', name: 'Taiwan Taoyuan Intl', city: 'Taipei', state: '', country: 'Taiwan', countryCode: 'TW', type: 'airport' },
  { code: 'SJO', name: 'Juan Santamaría Intl', city: 'San José', state: '', country: 'Costa Rica', countryCode: 'CR', type: 'airport' },
  { code: 'PTY', name: 'Tocumen Intl', city: 'Panama City', state: '', country: 'Panama', countryCode: 'PA', type: 'airport' },
  { code: 'HAV', name: 'José Martí Intl', city: 'Havana', state: '', country: 'Cuba', countryCode: 'CU', type: 'airport' },
  { code: 'MBJ', name: 'Sangster Intl', city: 'Montego Bay', state: '', country: 'Jamaica', countryCode: 'JM', type: 'airport' },
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', state: '', country: 'Norway', countryCode: 'NO', type: 'airport' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', state: '', country: 'Sweden', countryCode: 'SE', type: 'airport' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', state: '', country: 'Finland', countryCode: 'FI', type: 'airport' },
  { code: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', state: '', country: 'Poland', countryCode: 'PL', type: 'airport' },
  { code: 'PRG', name: 'Václav Havel', city: 'Prague', state: '', country: 'Czech Republic', countryCode: 'CZ', type: 'airport' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', state: '', country: 'Hungary', countryCode: 'HU', type: 'airport' },
];

/**
 * Search airports by query. Matches code, city, name, country.
 */
export function searchAirports(query: string, limit: number = 8): Airport[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();

  // Check city groups first
  const cityGroupResults: Airport[] = [];
  for (const [groupCode, group] of Object.entries(CITY_GROUPS)) {
    if (groupCode.toLowerCase().includes(q) || group.name.toLowerCase().includes(q)) {
      const airports = AIRPORTS.filter(a => group.codes.includes(a.code));
      cityGroupResults.push(...airports);
    }
  }
  if (cityGroupResults.length > 0) return cityGroupResults.slice(0, limit);

  // Exact code match
  const exact = AIRPORTS.filter(a => a.code.toLowerCase() === q);
  if (exact.length > 0) return exact;

  // Prefix match on code
  const codeMatches = AIRPORTS.filter(a => a.code.toLowerCase().startsWith(q));

  // City/name/country matches
  const textMatches = AIRPORTS.filter(a =>
    !a.code.toLowerCase().startsWith(q) &&
    (a.city.toLowerCase().includes(q) ||
     a.name.toLowerCase().includes(q) ||
     a.country.toLowerCase().includes(q))
  );

  return [...codeMatches, ...textMatches].slice(0, limit);
}
