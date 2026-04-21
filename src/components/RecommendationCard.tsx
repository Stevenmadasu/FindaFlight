'use client';

import { Recommendation, RankedFlight, PairedItinerary } from '@/types/flight';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatTime(timeString: string): string {
  const parts = timeString.split(' ');
  return parts.length > 1 ? parts[1] : timeString;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { item, reason, isPaired } = recommendation;

  if (isPaired) {
    const paired = item as PairedItinerary;
    return (
      <div className="recommendation-glow rounded-2xl animate-scale-in mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.08] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full border border-teal-500/30">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-teal-300">Top Layover Match</span>
            </div>
            <div className="px-2.5 py-1 bg-teal-500/10 rounded-full">
              <span className="text-xs font-medium text-teal-400">Score: {paired.score}/100</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-white font-semibold text-lg mb-1">
                Outbound via {paired.outbound.ticketedDestination?.id}
              </p>
              <p className="text-sm text-gray-400">
                Layover in <span className="text-teal-400 font-bold">{paired.returnFlight.flights[0]?.departure_airport.id}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  ${paired.outbound.price}
                </p>
                <p className="text-xs text-gray-500">Outbound Fare</p>
              </div>
              <div className="text-xl text-gray-500">+</div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  ${paired.returnFlight.price}
                </p>
                <p className="text-xs text-gray-500">Return Fare</p>
              </div>
            </div>

            <div className="text-right lg:text-center">
              <p className="text-sm text-gray-400 mb-1">Combined Total</p>
              <p className="text-3xl font-bold text-teal-400">${paired.combinedPrice?.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 bg-white/[0.04] rounded-xl p-4">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-emerald-400">Why this combination? </span>
              {reason}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard Ranking Card logic
  const flight = item as RankedFlight;
  const legs = flight.flights || [];
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  return (
    <div className="recommendation-glow rounded-2xl animate-scale-in mb-8">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-cyan-500/[0.08] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full border border-indigo-500/30">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-indigo-300">Our Top Pick</span>
          </div>
          <div className="px-2.5 py-1 bg-indigo-500/10 rounded-full">
            <span className="text-xs font-medium text-indigo-400">Score: {flight.score}/100</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            {flight.airline_logo ? (
              <img src={flight.airline_logo} alt={firstLeg?.airline || 'Airline'} className="w-12 h-12 rounded-xl object-contain bg-white/90 p-1.5" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-lg">{firstLeg?.airline || 'Airline'}</p>
              <p className="text-sm text-gray-400">{legs.map(l => l.flight_number).filter(Boolean).join(' → ')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{firstLeg?.departure_airport?.time ? formatTime(firstLeg.departure_airport.time) : '--:--'}</p>
              <p className="text-sm text-gray-400">{firstLeg?.departure_airport?.id || '---'}</p>
            </div>
            <div className="flex-1 px-2">
              <div className="relative flex items-center">
                <div className="flex-1 border-t-2 border-dashed border-indigo-500/40"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#0a0f1e] px-3">
                  <p className="text-xs text-gray-400 whitespace-nowrap font-medium">{formatDuration(flight.total_duration)}</p>
                  <p className="text-xs text-center text-gray-500">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{lastLeg?.arrival_airport?.time ? formatTime(lastLeg.arrival_airport.time) : '--:--'}</p>
              <p className="text-sm text-gray-400">{lastLeg?.arrival_airport?.id || '---'}</p>
            </div>
          </div>

          <div className="text-right lg:text-center">
            <p className="text-3xl font-bold text-white">${flight.price?.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 bg-white/[0.04] rounded-xl p-4">
          <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-cyan-400">Why this flight? </span>
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
}
