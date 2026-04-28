import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy — FindaFlight',
  description: 'Learn how FindaFlight uses cookies and local storage to improve your browsing experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen hero-pattern">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cookie <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg">Last updated: April 2026</p>
        </div>

        <article className="glass-strong rounded-2xl p-6 md:p-8 animate-slide-up space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">What Are Cookies?</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. FindaFlight uses cookies and similar technologies (such as browser local storage) to provide you with a better experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">How FindaFlight Uses Cookies</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              FindaFlight uses a minimal set of cookies and local storage entries for the following purposes:
            </p>
            <div className="space-y-4">
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Essential — Cookie Consent</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We store your cookie consent preference in your browser&apos;s local storage (<code className="text-indigo-400">faf_cookie_consent</code>) so we don&apos;t repeatedly ask for your consent on every visit.
                </p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Analytics</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We may use analytics services (such as Google Analytics) to understand how visitors interact with FindaFlight. These services may set cookies to collect anonymous usage data, including pages visited, time spent, and general location information.
                </p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm mb-1">Functionality</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Local storage may be used to remember your last search preferences (such as preferred departure airport) to make repeat searches faster.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Managing Your Cookies</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies, and to clear local storage. Please note that disabling cookies may affect the functionality of FindaFlight. For more information on how to manage cookies, visit your browser&apos;s help documentation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Third-Party Cookies</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              FindaFlight may load resources from third-party services (such as Google Fonts and airline logo CDNs). These third parties may set their own cookies according to their respective privacy policies. FindaFlight does not control these third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              If you have questions about our cookie practices, please reach out via the contact information provided on our{' '}
              <Link href="/about" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                About
              </Link>{' '}
              page.
            </p>
          </section>
        </article>

        <div className="text-center mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/privacy-policy"
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Privacy Policy
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
