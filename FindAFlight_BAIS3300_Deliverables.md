# FindAFlight — BAIS 3300 Deliverables

---

# DELIVERABLE 1: SITEMAP

---

## 1.1 Hierarchical Text Sitemap

```
FindAFlight
│
├── Home / Search
│   ├── Search Form (Origin, Destination, Date, Passengers, Budget)
│   └── Quick Tips / How It Works
│
├── Results
│   ├── Route List (Direct + Layover Options)
│   ├── Sort & Filter Controls
│   ├── No Results State
│   └── Route Details (expanded view per route)
│       ├── Leg-by-Leg Breakdown
│       ├── Cost Breakdown
│       ├── Time & Layover Summary
│       └── Comparison View
│
├── About
│   ├── What is FindAFlight
│   ├── How It Works
│   └── Frequently Asked Questions
│
└── Global Elements (persistent)
    ├── Header / Navigation Bar
    └── Footer (Legal, Contact, About link)
```

## 1.2 Diagram-Ready Structured Blocks

```
┌─────────────────────────────────────────────────────────┐
│                    FINDAFLIGHT                          │
│              (Global Navigation Bar)                    │
│     [Home/Search]     [About]                           │
└────────┬──────────────────────┬─────────────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  HOME / SEARCH  │    │     ABOUT       │
│                 │    │                 │
│ - Search Form   │    │ - What is FAF   │
│ - How It Works  │    │ - How It Works  │
│                 │    │ - FAQ           │
└────────┬────────┘    └─────────────────┘
         │
         │ (user submits search)
         ▼
┌─────────────────────────────────┐
│           RESULTS               │
│                                 │
│ - Route List                    │
│ - Sort / Filter Controls        │
│ - No Results State (conditional)│
│                                 │
└────────┬────────────────────────┘
         │
         │ (user selects a route)
         ▼
┌─────────────────────────────────┐
│       ROUTE DETAILS             │
│                                 │
│ - Leg-by-Leg Breakdown          │
│ - Cost Breakdown                │
│ - Time & Layover Summary        │
│ - Comparison View               │
└─────────────────────────────────┘
```

## 1.3 Navigation Decisions & Usability Rationale

**Top-level navigation items: Home/Search, About (2 items)**

This structure intentionally minimizes the navigation to only two persistent top-level items. The rationale follows established usability principles:

1. **Minimal cognitive load.** The product has a single primary task: search for flight routes. Exposing only the search entry point and an informational page prevents decision paralysis and keeps the user focused on the core action.

2. **Task-driven flow, not site-driven navigation.** Results and Route Details are not top-level navigation items because users reach them only as a consequence of performing a search. Listing them in the nav bar would create dead-end or empty states if clicked without context. This follows the principle of progressive disclosure—show information only when it becomes relevant.

3. **No orphan pages.** Every screen is reachable through a logical user action (search → results → details) or through persistent navigation (About). There are no pages that require explanation or orientation to find.

4. **Three to five item guideline.** With only two primary nav items, the navigation bar remains scannable at a glance, supporting rapid orientation and reducing the risk of users overlooking the primary action.

5. **Global elements (Header/Footer) provide orientation.** The footer provides secondary access to legal and contact information without cluttering the main navigation. The header anchors the user's position within the app at all times.

---

# DELIVERABLE 2: STORYBOARD

---

### Scene 1 — Landing on the Home Page

| Element | Description |
|---|---|
| **User goal** | Determine if a trip is financially or logistically feasible |
| **Screen** | Home / Search |
| **What user sees** | A clean interface with the FindAFlight logo, a brief tagline ("Find smarter routes for your next trip"), and a prominent search form: Origin, Destination, Date, Passengers, Budget. Below the form, a short "How It Works" section with three steps. |
| **User thought** | "I need to fly from Cedar Rapids to Miami and I don't know if I can afford it. Let me see what options exist." |
| **System response** | Page loads immediately. Search form fields are empty and ready for input. Placeholder text guides the user on expected input format. |

---

### Scene 2 — Filling Out the Search Form

| Element | Description |
|---|---|
| **User goal** | Enter trip parameters to explore options |
| **Screen** | Home / Search (in use) |
| **What user sees** | The user types "Cedar Rapids" into Origin, "Miami" into Destination, picks a date, sets passengers to 1, and optionally enters a budget ceiling of $350. |
| **User thought** | "Okay, I've put in my info. Let's see what comes back." |
| **System response** | Input fields validate in real time (e.g., recognizing airport codes/cities). The primary "Search Routes" button becomes active once required fields are completed. |

