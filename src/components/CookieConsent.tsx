'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'faf_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay for a smooth entrance after page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] animate-slide-up"
    >
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="glass-strong rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/40 border border-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-white font-semibold text-sm mb-1">
                FindaFlight uses cookies
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                We use cookies and local storage to remember your preferences and improve your experience.
                By continuing to use FindaFlight, you agree to our{' '}
                <Link
                  href="/cookie-policy"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Accept Button */}
            <button
              id="cookie-accept-btn"
              onClick={handleAccept}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all whitespace-nowrap flex-shrink-0"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
