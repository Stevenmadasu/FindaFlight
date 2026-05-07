'use client';

import { useState } from 'react';
import { RankedFlight, FlightBadge } from '@/types/flight';

interface FlightCardProps {
  flight: RankedFlight;
  index: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatTime(timeString: string): string {
  const parts = timeString.split(' ');
  if (parts.length > 1) {
    return parts[1];
  }
  return timeString;
}

function getBadgeConfig(badge: FlightBadge): { label: string; icon: string; className: string } {
  switch (badge) {
    case 'best_overall':
      return { label: 'Best Overall', icon: '⭐', className: 'badge-best' };
    case 'cheapest':
      return { label: 'Cheapest', icon: '💰', className: 'badge-cheapest' };
    case 'fastest':
      return { label: 'Fastest', icon: '⚡', className: 'badge-fastest' };
  }
}

export default function FlightCard({ flight, index }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const legs = flight.flights || [];
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  const animationDelay = `${index * 80}ms`;

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would be a dynamic URL. 
    // For now, we'll use a generic Google Flights search URL or the one from metadata if available.
    const url = `https://www.google.com/flights?hl=en#flt=${firstLeg.departure_airport.id}.${lastLeg.arrival_airport.id}.${firstLeg.departure_airport.time.split(' ')[0]}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`glass rounded-xl transition-all duration-300 group animate-slide-up cursor-pointer overflow-hidden ${
        expanded ? 'bg-white/[0.06] ring-1 ring-indigo-500/20' : 'hover:bg-white/[0.06]'
      }`}
      style={{ animationDelay, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
      role="button"
      aria-expanded={expanded}
      aria-label={`Flight from ${firstLeg?.departure_airport?.id} to ${lastLeg?.arrival_airport?.id} for $${flight.price}`}
    >
      {/* Main Row */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 md:w-44">
            {flight.airline_logo ? (
              <img
                src={flight.airline_logo}
                alt={firstLeg?.airline || 'Airline'}
                className="w-10 h-10 rounded-lg object-contain bg-white/90 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-white font-bold text-sm">{firstLeg?.airline || 'Airline'}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                {legs.map(leg => leg.flight_number).filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {/* Route & Times */}
          <div className="flex-1 mx-0 md:mx-4">
            <div className="flex items-center justify-between">
              {/* Departure */}
              <div className="text-center min-w-[70px]">
                <p className="text-xl font-black text-white">
                  {firstLeg?.departure_airport?.time ? formatTime(firstLeg.departure_airport.time) : '--:--'}
                </p>
                <p className="text-xs font-bold text-gray-500 mt-0.5 tracking-widest">{firstLeg?.departure_airport?.id || '---'}</p>
              </div>

              {/* Duration & Stops */}
              <div className="flex-1 px-3 md:px-6">
                <div className="relative flex items-center">
                  <div className="flex-1 border-t-2 border-dashed border-white/[0.08] group-hover:border-indigo-500/30 transition-colors"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-transparent px-2">
                    <div className="glass px-2 py-0.5 rounded-md border border-white/[0.05]">
                      <p className="text-[10px] text-gray-400 whitespace-nowrap font-bold uppercase tracking-tighter">
                        {formatDuration(flight.total_duration)}
                      </p>
                    </div>
                    <p className="text-[10px] text-center font-bold mt-1 tracking-wider uppercase">
                      {flight.stops === 0 ? (
                        <span className="text-teal-400">NON-STOP</span>
                      ) : (
                        <span className="text-gray-500">{flight.stops} STOP{flight.stops > 1 ? 'S' : ''}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[70px]">
                <p className="text-xl font-black text-white">
                  {lastLeg?.arrival_airport?.time ? formatTime(lastLeg.arrival_airport.time) : '--:--'}
                </p>
                <p className="text-xs font-bold text-gray-500 mt-0.5 tracking-widest">{lastLeg?.arrival_airport?.id || '---'}</p>
              </div>
            </div>

            {/* Layover Info (summary) */}
            {!expanded && flight.layovers && flight.layovers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {flight.layovers.map((layover, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500/80 border border-amber-500/20"
                  >
                    {formatDuration(layover.duration)} in {layover.id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price & Badges */}
          <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
            <div className="text-right">
              <p className="text-2xl font-black text-white tracking-tight">
                ${flight.price?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">one-way</p>
            </div>

            {flight.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {flight.badges.map((badge) => {
                  const config = getBadgeConfig(badge);
                  return (
                    <span
                      key={badge}
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${config.className}`}
                    >
                      {config.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Detail Section */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 md:px-5 py-6 space-y-6 animate-fade-in bg-white/[0.02]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Left: Timeline */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Itinerary Schedule</h4>
              <div className="space-y-4">
                {legs.map((leg, idx) => (
                  <div key={idx}>
                    <div className="flex items-start gap-5 group/leg">
                      {/* Leg timeline */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-1">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <div className="w-0.5 h-16 bg-white/[0.08] my-1"></div>
                        <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                      </div>

                      {/* Leg info */}
                      <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 transition-colors group-hover/leg:border-white/[0.1]">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-black text-white">
                              {formatTime(leg.departure_airport?.time || '')}
                            </p>
                            <p className="text-xs font-bold text-gray-400">
                              {leg.departure_airport?.id} <span className="text-gray-600 font-medium ml-1">{leg.departure_airport?.name}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-gray-500 bg-white/[0.05] px-2 py-1 rounded-md uppercase tracking-wider">
                              {formatDuration(leg.duration)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4 py-1">
                          <div className="flex-1 border-t border-white/[0.05]"></div>
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            {leg.airline} • {leg.flight_number}
                          </span>
                          <div className="flex-1 border-t border-white/[0.05]"></div>
                        </div>

                        <div>
                          <p className="text-sm font-black text-white">
                            {formatTime(leg.arrival_airport?.time || '')}
                          </p>
                          <p className="text-xs font-bold text-gray-400">
                            {leg.arrival_airport?.id} <span className="text-gray-600 font-medium ml-1">{leg.arrival_airport?.name}</span>
                          </p>
                        </div>
                        
                        {(leg.legroom || leg.airplane) && (
                          <div className="mt-4 flex gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                            {leg.airplane && <span className="bg-white/[0.04] px-2 py-0.5 rounded">{leg.airplane}</span>}
                            {leg.legroom && <span className="bg-white/[0.04] px-2 py-0.5 rounded">{leg.legroom}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Layover between legs */}
                    {flight.layovers && idx < flight.layovers.length && (
                      <div className="flex items-center gap-4 py-4 ml-[5px]">
                        <div className="w-0.5 h-8 border-l-2 border-dashed border-amber-500/20"></div>
                        <div className="flex-1 glass bg-amber-500/[0.03] border border-amber-500/10 rounded-xl px-4 py-2 flex items-center gap-3">
                          <svg className="w-4 h-4 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest">
                            {formatDuration(flight.layovers[idx].duration)} LAYOVER IN {flight.layovers[idx].name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions & Scoring */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Deal Quality</h4>
                <div className="glass border border-white/[0.05] rounded-2xl p-5 space-y-4">
                  <ScoreBar label="Price Value" score={flight.priceScore} color="from-teal-500 to-emerald-500" />
                  <ScoreBar label="Time Efficiency" score={flight.durationScore} color="from-amber-500 to-orange-500" />
                  <ScoreBar label="Travel Comfort" score={flight.stopsScore} color="from-indigo-500 to-violet-500" />
                  <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">FindaFlight Score</span>
                    <span className="text-xl font-black text-white">{flight.score}<span className="text-xs text-gray-500 font-bold">/100</span></span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Book on Google Flights
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                <div className="px-2 py-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                  <p className="text-[9px] text-gray-500 font-medium text-center leading-relaxed">
                    By clicking book, you will leave FindaFlight and be redirected to Google Flights to complete your booking. Prices may fluctuate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Score bar visualization */
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
        <span className="text-[10px] font-black text-white">{score}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
