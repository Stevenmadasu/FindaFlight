import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FindaFlight — Discover the Best Flight for You",
  description:
    "FindaFlight is an intelligent flight discovery platform that helps you find the best flight based on price, duration, and convenience — not just the cheapest.",
  keywords:
    "flights, flight search, best flights, cheap flights, fast flights, flight comparison, travel, smart flight search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0f1e] min-h-screen`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10">
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

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="/about" className="hover:text-gray-300 transition-colors">
                  About
                </a>
                <span>•</span>
                <span>© {new Date().getFullYear()} FindaFlight</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
