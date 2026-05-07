// ========================================================================
// FindaFlight — Flight Search & Result Types
// Complete types for SerpApi Google Flights integration
// ========================================================================

import type { DealScore as DealScoreType } from '@/lib/dealScore';
import type { FlexDateResult as FlexDateResultType } from '@/lib/flexDates';
import type { FareAlert as FareAlertType } from '@/lib/fareAlerts';
import type { AutocompleteSuggestion as AutoSugType, AutocompleteAirport as AutoAirportType } from '@/lib/autocomplete';

// Re-export for convenience
export type DealScore = DealScoreType;
export type FlexDateResult = FlexDateResultType;
export type FareAlert = FareAlertType;
export type AutocompleteSuggestion = AutoSugType;
export type AutocompleteAirport = AutoAirportType;

// ─── Search Modes & Preferences ─────────────────────────────────────────

export type SearchMode = 'standard' | 'layover' | 'anywhere';
export type SearchPreference = 'cheapest' | 'fastest' | 'best';

// ─── Flight Search Request (Frontend → API) ────────────────────────────

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  mode?: SearchMode;
  preference?: SearchPreference;
  maxPrice?: number;
  // Extended params
  adults?: number;
  children?: number;
  infants_in_seat?: number;
  infants_on_lap?: number;
  travel_class?: number; // 1=Economy, 2=Premium Economy, 3=Business, 4=First
  type?: number;         // 1=Round trip, 2=One way, 3=Multi-city
  stops?: number;        // 0=Any, 1=Non-stop, 2=1 stop or fewer, 3=2 stops or fewer
  sort_by?: number;
  bags?: number;
  currency?: string;
  hl?: string;
  gl?: string;
  deep_search?: boolean;
  show_hidden?: boolean;
  exclude_airlines?: string;
  include_airlines?: string;
  exclude_conns?: string;
  max_duration?: number;
  outbound_times?: string;
  return_times?: string;
  layover_duration?: string;
  exclude_basic?: boolean;
  flexDates?: boolean;
  includeNearby?: boolean;
}

// ─── SerpApi Request Params (built server-side) ─────────────────────────

export interface SerpApiRequestParams {
  engine: 'google_flights';
  api_key: string;
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  return_date?: string;
  type?: number;
  currency?: string;
  hl?: string;
  gl?: string;
  travel_class?: number;
  adults?: number;
  children?: number;
  infants_in_seat?: number;
  infants_on_lap?: number;
  stops?: number;
  sort_by?: number;
  bags?: number;
  max_price?: number;
  outbound_times?: string;
  return_times?: string;
  layover_duration?: string;
  exclude_airlines?: string;
  include_airlines?: string;
  exclude_conns?: string;
  max_duration?: number;
  deep_search?: boolean;
  show_hidden?: boolean;
  exclude_basic?: boolean;
  departure_token?: string;
  booking_token?: string;
  no_cache?: boolean;
}

// ─── Flight Leg / Segment ───────────────────────────────────────────────

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
  travel_class?: string;
  legroom?: string;
  extensions?: string[];
  overnight?: boolean;
  often_delayed_by_over_30_min?: boolean;
  ticket_also_sold_by?: string[];
}

// ─── Layover ────────────────────────────────────────────────────────────

export interface Layover {
  duration: number;
  name: string;
  id: string;
  overnight?: boolean;
}

// ─── Carbon Emissions ───────────────────────────────────────────────────

export interface CarbonEmissions {
  this_flight: number;
  typical_for_this_route: number;
  difference_percent: number;
}

// ─── Flight Option (normalized result) ──────────────────────────────────

export interface FlightOption {
  id: string;
  flights: FlightLeg[];
  layovers?: Layover[];
  total_duration: number; // minutes
  price: number;
  type: string;
  airline_logo: string;
  stops: number;
  carbon_emissions?: CarbonEmissions;
  departure_token?: string;
  booking_token?: string;
  extensions?: string[];

  // Hidden-city specific optional fields
  isLayoverMatch?: boolean;
  ticketedDestination?: {
    id: string;
    name: string;
  };
  savings?: number;
  savingsPercent?: number;
  normalRoutePrice?: number;

  // Deal scoring
  dealScore?: DealScoreType;
}

// ─── Price Insights ─────────────────────────────────────────────────────

