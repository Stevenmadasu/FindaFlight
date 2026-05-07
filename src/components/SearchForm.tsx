'use client';

import { useState, useEffect } from 'react';
import AirportInput from './AirportInput';
import { SearchMode, SearchPreference } from '@/types/flight';

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    mode: SearchMode;
    preference?: SearchPreference;
    maxPrice?: number;
    flexDates?: boolean;
    includeNearby?: boolean;
  }) => void;
  onModeChange?: (mode: SearchMode) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, onModeChange, loading }: SearchFormProps) {
  // Persistence initialization
  const [mode, setModeInternal] = useState<SearchMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('findaflight_mode') as SearchMode) || 'standard';
    }
    return 'standard';
  });
  
  const [origin, setOrigin] = useState(() => 
    (typeof window !== 'undefined' ? localStorage.getItem('findaflight_origin') || '' : '')
  );
  const [destination, setDestination] = useState(() => 
    (typeof window !== 'undefined' ? localStorage.getItem('findaflight_destination') || '' : '')
  );
  const [departureDate, setDepartureDate] = useState(() => 
    (typeof window !== 'undefined' ? localStorage.getItem('findaflight_departureDate') || '' : '')
  );
  const [returnDate, setReturnDate] = useState(() => 
    (typeof window !== 'undefined' ? localStorage.getItem('findaflight_returnDate') || '' : '')
  );
  const [preference, setPreference] = useState<SearchPreference>('best');
  const [maxPrice, setMaxPrice] = useState('');
  const [flexDates, setFlexDates] = useState(false);
  const [includeNearby, setIncludeNearby] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const setMode = (newMode: SearchMode) => {
    setModeInternal(newMode);
    localStorage.setItem('findaflight_mode', newMode);
    // Clear all errors when switching modes
    setErrors({});
    if (onModeChange) onModeChange(newMode);
  };

  // Sync other fields to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('findaflight_origin', origin);
      localStorage.setItem('findaflight_destination', destination);
      localStorage.setItem('findaflight_departureDate', departureDate);
      localStorage.setItem('findaflight_returnDate', returnDate || '');
    }
  }, [origin, destination, departureDate, returnDate]);

  // Helper to update state and clear error
  const updateField = (field: string, value: any, setter: (v: any) => void) => {
    setter(value);
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    console.log('[Form] Validating:', { mode, origin, destination, departureDate, returnDate });

    if (!origin || origin.trim().length < 3) {
      newErrors.origin = 'Origin airport code (3 letters) is required';
    }

    if (mode !== 'anywhere') {
      if (!destination || destination.trim().length < 3) {
        newErrors.destination = 'Destination airport code (3 letters) is required';
      } else if (origin && destination && origin.toUpperCase().trim() === destination.toUpperCase().trim()) {
        newErrors.destination = 'Must be different from origin';
      }
    }

    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else {
      const selectedDate = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.departureDate = 'Date cannot be in the past';
      }
    }

    // Return date is REQUIRED for layover and anywhere modes
    if ((mode === 'layover' || mode === 'anywhere')) {
      if (!returnDate) {
        newErrors.returnDate = 'Return date is required for this mode';
      }
    }

    if (departureDate && returnDate) {
      if (new Date(returnDate) < new Date(departureDate)) {
        newErrors.returnDate = 'Return date must be after departure';
      }
    }

    console.log('[Form] Errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch({
        origin: origin.toUpperCase().replace(/\s+/g, ''),
        destination: mode === 'anywhere' ? 'ANYWHERE' : destination.toUpperCase().replace(/\s+/g, ''),
        departureDate,
        returnDate: returnDate || undefined,
        mode,
        preference: mode === 'anywhere' ? preference : undefined,
        maxPrice: mode === 'anywhere' && maxPrice ? Number(maxPrice) : undefined,
        flexDates,
        includeNearby,
      });
    }
  };

  const handleSwap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  const modeConfig = {
    standard: {
      gradient: 'from-indigo-500 to-cyan-500',
      buttonGradient: 'from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500',
      shadow: 'shadow-indigo-500/25 hover:shadow-indigo-500/40',
      label: 'Search Flights',
    },
    layover: {
      gradient: 'from-teal-500 to-emerald-500',
      buttonGradient: 'from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500',
      shadow: 'shadow-teal-500/25 hover:shadow-teal-500/40',
      label: 'Search Layover Matches',
    },
    anywhere: {
      gradient: 'from-violet-500 to-fuchsia-500',
      buttonGradient: 'from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500',
      shadow: 'shadow-violet-500/25 hover:shadow-violet-500/40',
      label: 'Discover Destinations',
    },
  };

  const currentMode = modeConfig[mode];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/[0.04] p-1 rounded-xl flex items-center border border-white/[0.06] flex-wrap justify-center gap-1">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'standard'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setMode('layover')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'layover'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Layover Destination
          </button>
          <button
            type="button"
            onClick={() => setMode('anywhere')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'anywhere'
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Take Me Anywhere
          </button>
        </div>
      </div>

      {/* Mode Info Banners */}
      {mode === 'layover' && (
        <div className="mb-6 bg-teal-500/[0.08] border border-teal-500/20 rounded-xl p-4 text-sm text-teal-300">
          <p className="font-semibold mb-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Layover Search Enabled
          </p>
          <p className="text-teal-400/80 leading-relaxed">
            We will find paired itineraries where your intended destination is an intermediate layover on the outbound flight, combined with a standard one-way flight back.
          </p>
        </div>
      )}

      {mode === 'anywhere' && (
        <div className="mb-6 bg-violet-500/[0.08] border border-violet-500/20 rounded-xl p-4 text-sm text-violet-300">
          <p className="font-semibold mb-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Discovery Mode
          </p>
          <p className="text-violet-400/80 leading-relaxed">
            We&apos;ll search flights from your airport to multiple destinations and show you the best options ranked by your preference.
          </p>
        </div>
      )}

      <form id="search" onSubmit={handleSubmit}>
        {mode === 'anywhere' ? (
          /* Anywhere Mode Layout */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <AirportInput
                id="origin"
                label="From *"
                value={origin}
                onChange={(val) => updateField('origin', val, setOrigin)}
                placeholder="City or CID"
                error={errors.origin}
              />

              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Departure <span className="text-violet-400">*</span>
                </label>
                <input
                  id="departureDate"
                  type="date"
                  value={departureDate}
                  onChange={(e) => updateField('departureDate', e.target.value, setDepartureDate)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/[0.06] border ${
                    errors.departureDate ? 'border-red-500/60' : 'border-white/[0.1]'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                />
                {errors.departureDate && <p className="mt-1.5 text-xs text-red-400">{errors.departureDate}</p>}
              </div>

              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Return <span className="text-violet-400">*</span>
                </label>
                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => updateField('returnDate', e.target.value, setReturnDate)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/[0.06] border ${
                    errors.returnDate ? 'border-red-500/60' : 'border-white/[0.1]'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                />
                {errors.returnDate && <p className="mt-1.5 text-xs text-red-400">{errors.returnDate}</p>}
              </div>
            </div>

            {/* Preference + Max Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preference</label>
                <div className="flex gap-2">
                  {([
                    { value: 'best' as SearchPreference, label: '✨ Best' },
                    { value: 'cheapest' as SearchPreference, label: '💰 Cheapest' },
                    { value: 'fastest' as SearchPreference, label: '⚡ Fastest' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPreference(opt.value)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        preference === opt.value
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                          : 'text-gray-400 border-white/[0.06] hover:border-white/[0.1] hover:text-white bg-white/[0.04]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-2">
                  Max Price <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 500"
                  min="50"
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard / Layover Mode Layout */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr] gap-4 md:gap-5 items-start">
              <AirportInput
                id="origin"
                label="From *"
                value={origin}
                onChange={(val) => updateField('origin', val, setOrigin)}
                placeholder="City or CID"
                error={errors.origin}
              />

              <div className="hidden lg:flex items-center justify-center pt-8">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all group"
                  aria-label="Swap origin and destination"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              <AirportInput
                id="destination"
                label="To (Destination) *"
                value={destination}
                onChange={(val) => updateField('destination', val, setDestination)}
                placeholder="City or MIA"
                error={errors.destination}
              />

              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Departure *
                </label>
                <input
                  id="departureDate"
                  type="date"
                  value={departureDate}
                  onChange={(e) => updateField('departureDate', e.target.value, setDepartureDate)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/[0.06] border ${
                    errors.departureDate ? 'border-red-500/60' : 'border-white/[0.1]'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                />
                {errors.departureDate && <p className="mt-1.5 text-xs text-red-400">{errors.departureDate}</p>}
              </div>

              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Return {mode === 'standard' && <span className="text-gray-500">(optional)</span>}
                  {mode === 'layover' && <span className="text-teal-400 ml-1">*</span>}
                </label>
                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => updateField('returnDate', e.target.value, setReturnDate)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/[0.06] border ${
                    errors.returnDate ? 'border-red-500/60' : 'border-white/[0.1]'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                />
                {errors.returnDate && <p className="mt-1.5 text-xs text-red-400">{errors.returnDate}</p>}
              </div>
            </div>

            <div className="flex lg:hidden justify-center -mt-2 mb-2">
              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                aria-label="Swap origin and destination"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Swap
              </button>
            </div>
          </>
        )}

        {/* Advanced Options Toggle */}
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={flexDates}
                onChange={(e) => setFlexDates(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${flexDates ? 'bg-indigo-500' : 'bg-white/[0.1]'}`}></div>
              <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${flexDates ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
              Check nearby dates (±3 days)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={includeNearby}
                onChange={(e) => setIncludeNearby(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${includeNearby ? 'bg-indigo-500' : 'bg-white/[0.1]'}`}></div>
              <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${includeNearby ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
              Include nearby airports
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-4 px-6 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-gradient-to-r ${currentMode.buttonGradient} text-white ${currentMode.shadow}`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mode === 'anywhere' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )}
              </svg>
              {currentMode.label}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
