import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — FindaFlight',
  description: 'Learn how FindaFlight helps you discover the best flights using smart scoring and clear recommendations.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="gradient-text">FindaFlight</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A smarter way to discover your next flight.
          </p>
        </div>

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

        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            Three Search Modes
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-indigo-400">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Standard Search</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Search for flights conventionally. We analyze price, duration, and layovers to recommend the true best options. With a return date, we also pair outbound and return flights into complete round-trip options with combined pricing.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-teal-400">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Layover Destination</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Find flights where your intended destination is an intermediate layover on a longer itinerary. Paired with a return one-way flight to create a complete trip.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-violet-500/20 border border-violet-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-violet-400">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Take Me Anywhere</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Don&apos;t have a destination in mind? Let FindaFlight discover the best options from your airport. We show destination cards ranked by value, speed, and weekend convenience with personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            Layover Destination Details
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              FindaFlight supports an advanced discovery mode known as <strong>Layover Destination Search</strong>. 
            </p>
            <p>
              When you enable this mode, we look for flights where your intended destination is actually just an intermediate layover on a longer itinerary. Because airlines price tickets based on market demand rather than distance, these routes can sometimes be dramatically cheaper or open up direct flight availability.
            </p>
            <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.06] mt-4">
               <h3 className="text-teal-400 font-semibold mb-2">How One-Way Pairing Works</h3>
               <p className="text-sm text-gray-400">
                 Since layover strategies only work for one-way outbound flights (if you skip the final leg, the airline cancels your return), FindaFlight automatically pairs a generated outbound layover match with a standard one-way return flight from your destination. 
                 <br/><br/>
                 When you book, you simply purchase two independent one-way tickets:
               </p>
               <ul className="list-disc ml-6 mt-2 text-sm text-gray-400 space-y-1 mt-2">
                 <li><strong>Ticket 1 (Outbound):</strong> A flight from your Origin to some distant City, with a layover in your True Destination.</li>
                 <li><strong>Ticket 2 (Return):</strong> A standard flight from your True Destination back to your Origin.</li>
               </ul>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mt-4">
              <h3 className="text-orange-400 font-semibold mb-1">Important Disclaimers</h3>
              <p className="text-sm text-orange-200/80">
                You must leave the airport during your layover and never check baggage on the outbound flight (otherwise your bags will fly to the ticketed final destination). Users must review airline policies around layover strategies themselves. FindaFlight is purely for discovery and comparison.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
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
              <h3 className="text-white font-semibold mb-2">What airport codes should I use?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Use standard 3-letter IATA airport codes. For example: LAX (Los Angeles), JFK (New York),
                ORD (Chicago), MIA (Miami), DFW (Dallas), ATL (Atlanta), SFO (San Francisco),
                CID (Cedar Rapids).
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio / Developer Section */}
        <section className="glass-strong rounded-2xl p-6 md:p-8 mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            About the Developer
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-3xl font-bold text-white">SM</span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Steven Madasu</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Business Analytics &amp; Information Systems student with a passion for building data-driven products. 
                FindaFlight was created as part of BAIS 3300 to explore full-stack development, API integration, 
                and intelligent recommendation systems. The goal: make travel decisions smarter, not just cheaper.
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="/Steven_Madasu_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </a>
                <a
                  href="https://linkedin.com/in/stevenmadasu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Stevenmadasu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.1] hover:border-indigo-500/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mt-12">
          <Link
            href="/#search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Flights Now
          </Link>
        </div>
      </div>
    </div>
  );
}