export interface PriceInsights {
  lowest_price: number;
  price_level?: string; // 'low', 'typical', 'high'
  typical_price_range?: [number, number];
  price_history?: number[][];
}

// ─── Airport Metadata ───────────────────────────────────────────────────

export interface AirportMetadata {
  departure: Array<{
    airport: { id: string; name: string };
    city: string;
    country: string;
    country_code: string;
    image: string;
    thumbnail: string;
  }>;
  arrival: Array<{
    airport: { id: string; name: string };
    city: string;
    country: string;
    country_code: string;
    image: string;
    thumbnail: string;
  }>;
}

// ─── SerpApi Raw Response ───────────────────────────────────────────────

export interface SerpApiFlightResponse {
  search_metadata?: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_flights_url?: string;
    raw_html_file?: string;
    total_time_taken?: number;
  };
  search_parameters?: Record<string, string | number | boolean>;
  best_flights?: SerpApiFlightResult[];
  other_flights?: SerpApiFlightResult[];
  price_insights?: {
    lowest_price?: number;
    price_level?: string;
    typical_price_range?: [number, number];
    price_history?: number[][];
  };
  airports?: AirportMetadata[];
  booking_options?: BookingOption[];
  error?: string;
}

export interface SerpApiFlightResult {
  flights: Array<{
    departure_airport: { name: string; id: string; time: string };
    arrival_airport: { name: string; id: string; time: string };
    duration: number;
    airplane: string;
    airline: string;
    airline_logo: string;
    travel_class: string;
    flight_number: string;
    legroom?: string;
    extensions?: string[];
    overnight?: boolean;
    often_delayed_by_over_30_min?: boolean;
    ticket_also_sold_by?: string[];
  }>;
  layovers?: Array<{
    duration: number;
    name: string;
    id: string;
    overnight?: boolean;
  }>;
  total_duration: number;
  price: number;
  type: string;
  airline_logo: string;
  departure_token?: string;
  booking_token?: string;
  extensions?: string[];
  carbon_emissions?: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
}

// ─── Booking Options ────────────────────────────────────────────────────

export interface BookingOption {
  book_with?: string;
  price?: number;
  airline_logos?: string[];
  marketed_as?: string[];
  booking_request?: {
    url?: string;
    post_data?: string;
  };
  fare_details?: Array<{
    fare_class?: string;
    fare_type?: string;
  }>;
}

export interface BookingOptionsResponse {
  booking_options: BookingOption[];
  search_metadata?: SerpApiFlightResponse['search_metadata'];
}

// ─── API Error Response ─────────────────────────────────────────────────

export interface ApiErrorResponse {
  error: string;
  code: 'VALIDATION_ERROR' | 'API_ERROR' | 'RATE_LIMIT' | 'NETWORK_ERROR' | 'MISSING_API_KEY' | 'EMPTY_RESULTS';
  details?: string;
}

// ─── Ranking & Scoring ──────────────────────────────────────────────────

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
  label?: string;
}

export interface Recommendation {
  item: RankedFlight | PairedItinerary;
  reason: string;
  isPaired: boolean;
}

// ─── Take Me Anywhere ───────────────────────────────────────────────────

export interface DestinationCard {
  destinationCity: string;
  destinationCode: string;
  bestPrice: number;
  bestAirline: string;
  bestDuration: number; // minutes
  bestStops: number;
  score: number;
  weekendScore: number;
  recommendationReason: string;
  flights: RankedFlight[];
  returnFlights: RankedFlight[];
  bestRoundTripPrice: number;
}

// ─── Combined Search Results ────────────────────────────────────────────

export interface FlexDateSummary {
  cheapestDate: string;
  cheapestPrice: number;
  allDates: FlexDateResultType[];
}

export interface SearchResults {
  mode: SearchMode;
  flights?: RankedFlight[];
  pairedItineraries?: PairedItinerary[];
  destinations?: DestinationCard[];
  recommendation: Recommendation | null;
  searchParams: FlightSearchParams;
  priceInsights?: PriceInsights;
  isMockData: boolean;
  dataSource?: string; // 'api' | 'mock'
  flexDateSummary?: FlexDateSummary;
  resultType?: 'standard' | 'layover_deal' | 'flex';
  requiresAuth?: boolean; // true when Take Me Anywhere results are capped for anonymous users
}
