'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import {
  COOKIE_CONSENT_EVENT,
  CookieChoice,
  getSavedCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

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
      className="fixed inset-x-3 bottom-16 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-50 bg-white border border-slate-300 border-t-4 border-t-[#166534] rounded-lg shadow-lg p-4 sm:p-5 text-slate-700"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#166534] flex-shrink-0" aria-hidden="true" />
        <p className="text-sm font-bold text-slate-900">Cookies on this site</p>
      </div>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        We use essential browser storage to keep forms and preferences working properly, and handle any enquiry details under Singapore&apos;s PDPA. Read our{' '}
        <Link
          href="/privacy"
          className="font-semibold text-[#166534] hover:text-[#15803D] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="/cookies"
          className="font-semibold text-[#166534] hover:text-[#15803D] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
        >
          Cookie Policy
        </Link>
        .
      </p>

      <div className="mt-2.5">
        <button
          type="button"
          onClick={() => setShowSummary((prev) => !prev)}
          aria-expanded={showSummary}
          aria-controls="cookie-toast-privacy-summary"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded transition-colors"
        >
          <span>Quick Privacy Summary</span>
          {showSummary ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>

        {showSummary && (
          <ul
            id="cookie-toast-privacy-summary"
            className="mt-2 p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc pl-6"
          >
            <li>
              Essential storage remembers your cookie choice (
              <code className="font-mono text-[11px] text-slate-800">basecase_cookie_consent</code>
              ).
            </li>
            <li>
              Trial enquiry details (name, contact, student age/level) are used only to reply to your booking request under Singapore&apos;s PDPA.
            </li>
            <li>
              We never sell student or parent data or run third-party ad trackers.
            </li>
          </ul>
        )}
      </div>

      <div className="mt-3.5 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleConsent('accepted')}
          className="px-3.5 py-2 rounded-md bg-[#166534] hover:bg-[#15803D] text-white text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleConsent('declined')}
          className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
