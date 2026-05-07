'use client';

import { useState, useCallback } from 'react';
import { ref, set, get, push, remove, onValue, off, type DatabaseReference } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { FlightOption, FlightSearchParams, PairedItinerary } from '@/types/flight';

/**
 * useDatabase — Hook for interacting with Firebase Realtime Database.
 * Handles user-specific data like saved flights and search history.
 */
export function useDatabase() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save a flight to the user's saved flights list.
   */
  const saveFlight = useCallback(async (flight: FlightOption) => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const flightRef = ref(database, `users/${user.uid}/savedFlights/${flight.id}`);
      await set(flightRef, {
        ...flight,
        savedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flight');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Save a paired itinerary (round-trip or layover match).
   */
  const savePairedItinerary = useCallback(async (paired: PairedItinerary) => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const id = `${paired.outbound.id}_${paired.returnFlight.id}`;
      const pairedRef = ref(database, `users/${user.uid}/savedTrips/${id}`);
      await set(pairedRef, {
        ...paired,
        savedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Remove a flight from the user's saved flights list.
   */
  const removeFlight = useCallback(async (flightId: string) => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const flightRef = ref(database, `users/${user.uid}/savedFlights/${flightId}`);
      await remove(flightRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove flight');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Remove a paired itinerary.
   */
  const removePairedItinerary = useCallback(async (pairedId: string) => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const pairedRef = ref(database, `users/${user.uid}/savedTrips/${pairedId}`);
      await remove(pairedRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove trip');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Check if a flight is already saved.
   */
  const isFlightSaved = useCallback(async (flightId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    try {
      const flightRef = ref(database, `users/${user.uid}/savedFlights/${flightId}`);
      const snapshot = await get(flightRef);
      return snapshot.exists();
    } catch (err) {
      return false;
    }
  }, [isAuthenticated, user]);

  /**
   * Check if a paired itinerary is saved.
   */
  const isPairedItinerarySaved = useCallback(async (pairedId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    try {
      const pairedRef = ref(database, `users/${user.uid}/savedTrips/${pairedId}`);
      const snapshot = await get(pairedRef);
      return snapshot.exists();
    } catch (err) {
      return false;
    }
  }, [isAuthenticated, user]);

  /**
   * Log a search to the user's search history.
   */
  const logSearch = useCallback(async (params: FlightSearchParams) => {
    if (!isAuthenticated || !user) return;
    try {
      const historyRef = ref(database, `users/${user.uid}/searchHistory`);
      const newSearchRef = push(historyRef);
      await set(newSearchRef, {
        ...params,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to log search:', err);
    }
  }, [isAuthenticated, user]);

  /**
   * Get the user's saved flights.
   * Returns a list of FlightOption objects.
   */
  const getSavedFlights = useCallback(async (): Promise<FlightOption[]> => {
    if (!isAuthenticated || !user) return [];
    setLoading(true);
    try {
      const flightsRef = ref(database, `users/${user.uid}/savedFlights`);
      const snapshot = await get(flightsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      }
      return [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved flights');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Get the user's saved paired itineraries.
   */
  const getSavedPairedItineraries = useCallback(async (): Promise<PairedItinerary[]> => {
    if (!isAuthenticated || !user) return [];
    setLoading(true);
    try {
      const tripsRef = ref(database, `users/${user.uid}/savedTrips`);
      const snapshot = await get(tripsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      }
      return [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved trips');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Get the user's search history.
   */
  const getSearchHistory = useCallback(async (): Promise<(FlightSearchParams & { timestamp: string })[]> => {
    if (!isAuthenticated || !user) return [];
    setLoading(true);
    try {
      const historyRef = ref(database, `users/${user.uid}/searchHistory`);
      const snapshot = await get(historyRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Firebase push IDs are keys, we want the values sorted by timestamp
        const history = Object.values(data) as (FlightSearchParams & { timestamp: string })[];
        return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      return [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch search history');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  return {
    saveFlight,
    removeFlight,
    isFlightSaved,
    getSavedFlights,
    savePairedItinerary,
    removePairedItinerary,
    isPairedItinerarySaved,
    getSavedPairedItineraries,
    logSearch,
    getSearchHistory,
    loading,
    error,
  };
}
