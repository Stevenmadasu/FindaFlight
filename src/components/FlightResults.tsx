'use client';

import { useState, useMemo } from 'react';
import { SearchResults, RankedFlight, PairedItinerary } from '@/types/flight';
import FlightCard from './FlightCard';
import PairedFlightCard from './PairedFlightCard';
import RoundTripCard from './RoundTripCard';
import RecommendationCard from './RecommendationCard';
import DestinationCard from './DestinationCard';

interface FlightResultsProps {
  results: SearchResults;
}

type SortOption = 'best' | 'price' | 'duration' | 'stops';

export default function FlightResults({ results }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [maxStops, setMaxStops] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const isLayoverMode = results.mode === 'layover';
  const isAnywhereMode = results.mode === 'anywhere';
  const isStandardRoundTrip = results.mode === 'standard' && (results.pairedItineraries?.length ?? 0) > 0;
  const isStandardOneWay = results.mode === 'standard' && !isStandardRoundTrip;

  // === ANYWHERE MODE ===
  if (isAnywhereMode) {
    const destinations = results.destinations || [];

    if (destinations.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="mt-8 animate-fade-in">
        {/* Summary */}
        <div className="glass rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {destinations.length} Destinations Discovered
            </h2>
            <p className="text-sm text-gray-400">
              From {results.searchParams.origin} · {results.searchParams.departureDate} → {results.searchParams.returnDate}
            </p>
          </div>
          {results.isMockData && (
            <span className="text-xs px-3 py-1 bg-amber-500/[0.1] border border-amber-500/20 rounded-lg text-amber-300/80">
              Demo data
            </span>
          )}
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinations.map((card, index) => (
            <DestinationCard key={card.destinationCode} card={card} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // === STANDARD / LAYOVER MODES ===
  const flightsArray = isLayoverMode || isStandardRoundTrip
    ? (results.pairedItineraries || []) as Array<RankedFlight | PairedItinerary>
    : (results.flights || []) as Array<RankedFlight | PairedItinerary>;

  // Type guards
  const isPaired = (f: RankedFlight | PairedItinerary): f is PairedItinerary => 'combinedPrice' in f;
  
  const getPrice = (f: RankedFlight | PairedItinerary) => isPaired(f) ? f.combinedPrice : f.price;
  const getDuration = (f: RankedFlight | PairedItinerary) => isPaired(f) ? f.totalDuration : f.total_duration;
  const getStops = (f: RankedFlight | PairedItinerary) => isPaired(f) ? f.outbound.stops : f.stops;

  // Price range from results
  const priceRange = useMemo(() => {
    if (flightsArray.length === 0) return { min: 0, max: 0 };
    const prices = flightsArray.map(f => getPrice(f));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightsArray]);

  // Filter and sort
  const filteredFlights = useMemo(() => {
    let list = [...flightsArray];

    // Apply filters
    if (maxStops !== null) {
      list = list.filter(f => getStops(f) <= maxStops);
    }
    if (maxPrice !== null) {
      list = list.filter(f => getPrice(f) <= maxPrice);
    }

    // Sort
    switch (sortBy) {
      case 'best':
        return list.sort((a, b) => b.score - a.score);
      case 'price':
        return list.sort((a, b) => getPrice(a) - getPrice(b));
      case 'duration':
        return list.sort((a, b) => getDuration(a) - getDuration(b));
      case 'stops':
        return list.sort((a, b) => getStops(a) - getStops(b));
      default:
        return list;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightsArray, sortBy, maxStops, maxPrice]);

  const totalFlights = flightsArray.length;
  
  const cheapest = flightsArray.length > 0 
    ? flightsArray.reduce((min, f) => getPrice(f) < getPrice(min) ? f : min, flightsArray[0])
    : null;
    
  const fastest = flightsArray.length > 0
    ? flightsArray.reduce((min, f) => getDuration(f) < getDuration(min) ? f : min, flightsArray[0])
    : null;
    
  const directCount = flightsArray.filter(f => getStops(f) === 0).length;

  // Get unique stop counts
  const availableStops = useMemo(() => {
    const stops = [...new Set(flightsArray.map(f => getStops(f)))].sort();
    return stops;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightsArray]);

  const activeFilterCount = (maxStops !== null ? 1 : 0) + (maxPrice !== null ? 1 : 0);

  const clearFilters = () => {
    setMaxStops(null);
    setMaxPrice(null);
  };

  if (totalFlights === 0) {
    return <EmptyState />;
  }

  const fastestDur = fastest ? getDuration(fastest) : 0;

  return (
    <div className="mt-8 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {isLayoverMode ? 'Layover Matches' : isStandardRoundTrip ? 'Round-Trips' : 'Flights Found'}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{totalFlights}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">From</p>
          <p className="text-2xl font-bold text-teal-400 mt-1">${cheapest ? getPrice(cheapest) : 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Fastest</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {Math.floor(fastestDur / 60)}h {fastestDur % 60}m
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Direct Routes</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{directCount}</p>
        </div>
      </div>

      {/* Data Source Indicator */}
      {results.isMockData ? (
        <div className="mb-5 flex items-center gap-2 px-4 py-2.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl text-sm">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-amber-300/80">
            Showing simulated results for demonstration. Real-time data available with API integration.
          </span>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 px-4 py-2.5 bg-teal-500/[0.08] border border-teal-500/20 rounded-xl text-sm">
          <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-teal-300/80">
            Live flight data from Google Flights
          </span>
          {results.priceInsights && (
            <span className="ml-auto text-xs px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-md text-teal-400">
              {results.priceInsights.price_level ? `Prices are ${results.priceInsights.price_level}` : 'Price insights available'}
            </span>
          )}
        </div>
      )}

      {/* Recommendation */}
      {results.recommendation && (
        <RecommendationCard recommendation={results.recommendation} />
      )}

      {/* Sort & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            {filteredFlights.length === totalFlights ? 'All Options' : `${filteredFlights.length} of ${totalFlights}`}
            <span className="text-gray-500 font-normal text-sm ml-2">
              {results.searchParams.origin} → {isLayoverMode ? 'Layover at ' : ''}{results.searchParams.destination}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              showFilters || activeFilterCount > 0
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'text-gray-400 hover:text-white bg-white/[0.04] border-white/[0.06] hover:border-white/[0.1]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
            {[
              { value: 'best' as SortOption, label: 'Best' },
              { value: 'price' as SortOption, label: 'Price' },
              { value: 'duration' as SortOption, label: 'Duration' },
              { value: 'stops' as SortOption, label: 'Stops' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  sortBy === option.value
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-5 glass rounded-xl p-5 animate-slide-down">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Max Stops
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: null, label: 'Any' },
                  ...availableStops.map(s => ({ value: s, label: s === 0 ? 'Direct' : `${s} stop${s > 1 ? 's' : ''}` })),
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setMaxStops(option.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      maxStops === option.value
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'text-gray-400 border-white/[0.06] hover:border-white/[0.1] hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Max Price: {maxPrice !== null ? `$${maxPrice}` : 'Any'}
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={maxPrice ?? priceRange.max}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val >= priceRange.max ? null : val);
                }}
                className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">${priceRange.min}</span>
                <span className="text-xs text-gray-500">${priceRange.max}</span>
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Flight List */}
      <div className="space-y-4">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((item, index) => {
            if (isPaired(item)) {
              if (isLayoverMode) {
                return <PairedFlightCard key={item.id} paired={item} />;
              }
              return <RoundTripCard key={item.id} paired={item} index={index} />;
            } else {
              return <FlightCard key={item.id} flight={item} index={index} />;
            }
          })
        ) : (
          <div className="text-center py-10 glass rounded-xl">
            <p className="text-gray-400 mb-2">No flights match your filters</p>
            <button onClick={clearFilters} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Clear filters to see all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Polished empty state component */
function EmptyState() {
  return (
    <div className="mt-10 text-center animate-fade-in">
      <div className="glass-strong rounded-2xl p-10 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-gray-700/30 to-gray-600/20 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No strong options found</h3>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          We couldn&apos;t find flights that meet your criteria. Here are some suggestions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="flex items-start gap-2 bg-white/[0.04] rounded-lg p-3">
            <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-white">Clear filters</p>
              <p className="text-[10px] text-gray-500">Remove stop or price limits</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/[0.04] rounded-lg p-3">
            <svg className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-white">Increase budget</p>
              <p className="text-[10px] text-gray-500">Higher max price = more options</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/[0.04] rounded-lg p-3">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-white">Try flexible dates</p>
              <p className="text-[10px] text-gray-500">±1-2 days can unlock better fares</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/[0.04] rounded-lg p-3">
            <svg className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-white">Allow stops</p>
              <p className="text-[10px] text-gray-500">Connecting flights are often cheaper</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
