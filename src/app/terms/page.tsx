import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — FindaFlight',
  description: 'Terms of service for FindaFlight: usage guidelines, disclaimers, and limitations of liability.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-gray-400 text-lg">Last updated: April 2026</p>
        </div>

        <article className="glass-strong rounded-2xl p-6 md:p-8 animate-slide-up space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              By accessing or using FindaFlight (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. FindaFlight reserves the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight is a <strong className="text-white">flight discovery and comparison tool</strong>. It helps users research, compare, and evaluate flight options using intelligent scoring and ranking algorithms. FindaFlight does not sell tickets, process bookings, or handle payments. All booking must be completed through the respective airline or a licensed travel agency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Flight Data Accuracy</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              Flight information displayed on FindaFlight is sourced from third-party APIs and may include simulated (mock) data for demonstration purposes. Prices, schedules, availability, and other flight details are <strong className="text-white">estimates only</strong> and may differ from actual airline offerings at the time of booking. FindaFlight makes no guarantees regarding the accuracy, completeness, or timeliness of flight data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Layover Destination Disclaimer</h2>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                FindaFlight offers a &quot;Layover Destination Search&quot; feature that identifies flights where your intended destination is an intermediate layover. This strategy <strong className="text-orange-300">may violate certain airline terms of service</strong>. By using this feature, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-3 leading-relaxed">
                <li>You are solely responsible for understanding and complying with airline policies.</li>
                <li>Airlines may cancel your return ticket, revoke frequent flyer miles, or take other action.</li>
                <li>You must not check baggage on these itineraries.</li>
                <li>FindaFlight provides this feature for <strong className="text-white">informational purposes only</strong> and assumes no liability.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 leading-relaxed">
              <li>You agree to use FindaFlight only for lawful purposes and in accordance with these Terms.</li>
              <li>You are responsible for verifying all flight information before making any booking decisions.</li>
              <li>You agree not to scrape, crawl, or programmatically access FindaFlight without prior written consent.</li>
              <li>You agree not to attempt to circumvent any security measures implemented by FindaFlight.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              All content, design, code, and branding of FindaFlight are the property of their respective owners. The FindaFlight scoring algorithm, user interface design, and original content are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, express or implied. In no event shall FindaFlight, its creators, or contributors be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with your use of the Service, including but not limited to missed flights, financial losses, or decisions made based on information provided by the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Links and Services</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Your use of third-party services is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Modifications</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              We reserve the right to modify, suspend, or discontinue FindaFlight (or any part of it) at any time without notice. We may also update these Terms of Service periodically. Continued use of the Service after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              For questions about these Terms, please contact us through the information on our{' '}
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
            href="/privacy-policy"
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Privacy Policy
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
