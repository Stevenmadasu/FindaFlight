'use client';

import { FlexDateSummary } from '@/types/flight';
import { format, parseISO } from 'date-fns';

interface FlexDateBarProps {
  summary: FlexDateSummary;
  onSelectDate?: (date: string) => void;
}

export default function FlexDateBar({ summary, onSelectDate }: FlexDateBarProps) {
  const { cheapestDate, cheapestPrice, allDates } = summary;

  return (
    <div className="mb-8 glass-strong rounded-2xl overflow-hidden border border-indigo-500/20 animate-fade-in shadow-xl shadow-black/20">
      <div className="bg-indigo-500/10 px-6 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Nearby Date Discoveries
        </h3>
        <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
          Flexible ±3 Days
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {allDates.map((item) => {
            const isCheapest = item.date === cheapestDate;
            const dateObj = parseISO(item.date);
            const isToday = format(new Date(), 'yyyy-MM-dd') === item.date;

            return (
              <button
                key={item.date}
                onClick={() => onSelectDate?.(item.date)}
                className={`flex-shrink-0 min-w-[100px] p-3 rounded-xl border transition-all text-center ${
                  isCheapest
                    ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                }`}
              >
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                  {format(dateObj, 'EEE, MMM d')}
                </p>
                <p className={`text-lg font-bold mt-1 ${isCheapest ? 'text-teal-400' : 'text-white'}`}>
                  ${item.bestPrice}
                </p>
                {isCheapest && (
                  <span className="inline-block mt-1 text-[9px] font-black uppercase bg-teal-500 text-black px-1 rounded-sm leading-none py-0.5">
                    Cheapest
                  </span>
                )}
                {!isCheapest && item.bestPrice > cheapestPrice && (
                  <p className="text-[9px] text-gray-600 mt-1">
                    +${item.bestPrice - cheapestPrice}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            <span>Cheapest nearby date found: <span className="text-white font-bold">{format(parseISO(cheapestDate), 'MMM d')}</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span>Showing best price for each day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
