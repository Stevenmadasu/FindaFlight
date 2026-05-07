# ✈️ FindAFlight

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Azure-0089D6?style=for-the-badge&logo=microsoft-azure)](https://findaflight.site)

An intelligent flight discovery platform powered by **real Google Flights data** via SerpApi. FindAFlight scores every flight option using a weighted algorithm (price, duration, stops) and gives you clear recommendations with explanations, so you can make a confident travel decision.

---

## 🌟 Key Features

### 🔍 Three Intelligent Search Modes
- **Standard Search** — Smart scoring for one-way and round-trip flights. Outbound and return flights are automatically paired to maximize value.
- **Layover Destination Search** — Our signature "Hidden-City" engine. It finds flights where your destination is actually a layover, saving you up to 40% on airfare.
- **Take Me Anywhere** — Pure discovery mode. Enter your origin and dates, and we'll show you the best deals across the globe with personalized rankings.

### ✈️ Real Flight Data
- Live data from **Google Flights** via the SerpApi Google Flights API
- Real-time pricing, airline info, layover details, and carbon emissions
- Price insights showing whether fares are low, typical, or high
- Server-side caching (1 hour) to minimize API usage

### 📋 Portfolio Compliance (BAIS 3300)
- [x] **Cookie Consent** — Persistent glassmorphism popup with localStorage.
- [x] **Policy Framework** — Dedicated routes for Cookie, Privacy, and Terms.
- [x] **Brand Assets** — Custom travel-themed SVG favicon and metadata.
- [x] **Analytics** — Fully integrated Firebase tracking with conversion funnels.
- [x] **SEO & Social** — Open Graph / Twitter meta tags with custom preview.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17 or later
- **npm** or **yarn**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/stevenmadasu/findaflight.git
   cd findaflight
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### API Configuration
Create a `.env.local` file in the root directory:
```env
# SerpApi Google Flights API Key (required for live flight data)
# Get your key at https://serpapi.com
SERPAPI_API_KEY=your_serpapi_key_here
```

> **Security**: The API key is stored only in `.env.local` (gitignored) and used exclusively in server-side API routes. It never reaches the browser.

### Running Locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

### Production Build
```bash
npm run build
npm start
```

---

## 🏗️ Flight API Architecture

```
Browser (React)                     Server (Next.js API Routes)         External
┌─────────────┐    POST /api/       ┌─────────────────────┐            ┌──────────┐
│ SearchForm  │───────────────────→ │ /api/flights/search  │──────────→│ SerpApi  │
│ FlightResults│←──────────────────│ validate → fetch →   │←──────────│ Google   │
│ (scoring)    │   normalized JSON  │ normalize → cache    │  raw JSON │ Flights  │
└─────────────┘                    └─────────────────────┘            └──────────┘
                                          │
                                   ┌──────┴──────┐
                                   │ SERPAPI_KEY  │ (env var, never sent to browser)
                                   └─────────────┘
```

**API Routes:**
| Endpoint | Purpose |
|----------|---------|
| `POST /api/flights/search` | Search flights with full SerpApi params |
| `POST /api/flights/return` | Fetch return flights using `departure_token` |
| `POST /api/flights/booking-options` | Fetch booking options using `booking_token` |

---

## ⚙️ Tech Stack & Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Hybrid Rendering) |
| **Language** | TypeScript |
| **Flight Data** | SerpApi Google Flights API |
| **Styling** | Vanilla CSS + Tailwind 4 Utility |
| **Analytics** | Firebase / GA4 |
| **Hosting** | Azure Static Web Apps (Hybrid) |
| **CI/CD** | GitHub Actions |

### Folder Structure
- `src/app/` — App Router pages, API routes, and global styles.
- `src/app/api/flights/` — Server-side API routes (search, return, booking).
- `src/components/` — Modular, reusable UI components (Glassmorphism design).
- `src/lib/` — Business logic: SerpApi client, validation, normalization, scoring, hidden-city detection, caching.
- `src/types/` — Shared TypeScript interfaces for data safety.

---

## 📈 Smart Ranking Algorithm
Every flight is scored from **0-100** using a balanced weight system:
- **40% Price**: Lower fares get higher scores.
- **35% Duration**: Efficiency matters.
- **25% Stops**: Minimizing friction for the traveler.

---

## 🌐 Deployment
This project is automatically deployed to **Azure Static Web Apps** on every push to the `main` branch. The `SERPAPI_API_KEY` must be added as a GitHub repository secret.

**Live Site:** [findaflight.site](https://findaflight.site)

---
© 2025 FindAFlight Team. Built for BAIS 3300.
