import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — FindaFlight',
  description: 'Learn how FindaFlight helps you discover the best flights using smart scoring and clear recommendations.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="gradient-text">FindaFlight</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A smarter way to discover your next flight.
          </p>
        </div>

        {/* What is FindaFlight */}
        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            What is FindaFlight?
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              FindaFlight is an intelligent flight discovery platform that helps you find the <span className="text-white font-medium">best</span> flight — not just the cheapest.
            </p>
            <p>
              Most flight search tools sort by price alone. But the cheapest flight isn&apos;t always
              the best option. A $50 savings might come with a 6-hour layover or an extra stop.
              FindaFlight scores every option across multiple factors — price, duration, and number
              of stops — and gives you a clear recommendation so you can decide with confidence.
            </p>
            <p>
              FindaFlight is a <span className="text-white font-medium">research and decision-support tool</span>.
              It does not book flights. Once you find the right option, you book through your
              preferred airline or travel site.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-indigo-400">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Enter your trip details</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Provide your departure and destination cities (3-letter airport codes), your travel
                  date, and optionally a return date.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-cyan-400">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Review scored and ranked results</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every available flight is scored on a 0-100 scale based on price (40% weight),
                  duration (35%), and number of stops (25%). Flights are labeled as &quot;Best Overall&quot;,
                  &quot;Cheapest&quot;, or &quot;Fastest&quot; to help you compare at a glance.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-teal-400">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Make an informed decision</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our top recommendation includes a plain-language explanation of why it&apos;s the best
                  option. Sort by any criteria, compare alternatives, and book with confidence through
                  your preferred airline or travel site.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="glass-strong rounded-2xl p-6 md:p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Does FindaFlight book flights?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No. FindaFlight is a research and decision-support tool. It helps you discover and compare
                flights — you book through your preferred airline or travel site like Google Flights,
                Kayak, or Expedia.
              </p>
            </div>
            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-white font-semibold mb-2">Are the prices exact?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Prices shown are estimates based on available data at the time of search. Actual prices
                may vary at the time of booking due to airline pricing changes, seat availability, and
                other factors.
              </p>
            </div>
            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-white font-semibold mb-2">How does the scoring work?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each flight receives a composite score (0-100) based on three weighted factors:
                <span className="text-white"> price (40%)</span>,
                <span className="text-white"> duration (35%)</span>, and
                <span className="text-white"> number of stops (25%)</span>.
                Lower values (cheaper, faster, fewer stops) get higher scores. The flight with the
                highest composite score is our &quot;Best Overall&quot; recommendation.
              </p>
            </div>
            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-white font-semibold mb-2">What airport codes should I use?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Use standard 3-letter IATA airport codes. For example: LAX (Los Angeles), JFK (New York),
                ORD (Chicago), MIA (Miami), DFW (Dallas), ATL (Atlanta), SFO (San Francisco),
                CID (Cedar Rapids).
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/#search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Flights Now
          </a>
        </div>
      </div>
    </div>
  );
}
