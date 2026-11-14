'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  COOKIE_CONSENT_EVENT,
  CookieChoice,
  getSavedCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      try {
        setVisible(getSavedCookieConsent() === null);
      } catch {
        setVisible(true);
      }
    };

    syncVisibility();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncVisibility);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncVisibility);
  }, []);

  const handleConsent = (choice: CookieChoice) => {
    saveCookieConsent(choice);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-16 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 sm:p-5 text-slate-700"
    >
      <p className="text-sm font-semibold text-slate-900">Cookies on this site</p>
      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
        We use cookies to keep the site working properly and understand basic page traffic. Read our{' '}
        <Link
          href="/cookies"
          className="font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-3.5 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleConsent('accepted')}
          className="px-3.5 py-2 rounded-md bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleConsent('declined')}
          className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
