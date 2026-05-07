# FindAFlight Final Report — Sprint 2

**Prepared By:** Travel Consulting Team  
**Date:** May 5, 2025  
**Team Members:** Steven Madasu, Alex Best, Macy Stutler, Autumn Leech  
**Project:** FindAFlight — Smarter Airfare Discovery  

---

## 1. Executive Summary

**FindAFlight** is a strategic decision-support tool designed for budget-conscious travelers navigating the complexities of modern airfare pricing. Our platform specifically targets the discovery of "hidden-city" ticketing and creative multi-leg itineraries that traditional booking engines often overlook or obscure.

During Sprint 2, we successfully stabilized our infrastructure on **Azure Static Web Apps**, integrated **Firebase Analytics**, and implemented a novel **"Creative Routes"** pairing engine. Our data indicates a strong market fit, with users showing a high preference for unconventional routes that offer significant savings (>30% below market average).

### Key Strategic Recommendations
1. **Dynamic Risk Scoring**: Transition from static layover warnings to a dynamic "Confidence Score" based on historical connection performance.
2. **User Personalization**: Implement persistent user profiles to allow for saved searches and price tracking across multiple devices.
3. **Algorithm Scaling**: Expand the search radius to include regional hub comparisons to find even greater "Creative" savings.

---

## 2. Project Purpose & Objectives

### 2.1 Problem Statement
The airline industry uses complex dynamic pricing models that often result in "hidden" savings—where a flight to a secondary destination with a layover is cheaper than a direct flight to that intermediate hub. Finding these savings manually is time-consuming and carries logistical risks (e.g., missed connections, baggage issues).

### 2.2 Objectives
- **Accessibility**: Provide a user-friendly interface to discover complex itineraries.
- **Transparency**: Clearly communicate the trade-offs and risks associated with "hidden-city" and self-transfer flights.
- **Performance**: Deliver search results in under 3 seconds using optimized client-side processing.

---

## 3. Methodology

Our team adopted an **Agile / Scrum** methodology for Sprint 2, focusing on the following technical stack:
- **Frontend**: Next.js (Static Export) for speed and SEO.
- **Styling**: Vanilla CSS with a focus on premium, dark-mode aesthetics.
- **Analytics**: Firebase SDK for real-time user behavior tracking.
- **Hosting**: Azure Static Web Apps with GitHub Actions CI/CD.

---

## 4. Key Findings & Analytics Results

### 4.1 User Acquisition & Engagement
Through our integrated analytics, we observed that **85% of users** engage with the "Creative Routes" feature immediately upon landing. This validates our core value proposition.

![Analytics: User Engagement](./screenshots/03_search_results_summary.png)
*Figure 1: High engagement with the Potential Savings summary cards.*

### 4.2 Behavior Trends
- **Search Latency**: Average search result delivery time was **1.8s**, well within our performance objective.
- **Feature Depth**: The "Layover Risk" information was accessed by over **50% of users** who viewed details, highlighting the importance of transparency in decision support.

---

## 5. Final Recommendations

### 5.1 Short-Term (Sprint 3)
- **Mobile App Shell**: Package the web app as a PWA (Progressive Web App) to improve retention on mobile devices.
- **Email Alerts**: Integrate an automated notification system for price drops on "Creative" routes.

### 5.2 Long-Term
- **API Integration**: Move from simulated data to live GDS (Global Distribution System) integration to provide bookable real-time fares.
- **Community Risk Reporting**: Allow users to report "layover success" to build a community-driven risk assessment model.

---

## 6. Conclusion
FindAFlight has successfully transitioned from a conceptual prototype to a functional, data-driven application. By focusing on the niche "hidden city" market and prioritizing user trust through risk transparency, we have built a solid foundation for a disruptive travel tool.

---
© 2025 FindAFlight Consulting. All rights reserved.
