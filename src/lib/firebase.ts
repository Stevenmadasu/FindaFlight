"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

// Firebase client config — these are public identifiers, not secrets.
// They are restricted by Firebase Security Rules, not by secrecy.
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBD48Ln3YvxuK6pjfkCem1uNwRGqgp1dj4",
  authDomain: "findaflight-a5bc4.firebaseapp.com",
  projectId: "findaflight-a5bc4",
  storageBucket: "findaflight-a5bc4.firebasestorage.app",
  messagingSenderId: "484431843722",
  appId: "1:484431843722:web:23fac9c034da79f7e5f873",
  measurementId: "G-ES24W9LVQ7",
};

// Initialize Firebase (ensuring it's only initialized once)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth: Auth = getAuth(app);

// Initialize Realtime Database
const database: Database = getDatabase(app);

// Initialize Analytics lazily (client-side only)
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("[FindAFlight] Firebase Analytics initialized ✓");
    }
  });
}

export { app, auth, database, analytics };