---

### Scene 3 — Loading State

| Element | Description |
|---|---|
| **User goal** | Wait for results |
| **Screen** | Results (loading) |
| **What user sees** | A loading indicator (spinner or progress bar) with the message: "Searching for routes from Cedar Rapids to Miami…" |
| **User thought** | "It's working. Hopefully there are some affordable options." |
| **System response** | The system queries available routes, including layover-based alternatives. The loading state persists until data is ready. |

---

### Scene 4a — Results: Success State

| Element | Description |
|---|---|
| **User goal** | Review available routes and compare options |
| **Screen** | Results |
| **What user sees** | A list of 4–8 route options displayed as cards. Each card shows: route summary (e.g., CID → ORD → MIA), total estimated cost, total travel time, number of layovers, and a "View Details" link. Sort controls at the top allow sorting by price, duration, or number of stops. A filter panel allows narrowing by max layovers or max budget. A summary banner at the top reads: "6 routes found from Cedar Rapids to Miami." |
| **User thought** | "There's a $210 option with one layover in Chicago. That's way less than the $480 direct. Let me look at the details." |
| **System response** | Routes are presented in order of estimated cost (lowest first, by default). Each card is tappable/clickable to expand into route details. |

---

### Scene 4b — Results: No Results State

| Element | Description |
|---|---|
| **User goal** | Understand why no options were found and decide what to do next |
| **Screen** | Results (empty) |
| **What user sees** | A centered message: "No routes found for your search." Below it, three actionable suggestions: (1) "Try adjusting your dates," (2) "Try a higher budget," (3) "Try a nearby departure city." A "Modify Search" button returns the user to the search form with their previous inputs preserved. |
| **User thought** | "No results—maybe my budget was too tight. Let me try again with a higher ceiling." |
| **System response** | The "Modify Search" button navigates back to the Home/Search page. All previously entered values remain populated so the user does not need to re-enter everything. |

---

### Scene 5 — Route Details

| Element | Description |
|---|---|
| **User goal** | Understand the full logistics of a specific route to make a go/no-go decision |
| **Screen** | Route Details |
| **What user sees** | A detailed breakdown of the selected route: **Leg-by-leg view** — Flight 1: CID → ORD (1h 15m, est. $85), Flight 2: ORD → MIA (3h 10m, est. $125). **Cost breakdown** — Total estimated cost: $210. **Time summary** — Total travel time: 6h 45m (including 2h 20m layover at ORD). **Layover info** — "2h 20m layover at Chicago O'Hare (ORD). Minimum connection time: 1h 30m. Sufficient." A "Back to Results" link at the top returns to the full list. |
| **User thought** | "Six hours and forty-five minutes total, $210. The layover is long enough that I won't miss the connection. This is feasible—I can plan around this." |
| **System response** | All data is presented in a structured, scannable layout. No booking action is offered. The purpose is to give the user enough information to make an external decision. |

---

### Scene 6 — Returning to Results / New Search

| Element | Description |
|---|---|
| **User goal** | Compare another route or start a new search |
| **Screen** | Results or Home / Search |
| **What user sees** | From Route Details, the user clicks "Back to Results" and returns to the full route list with their scroll position preserved. Alternatively, the user clicks "Home" in the navigation to start a new search. |
| **User thought** | "Let me check one more option before I decide." OR "I've seen enough—this trip is doable." |
| **System response** | Navigation state is preserved when returning to results. Starting a new search clears previous inputs. |

---

### Scene 7 — About Page

| Element | Description |
|---|---|
| **User goal** | Understand what FindAFlight is and how it works |
| **Screen** | About |
| **What user sees** | Three sections: **What is FindAFlight** — A short paragraph explaining the product as a decision-support tool for exploring alternative flight routes. **How It Works** — A numbered list: (1) Enter your trip details, (2) Review alternative routes including layovers, (3) Make an informed decision. **FAQ** — Answers to common questions: "Does FindAFlight book flights?" → "No. FindAFlight is a research and decision-support tool. It helps you discover routes—you book through your preferred airline or travel site." |
| **User thought** | "Got it—this is just for exploring options, not for booking. That's fine, I just needed to know if the trip was feasible." |
| **System response** | Static content page. No interactive elements beyond navigation. |

