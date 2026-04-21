'use client';

import { useState } from 'react';
import AirportInput from './AirportInput';

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
  }) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
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
      });
    }
  };

  // Swap origin and destination
  const handleSwap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  return (
    <form
      id="search"
      onSubmit={handleSubmit}
      className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr] gap-4 md:gap-5 items-start">
        {/* Origin */}
        <AirportInput
          id="origin"
          label="From"
          value={origin}
          onChange={setOrigin}
          placeholder="City or CID"
          error={errors.origin}
        />

        {/* Swap Button */}
        <div className="hidden lg:flex items-center justify-center pt-8">
          <button
            type="button"
            onClick={handleSwap}
            className="p-2 rounded-full bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all group"
            title="Swap origin and destination"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Destination */}
        <AirportInput
          id="destination"
          label="To"
          value={destination}
          onChange={setDestination}
          placeholder="City or MIA"
          error={errors.destination}
        />

        {/* Departure Date */}
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
            } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
          />
          {errors.departureDate && (
            <p className="mt-1.5 text-xs text-red-400">{errors.departureDate}</p>
          )}
        </div>

        {/* Return Date */}
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-300 mb-2">
            Return <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="returnDate"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 bg-white/[0.06] border ${
              errors.returnDate ? 'border-red-500/60' : 'border-white/[0.1]'
            } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
          />
          {errors.returnDate && (
            <p className="mt-1.5 text-xs text-red-400">{errors.returnDate}</p>
          )}
        </div>
      </div>

      {/* Mobile swap button */}
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
        className="mt-4 w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
            Search Flights
          </>
        )}
      </button>
    </form>
  );
}
