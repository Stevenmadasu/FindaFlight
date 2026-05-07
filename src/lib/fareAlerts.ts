/**
 * FindaFlight — Fare Alerts (localStorage)
 *
 * Client-side fare alert storage. Foundation only — no
 * background checking or notifications. Max 20 alerts.
 */

export interface FareAlert {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  maxPrice: number;
  createdAt: string;
}

const STORAGE_KEY = 'findaflight_fare_alerts';
const MAX_ALERTS = 20;

export function getAlerts(): FareAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAlert(alert: Omit<FareAlert, 'id' | 'createdAt'>): FareAlert {
  const alerts = getAlerts();
  const newAlert: FareAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  // Enforce max limit
  const updated = [newAlert, ...alerts].slice(0, MAX_ALERTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newAlert;
}

export function deleteAlert(id: string): void {
  const alerts = getAlerts().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function clearAlerts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
