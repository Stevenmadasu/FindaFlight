"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { getAnalytics, isSupported } from "firebase/analytics";

export default function FirebaseAnalytics() {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
        console.log("[FindAFlight] GA4 tracking active ✓");
      }
    });
  }, []);

  return null; // This component renders nothing — it just initializes analytics
}