---

# DELIVERABLE 3: WIREFRAMES

---

## Page 1: Home / Search

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT                                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Find Smarter Routes                     │    │
│  │     Explore alternative flight paths to make         │    │
│  │     an informed travel decision.                     │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────── SEARCH FORM ──────────────────────┐    │
│  │                                                      │    │
│  │  Origin          │  Destination                      │    │
│  │  [____________]  │  [____________]                   │    │
│  │                                                      │    │
│  │  Travel Date     │  Passengers    │  Max Budget      │    │
│  │  [____________]  │  [__]          │  [____________]  │    │
│  │                                    (optional)        │    │
│  │                                                      │    │
│  │         ┌──────────────────────┐                     │    │
│  │         │   SEARCH ROUTES      │                     │    │
│  │         └──────────────────────┘                     │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────── HOW IT WORKS ────────────────────────┐    │
│  │                                                      │    │
│  │  [1]  Enter your    [2]  Review       [3]  Make an   │    │
│  │       trip details       routes            informed  │    │
│  │                          & layovers        decision  │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

### Home / Search — States

**Empty State (initial load):**
All form fields are empty. Placeholder text is visible inside each field (e.g., "City or airport code"). The Search Routes button is disabled/grayed out until required fields are completed.

**Error State (validation):**
```
┌─────────────────── SEARCH FORM ──────────────────────┐
│                                                      │
│  Origin                │  Destination                │
│  [____________]        │  [____________]             │
│  ⚠ Origin is required  │  ⚠ Destination is required │
│                                                      │
│  Travel Date           │  Passengers                 │
│  [____________]        │  [__]                       │
│  ⚠ Please select       │                            │
│    a travel date       │                            │
│                                                      │
│         ┌──────────────────────┐                     │
│         │   SEARCH ROUTES      │  (disabled)         │
│         └──────────────────────┘                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Page 2: Results — Loading State

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT                                                │
│                                                              │
│                                                              │
│                                                              │
│              ┌─────────────────────┐                         │
│              │    ◌  Loading...    │                         │
│              │                     │                         │
│              │  Searching for      │                         │
│              │  routes from        │                         │
│              │  Cedar Rapids       │                         │
│              │  to Miami...        │                         │
│              └─────────────────────┘                         │
│                                                              │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

---

## Page 3: Results — Success State

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT                                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  6 routes found: Cedar Rapids → Miami   [Modify]     │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Sort by: [Price ▼]  [Duration]  [Stops]                     │
│  Filter:  Max stops [Any ▼]  |  Max budget [$____]           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ROUTE CARD                                          │    │
│  │  CID → ORD → MIA           1 stop                   │    │
│  │  Est. $210                  6h 45m total              │    │
│  │  2h 20m layover at ORD                               │    │
│  │                          [View Details →]            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ROUTE CARD                                          │    │
│  │  CID → ATL → MIA           1 stop                   │    │
│  │  Est. $245                  7h 30m total              │    │
│  │  3h 00m layover at ATL                               │    │
│  │                          [View Details →]            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ROUTE CARD                                          │    │
│  │  CID → DFW → MIA           1 stop                   │    │
│  │  Est. $275                  8h 15m total              │    │
│  │  2h 45m layover at DFW                               │    │
│  │                          [View Details →]            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ... (additional route cards)                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

---

## Page 4: Results — No Results State

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT                                                │
│                                                              │
│                                                              │
│         ┌──────────────────────────────────────┐             │
│         │                                      │             │
│         │    No routes found for your search.  │             │
│         │                                      │             │
│         │    Suggestions:                      │             │
│         │    • Try adjusting your dates        │             │
│         │    • Try a higher budget             │             │
│         │    • Try a nearby departure city     │             │
│         │                                      │             │
│         │    ┌────────────────────┐             │             │
│         │    │   MODIFY SEARCH    │             │             │
│         │    └────────────────────┘             │             │
│         │                                      │             │
│         └──────────────────────────────────────┘             │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

---

## Page 5: Route Details

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Back to Results                                           │
│                                                              │
│  ROUTE DETAILS: Cedar Rapids → Miami (via Chicago)           │
│                                                              │
│  ┌──────────────── LEG-BY-LEG BREAKDOWN ────────────────┐    │
│  │                                                      │    │
│  │  LEG 1                                               │    │
│  │  CID → ORD (Cedar Rapids to Chicago O'Hare)          │    │
│  │  Duration: 1h 15m                                    │    │
│  │  Estimated cost: $85                                 │    │
│  │                                                      │    │
│  │  ── LAYOVER at ORD ──                                │    │
│  │  Duration: 2h 20m                                    │    │
│  │  Min. connection time: 1h 30m                        │    │
│  │  Status: ✓ Sufficient                                │    │
│  │                                                      │    │
│  │  LEG 2                                               │    │
│  │  ORD → MIA (Chicago O'Hare to Miami)                 │    │
│  │  Duration: 3h 10m                                    │    │
│  │  Estimated cost: $125                                │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────── COST BREAKDOWN ──────────────────────┐    │
│  │                                                      │    │
│  │  Leg 1 (CID → ORD):          $85                     │    │
│  │  Leg 2 (ORD → MIA):          $125                    │    │
│  │  ─────────────────────────────────                   │    │
│  │  Total estimated cost:        $210                   │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────── TIME SUMMARY ────────────────────────┐    │
│  │                                                      │    │
│  │  Total travel time:           6h 45m                 │    │
│  │  Time in air:                 4h 25m                 │    │
│  │  Layover time:                2h 20m                 │    │
│  │  Number of stops:             1                      │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  This route saves approximately $270 compared to    │    │
│  │  a direct CID → MIA flight ($480 estimated).        │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ← Back to Results                                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

### Route Details — Error State

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Back to Results                                           │
│                                                              │
│         ┌──────────────────────────────────────┐             │
│         │                                      │             │
│         │  Unable to load route details.       │             │
│         │  Please try again.                   │             │
│         │                                      │             │
│         │  ┌──────────────┐  ┌──────────────┐  │             │
│         │  │    RETRY     │  │  GO BACK     │  │             │
│         │  └──────────────┘  └──────────────┘  │             │
│         │                                      │             │
│         └──────────────────────────────────────┘             │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

---

## Page 6: About

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [FindAFlight Logo]                    [Home]  [About]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT                                                │
│                                                              │
│  ┌──────────────── WHAT IS FINDAFLIGHT ─────────────────┐    │
│  │                                                      │    │
│  │  FindAFlight is a decision-support tool that helps   │    │
│  │  budget- or time-constrained travelers discover      │    │
│  │  alternative flight routes, including layover-based  │    │
│  │  options. It does not book flights.                  │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────── HOW IT WORKS ────────────────────────┐    │
│  │                                                      │    │
│  │  1. Enter your trip details (origin, destination,    │    │
│  │     date, passengers, and optional budget).          │    │
│  │                                                      │    │
│  │  2. Review alternative routes, including options     │    │
│  │     with layovers that may reduce cost.              │    │
│  │                                                      │    │
│  │  3. Make an informed decision about whether          │    │
│  │     and how to travel.                               │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────── FAQ ─────────────────────────────────┐    │
│  │                                                      │    │
│  │  Q: Does FindAFlight book flights?                   │    │
│  │  A: No. FindAFlight is a research and decision-      │    │
│  │     support tool. It helps you discover routes.      │    │
│  │     You book through your preferred airline or       │    │
│  │     travel site.                                     │    │
│  │                                                      │    │
│  │  Q: Are the prices exact?                            │    │
│  │  A: Prices shown are estimates based on available    │    │
│  │     data. Actual prices may vary at time of booking. │    │
│  │                                                      │    │
│  │  Q: What is a layover-based route?                   │    │
│  │  A: A route that connects through an intermediate    │    │
│  │     airport. These routes can sometimes be           │    │
│  │     significantly cheaper than direct flights.       │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © FindAFlight  |  About  |  Contact  |  Legal               │
└──────────────────────────────────────────────────────────────┘
```

