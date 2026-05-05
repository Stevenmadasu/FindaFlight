# ✈️ FindAFlight

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Azure-0089D6?style=for-the-badge&logo=microsoft-azure)](https://findaflight.site)

An intelligent flight discovery platform that helps you find the **best** flight — not just the cheapest. FindAFlight scores every flight option using a weighted algorithm (price, duration, stops) and gives you clear recommendations with explanations, so you can make a confident travel decision.

---

## 🌟 Sprint 2 Highlights

### 🔍 Three Intelligent Search Modes
- **Standard Search** — Smart scoring for one-way and round-trip flights. Outbound and return flights are automatically paired to maximize value.
- **Layover Destination Search** — Our signature "Hidden-City" engine. It finds flights where your destination is actually a layover, saving you up to 40% on airfare.
- **Take Me Anywhere** — Pure discovery mode. Enter your origin and dates, and we'll show you the best deals across the globe with personalized rankings.

### 📋 Rubric Compliance (Sprint 2)
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

### Running Locally
Start the development server:
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

## ⚙️ Configuration

Create a `.env.local` file in the root directory to manage your keys:

```env
# SerpApi (optional — app uses realistic mock data if missing)
SERPAPI_KEY=your_serpapi_key_here

# Force Mock Data (useful for testing)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Firebase Analytics
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS + Tailwind 4 Utility |
| **Analytics** | Firebase / GA4 |
| **Hosting** | Azure Static Web Apps |
| **CI/CD** | GitHub Actions |

### Folder Structure
- `src/app/` — App Router pages and global styles.
- `src/components/` — Modular, reusable UI components (Glassmorphism design).
- `src/lib/` — Business logic: Smart Ranking, Mock Data, and API clients.
- `src/types/` — Shared TypeScript interfaces for data safety.

---

## 📈 Smart Ranking Algorithm
Every flight is scored from **0-100** using a balanced weight system:
- **40% Price**: Lower fares get higher scores.
- **35% Duration**: Efficiency matters.
- **25% Stops**: Minimizing friction for the traveler.

---

## 🌐 Deployment
This project is automatically deployed to **Azure Static Web Apps** on every push to the `main` branch.

**Live Site:** [findaflight.site](https://findaflight.site)

---
© 2025 FindAFlight Team. Built for BAIS 3300.
