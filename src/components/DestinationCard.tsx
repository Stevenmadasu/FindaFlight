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

  return (
    <div
      className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.06] group animate-slide-up cursor-pointer"
      style={{ animationDelay, animationFillMode: 'backwards' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card Header */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
              {card.destinationCity}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{card.destinationCode}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">from</p>
            <p className="text-2xl font-bold text-white">${card.bestPrice}</p>
            {card.bestRoundTripPrice > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                ${card.bestRoundTripPrice} round-trip
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Airline</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5 truncate">{card.bestAirline}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Duration</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5">{formatDuration(card.bestDuration)}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Stops</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5">
              {card.bestStops === 0 ? 'Direct' : `${card.bestStops} stop${card.bestStops > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Weekend</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5">{card.weekendScore}/100</p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Score</span>
            <span className="text-xs font-bold text-white">{card.score}/100</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${card.score}%` }}
            ></div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-2 bg-violet-500/[0.08] border border-violet-500/15 rounded-lg p-3">
          <svg className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-xs text-violet-300/80 leading-relaxed">{card.recommendationReason}</p>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-3">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded — Flight Options */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-5 md:p-6 bg-black/20 animate-fade-in">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {card.flights.length} Outbound Flight{card.flights.length !== 1 ? 's' : ''} Available
          </h4>
          <div className="space-y-2">
            {card.flights.slice(0, 5).map((flight, idx) => {
              const firstLeg = flight.flights[0];
              const lastLeg = flight.flights[flight.flights.length - 1];
              const depTime = firstLeg?.departure_airport?.time?.split(' ')[1] || '--:--';
              const arrTime = lastLeg?.arrival_airport?.time?.split(' ')[1] || '--:--';

              return (
                <div key={flight.id || idx} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {flight.airline_logo ? (
                      <img src={flight.airline_logo} alt={firstLeg?.airline || 'Airline'} className="w-8 h-8 rounded-md object-contain bg-white/90 p-0.5" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-violet-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{depTime} → {arrTime}</p>
                      <p className="text-xs text-gray-500">
                        {formatDuration(flight.total_duration)} · {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`} · {firstLeg?.airline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">${flight.price}</p>
                    <p className="text-[10px] text-gray-500">Score: {flight.score}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {card.returnFlights.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-5">
                Return Flights (from ${card.returnFlights[0]?.price || '—'})
              </h4>
              <div className="space-y-2">
                {card.returnFlights.slice(0, 3).map((flight, idx) => {
                  const firstLeg = flight.flights[0];
                  const lastLeg = flight.flights[flight.flights.length - 1];
                  const depTime = firstLeg?.departure_airport?.time?.split(' ')[1] || '--:--';
                  const arrTime = lastLeg?.arrival_airport?.time?.split(' ')[1] || '--:--';

                  return (
                    <div key={flight.id || idx} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white/[0.06] flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{depTime} → {arrTime}</p>
                          <p className="text-xs text-gray-500">
                            {formatDuration(flight.total_duration)} · {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-white">${flight.price}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
