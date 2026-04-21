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

  return (
    <div
      className={`glass rounded-xl transition-all duration-300 group animate-slide-up cursor-pointer ${
        expanded ? 'bg-white/[0.06] ring-1 ring-indigo-500/20' : 'hover:bg-white/[0.06]'
      }`}
      style={{ animationDelay, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
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
              <p className="text-white font-medium text-sm">{firstLeg?.airline || 'Airline'}</p>
              <p className="text-xs text-gray-500">
                {legs.map(leg => leg.flight_number).filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {/* Route & Times */}
          <div className="flex-1 mx-0 md:mx-4">
            <div className="flex items-center justify-between">
              {/* Departure */}
              <div className="text-center min-w-[60px]">
                <p className="text-xl font-bold text-white">
                  {firstLeg?.departure_airport?.time ? formatTime(firstLeg.departure_airport.time) : '--:--'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{firstLeg?.departure_airport?.id || '---'}</p>
              </div>

              {/* Duration & Stops */}
              <div className="flex-1 px-3 md:px-6">
                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-dashed border-gray-600 group-hover:border-gray-500 transition-colors"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#0a0f1e]/80 px-2">
                    <p className="text-xs text-gray-400 whitespace-nowrap font-medium">
                      {formatDuration(flight.total_duration)}
                    </p>
                    <p className="text-xs text-center text-gray-500">
                      {flight.stops === 0 ? (
                        <span className="text-teal-400">Direct</span>
                      ) : (
                        `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[60px]">
                <p className="text-xl font-bold text-white">
                  {lastLeg?.arrival_airport?.time ? formatTime(lastLeg.arrival_airport.time) : '--:--'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{lastLeg?.arrival_airport?.id || '---'}</p>
              </div>
            </div>

            {/* Layover Info (summary) */}
            {!expanded && flight.layovers && flight.layovers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {flight.layovers.map((layover, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-400 border border-white/[0.06]"
                  >
                    {formatDuration(layover.duration)} in {layover.id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price & Badges */}
          <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2">
            <p className="text-2xl font-bold text-white">
              ${flight.price?.toLocaleString() || 'N/A'}
            </p>

            {flight.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {flight.badges.map((badge) => {
                  const config = getBadgeConfig(badge);
                  return (
                    <span
                      key={badge}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${config.className}`}
                    >
                      {config.icon} {config.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Expand indicator */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Detail Section */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 md:px-5 py-5 space-y-5 animate-fade-in">
          {/* Score Breakdown */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Score Breakdown</h4>
            <div className="grid grid-cols-3 gap-3">
              <ScoreBar label="Price" score={flight.priceScore} color="from-teal-500 to-emerald-500" />
              <ScoreBar label="Duration" score={flight.durationScore} color="from-amber-500 to-orange-500" />
              <ScoreBar label="Stops" score={flight.stopsScore} color="from-indigo-500 to-violet-500" />
            </div>
            <p className="mt-2 text-right text-sm font-medium text-gray-400">
              Composite: <span className="text-white font-bold">{flight.score}/100</span>
            </p>
          </div>

          {/* Leg-by-Leg Breakdown */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Flight Details</h4>
            <div className="space-y-3">
              {legs.map((leg, idx) => (
                <div key={idx}>
                  <div className="flex items-start gap-4 bg-white/[0.03] rounded-xl p-4">
                    {/* Leg timeline */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <div className="w-0.5 h-12 bg-gradient-to-b from-indigo-500/60 to-cyan-500/60"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                    </div>

                    {/* Leg info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-white">
                            {formatTime(leg.departure_airport?.time || '')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {leg.departure_airport?.id} — {leg.departure_airport?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDuration(leg.duration)}</p>
                          <p className="text-xs text-gray-500">{leg.airplane || ''}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {formatTime(leg.arrival_airport?.time || '')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {leg.arrival_airport?.id} — {leg.arrival_airport?.name}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {leg.airline} {leg.flight_number}
                        </p>
                        {leg.legroom && (
                          <span className="text-xs text-gray-600">• {leg.legroom}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Layover between legs */}
                  {flight.layovers && idx < flight.layovers.length && (
                    <div className="flex items-center gap-2 py-2 px-6">
                      <div className="flex-1 border-t border-dashed border-amber-500/20"></div>
                      <span className="text-xs text-amber-400/80 font-medium">
                        {formatDuration(flight.layovers[idx].duration)} layover in {flight.layovers[idx].name}
                      </span>
                      <div className="flex-1 border-t border-dashed border-amber-500/20"></div>
                    </div>
                  )}
                </div>
              ))}
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
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-white">{score}</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
