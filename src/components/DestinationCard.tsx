'use client';

import { useState } from 'react';
import { DestinationCard as DestinationCardType } from '@/types/flight';

interface DestinationCardProps {
  card: DestinationCardType;
  index: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default function DestinationCard({ card, index }: DestinationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const animationDelay = `${index * 100}ms`;

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Redirect to a specific search for this destination
    const url = `https://www.google.com/flights?hl=en#flt=.${card.destinationCode}.${new Date().toISOString().split('T')[0]}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`glass rounded-[32px] overflow-hidden transition-all duration-500 animate-slide-up cursor-pointer border ${
        expanded ? 'border-violet-500/40 bg-white/[0.04] ring-1 ring-violet-500/20' : 'border-white/[0.05] hover:border-violet-500/20 hover:bg-white/[0.02]'
      }`}
      style={{ animationDelay, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
      role="button"
      aria-expanded={expanded}
    >
      {/* Card Header */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-3xl font-black text-white tracking-tighter">
                {card.destinationCity}
              </h3>
              <span className="text-xs font-black text-violet-400/60 bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20 uppercase tracking-widest">
                {card.destinationCode}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Discovery Result</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-4xl font-black text-white tracking-tighter leading-none">${card.bestPrice}</p>
            {card.bestRoundTripPrice > 0 && (
              <p className="text-[10px] font-bold text-teal-400/60 mt-2 uppercase tracking-widest">
                ${card.bestRoundTripPrice} RT Available
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Top Airline</p>
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{card.bestAirline}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Shortest</p>
            <p className="text-xs font-black text-white tracking-tighter">{formatDuration(card.bestDuration)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Stops</p>
            <p className="text-xs font-black text-white uppercase tracking-tighter">
              {card.bestStops === 0 ? 'Direct' : `${card.bestStops} stop${card.bestStops > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Weekend</p>
            <p className="text-xs font-black text-white tracking-tighter">{card.weekendScore}/100</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-4 bg-violet-500/[0.05] border border-violet-500/10 rounded-[24px] p-5">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-1">Expert Reasoning</p>
            <p className="text-xs text-violet-200/80 font-bold leading-relaxed">{card.recommendationReason}</p>
          </div>
        </div>

        {/* Score Bar & Expand */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Discovery Score</span>
              <span className="text-xs font-black text-white">{card.score}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out"
                style={{ width: `${card.score}%` }}
              ></div>
            </div>
          </div>
          
          <div className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all duration-500 ${
            expanded ? 'bg-violet-500 text-black shadow-lg shadow-violet-500/30' : 'bg-white/[0.04] border border-white/[0.06] text-gray-400'
          }`}>
            <svg
              className={`w-6 h-6 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded — Flight Options */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-6 md:p-10 bg-white/[0.02] animate-fade-in space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Left: Options */}
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  Best Available Routes
                </h4>
                <div className="space-y-3">
                  {card.flights.slice(0, 5).map((flight, idx) => {
                    const firstLeg = flight.flights[0];
                    const lastLeg = flight.flights[flight.flights.length - 1];
                    const depTime = firstLeg?.departure_airport?.time?.split(' ')[1] || '--:--';
                    const arrTime = lastLeg?.arrival_airport?.time?.split(' ')[1] || '--:--';

                    return (
                      <div key={flight.id || idx} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.05]">
                        <div className="flex items-center gap-4">
                          {flight.airline_logo ? (
                            <img src={flight.airline_logo} alt={firstLeg?.airline || 'Airline'} className="w-10 h-10 rounded-lg object-contain bg-white/90 p-1" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black text-white tracking-tight">{depTime} → {arrTime}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                              {formatDuration(flight.total_duration)} · {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`} · {firstLeg?.airline}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-white tracking-tight">${flight.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {card.returnFlights.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                    Return Options (from ${card.returnFlights[0]?.price || '—'})
                  </h4>
                  <div className="space-y-3">
                    {card.returnFlights.slice(0, 3).map((flight, idx) => {
                      const firstLeg = flight.flights[0];
                      const lastLeg = flight.flights[flight.flights.length - 1];
                      const depTime = firstLeg?.departure_airport?.time?.split(' ')[1] || '--:--';
                      const arrTime = lastLeg?.arrival_airport?.time?.split(' ')[1] || '--:--';

                      return (
                        <div key={flight.id || idx} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.05]">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-black text-white tracking-tight">{depTime} → {arrTime}</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                {formatDuration(flight.total_duration)} · {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-black text-white tracking-tight">${flight.price}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="space-y-4">
              <button
                onClick={handleExplore}
                className="w-full py-5 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[24px] shadow-2xl shadow-violet-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Explore Destination
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <div className="px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <p className="text-[10px] text-gray-500 font-bold text-center leading-relaxed">
                  Discovery mode provides estimated pricing based on recent data. Final prices confirmed on Google Flights.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
