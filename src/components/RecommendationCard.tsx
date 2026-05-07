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
      <div className="recommendation-glow rounded-[40px] animate-scale-in mb-12 relative overflow-hidden group">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 -z-10 transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="rounded-[40px] border border-teal-500/20 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-lg shadow-teal-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Top Layover Match</span>
            </div>
            <div className="px-4 py-2 bg-white/[0.04] border border-white/[0.05] rounded-full">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Score: {paired.score}%</span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Layover Discovery</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
                Destination via <span className="text-teal-400">{paired.outbound.ticketedDestination?.id}</span>
              </h3>
              <div className="flex items-center gap-3 text-lg font-bold text-gray-400">
                <span>Direct to</span>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-300 rounded-xl border border-teal-500/20">
                  {paired.returnFlight.flights[0]?.departure_airport.id}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 py-6 px-8 bg-white/[0.03] border border-white/[0.05] rounded-[32px]">
              <div className="text-center">
                <p className="text-2xl font-black text-white tracking-tighter">${paired.outbound.price}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Outbound</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-white tracking-tighter">${paired.returnFlight.price}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Return</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Combined Total</p>
                <p className="text-5xl font-black text-teal-400 tracking-tighter leading-none">${paired.combinedPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-start gap-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[32px] p-6 md:p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.3em] mb-2">Our Analysis</p>
              <p className="text-lg md:text-xl text-gray-200 font-bold leading-tight">
                {reason}
              </p>
            </div>
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
    <div className="recommendation-glow rounded-[40px] animate-scale-in mb-12 relative overflow-hidden group">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 -z-10 transition-transform duration-1000 group-hover:scale-110"></div>
      
      <div className="rounded-[40px] border border-indigo-500/20 p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Our Top Pick</span>
          </div>
          <div className="px-4 py-2 bg-white/[0.04] border border-white/[0.05] rounded-full">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Score: {flight.score}%</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-6 flex-1">
            {flight.airline_logo ? (
              <div className="w-20 h-20 rounded-[24px] bg-white shadow-xl flex items-center justify-center p-3">
                <img src={flight.airline_logo} alt={firstLeg?.airline || 'Airline'} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Airline Carrier</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{firstLeg?.airline || 'Premium Carrier'}</h3>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">
                {legs.map(l => l.flight_number).filter(Boolean).slice(0, 2).join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-center py-6 px-8 bg-white/[0.03] border border-white/[0.05] rounded-[32px]">
            <div className="text-center">
              <p className="text-3xl font-black text-white tracking-tighter">{firstLeg?.departure_airport?.time ? formatTime(firstLeg.departure_airport.time) : '--:--'}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{firstLeg?.departure_airport?.id || '---'}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">{formatDuration(flight.total_duration)}</p>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0a0f1e]"></div>
              </div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-black text-white tracking-tighter">{lastLeg?.arrival_airport?.time ? formatTime(lastLeg.arrival_airport.time) : '--:--'}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{lastLeg?.arrival_airport?.id || '---'}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Fare</p>
            <p className="text-5xl font-black text-white tracking-tighter leading-none">${flight.price?.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-10 flex items-start gap-6 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-[32px] p-6 md:p-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.3em] mb-2">Our Analysis</p>
            <p className="text-lg md:text-xl text-gray-200 font-bold leading-tight">
              {reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