---

# FINAL OUTPUT REQUIREMENTS

---

## 1. Instruction Checklist for Recreation

### Sitemap in draw.io

1. Open draw.io (app.diagrams.net).
2. Create a new blank diagram.
3. Set the page to landscape orientation (File → Page Setup).
4. Use **rectangle shapes** for each page node. Apply a consistent fill color for top-level pages and a lighter shade for sub-pages.
5. Place "FindAFlight" as the root node at the top center.
6. Below the root, place two top-level page nodes side by side: **Home / Search** and **About**.
7. Below **Home / Search**, draw a child node for **Results**.
8. Below **Results**, draw a child node for **Route Details**.
9. Below **About**, draw child nodes for **What is FindAFlight**, **How It Works**, and **FAQ**.
10. Add a separate grouped block at the bottom labeled **Global Elements** containing **Header/Nav** and **Footer**.
11. Connect all nodes using straight connectors with arrows pointing downward (parent → child).
12. Label all connectors where user actions trigger navigation (e.g., "submits search" between Home/Search and Results, "selects route" between Results and Route Details).
13. Ensure consistent font size (14pt for page names, 11pt for labels), alignment, and spacing.
14. Save as `hawkid_sitemap.drawio`.

### Storyboard in draw.io

1. Open draw.io. Create a new blank diagram.
2. Set the page to landscape orientation.
3. Create a horizontal sequence of **rounded rectangle** frames, one per scene (7 scenes total).
4. Inside each frame, include:
   - A bold scene title at the top (e.g., "Scene 1: Landing").
   - A simplified screen sketch in the center (use basic shapes: rectangles for content areas, lines for text, a rounded rectangle for the primary button).
   - Below the sketch, add a text block with: **User thought** (in italics) and **System response** (in plain text).
