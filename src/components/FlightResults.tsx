'use client';

import { useState, useMemo } from 'react';
import { SearchResults, RankedFlight, PairedItinerary } from '@/types/flight';
import FlightCard from './FlightCard';
import PairedFlightCard from './PairedFlightCard';
import RoundTripCard from './RoundTripCard';
import RecommendationCard from './RecommendationCard';
import DestinationCard from './DestinationCard';
import FlexDateBar from './FlexDateBar';

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

  if (totalFlights === 0 && !results.flexDateSummary) {
    return <EmptyState />;
  }

  const fastestDur = fastest ? getDuration(fastest) : 0;

  return (
    <div className="mt-8 animate-fade-in" id="results">
      {/* Summary Row */}
      <div className="glass-strong rounded-[32px] p-6 md:p-10 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-white/[0.08] relative overflow-hidden">
        {/* Background glow for summary */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] -z-10"></div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
              {isLayoverMode ? 'Top Layover Match' : isAnywhereMode ? 'Discovery Hub' : 'Best Flight Match'}
            </h2>
            {results.isMockData && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                Demo
              </span>
            )}
            {isLayoverMode && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg">
                Hidden City
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <span className="text-white">{results.searchParams.origin}</span>
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-white">
              {isAnywhereMode ? 'The World' : results.searchParams.destination}
            </span>
            <span className="h-4 w-px bg-white/10 mx-1 hidden sm:block"></span>
            <span className="text-gray-400">{results.searchParams.departureDate}</span>
            {results.searchParams.returnDate && (
              <>
                <span className="text-gray-700">—</span>
                <span className="text-gray-400">{results.searchParams.returnDate}</span>
              </>
            )}
          </div>

          {isLayoverMode && (
            <div className="mt-4 flex items-center gap-2 text-violet-400 font-black text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
              Layover in {results.searchParams.destination}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:w-40 bg-white/[0.04] border border-white/[0.05] rounded-2xl p-4 transition-all hover:bg-white/[0.06]">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Cheapest</p>
            <p className="text-2xl font-black text-teal-400 tracking-tighter">${cheapest ? getPrice(cheapest) : '—'}</p>
          </div>
          <div className="flex-1 lg:w-40 bg-white/[0.04] border border-white/[0.05] rounded-2xl p-4 transition-all hover:bg-white/[0.06]">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Fastest</p>
            <p className="text-2xl font-black text-amber-400 tracking-tighter">
              {fastestDur ? `${Math.floor(fastestDur / 60)}h ${fastestDur % 60}m` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Flex Date Discoveries */}
      {results.flexDateSummary && (
        <FlexDateBar summary={results.flexDateSummary} />
      )}

      {/* Data Source Indicator */}
      <div className="mb-5 flex flex-wrap items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs">
        {(results as any)._isCached ? (
          <div className="flex items-center gap-1.5 text-amber-400/80">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Showing cached results</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-teal-400/80">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Live data from Google Flights</span>
          </div>
        )}
        
        {results.priceInsights?.price_level && (
          <span className="ml-auto px-2 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded-md text-gray-400">
            Prices are {results.priceInsights.price_level}
          </span>
        )}
      </div>

      {/* Recommendation */}
      {results.recommendation && (
        <RecommendationCard recommendation={results.recommendation} />
      )}

      {/* Sort & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 px-1">
        <div className="flex items-center gap-2 text-gray-400 text-sm" aria-live="polite">
          <span className="font-semibold text-white">{filteredFlights.length}</span> results shown
          {activeFilterCount > 0 && <span className="text-xs text-indigo-400 font-medium">(filters active)</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              // Simple instrumentation placeholder
              console.log('[Analytics] Toggle Filters', { visible: !showFilters });
            }}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showFilters || activeFilterCount > 0
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1" role="radiogroup" aria-label="Sort flights by">
            {[
              { value: 'best' as SortOption, label: 'Best' },
              { value: 'price' as SortOption, label: 'Cheapest' },
              { value: 'duration' as SortOption, label: 'Fastest' },
              { value: 'stops' as SortOption, label: 'Stops' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  console.log('[Analytics] Sort Changed', { sort: option.value });
                }}
                role="radio"
                aria-checked={sortBy === option.value}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  sortBy === option.value
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
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
        <div id="filter-panel" className="mb-6 glass-strong border border-white/[0.1] rounded-2xl p-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Maximum Stops
                </label>
                {maxStops !== null && (
                  <button 
                    onClick={() => setMaxStops(null)} 
                    className="text-[10px] text-indigo-400 font-bold hover:underline"
                    aria-label="Reset stops filter"
                  >
                    RESET
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by maximum stops">
                {[
                  { value: null, label: 'Any' },
                  { value: 0, label: 'Direct' },
                  { value: 1, label: '1 Stop' },
                  { value: 2, label: '2+ Stops' },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setMaxStops(option.value);
                      console.log('[Analytics] Filter MaxStops', { value: option.value });
                    }}
                    aria-pressed={maxStops === option.value}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      maxStops === option.value
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'text-gray-400 border-white/[0.06] hover:border-white/[0.1] bg-white/[0.02]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="price-range" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Budget Limit
                </label>
                <span className="text-xs font-bold text-white">
                  {maxPrice !== null ? `$${maxPrice}` : 'Unlimited'}
                </span>
              </div>
              <input
                id="price-range"
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={maxPrice ?? priceRange.max}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const newVal = val >= priceRange.max ? null : val;
                  setMaxPrice(newVal);
                  console.log('[Analytics] Filter MaxPrice', { value: newVal });
                }}
                className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-indigo-500"
                aria-label="Filter by maximum price"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-medium text-gray-600">${priceRange.min}</span>
                <span className="text-[10px] font-medium text-gray-600">${priceRange.max}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <button 
              onClick={() => setShowFilters(false)} 
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
              aria-label="Close filters panel"
            >
              CLOSE PANEL
            </button>
            {activeFilterCount > 0 && (
              <button 
                onClick={() => {
                  clearFilters();
                  console.log('[Analytics] Filters Cleared');
                }} 
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                aria-label="Clear all active filters"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                CLEAR ALL
              </button>
            )}
          </div>
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
      <div className="glass-strong rounded-2xl p-10 max-lg mx-auto">
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
