/**
 * FindaFlight — Mock Flight Data Generator
 *
 * Generates realistic flight data for demos and when SerpAPI is unavailable.
 * Dynamically creates results based on provided search params.
 */

import { FlightOption } from '@/types/flight';

// Airline database
const AIRLINES = [
  { name: 'Delta Air Lines', code: 'DL', logo: 'https://www.gstatic.com/flights/airline_logos/70px/DL.png' },
  { name: 'United Airlines', code: 'UA', logo: 'https://www.gstatic.com/flights/airline_logos/70px/UA.png' },
  { name: 'American Airlines', code: 'AA', logo: 'https://www.gstatic.com/flights/airline_logos/70px/AA.png' },
  { name: 'Southwest Airlines', code: 'WN', logo: 'https://www.gstatic.com/flights/airline_logos/70px/WN.png' },
  { name: 'JetBlue Airways', code: 'B6', logo: 'https://www.gstatic.com/flights/airline_logos/70px/B6.png' },
  { name: 'Alaska Airlines', code: 'AS', logo: 'https://www.gstatic.com/flights/airline_logos/70px/AS.png' },
  { name: 'Spirit Airlines', code: 'NK', logo: 'https://www.gstatic.com/flights/airline_logos/70px/NK.png' },
  { name: 'Frontier Airlines', code: 'F9', logo: 'https://www.gstatic.com/flights/airline_logos/70px/F9.png' },
];

// Airport database with names
const AIRPORTS: Record<string, string> = {
  'ATL': 'Hartsfield-Jackson Atlanta Intl',
  'DFW': 'Dallas/Fort Worth Intl',
  'DEN': 'Denver Intl',
  'ORD': "Chicago O'Hare Intl",
  'LAX': 'Los Angeles Intl',
  'JFK': 'John F. Kennedy Intl',
  'SFO': 'San Francisco Intl',
  'SEA': 'Seattle-Tacoma Intl',
  'LAS': 'Harry Reid Intl',
  'MCO': 'Orlando Intl',
  'EWR': 'Newark Liberty Intl',
  'MIA': 'Miami Intl',
  'PHX': 'Phoenix Sky Harbor Intl',
  'IAH': 'George Bush Intercontinental',
  'BOS': 'Boston Logan Intl',
  'MSP': 'Minneapolis-Saint Paul Intl',
  'DTW': 'Detroit Metro Wayne County',
  'CLT': 'Charlotte Douglas Intl',
  'FLL': 'Fort Lauderdale-Hollywood Intl',
  'BWI': 'Baltimore/Washington Intl',
  'SLC': 'Salt Lake City Intl',
  'SAN': 'San Diego Intl',
  'DCA': 'Ronald Reagan Washington National',
  'TPA': 'Tampa Intl',
  'AUS': 'Austin-Bergstrom Intl',
  'CID': 'The Eastern Iowa Airport',
  'DSM': 'Des Moines Intl',
  'STL': 'St. Louis Lambert Intl',
  'PIT': 'Pittsburgh Intl',
  'RDU': 'Raleigh-Durham Intl',
  'BNA': 'Nashville Intl',
  'PDX': 'Portland Intl',
  'IND': 'Indianapolis Intl',
  'MCI': 'Kansas City Intl',
  'MDW': 'Chicago Midway Intl',
  'HNL': 'Daniel K. Inouye Intl',
  'OAK': 'Oakland Intl',
};

// Hub connections for layovers
const HUB_AIRPORTS = ['ATL', 'ORD', 'DFW', 'DEN', 'JFK', 'LAX', 'CLT', 'MIA', 'IAH', 'MSP', 'DTW', 'SLC', 'PHX'];

