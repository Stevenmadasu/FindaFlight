'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * UserMenu — Only visible when logged in.
 * Shows a small avatar in the top-right corner with a dropdown.
 * Completely invisible to anonymous users.
 */
export default function UserMenu() {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Invisible to anonymous users
  if (loading || !isAuthenticated || !user) return null;

  const initial = user.displayName?.[0] || user.email?.[0] || '?';
  const photoURL = user.photoURL;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/[0.06] transition-all"
        aria-label="User menu"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt=""
            className="w-8 h-8 rounded-full border border-white/10"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold uppercase">
            {initial}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl border border-white/10 py-2 animate-fade-in z-50">
          <div className="px-4 py-2 border-b border-white/[0.06]">
            <p className="text-sm text-white font-medium truncate">
              {user.displayName || 'FindAFlight User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/saved"
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Saved Trips
          </Link>

          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
