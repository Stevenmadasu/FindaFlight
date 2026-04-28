import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — FindaFlight',
  description: 'FindaFlight privacy policy: learn how we handle your data, what we collect, and your rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg">Last updated: April 2026</p>
        </div>

        <article className="glass-strong rounded-2xl p-6 md:p-8 animate-slide-up space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use the FindaFlight web application. FindaFlight is a flight discovery and comparison tool — it does not book flights or process payments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Information We Collect</h2>
            <div className="space-y-4">
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Search Queries</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  When you search for flights, we transmit your search parameters (origin airport, destination airport, travel dates, and search mode) to our server-side API to fetch results. These queries are processed in real-time and are not permanently stored.
                </p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Local Storage Data</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We store a cookie consent preference in your browser&apos;s local storage. This data never leaves your device and is not transmitted to our servers.
                </p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Analytics Data</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We may use third-party analytics services (e.g., Google Analytics) that collect anonymous, aggregated usage data such as pages visited, referral sources, browser type, and general geographic region. This data does not identify you personally.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Information We Do Not Collect</h2>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 leading-relaxed">
              <li>We do not collect personally identifiable information (PII) such as your name, email address, or phone number.</li>
              <li>We do not require account creation or login.</li>
              <li>We do not process payments or store financial information.</li>
              <li>We do not track individual user behavior across sessions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight uses the SerpAPI service to retrieve flight data from Google Flights. When you perform a search, your search parameters (airport codes and dates) are sent to SerpAPI&apos;s servers to retrieve results. SerpAPI&apos;s use of this data is governed by their own privacy policy. No personal information is shared with SerpAPI — only flight search parameters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Data Security</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              We take reasonable measures to protect the information transmitted through FindaFlight. All API keys and sensitive credentials are stored server-side and are never exposed to the client browser. Communication between your browser and our servers is encrypted via HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight is not directed at children under the age of 13. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              Since FindaFlight does not collect or store personal data, there is no personal data to access, modify, or delete. You can clear your local storage at any time through your browser settings to remove the cookie consent preference.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              We may update this Privacy Policy from time to time. Changes will be reflected on this page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              For privacy-related inquiries, please reach out through the contact information on our{' '}
              <Link href="/about" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                About
              </Link>{' '}
              page.
            </p>
          </section>
        </article>

        <div className="text-center mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/cookie-policy"
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Cookie Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Terms of Service
          </Link>
          <Link
            href="/"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
