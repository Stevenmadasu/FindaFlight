'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { PairedItinerary } from '@/types/flight';
import AuthGate from './AuthGate';

interface RoundTripCardProps {
  paired: PairedItinerary;
  index: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default function RoundTripCard({ paired, index }: RoundTripCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { isAuthenticated } = useAuth();
  const { savePairedItinerary, removePairedItinerary, isPairedItinerarySaved } = useDatabase();

  const pairedId = `${paired.outbound.id}_${paired.returnFlight.id}`;

  // Check if trip is saved
  useState(() => {
    if (isAuthenticated) {
      isPairedItinerarySaved(pairedId).then(setIsSaved);
    }
  });

  const { outbound, returnFlight, combinedPrice, totalDuration, score, label } = paired;
  const animationDelay = `${index * 80}ms`;

  // Collect airlines used
  const airlines = new Set<string>();
  outbound.flights.forEach(leg => airlines.add(leg.airline));
  returnFlight.flights.forEach(leg => airlines.add(leg.airline));
  const airlineList = [...airlines].join(', ');

  const isbestValue = label === 'Best round-trip value';

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/flights?hl=en#flt=${outbound.flights[0]?.departure_airport.id}.${outbound.flights[outbound.flights.length-1]?.arrival_airport.id}.${outbound.flights[0]?.departure_airport.time.split(' ')[0]}*${returnFlight.flights[0]?.departure_airport.id}.${returnFlight.flights[returnFlight.flights.length-1]?.arrival_airport.id}.${returnFlight.flights[0]?.departure_airport.time.split(' ')[0]}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsAuthGateOpen(true);
      return;
    }

    if (isSaved) {
      await removePairedItinerary(pairedId);
      setIsSaved(false);
    } else {
      await savePairedItinerary(paired);
      setIsSaved(true);
    }
  };

  return (
    <>
      <AuthGate 
        isOpen={isAuthGateOpen} 
        onClose={() => setIsAuthGateOpen(false)} 
        onSuccess={() => {
          setIsAuthGateOpen(false);
          savePairedItinerary(paired).then(() => setIsSaved(true));
        }}
      />
      <div
        className={`rounded-[32px] overflow-hidden transition-all duration-500 animate-slide-up cursor-pointer border ${
          isbestValue
            ? 'bg-[#0f172a]/80 backdrop-blur-xl border-indigo-500/40 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20'
            : 'glass border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]'
        }`}
        style={{ animationDelay, animationFillMode: 'backwards' }}
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
      >
        {/* Header */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left: Label + Route */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-[0.15em] border ${
                  isbestValue
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                    : 'bg-white/[0.04] text-gray-500 border-white/[0.05]'
                }`}>
                  {label || 'Round-trip option'}
                </span>
                <span className="text-gray-500 text-[10px] font-black bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05] uppercase tracking-widest">
                  SCORE: {score}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {outbound.flights[0]?.departure_airport?.id}
                    <span className="mx-3 text-gray-700 font-medium">⇄</span>
                    {outbound.flights[outbound.flights.length - 1]?.arrival_airport?.id}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {airlineList}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {formatDuration(totalDuration)} Total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Pricing */}
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-6 pr-8 border-r border-white/[0.05]">
                {/* Save Button */}
                <button
                  onClick={handleToggleSave}
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    isSaved 
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                      : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={isSaved ? "Remove from saved" : "Save trip"}
                >
                  <svg 
                    className="w-6 h-6" 
                    fill={isSaved ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Out</p>
                  <p className="text-xl font-bold text-white/90">${outbound.price}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Ret</p>
                  <p className="text-xl font-bold text-white/90">${returnFlight.price}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Combined</p>
                <p className={`text-5xl font-black tracking-tighter leading-none ${isbestValue ? 'text-indigo-400' : 'text-white'}`}>
                  ${combinedPrice.toLocaleString()}
                </p>
              </div>

              <div className={`h-14 w-14 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                expanded ? 'bg-indigo-500 text-black shadow-lg shadow-indigo-500/30' : 'bg-white/[0.04] border border-white/[0.06] text-gray-400'
              }`}>
                <svg
                  className={`w-7 h-7 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-6 md:p-10 bg-white/[0.02] animate-fade-in space-y-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-10">
            {/* Left: Itinerary Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest">Outbound Segment</span>
                  <span className="text-sm font-black text-white">${outbound.price}</span>
                </div>
                <div className="pointer-events-none opacity-90 scale-[0.98] origin-top">
                  <FlightCard flight={outbound} index={0} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-violet-500/60 uppercase tracking-widest">Return Segment</span>
                  <span className="text-sm font-black text-white">${returnFlight.price}</span>
                </div>
                <div className="pointer-events-none opacity-90 scale-[0.98] origin-top">
                  <FlightCard flight={returnFlight} index={0} />
                </div>
              </div>
            </div>

            {/* Right: Summary & Booking */}
            <div className="space-y-6">
              <div className="glass border border-white/[0.05] rounded-[24px] p-6 space-y-6">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fare Insights</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.04] border border-white/[0.05] rounded-xl p-3">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter mb-1">Last Updated</p>
                    <p className="text-xs font-bold text-white">{outbound.lastUpdated || 'Just now'}</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.05] rounded-xl p-3">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter mb-1">Fare Type</p>
                    <p className="text-xs font-bold text-indigo-400">{outbound.fareType || 'Main Cabin'}</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.05] rounded-xl p-3">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter mb-1">Carry-on</p>
                    <p className="text-xs font-bold text-teal-400">{outbound.includesCarryOn ? 'Included' : 'Check Fees'}</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.05] rounded-xl p-3">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter mb-1">Self-Transfer</p>
                    <p className={`text-xs font-bold ${outbound.isSelfTransfer || returnFlight.isSelfTransfer ? 'text-orange-400' : 'text-gray-500'}`}>
                      {outbound.isSelfTransfer || returnFlight.isSelfTransfer ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass border border-white/[0.05] rounded-[24px] p-6 space-y-6">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Trip Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Combined Fare</span>
                    <span className="text-white font-black">${combinedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Taxes & Fees</span>
                    <span className="text-teal-400 font-black">Included</span>
                  </div>
                  <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black text-white tracking-tighter">${combinedPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    className="w-full py-5 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[24px] shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Book Full Trip
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    onClick={handleBooking}
                    className="w-full py-4 px-8 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-gray-300 font-bold uppercase tracking-widest text-[11px] rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Verify Price on Google Flights
                  </button>
                <div className="px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                  <p className="text-[10px] text-gray-500 font-bold text-center leading-relaxed">
                    Redirecting to Google Flights. Multiple bookings may be required for complex itineraries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
