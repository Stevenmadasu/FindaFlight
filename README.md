# FindaFlight

An intelligent flight discovery platform that helps you find the **best** flight — not just the cheapest.

FindaFlight scores every flight option using a weighted algorithm (price, duration, stops) and gives you clear recommendations with explanations, so you can make a confident travel decision.

---

## Sprint 2 Features

### Three Search Modes

- **Standard Search** — Search for flights with smart scoring. When a return date is provided, outbound and return flights are paired into round-trip options with combined pricing and a "Best round-trip value" recommendation.
- **Layover Destination Search** — Find hidden-city flights where your intended destination is the intermediate layover. Paired automatically with a return one-way ticket.
- **Take Me Anywhere** — Discovery mode: enter your origin and dates, and FindaFlight explores multiple destinations to show you the best deals. Each destination card shows price, duration, stops, weekend score, and a personalized recommendation.

### Rubric Compliance (Sprint 2)

- **Cookie Consent Popup** — Appears on first visit, links to Cookie Policy, uses localStorage persistence
- **Policy Pages** — `/cookie-policy`, `/privacy-policy`, `/terms` — all linked from footer
- **Favicon** — Custom travel-themed SVG favicon
- **Social Media Meta Tags** — Open Graph and Twitter card tags with preview image
- **Campaign URL** — Google Analytics UTM parameters displayed in footer
- **Portfolio Section** — Developer bio with Resume, LinkedIn, and GitHub links on the About page

### Smart Ranking

- Every flight scored 0-100 using weighted factors (40% price, 35% duration, 25% stops)
- Clear labels: "Best Overall ⭐", "Cheapest 💰", "Fastest ⚡"
- Round-trip recommendations: "This round-trip is the best balance of price and total travel time"
- Sort & filter by Best, Price, Duration, or Stops

### Polished UI

- Improved empty states with actionable suggestions
- Mobile responsive design
- Smooth animations and glassmorphism effects
- WCAG 2.1 AA accessible with semantic HTML

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# SerpApi (optional — app uses mock data if this is missing)
SERPAPI_KEY=your_serpapi_key_here

# Set to 'true' to always use mock data
NEXT_PUBLIC_USE_MOCK_DATA=true
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SERPAPI_KEY` | No | SerpApi key for real Google Flights data |
| `NEXT_PUBLIC_USE_MOCK_DATA` | No | Set to `true` to use mock data even with API key |

> **Note:** The app works fully without any API keys using realistic mock data.

---

## API & Mock Fallback

FindaFlight uses a layered data strategy:

1. **Live API** — When `SERPAPI_KEY` is set and `NEXT_PUBLIC_USE_MOCK_DATA` is `false`, real Google Flights data is fetched via SerpAPI
2. **Mock Fallback** — If the API fails or no key is provided, deterministic mock data is generated based on route and date
3. **Hybrid Mode** — For layover searches, outbound flights are always mocked (to ensure layover matches exist), while return flights can use live data

All API calls happen **server-side only** — keys are never exposed to the client browser. The UI shows a data source indicator so you always know if you're seeing live or demo data.

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home — Flight search with 3 modes |
| `/about` | About FindaFlight + Developer portfolio |
| `/cookie-policy` | Cookie policy |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms of service |

---

## Project Structure

```
findaflight/
├── src/
│   ├── app/
│   │   ├── api/search/route.ts        # Flight search API (3 modes)
│   │   ├── about/page.tsx             # About page + portfolio
│   │   ├── cookie-policy/page.tsx     # Cookie policy
│   │   ├── privacy-policy/page.tsx    # Privacy policy
│   │   ├── terms/page.tsx             # Terms of service
│   │   ├── globals.css                # Global styles & design tokens
│   │   ├── layout.tsx                 # Root layout (meta, nav, footer, cookies)
│   │   └── page.tsx                   # Landing page with search
│   ├── components/
│   │   ├── AirportInput.tsx           # Airport autocomplete input
│   │   ├── CookieConsent.tsx          # Cookie consent banner
│   │   ├── DestinationCard.tsx        # Take Me Anywhere destination card
│   │   ├── FlightCard.tsx             # Individual flight display
│   │   ├── FlightResults.tsx          # Results list with sort/filter
│   │   ├── Navbar.tsx                 # Navigation bar
│   │   ├── PairedFlightCard.tsx       # Layover paired itinerary card
│   │   ├── RecommendationCard.tsx     # Top recommendation highlight
│   │   ├── RoundTripCard.tsx          # Standard round-trip card
│   │   └── SearchForm.tsx             # Flight search form (3 modes)
│   ├── lib/
│   │   ├── airports.ts               # Airport database & search
│   │   ├── config.ts                  # Environment configuration
│   │   ├── mockData.ts               # Mock data generator (incl. anywhere)
│   │   ├── scoring.ts                # Smart ranking + destination cards
│   │   └── serpapi.ts                # SerpAPI client
│   └── types/
│       └── flight.ts                 # TypeScript type definitions
├── public/
│   ├── favicon.svg                    # Travel-themed favicon
│   └── og-preview.png               # Social media preview image
├── .env.local                         # Environment variables
├── next.config.ts                     # Next.js configuration
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # TypeScript configuration
```

---

## How to Deploy to Azure

### Azure Static Web Apps

1. Push this repo to GitHub
2. In Azure Portal → Create Static Web App
3. Connect your GitHub repository
4. Build settings:
   - **App location:** `/`
   - **API location:** (leave blank, Next.js handles it)
   - **Output location:** `.next`
5. Add environment variables in Azure Portal → Configuration

The app auto-deploys on every push to `main` via GitHub Actions.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Font:** Inter (Google Fonts)
- **API:** SerpAPI (Google Flights) with mock data fallback
