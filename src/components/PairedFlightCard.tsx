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

  return (
    <div className="bg-[#111827]/80 backdrop-blur-md border border-teal-500/10 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-teal-500/40 group relative">
      
      {/* Savings Badge */}
      <div className="absolute top-0 right-12 px-3 py-1 bg-teal-500 text-black text-[10px] font-black uppercase tracking-tighter rounded-b-md z-10 shadow-lg shadow-teal-500/20">
        Estimated Savings: ${savingsEstimate}+
      </div>

      {/* Paired Header Summary */}
      <div 
        className="p-5 md:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-md border border-teal-500/20 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Layover Match
            </span>
            <span className="text-gray-400 text-[10px] font-black border border-gray-700/50 bg-gray-800/30 px-2 py-0.5 rounded-md uppercase tracking-tighter">
              Deal Score: {score}
            </span>
          </div>
          <h3 className="text-white text-xl font-bold flex items-center gap-2">
            {outbound.flights[0]?.departure_airport.id}
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {returnFlight.flights[0]?.departure_airport.id}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            <span className="text-teal-400/80 font-medium italic">Hidden-City Route:</span> Get off at {returnFlight.flights[0]?.departure_airport.id} layover
          </p>
        </div>

        <div className="flex items-center gap-6 lg:gap-10">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Combined Pair</p>
            <p className="text-4xl font-black text-white leading-none">${combinedPrice.toLocaleString()}</p>
            <p className="text-[10px] text-teal-500/60 mt-1 font-bold">vs ~${(combinedPrice + savingsEstimate).toLocaleString()} normal</p>
          </div>
          
          <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06] group-hover:border-teal-500/20 transition-all">
            <svg 
              className={`w-6 h-6 text-gray-400 transition-transform duration-500 ${expanded ? 'rotate-180 text-teal-400' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100 border-t border-white/[0.04]' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 md:p-8 bg-gradient-to-b from-black/20 to-transparent flex flex-col gap-8">
            
            {/* Outbound Section */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-teal-500/30 rounded-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                     <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                     </svg>
                   </div>
                   <span className="text-white font-bold text-sm">Ticket 1: Outbound Hidden-City</span>
                </div>
                <span className="text-teal-400 font-black">${outbound.price}</span>
              </div>
              <div className="pointer-events-none opacity-90 scale-[0.98] origin-left">
                <FlightCard flight={outbound} index={0} />
              </div>
              <div className="mt-3 p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                <p className="text-xs text-teal-300/80 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your target destination is the <span className="font-bold">layover</span> in {returnFlight.flights[0]?.departure_airport.id}. 
                  The ticket continues to {outbound.ticketedDestination?.id}, but you exit at the layover.
                </p>
              </div>
            </div>

            {/* Return Section */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/30 rounded-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                     <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                     </svg>
                   </div>
                   <span className="text-white font-bold text-sm">Ticket 2: Return Standard Trip</span>
                </div>
                <span className="text-indigo-400 font-black">${returnFlight.price}</span>
              </div>
              <div className="pointer-events-none opacity-90 scale-[0.98] origin-left">
                <FlightCard flight={returnFlight} index={0} />
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-orange-500/[0.08] border border-orange-500/30 rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-orange-300 font-bold text-sm mb-1 uppercase tracking-wider">Hidden-City Protocol</h4>
                <p className="text-xs text-orange-200/80 leading-relaxed">
                  1. <strong className="text-orange-300">DO NOT CHECK BAGS:</strong> Your bags will go to the final ticketed destination ({outbound.ticketedDestination?.id}).<br />
                  2. <strong className="text-orange-300">CARRY-ON ONLY:</strong> Ensure your bag fits in the overhead bin or under the seat.<br />
                  3. <strong className="text-orange-300">SKIP THE LEG:</strong> Exit the airport at {returnFlight.flights[0]?.departure_airport.id}. Your return ticket is a separate one-way and remains valid.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
