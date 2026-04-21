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

  return (
    <div className="bg-[#111827]/80 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden shadow-lg transition-all hover:border-teal-500/30">
      
      {/* Paired Header Summary */}
      <div 
        className="p-5 md:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-md border border-teal-500/20 uppercase tracking-widest">
              Layover Match
            </span>
            <span className="text-gray-400 text-sm font-medium border border-gray-700/50 bg-gray-800/30 px-2 py-0.5 rounded-md">
              Score: {score}
            </span>
          </div>
          <h3 className="text-white text-lg font-semibold">
            One-Way Pair: {outbound.flights[0]?.departure_airport.id} ⇄ {returnFlight.flights[0]?.departure_airport.id}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Outbound final ticket: <span className="text-gray-300">{outbound.ticketedDestination?.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-6 lg:gap-10">
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">Combined Total</p>
            <p className="text-3xl font-bold text-white">${combinedPrice.toLocaleString()}</p>
          </div>
          
          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white/[0.04]">
            <svg 
              className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100 border-t border-white/[0.04]' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 md:p-6 bg-black/20 flex flex-col gap-6">
            
            {/* Outbound Section */}
            <div className="border border-teal-500/20 rounded-xl overflow-hidden">
              <div className="bg-teal-500/5 px-4 py-2 border-b border-teal-500/20 flex justify-between items-center">
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Outbound Hidden-City</span>
                <span className="text-white font-semibold">${outbound.price}</span>
              </div>
              <div className="p-2 pointer-events-none">
                <FlightCard flight={outbound} index={0} />
              </div>
            </div>

            {/* Return Section */}
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2 border-b border-white/[0.06] flex justify-between items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Return Standard Ticket</span>
                <span className="text-white font-semibold">${returnFlight.price}</span>
              </div>
              <div className="p-2 pointer-events-none">
                <FlightCard flight={returnFlight} index={0} />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3">
              <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-orange-200/80 leading-relaxed">
                You must leave the airport at your layover in {returnFlight.flights[0]?.departure_airport.id} and skip the final leg to {outbound.ticketedDestination?.id}. <strong className="text-orange-300">Do not check any bags on the outbound flight.</strong> This is presented as two separate one-way tickets.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
