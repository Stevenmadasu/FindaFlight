'use client';

import { useState } from 'react';
import { PairedItinerary } from '@/types/flight';
import FlightCard from './FlightCard';

interface PairedFlightCardProps {
  paired: PairedItinerary;
}

export default function PairedFlightCard({ paired }: PairedFlightCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { outbound, returnFlight, combinedPrice, score } = paired;

  // Skiplagged style savings estimation (just a visual indicator)
  const savingsEstimate = Math.round(combinedPrice * 0.4); 

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open both tickets or a combined search. 
    // For now, we'll open a Google Flights search for the destination.
    const url = `https://www.google.com/flights?hl=en#flt=${outbound.flights[0]?.departure_airport.id}.${returnFlight.flights[0]?.departure_airport.id}.${outbound.flights[0]?.departure_airport.time.split(' ')[0]}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-[#0f172a]/80 backdrop-blur-xl border transition-all duration-500 rounded-3xl overflow-hidden group relative ${
      expanded ? 'border-teal-500/40 ring-1 ring-teal-500/20' : 'border-white/[0.05] hover:border-teal-500/20'
    }`}>
      
      {/* Savings Badge */}
      <div className="absolute top-0 right-12 px-4 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-b-xl z-10 shadow-lg shadow-teal-500/20">
        SAVINGS: ${savingsEstimate}+
      </div>

      {/* Paired Header Summary */}
      <div 
        className="p-6 md:p-8 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-black rounded-lg border border-teal-500/20 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              LAYOVER MATCH
            </span>
            <span className="text-gray-500 text-[10px] font-black border border-white/[0.05] bg-white/[0.03] px-2.5 py-1 rounded-lg uppercase tracking-widest">
              DEAL SCORE: {score}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <h3 className="text-white text-3xl font-black tracking-tighter flex items-center gap-3">
              {outbound.flights[0]?.departure_airport.id}
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 text-teal-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <svg className="w-5 h-5 -mt-2 text-indigo-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              {returnFlight.flights[0]?.departure_airport.id}
            </h3>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="glass px-3 py-1 rounded-full border border-teal-500/20">
              <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest">
                Exit at {returnFlight.flights[0]?.departure_airport.id} Layover
              </p>
            </div>
            <p className="text-xs text-gray-500 font-bold italic">
              Hidden-City efficiency detected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 lg:gap-12">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Trip Price</p>
            <p className="text-5xl font-black text-white leading-none tracking-tighter">${combinedPrice.toLocaleString()}</p>
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500/40"></span>
              <p className="text-[10px] text-teal-500/80 font-black uppercase tracking-widest">Save {Math.round((savingsEstimate / (combinedPrice + savingsEstimate)) * 100)}% vs Standard</p>
            </div>
          </div>
          
          <div className={`h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500 ${
            expanded ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/30' : 'bg-white/[0.04] border border-white/[0.06] text-gray-400 group-hover:border-teal-500/30'
          }`}>
            <svg 
              className={`w-8 h-8 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div 
        className={`grid transition-all duration-700 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100 border-t border-white/[0.06]' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 md:p-10 bg-gradient-to-b from-teal-500/[0.02] to-transparent space-y-10">
            
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
              {/* Left Side: Tickets */}
              <div className="space-y-8">
                {/* Outbound Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center shadow-inner">
                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-teal-500/60 uppercase tracking-widest">Ticket 01</p>
                        <p className="text-sm font-black text-white">Outbound Hidden-City</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-teal-400">${outbound.price}</span>
                  </div>
                  <div className="pointer-events-none opacity-90 scale-[0.98] origin-top">
                    <FlightCard flight={outbound} index={0} />
                  </div>
                  <div className="glass bg-teal-500/[0.03] border border-teal-500/10 rounded-2xl p-4">
                    <p className="text-[11px] text-teal-300/80 font-bold leading-relaxed flex items-start gap-3">
                      <svg className="w-5 h-5 text-teal-500/50 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Your destination is the <strong className="text-white">layover</strong> in {returnFlight.flights[0]?.departure_airport.id}. 
                        This ticket is booked to {outbound.ticketedDestination?.id}, but you will simply exit at the layover.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Return Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shadow-inner">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest">Ticket 02</p>
                        <p className="text-sm font-black text-white">Return Standard Trip</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-indigo-400">${returnFlight.price}</span>
                  </div>
                  <div className="pointer-events-none opacity-90 scale-[0.98] origin-top">
                    <FlightCard flight={returnFlight} index={0} />
                  </div>
                </div>
              </div>

              {/* Right Side: Protocol & Booking */}
              <div className="space-y-6">
                <div className="bg-orange-500/[0.05] border border-orange-500/20 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h4 className="text-orange-400 font-black text-lg uppercase tracking-widest">Hidden-City Protocol</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <span className="text-lg font-black text-orange-500/40">01</span>
                      <p className="text-xs text-orange-200/70 font-bold leading-relaxed">
                        <strong className="text-orange-300 uppercase tracking-widest block mb-1">Carry-On Only</strong>
                        Do not check bags. They will be sent to the final ticketed destination ({outbound.ticketedDestination?.id}) instead of your stop.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-lg font-black text-orange-500/40">02</span>
                      <p className="text-xs text-orange-200/70 font-bold leading-relaxed">
                        <strong className="text-orange-300 uppercase tracking-widest block mb-1">Exit at Layover</strong>
                        Simply exit the airport at {returnFlight.flights[0]?.departure_airport.id}. This is perfectly legal, but airlines prefer you don't.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-lg font-black text-orange-500/40">03</span>
                      <p className="text-xs text-orange-200/70 font-bold leading-relaxed">
                        <strong className="text-orange-300 uppercase tracking-widest block mb-1">Valid Return</strong>
                        Your return ticket is a separate booking and remains 100% valid even if you skip the second leg of your outbound ticket.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    className="w-full py-5 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-3xl shadow-2xl shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Book Both Tickets
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <div className="px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                    <p className="text-[10px] text-gray-500 font-bold text-center leading-relaxed">
                      This itinerary requires two separate bookings. Ensure both are available before finalizing. You will leave FindaFlight for Google Flights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
