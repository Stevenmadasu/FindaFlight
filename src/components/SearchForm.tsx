'use client';

import { useState } from 'react';
import AirportInput from './AirportInput';
import { SearchMode } from '@/types/flight';

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    mode: SearchMode;
  }) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [mode, setMode] = useState<SearchMode>('standard');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!origin || !/^[A-Za-z]{3}$/.test(origin)) {
      newErrors.origin = 'Select an airport';
    }

    if (!destination || !/^[A-Za-z]{3}$/.test(destination)) {
      newErrors.destination = 'Select an airport';
    }

    if (origin && destination && origin.toUpperCase() === destination.toUpperCase()) {
      newErrors.destination = 'Must be different from origin';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Select a departure date';
    } else {
      const selectedDate = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.departureDate = 'Date cannot be in the past';
      }
    }

    if (mode === 'layover' && !returnDate) {
      newErrors.returnDate = 'Required for layover search';
    }

    if (returnDate) {
      const outDate = new Date(departureDate);
      const retDate = new Date(returnDate);
      if (retDate < outDate) {
        newErrors.returnDate = 'Must be after departure';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate: returnDate || undefined,
        mode,
      });
    }
  };

  const handleSwap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/[0.04] p-1 rounded-xl flex items-center border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'standard'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Standard Search
          </button>
          <button
            type="button"
            onClick={() => setMode('layover')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'layover'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Layover Destination
          </button>
        </div>
      </div>

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

      <form id="search" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr] gap-4 md:gap-5 items-start">
          <AirportInput
            id="origin"
            label="From"
            value={origin}
            onChange={setOrigin}
            placeholder="City or CID"
            error={errors.origin}
          />

          <div className="hidden lg:flex items-center justify-center pt-8">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all group"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <AirportInput
            id="destination"
            label="To (Destination)"
            value={destination}
            onChange={setDestination}
            placeholder="City or MIA"
            error={errors.destination}
          />

          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-300 mb-2">
              Departure
            </label>
            <input
              id="departureDate"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
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
              onChange={(e) => setReturnDate(e.target.value)}
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
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full py-4 px-6 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
            mode === 'layover' 
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-teal-500/25 hover:shadow-teal-500/40'
              : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Searching flights...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search {mode === 'layover' ? 'Layover Matches' : 'Flights'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
