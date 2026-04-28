// Flight search and result types for FindaFlight

export type SearchMode = 'standard' | 'layover' | 'anywhere';

export type SearchPreference = 'cheapest' | 'fastest' | 'best';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  mode?: SearchMode;
  preference?: SearchPreference;
  maxPrice?: number;
}

export interface FlightLeg {
  departure_airport: {
    name: string;
    id: string;
    time: string;
  };
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  };
  duration: number; // minutes
  airplane: string;
  airline: string;
  airline_logo: string;
  flight_number: string;
  legroom?: string;
  extensions?: string[];
}

export interface FlightOption {
  id: string;
  flights: FlightLeg[];
  layovers?: {
    duration: number;
    name: string;
    id: string;
    overnight?: boolean;
  }[];
  total_duration: number; // minutes
  price: number;
  type: string;
  airline_logo: string;
  stops: number;
  carbon_emissions?: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
  departure_token?: string;
  
  // Hidden-city specific optional fields
  isLayoverMatch?: boolean;
  ticketedDestination?: {
    id: string;
    name: string;
  };
}

// Ranking badge types
export type FlightBadge = 'best_overall' | 'cheapest' | 'fastest';

export interface RankedFlight extends FlightOption {
  score: number;        // 0-100 composite score (higher is better)
  priceScore: number;   // 0-100
  durationScore: number;// 0-100
  stopsScore: number;   // 0-100
  badges: FlightBadge[];
}

export interface PairedItinerary {
  id: string;
  outbound: RankedFlight;
  returnFlight: RankedFlight;
  combinedPrice: number;
  totalDuration: number;
  score: number;
  priceScore: number;
  durationScore: number;
  stopsScore: number;
  badges: FlightBadge[];
  label?: string; // "Round-trip option" or "Best round-trip value"
}

export interface Recommendation {
  item: RankedFlight | PairedItinerary;
  reason: string;
  isPaired: boolean;
}

// Take Me Anywhere types
export interface DestinationCard {
  destinationCity: string;
  destinationCode: string;
  bestPrice: number;
  bestAirline: string;
  bestDuration: number; // minutes
  bestStops: number;
  score: number;
  weekendScore: number; // 0-100, how well does it work for a weekend trip
  recommendationReason: string;
  flights: RankedFlight[]; // all flight options to this destination
  returnFlights: RankedFlight[]; // return options
  bestRoundTripPrice: number;
}

export interface SearchResults {
  mode: SearchMode;
  flights?: RankedFlight[];           // defined if mode === 'standard' (one-way)
  pairedItineraries?: PairedItinerary[]; // defined if mode === 'layover' OR standard round-trip
  destinations?: DestinationCard[];    // defined if mode === 'anywhere'
  recommendation: Recommendation | null;
  searchParams: FlightSearchParams;
  isMockData: boolean;
  dataSource?: string; // 'api' | 'mock' | 'hybrid'
}

// SerpAPI response shape
export interface SerpApiFlightResponse {
  best_flights?: FlightOption[];
  other_flights?: FlightOption[];
  search_metadata?: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
  };
  error?: string;
}
