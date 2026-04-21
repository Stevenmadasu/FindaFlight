'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAirports, Airport } from '@/lib/airports';

interface AirportInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  error?: string;
}

export default function AirportInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'City or code',
  error,
}: AirportInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (value !== query && !isOpen) {
      setQuery(value);
    }
  }, [value, isOpen, query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (val.length >= 1) {
      const results = searchAirports(val);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      onChange('');
      setSelectedAirport(null);
    }
  }, [onChange]);

  const selectAirport = useCallback((airport: Airport) => {
    setQuery(airport.code);
    onChange(airport.code);
    setSelectedAirport(airport);
    setIsOpen(false);
    setSuggestions([]);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectAirport(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, selectedIndex, suggestions, selectAirport]);

  const handleBlur = useCallback(() => {
    // If user typed a 3-letter code directly without selecting, auto-uppercase and set
    setTimeout(() => {
      if (query.length === 3 && /^[A-Za-z]{3}$/.test(query)) {
        const code = query.toUpperCase();
        setQuery(code);
        onChange(code);
      }
    }, 200);
  }, [query, onChange]);

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 1) {
              const results = searchAirports(query);
              setSuggestions(results);
              setIsOpen(results.length > 0);
            }
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-4 py-3 bg-white/[0.06] border ${
            error ? 'border-red-500/60' : 'border-white/[0.1]'
          } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all uppercase text-lg font-medium pr-10`}
        />

        {/* Airport icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>

      {/* Selected airport name hint */}
      {selectedAirport && !isOpen && (
        <p className="mt-1 text-xs text-gray-500 truncate">
          {selectedAirport.city}, {selectedAirport.state} — {selectedAirport.name}
        </p>
      )}

      {/* Error message */}
      {error && !selectedAirport && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#141b2d] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-scale-in max-h-64 overflow-y-auto">
          {suggestions.map((airport, index) => (
            <button
              key={airport.code}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                selectAirport(airport);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-indigo-500/20 text-white'
                  : 'text-gray-300 hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-sm font-bold text-indigo-400 w-10 flex-shrink-0">
                {airport.code}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{airport.city}, {airport.state}</p>
                <p className="text-xs text-gray-500 truncate">{airport.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
