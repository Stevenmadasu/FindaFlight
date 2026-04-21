'use client';

import { useState, useMemo } from 'react';
import { SearchResults } from '@/types/flight';
import FlightCard from './FlightCard';
import RecommendationCard from './RecommendationCard';

interface FlightResultsProps {
  results: SearchResults;
}

type SortOption = 'best' | 'price' | 'duration' | 'stops';

export default function FlightResults({ results }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [maxStops, setMaxStops] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Price range from results
  const priceRange = useMemo(() => {
    const prices = results.flights.map(f => f.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [results.flights]);

  // Filter and sort
  const filteredFlights = useMemo(() => {
    let flights = [...results.flights];

    // Apply filters
    if (maxStops !== null) {
      flights = flights.filter(f => f.stops <= maxStops);
    }
    if (maxPrice !== null) {
      flights = flights.filter(f => f.price <= maxPrice);
    }

    // Sort
    switch (sortBy) {
      case 'best':
        return flights.sort((a, b) => b.score - a.score);
      case 'price':
        return flights.sort((a, b) => a.price - b.price);
      case 'duration':
        return flights.sort((a, b) => a.total_duration - b.total_duration);
      case 'stops':
        return flights.sort((a, b) => a.stops - b.stops);
      default:
        return flights;
    }
  }, [results.flights, sortBy, maxStops, maxPrice]);

  const totalFlights = results.flights.length;
  const cheapest = results.flights.reduce((min, f) => f.price < min.price ? f : min, results.flights[0]);
  const fastest = results.flights.reduce((min, f) => f.total_duration < min.total_duration ? f : min, results.flights[0]);
  const directCount = results.flights.filter(f => f.stops === 0).length;

  // Get unique stop counts
  const availableStops = useMemo(() => {
    const stops = [...new Set(results.flights.map(f => f.stops))].sort();
    return stops;
  }, [results.flights]);

  const activeFilterCount = (maxStops !== null ? 1 : 0) + (maxPrice !== null ? 1 : 0);

  const clearFilters = () => {
    setMaxStops(null);
    setMaxPrice(null);
  };

  if (totalFlights === 0) {
    return (
      <div className="mt-10 text-center animate-fade-in">
        <div className="glass-strong rounded-2xl p-10 max-w-lg mx-auto">
          <svg className="w-16 h-16 mx-auto mb-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-3">No flights found</h3>
          <p className="text-gray-400 mb-6">We couldn&apos;t find any flights for this route.</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>💡 Try adjusting your dates</p>
            <p>💡 Try a nearby departure city</p>
            <p>💡 Check your airport codes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Flights Found</p>
          <p className="text-2xl font-bold text-white mt-1">{totalFlights}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">From</p>
          <p className="text-2xl font-bold text-teal-400 mt-1">${cheapest.price}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Fastest</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {Math.floor(fastest.total_duration / 60)}h {fastest.total_duration % 60}m
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Direct</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{directCount}</p>
        </div>
      </div>

      {/* Mock Data Indicator */}
      {results.isMockData && (
        <div className="mb-5 flex items-center gap-2 px-4 py-2.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl text-sm">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-amber-300/80">
            Showing simulated results for demonstration. Real-time data available with API integration.
          </span>
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
            {filteredFlights.length === totalFlights ? 'All Flights' : `${filteredFlights.length} of ${totalFlights} Flights`}
            <span className="text-gray-500 font-normal text-sm ml-2">
              {results.searchParams.origin} → {results.searchParams.destination}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
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
            {/* Max Stops Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Max Stops
              </label>
              <div className="flex gap-2">
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

            {/* Max Price Filter */}
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

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Flight List */}
      <div className="space-y-3">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight, index) => (
            <FlightCard key={flight.id} flight={flight} index={index} />
          ))
        ) : (
          <div className="text-center py-10 glass rounded-xl">
            <p className="text-gray-400 mb-2">No flights match your filters</p>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear filters to see all {totalFlights} flights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
