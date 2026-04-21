# FindaFlight

An intelligent flight discovery platform that helps you find the **best** flight — not just the cheapest.

FindaFlight scores every flight option using a weighted algorithm (price, duration, stops) and gives you clear recommendations with explanations, so you can make a confident travel decision.

---

## Features

- **Smart Ranking** — Every flight scored 0-100 using weighted factors (40% price, 35% duration, 25% stops)
- **Clear Labels** — "Best Overall ⭐", "Cheapest 💰", "Fastest ⚡" badges on results
- **Top Recommendation** — Highlighted pick with plain-language reasoning
- **Sort & Filter** — Sort by Best, Price, Duration, or Stops
- **Mock Data Fallback** — Works immediately without any API keys
- **Responsive Design** — Clean, modern UI that works on all devices

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

## Project Structure

```
findaflight/
├── src/
│   ├── app/
│   │   ├── api/search/route.ts      # Flight search API (SerpAPI + mock fallback)
│   │   ├── about/page.tsx           # About page
│   │   ├── globals.css              # Global styles & design tokens
│   │   ├── layout.tsx               # Root layout with nav + footer
│   │   └── page.tsx                 # Landing page with search
│   ├── components/
│   │   ├── FlightCard.tsx           # Individual flight display card
│   │   ├── FlightResults.tsx        # Results list with sort/filter
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── RecommendationCard.tsx   # Top recommendation highlight
│   │   └── SearchForm.tsx           # Flight search form
│   ├── lib/
│   │   ├── config.ts               # Environment configuration
│   │   ├── mockData.ts             # Mock flight data generator
│   │   ├── scoring.ts              # Smart ranking algorithm
│   │   └── serpapi.ts              # SerpAPI client
│   └── types/
│       └── flight.ts               # TypeScript type definitions
├── .env.local                       # Environment variables
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # TypeScript configuration
```

---

## How to Deploy to Azure

### Option 1: Azure Static Web Apps

1. Push this repo to GitHub
2. In Azure Portal → Create Static Web App
3. Connect your GitHub repository
4. Build settings:
   - **App location:** `/`
   - **API location:** (leave blank, Next.js handles it)
   - **Output location:** `.next`
5. Add environment variables in Azure Portal → Configuration

### Option 2: Azure App Service

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Create an Azure App Service (Node.js 18+)
3. Deploy using the Azure CLI:
   ```bash
   az webapp up --name findaflight --runtime "NODE:18-lts"
   ```
4. Set environment variables:
   ```bash
   az webapp config appsettings set --name findaflight \
     --settings SERPAPI_KEY=your_key NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Font:** Inter (Google Fonts)
- **API:** SerpAPI (Google Flights) with mock data fallback