// Popular destinations for "Take Me Anywhere"
const ANYWHERE_DESTINATIONS: Record<string, string> = {
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

function getAirportName(code: string): string {
  return AIRPORTS[code.toUpperCase()] || `${code.toUpperCase()} Airport`;
}

/**
 * Pseudo-random number generator seeded by string (deterministic results per route).
 */
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

/**
 * Generate mock flights for a given origin → destination route.
 */
export function generateMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
): FlightOption[] {
  const from = origin.toUpperCase();
  const to = destination.toUpperCase();
  const seed = `${from}-${to}-${departureDate}`;
  const rng = seededRandom(seed);

  const flights: FlightOption[] = [];

  // Generate 2-3 direct flights
  const numDirect = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < numDirect; i++) {
    const airline = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const basePrice = 120 + Math.floor(rng() * 350);
    const duration = 90 + Math.floor(rng() * 240); // 1.5h – 5.5h
    const departHour = 6 + Math.floor(rng() * 14); // 6am – 8pm
    const departMin = Math.floor(rng() * 4) * 15; // 00, 15, 30, 45
    const arriveMinutes = departHour * 60 + departMin + duration;
    const arriveHour = Math.floor(arriveMinutes / 60) % 24;
    const arriveMin = arriveMinutes % 60;

    flights.push({
      id: `mock-direct-${i}`,
      flights: [
        {
          departure_airport: {
            name: getAirportName(from),
            id: from,
            time: `${departureDate} ${String(departHour).padStart(2, '0')}:${String(departMin).padStart(2, '0')}`,
          },
          arrival_airport: {
            name: getAirportName(to),
            id: to,
            time: `${departureDate} ${String(arriveHour).padStart(2, '0')}:${String(arriveMin).padStart(2, '0')}`,
          },
          duration,
          airplane: rng() > 0.5 ? 'Boeing 737' : 'Airbus A320',
          airline: airline.name,
          airline_logo: airline.logo,
          flight_number: `${airline.code} ${1000 + Math.floor(rng() * 9000)}`,
          legroom: rng() > 0.5 ? '31 in' : '30 in',
        },
      ],
      total_duration: duration,
      price: basePrice,
      type: 'direct',
      airline_logo: airline.logo,
      stops: 0,
    });
  }

  // Generate 3-5 connecting flights (1 stop)
  const numConnecting = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < numConnecting; i++) {
    const airline1 = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const airline2 = rng() > 0.6 ? airline1 : AIRLINES[Math.floor(rng() * AIRLINES.length)];

    // Pick a hub that isn't origin or destination
    const availableHubs = HUB_AIRPORTS.filter(h => h !== from && h !== to);
    const hub = availableHubs[Math.floor(rng() * availableHubs.length)];

    const leg1Duration = 60 + Math.floor(rng() * 180); // 1h – 4h
    const layoverDuration = 45 + Math.floor(rng() * 180); // 45m – 3h45m
    const leg2Duration = 60 + Math.floor(rng() * 180);
    const totalDuration = leg1Duration + layoverDuration + leg2Duration;

    // Price is sometimes cheaper, sometimes not (connecting usually cheaper)
    const directAvg = flights.filter(f => f.stops === 0).reduce((s, f) => s + f.price, 0) / Math.max(1, flights.filter(f => f.stops === 0).length);
    const priceMultiplier = 0.6 + rng() * 0.7; // 60% – 130% of direct avg
    const price = Math.round(directAvg * priceMultiplier);

    const departHour = 5 + Math.floor(rng() * 15);
    const departMin = Math.floor(rng() * 4) * 15;

    const leg1ArrMinutes = departHour * 60 + departMin + leg1Duration;
    const leg2DepMinutes = leg1ArrMinutes + layoverDuration;
    const leg2ArrMinutes = leg2DepMinutes + leg2Duration;

    flights.push({
      id: `mock-connect-${i}`,
      flights: [
        {
          departure_airport: {
            name: getAirportName(from),
            id: from,
            time: `${departureDate} ${String(departHour).padStart(2, '0')}:${String(departMin).padStart(2, '0')}`,
          },
          arrival_airport: {
            name: getAirportName(hub),
            id: hub,
            time: `${departureDate} ${String(Math.floor(leg1ArrMinutes / 60) % 24).padStart(2, '0')}:${String(leg1ArrMinutes % 60).padStart(2, '0')}`,
          },
          duration: leg1Duration,
          airplane: 'Boeing 737',
          airline: airline1.name,
          airline_logo: airline1.logo,
          flight_number: `${airline1.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
        {
          departure_airport: {
            name: getAirportName(hub),
            id: hub,
            time: `${departureDate} ${String(Math.floor(leg2DepMinutes / 60) % 24).padStart(2, '0')}:${String(leg2DepMinutes % 60).padStart(2, '0')}`,
          },
          arrival_airport: {
            name: getAirportName(to),
            id: to,
            time: `${departureDate} ${String(Math.floor(leg2ArrMinutes / 60) % 24).padStart(2, '0')}:${String(leg2ArrMinutes % 60).padStart(2, '0')}`,
          },
          duration: leg2Duration,
          airplane: 'Airbus A321',
          airline: airline2.name,
          airline_logo: airline2.logo,
          flight_number: `${airline2.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
      ],
      layovers: [
        {
          duration: layoverDuration,
          name: getAirportName(hub),
          id: hub,
          overnight: layoverDuration > 360,
        },
      ],
      total_duration: totalDuration,
      price: Math.max(79, price), // floor at $79
      type: 'connecting',
      airline_logo: airline1.logo,
      stops: 1,
    });
  }

  // Generate 1-2 multi-stop flights (2 stops) — usually cheapest
  const numMulti = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < numMulti; i++) {
    const airline = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const availableHubs = HUB_AIRPORTS.filter(h => h !== from && h !== to);
    const hub1 = availableHubs[Math.floor(rng() * availableHubs.length)];
    const hub2 = availableHubs.filter(h => h !== hub1)[Math.floor(rng() * (availableHubs.length - 1))];

    const leg1 = 60 + Math.floor(rng() * 120);
    const lay1 = 50 + Math.floor(rng() * 120);
    const leg2 = 45 + Math.floor(rng() * 120);
    const lay2 = 50 + Math.floor(rng() * 120);
    const leg3 = 60 + Math.floor(rng() * 120);
    const total = leg1 + lay1 + leg2 + lay2 + leg3;

    const directAvg = flights.filter(f => f.stops === 0).reduce((s, f) => s + f.price, 0) / Math.max(1, flights.filter(f => f.stops === 0).length);
    const price = Math.max(69, Math.round(directAvg * (0.45 + rng() * 0.4)));

    const dH = 5 + Math.floor(rng() * 12);
    const dM = Math.floor(rng() * 4) * 15;

    flights.push({
      id: `mock-multi-${i}`,
      flights: [
        {
          departure_airport: { name: getAirportName(from), id: from, time: `${departureDate} ${String(dH).padStart(2, '0')}:${String(dM).padStart(2, '0')}` },
          arrival_airport: { name: getAirportName(hub1), id: hub1, time: `${departureDate} ${String(Math.floor((dH * 60 + dM + leg1) / 60) % 24).padStart(2, '0')}:${String((dH * 60 + dM + leg1) % 60).padStart(2, '0')}` },
          duration: leg1,
          airplane: 'Embraer 175',
          airline: airline.name,
          airline_logo: airline.logo,
          flight_number: `${airline.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
        {
          departure_airport: { name: getAirportName(hub1), id: hub1, time: `${departureDate} ${String(Math.floor((dH * 60 + dM + leg1 + lay1) / 60) % 24).padStart(2, '0')}:${String((dH * 60 + dM + leg1 + lay1) % 60).padStart(2, '0')}` },
          arrival_airport: { name: getAirportName(hub2), id: hub2, time: `${departureDate} ${String(Math.floor((dH * 60 + dM + leg1 + lay1 + leg2) / 60) % 24).padStart(2, '0')}:${String((dH * 60 + dM + leg1 + lay1 + leg2) % 60).padStart(2, '0')}` },
          duration: leg2,
          airplane: 'Boeing 737',
          airline: airline.name,
          airline_logo: airline.logo,
          flight_number: `${airline.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
        {
          departure_airport: { name: getAirportName(hub2), id: hub2, time: `${departureDate} ${String(Math.floor((dH * 60 + dM + leg1 + lay1 + leg2 + lay2) / 60) % 24).padStart(2, '0')}:${String((dH * 60 + dM + leg1 + lay1 + leg2 + lay2) % 60).padStart(2, '0')}` },
          arrival_airport: { name: getAirportName(to), id: to, time: `${departureDate} ${String(Math.floor((dH * 60 + dM + total) / 60) % 24).padStart(2, '0')}:${String((dH * 60 + dM + total) % 60).padStart(2, '0')}` },
          duration: leg3,
          airplane: 'Airbus A319',
          airline: airline.name,
          airline_logo: airline.logo,
          flight_number: `${airline.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
      ],
      layovers: [
        { duration: lay1, name: getAirportName(hub1), id: hub1, overnight: false },
        { duration: lay2, name: getAirportName(hub2), id: hub2, overnight: false },
      ],
      total_duration: total,
      price,
      type: 'multi-stop',
      airline_logo: airline.logo,
      stops: 2,
    });
  }

  // Sort by price
  flights.sort((a, b) => a.price - b.price);

  return flights;
}

/**
 * Generate mock flights where the intended destination is actually a layover.
 */
export function generateMockLayoverFlights(
  origin: string,
  intendedDestination: string,
  departureDate: string,
): FlightOption[] {
  const from = origin.toUpperCase();
  const hub = intendedDestination.toUpperCase();
  const seed = `${from}-${hub}-${departureDate}-layover`;
  const rng = seededRandom(seed);

  const flights: FlightOption[] = [];
  const numFlights = 3 + Math.floor(rng() * 4); // 3 to 6

  for (let i = 0; i < numFlights; i++) {
    const airline1 = AIRLINES[Math.floor(rng() * AIRLINES.length)];
    const airline2 = rng() > 0.6 ? airline1 : AIRLINES[Math.floor(rng() * AIRLINES.length)];

    // Pick a final ticketed destination that isn't origin or hub
    const availableDestinations = Object.keys(AIRPORTS).filter(k => k !== from && k !== hub);
    const finalDest = availableDestinations[Math.floor(rng() * availableDestinations.length)];

    const leg1Duration = 60 + Math.floor(rng() * 180);
    const layoverDuration = 45 + Math.floor(rng() * 300); // 45m - 5h
    const leg2Duration = 60 + Math.floor(rng() * 240);
    const totalDuration = leg1Duration + layoverDuration + leg2Duration;

    // Layover/Discovery flights are often cheap
    const price = 89 + Math.floor(rng() * 250);

    const departHour = 5 + Math.floor(rng() * 15);
    const departMin = Math.floor(rng() * 4) * 15;

    const leg1ArrMinutes = departHour * 60 + departMin + leg1Duration;
    const leg2DepMinutes = leg1ArrMinutes + layoverDuration;
    const leg2ArrMinutes = leg2DepMinutes + leg2Duration;

    flights.push({
      id: `mock-layover-${i}`,
      flights: [
        {
          departure_airport: {
            name: getAirportName(from),
            id: from,
            time: `${departureDate} ${String(departHour).padStart(2, '0')}:${String(departMin).padStart(2, '0')}`,
          },
          arrival_airport: {
            name: getAirportName(hub),
            id: hub,
            time: `${departureDate} ${String(Math.floor(leg1ArrMinutes / 60) % 24).padStart(2, '0')}:${String(leg1ArrMinutes % 60).padStart(2, '0')}`,
          },
          duration: leg1Duration,
          airplane: 'Boeing 737',
          airline: airline1.name,
          airline_logo: airline1.logo,
          flight_number: `${airline1.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
        {
          departure_airport: {
            name: getAirportName(hub),
            id: hub,
            time: `${departureDate} ${String(Math.floor(leg2DepMinutes / 60) % 24).padStart(2, '0')}:${String(leg2DepMinutes % 60).padStart(2, '0')}`,
          },
          arrival_airport: {
            name: getAirportName(finalDest),
            id: finalDest,
            time: `${departureDate} ${String(Math.floor(leg2ArrMinutes / 60) % 24).padStart(2, '0')}:${String(leg2ArrMinutes % 60).padStart(2, '0')}`,
          },
          duration: leg2Duration,
          airplane: 'Airbus A321',
          airline: airline2.name,
          airline_logo: airline2.logo,
          flight_number: `${airline2.code} ${1000 + Math.floor(rng() * 9000)}`,
        },
      ],
      layovers: [
        {
          duration: layoverDuration,
          name: getAirportName(hub),
          id: hub,
          overnight: layoverDuration > 360,
        },
      ],
      total_duration: totalDuration,
      price,
      type: 'connecting',
      airline_logo: airline1.logo,
      stops: 1,
      isLayoverMatch: true,
      ticketedDestination: {
        id: finalDest,
        name: getAirportName(finalDest)
      }
    });
  }

  flights.sort((a, b) => a.price - b.price);
  return flights;
}

/**
 * Generate "Take Me Anywhere" mock flights from origin to multiple random destinations.
 * Returns a map of destination code → FlightOption[]
 */
export function generateAnywhereFlights(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxPrice?: number,
): { outbound: Record<string, FlightOption[]>; returns: Record<string, FlightOption[]> } {
  const from = origin.toUpperCase();
  const seed = `${from}-anywhere-${departureDate}`;
  const rng = seededRandom(seed);

  // Pick 8-12 destinations, excluding origin
  const allDests = Object.keys(ANYWHERE_DESTINATIONS).filter(d => d !== from);
  const shuffled = allDests.sort(() => rng() - 0.5);
  const selectedDests = shuffled.slice(0, 8 + Math.floor(rng() * 4));

  const outbound: Record<string, FlightOption[]> = {};
  const returns: Record<string, FlightOption[]> = {};

  for (const dest of selectedDests) {
    const outFlights = generateMockFlights(from, dest, departureDate);
    const retFlights = generateMockFlights(dest, from, returnDate);

    // Apply max price filter if set
    if (maxPrice) {
      const filtered = outFlights.filter(f => f.price <= maxPrice);
      outbound[dest] = filtered.length > 0 ? filtered : outFlights.slice(0, 2); // keep at least 2
    } else {
      outbound[dest] = outFlights;
    }

    returns[dest] = retFlights;
  }

  return { outbound, returns };
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
