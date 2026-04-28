'use client';

import { useState } from 'react';
import { PairedItinerary } from '@/types/flight';
import FlightCard from './FlightCard';

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
  const { outbound, returnFlight, combinedPrice, totalDuration, score, label } = paired;
  const animationDelay = `${index * 80}ms`;

  // Collect airlines used
  const airlines = new Set<string>();
  outbound.flights.forEach(leg => airlines.add(leg.airline));
  returnFlight.flights.forEach(leg => airlines.add(leg.airline));
  const airlineList = [...airlines].join(', ');

  const isbestValue = label === 'Best round-trip value';

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 animate-slide-up cursor-pointer ${
        isbestValue
          ? 'bg-[#111827]/80 backdrop-blur-md border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10'
          : 'glass hover:bg-white/[0.06]'
      }`}
      style={{ animationDelay, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Label + Route */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-widest border ${
                isbestValue
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'bg-white/[0.06] text-gray-400 border-white/[0.06]'
              }`}>
                {label || 'Round-trip option'}
              </span>
              <span className="text-gray-500 text-sm font-medium bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                Score: {score}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-white font-semibold">
                {outbound.flights[0]?.departure_airport?.id} → {outbound.flights[outbound.flights.length - 1]?.arrival_airport?.id}
              </p>
              <span className="text-gray-500">⇄</span>
              <p className="text-white font-semibold">
                {returnFlight.flights[0]?.departure_airport?.id} → {returnFlight.flights[returnFlight.flights.length - 1]?.arrival_airport?.id}
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {airlineList} · Total travel: {formatDuration(totalDuration)}
            </p>
          </div>

          {/* Right: Pricing */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Outbound</p>
              <p className="text-lg font-semibold text-white">${outbound.price}</p>
            </div>
            <div className="text-gray-600">+</div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Return</p>
              <p className="text-lg font-semibold text-white">${returnFlight.price}</p>
            </div>
            <div className="text-center border-l border-white/[0.08] pl-6">
              <p className="text-xs text-gray-500">Combined</p>
              <p className={`text-2xl font-bold ${isbestValue ? 'text-indigo-400' : 'text-white'}`}>
                ${combinedPrice.toLocaleString()}
              </p>
            </div>

            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/[0.04]">
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-5 md:p-6 bg-black/20 animate-fade-in space-y-4">
          {/* Outbound */}
          <div className="border border-indigo-500/20 rounded-xl overflow-hidden">
            <div className="bg-indigo-500/5 px-4 py-2 border-b border-indigo-500/20 flex justify-between items-center">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Outbound Flight</span>
              <span className="text-white font-semibold text-sm">${outbound.price}</span>
            </div>
            <div className="p-2 pointer-events-none">
              <FlightCard flight={outbound} index={0} />
            </div>
          </div>

          {/* Return */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.02] px-4 py-2 border-b border-white/[0.06] flex justify-between items-center">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Return Flight</span>
              <span className="text-white font-semibold text-sm">${returnFlight.price}</span>
            </div>
            <div className="p-2 pointer-events-none">
              <FlightCard flight={returnFlight} index={0} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
