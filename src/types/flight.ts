// Flight search and result types for FindaFlight

export type SearchMode = 'standard' | 'layover';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  mode?: SearchMode;
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
}

export interface Recommendation {
  item: RankedFlight | PairedItinerary;
  reason: string;
  isPaired: boolean;
}

export interface SearchResults {
  mode: SearchMode;
  flights?: RankedFlight[];           // defined if mode === 'standard'
  pairedItineraries?: PairedItinerary[]; // defined if mode === 'layover'
  recommendation: Recommendation | null;
  searchParams: FlightSearchParams;
  isMockData: boolean;
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
