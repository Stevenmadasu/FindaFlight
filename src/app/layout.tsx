import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mango-bush-0cf642c0f.5.azurestaticapps.net"),
  title: "FindaFlight — Discover the Best Flight for You",
  description:
    "FindaFlight is an intelligent flight discovery platform that helps you find the best flight based on price, duration, and convenience — not just the cheapest.",
  keywords:
    "flights, flight search, best flights, cheap flights, fast flights, flight comparison, travel, smart flight search, hidden city, layover destination, take me anywhere",
  
  // Open Graph
  openGraph: {
    title: "FindaFlight — Discover the Best Flight for You",
    description: "An intelligent flight discovery platform. Search standard routes, uncover layover destinations, or let us surprise you with Take Me Anywhere.",
    url: "https://mango-bush-0cf642c0f.5.azurestaticapps.net",
    siteName: "FindaFlight",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "FindaFlight — Intelligent Flight Discovery",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "FindaFlight — Discover the Best Flight for You",
    description: "An intelligent flight discovery platform. Search standard routes, uncover layover destinations, or let us surprise you.",
    images: ["/og-preview.png"],
  },

  // Additional
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaignUrl = "?utm_source=findaflight&utm_medium=web&utm_campaign=sprint2_launch";

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0f1e] min-h-screen`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-20" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col gap-6">
              {/* Top row: Logo + Policy links */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-400">
                    FindaFlight
                  </span>
                </div>

                <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                  <Link href="/about" className="hover:text-gray-300 transition-colors">
                    About
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <Link href="/cookie-policy" className="hover:text-gray-300 transition-colors">
                    Cookies
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                    Privacy
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <Link href="/terms" className="hover:text-gray-300 transition-colors">
                    Terms
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <span>© {new Date().getFullYear()} FindaFlight</span>
                </nav>
              </div>

              {/* Campaign URL */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Campaign:{' '}
                  <code className="text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded text-[10px]">
                    {campaignUrl}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
