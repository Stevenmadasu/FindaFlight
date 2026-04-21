'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import FlightResults from '@/components/FlightResults';
import { SearchResults } from '@/types/flight';

export default function HomePage() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
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

      // Scroll to results smoothly
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
        {/* Hero Section */}
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
            Not just the cheapest — the <span className="text-gray-300 font-medium">smartest</span>.
            We rank flights by price, duration, and convenience so you can
            make the right decision, fast.
          </p>
        </div>

        {/* Search Form */}
        <div className="animate-slide-up max-w-4xl mx-auto">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 max-w-4xl mx-auto bg-red-500/[0.1] border border-red-500/30 text-red-300 px-5 py-4 rounded-xl animate-fade-in flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="glass-strong rounded-2xl p-10 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto mb-5"></div>
              <p className="text-gray-300 font-medium">Searching for flights...</p>
              <p className="text-gray-500 text-sm mt-2">Finding and ranking the best options for you</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div id="results" className="max-w-4xl mx-auto">
            <FlightResults results={results} />
          </div>
        )}

        {/* How It Works Section (shown only when no results) */}
        {!results && !loading && (
          <div className="mt-20 animate-fade-in">
            <h2 className="text-center text-2xl font-bold text-white mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold gradient-text">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Enter Your Trip</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Tell us where you&apos;re going and when. Just two airports and a date.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold gradient-text">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">We Rank & Score</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Our algorithm scores every flight on price, duration, and stops to find the best balance.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold gradient-text">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Decide with Confidence</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  See our top pick with a clear explanation, then compare all options side by side.
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4 p-5 glass rounded-xl hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Smart Scoring</h4>
                  <p className="text-sm text-gray-400">Every flight gets a composite score weighing price, time, and convenience.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 glass rounded-xl hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Clear Recommendations</h4>
                  <p className="text-sm text-gray-400">We tell you the best option and explain exactly why — no guesswork.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 glass rounded-xl hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Sort & Filter</h4>
                  <p className="text-sm text-gray-400">Quickly sort by best, cheapest, fastest, or fewest stops to find what matters to you.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
