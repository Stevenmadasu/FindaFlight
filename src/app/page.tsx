'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import FlightResults from '@/components/FlightResults';
import { SearchResults } from '@/types/flight';
import { SearchMode } from '@/types/flight';

export default function HomePage() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    mode: SearchMode;
  }) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data);

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/[0.08] border border-indigo-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
            <span className="text-xs font-medium text-indigo-300 tracking-wide">Intelligent Flight Discovery</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
            <span className="text-white">Find the </span>
            <span className="gradient-text">best flight</span>
            <br />
            <span className="text-white">for </span>
            <span className="text-gray-400">your trip</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover standard routes or uncover <span className="text-teal-400 font-medium">Layover Destinations</span>. 
            We calculate matched one-way tickets to help you save money or visit extra cities painlessly.
          </p>
        </div>

        <div className="animate-slide-up max-w-4xl mx-auto">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="mt-6 max-w-4xl mx-auto bg-red-500/[0.1] border border-red-500/30 text-red-300 px-5 py-4 rounded-xl animate-fade-in flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="glass-strong rounded-2xl p-10 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto mb-5"></div>
              <p className="text-gray-300 font-medium">Searching out optimal combinations...</p>
              <p className="text-gray-500 text-sm mt-2">Generating and scoring the best itineraries</p>
            </div>
          </div>
        )}

        {results && (
          <div id="results" className="max-w-4xl mx-auto">
            <FlightResults results={results} />
          </div>
        )}

        {!results && !loading && (
          <div className="mt-20 animate-fade-in">
            <h2 className="text-center text-2xl font-bold text-white mb-10">
              Smarter Travel Discovery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Search Standard</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Search conventionally. We analyze price, length, and layovers to recommend the true best options.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Layover Destinations</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Toggle Layer Match to find hidden-city flights where your stop-off is actually the destination you want.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Paired Matching</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We automatically calculate your return flight so you can view these strategies as complete round-trips.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