5. Connect each scene to the next with a horizontal arrow.
6. For Scene 4, create a **branch** with two paths: Scene 4a (Success) and Scene 4b (No Results). Use a diamond decision shape labeled "Results found?" before the branch. Rejoin the paths at Scene 5 or Scene 6 as appropriate.
7. Use consistent sizing for each frame (approximately 250×350px each).
8. Save as `hawkid_storyboard.drawio`.

### Wireframes in draw.io or Balsamiq

**Option A: draw.io**

1. Open draw.io. Create a new multi-page diagram (one page per wireframe).
2. Name each page tab after the corresponding screen (e.g., "Home - Search", "Results - Success", "Results - No Results", "Results - Loading", "Route Details", "Route Details - Error", "About").
3. On each page:
   - Draw a full-width rectangle at the top for the **Header** (include placeholder text for logo and nav items).
   - Draw a large rectangle in the center for **Main Content**. Inside it, use smaller rectangles, lines, and text labels to represent form fields, cards, buttons, and content sections as shown in the wireframes above.
   - Draw a full-width rectangle at the bottom for the **Footer**.
4. Use only grayscale fills (white, light gray, dark gray) to keep the wireframes low-fidelity.
5. Use a consistent font (e.g., Arial or Helvetica, 12pt body, 16pt headings).
6. Label each page clearly in the top-left corner with the page name and state (e.g., "Results — No Results State").
7. Save as `hawkid_wireframes.drawio`.

**Option B: Balsamiq**

1. Open Balsamiq. Create a new project.
2. Create one mockup per screen/state.
3. Use the built-in wireframe components: Browser Window, Text Input, Button, Label, Paragraph, Horizontal Rule, Icon (for loading spinner), and Alert Box (for error states).
4. Name each mockup after the corresponding screen.
5. Arrange components to match the layouts defined in the wireframes above.
6. Export as PDF.

---

## 2. File Naming Instructions

All files must follow this naming convention, replacing `hawkid` with your actual HawkID:

| Deliverable | Source File | Export File |
|---|---|---|
| Sitemap | `hawkid_sitemap.drawio` | `hawkid_sitemap.pdf` |
| Storyboard | `hawkid_storyboard.drawio` | `hawkid_storyboard.pdf` |
| Wireframes | `hawkid_wireframes.drawio` | `hawkid_wireframes.pdf` |

---

## 3. Export Settings

When exporting from draw.io:

| Setting | Value |
|---|---|
| Format | PNG |
| Zoom / Size | 300% |
| Border | 25 |
| Background | Transparent |
| Selection | All Pages (if multi-page) |

**Steps to export:**
1. File → Export as → PNG.
2. Set Zoom to 300%.
3. Set Border Width to 25.
4. Check "Transparent Background."
5. Click Export.
6. Repeat for each diagram file.

For PDF exports:
1. File → Export as → PDF.
2. Ensure all pages are included.
3. Save with the correct filename.
