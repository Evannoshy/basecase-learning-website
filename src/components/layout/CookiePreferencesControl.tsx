'use client';

import React, { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  CookieChoice,
  clearCookieConsent,
  getSavedCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent';
import { cn } from '@/lib/utils';

type StoredStatus = CookieChoice | null;

const statusLabelMap: Record<CookieChoice, string> = {
  accepted: 'Accepted All',
  declined: 'Essential Only',
};

export function CookiePreferencesControl() {
  const [status, setStatus] = useState<StoredStatus>(null);

  useEffect(() => {
    const syncStatus = () => {
      setStatus(getSavedCookieConsent());
    };

    syncStatus();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncStatus);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncStatus);
  }, []);

  const handleSelect = (choice: CookieChoice) => {
    saveCookieConsent(choice);
    setStatus(choice);
  };

  const handleReset = () => {
    clearCookieConsent();
    setStatus(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 border-t-4 border-t-teal-700 bg-slate-50 p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Browser Setting
          </p>
          <p className="mt-1 text-base font-bold text-slate-900" data-testid="cookie-consent-status">
            {status ? statusLabelMap[status] : 'No preference saved yet'}
          </p>
        </div>
        {status && (
          <span
            className={cn(
              'inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded text-xs font-semibold border',
              status === 'accepted'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-200/70 text-slate-800 border-slate-300'
            )}
          >
            Saved locally
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        You can update or clear your cookie consent choice for this browser at any time below.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleSelect('accepted')}
          className="px-4 py-2.5 rounded-md bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
        >
          Accept All Cookies
        </button>
        <button
          type="button"
          onClick={() => handleSelect('declined')}
          className="px-4 py-2.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
        >
          Essential Cookies Only
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-md bg-transparent hover:bg-slate-200/70 text-slate-700 border border-transparent hover:border-slate-300 text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
        >
          Reset Preference
        </button>
      </div>
    </div>
  );
}
