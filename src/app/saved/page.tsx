'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import FlightCard from '@/components/FlightCard';
import RoundTripCard from '@/components/RoundTripCard';
import PairedFlightCard from '@/components/PairedFlightCard';
import { FlightOption, PairedItinerary, RankedFlight } from '@/types/flight';
import Link from 'next/link';

export default function SavedPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { getSavedFlights, getSavedPairedItineraries, getSearchHistory } = useDatabase();
  
  const [flights, setFlights] = useState<RankedFlight[]>([]);
  const [pairedTrips, setPairedTrips] = useState<PairedItinerary[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const fetchData = async () => {
        try {
          const [savedFlights, savedPaired, searchHistory] = await Promise.all([
            getSavedFlights(),
            getSavedPairedItineraries(),
            getSearchHistory()
          ]);
          setFlights(savedFlights);
          setPairedTrips(savedPaired);
          setHistory(searchHistory);
        } catch (error) {
          console.error("Error fetching saved items:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, getSavedFlights, getSavedPairedItineraries, getSearchHistory]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading your saved trips...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.06] rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Sign in to see your saved trips</h1>
          <p className="text-gray-500 leading-relaxed">
            Create an account to save flights, track prices, and sync your searches across all your devices.
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const hasItems = flights.length > 0 || pairedTrips.length > 0;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-500/20 uppercase tracking-widest">
              My Collection
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Saved Trips</h1>
          <p className="text-xl text-gray-500 font-medium">
            {hasItems 
              ? `You have ${flights.length + pairedTrips.length} items in your collection.`
              : "Your collection is empty. Start searching and save flights you love."}
          </p>
        </header>

        {!hasItems ? (
          <div className="py-20 text-center glass rounded-[40px] border border-white/[0.05]">
            <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No saved trips yet</h2>
            <p className="text-gray-500 mb-8">Tap the heart icon on any flight result to save it here.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:text-indigo-300 transition-colors"
            >
              Start Searching
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Paired Trips Section */}
            {pairedTrips.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Paired Itineraries ({pairedTrips.length})</h2>
                  <div className="h-px flex-1 bg-white/[0.06]"></div>
                </div>
                <div className="grid gap-6">
                  {pairedTrips.map((trip, idx) => (
                    trip.label?.includes('Layover') || trip.outbound.id.includes('_') 
                      ? <PairedFlightCard key={idx} paired={trip} />
                      : <RoundTripCard key={idx} paired={trip} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* Individual Flights Section */}
            {flights.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Individual Flights ({flights.length})</h2>
                  <div className="h-px flex-1 bg-white/[0.06]"></div>
                </div>
                <div className="grid gap-6">
                  {flights.map((flight, idx) => (
                    <FlightCard key={flight.id} flight={flight} index={idx} />
                  ))}
                </div>
              </section>
            )}

            {/* Search History Section */}
            {history.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Recent Searches ({history.length})</h2>
                  <div className="h-px flex-1 bg-white/[0.06]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item, idx) => (
                    <Link
                      key={idx}
                      href={`/?origin=${item.origin}&destination=${item.destination}&departureDate=${item.departureDate}${item.returnDate ? `&returnDate=${item.returnDate}` : ''}&mode=${item.mode}`}
                      className="glass p-5 rounded-2xl border border-white/[0.05] hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                          item.mode === 'layover' ? 'bg-teal-500/10 text-teal-400' : 
                          item.mode === 'anywhere' ? 'bg-violet-500/10 text-violet-400' : 
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {item.mode}
                        </span>
                        <span className="text-[9px] font-bold text-gray-600">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white font-black text-lg tracking-tighter">
                        <span>{item.origin}</span>
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span>{item.destination}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>{new Date(item.departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        {item.returnDate && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                            <span>{new Date(item.returnDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
