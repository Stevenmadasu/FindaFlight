'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAirports, Airport } from '@/lib/airports';
import { AutocompleteSuggestion, AutocompleteAirport } from '@/lib/autocomplete';

interface AirportInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  error?: string;
}

type SuggestionItem = {
  type: 'airport' | 'city' | 'region';
  code: string; // IATA or Google ID
  name: string;
  city: string;
  state?: string;
  isRemote?: boolean;
};

export default function AirportInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'City or code',
  error,
}: AirportInputProps) {
  const [query, setQuery] = useState(value);
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

  const fetchRemoteSuggestions = async (q: string) => {
    if (q.length < 3) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/airports/autocomplete?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        const remoteItems: SuggestionItem[] = (data.suggestions || []).flatMap((s: AutocompleteSuggestion) => {
          const suggestions: SuggestionItem[] = [];
          
          // Add city/region itself
          suggestions.push({
            type: s.type,
            code: s.id,
            name: s.name,
            city: s.name,
            isRemote: true
          });

          // Add individual airports for that city
          s.airports?.forEach((a: AutocompleteAirport) => {
            suggestions.push({
              type: 'airport',
              code: a.id,
              name: a.name,
              city: a.city,
              isRemote: true
            });
          });

          return suggestions;
        });

        // Merge with local results, avoid duplicates
        setItems(prev => {
          const codes = new Set(prev.map(i => i.code));
          const filteredRemote = remoteItems.filter(i => !codes.has(i.code));
          return [...prev, ...filteredRemote].slice(0, 15);
        });
      }
    } catch (err) {
      console.error('Failed to fetch remote suggestions', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.length >= 1) {
      // Step 1: Search local (instant)
      const localResults = searchAirports(val).map(a => ({
        type: 'airport' as const,
        code: a.code,
        name: a.name,
        city: a.city,
        state: a.state,
        isRemote: false
      }));
      setItems(localResults);
      setIsOpen(localResults.length > 0 || val.length >= 3);

      // Step 2: Search remote (debounced)
      if (val.length >= 2) {
        debounceTimer.current = setTimeout(() => {
          fetchRemoteSuggestions(val);
        }, 400);
      }
    } else {
      setItems([]);
      setIsOpen(false);
      onChange('');
    }
  }, [onChange]);

  const selectItem = useCallback((item: SuggestionItem) => {
    setQuery(item.code);
    onChange(item.code);
    setIsOpen(false);
    setItems([]);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        selectItem(items[selectedIndex]);
      } else if (query.length >= 3) {
        onChange(query.toUpperCase());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, selectedIndex, items, selectItem, query, onChange]);

  const handleBlur = useCallback(() => {
    // If user typed a 3-letter code or multiple codes directly, keep it
    setTimeout(() => {
      if (!isOpen) {
        onChange(query.toUpperCase().trim());
      }
    }, 200);
  }, [query, onChange, isOpen]);

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
              setIsOpen(true);
            }
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-4 py-3 bg-white/[0.06] border ${
            error ? 'border-red-500/60' : 'border-white/[0.1]'
          } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all uppercase text-lg font-medium pr-10`}
        />

        {/* Status icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          )}
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>

      {/* Selected item hint - showing name of first matched airport if code is present */}
      {query.length === 3 && !isOpen && (
        <p className="mt-1 text-xs text-gray-500 truncate italic">
          Selected Code: {query.toUpperCase()}
        </p>
      )}

      {/* Error message */}
      {error && !isOpen && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && items.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#141b2d] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-scale-in max-h-80 overflow-y-auto">
          {items.map((item, index) => (
            <button
              key={`${item.code}-${index}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                selectItem(item);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-white/[0.02] last:border-0 ${
                index === selectedIndex
                  ? 'bg-indigo-500/20 text-white'
                  : 'text-gray-300 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex flex-col w-12 flex-shrink-0">
                <span className={`text-[10px] font-bold uppercase ${item.type === 'airport' ? 'text-indigo-400' : 'text-violet-400'}`}>
                  {item.type}
                </span>
                <span className="text-sm font-bold text-white leading-none mt-1">
                  {item.code.length > 4 ? 'ID' : item.code}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.city}{item.state ? `, ${item.state}` : ''}
                </p>
                <p className="text-xs text-gray-500 truncate">{item.name}</p>
              </div>
              {item.isRemote && (
                <div className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-gray-500 uppercase tracking-tighter">
                  Global
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
