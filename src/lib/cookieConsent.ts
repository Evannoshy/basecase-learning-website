export const COOKIE_CONSENT_KEY = 'basecase_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'basecase-cookie-consent-changed';

export type CookieChoice = 'accepted' | 'declined';

/**
 * Safely reads the visitor's persisted cookie preference from localStorage.
 */
export function getSavedCookieConsent(): CookieChoice | null {
  try {
    const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (saved === 'accepted' || saved === 'declined') {
      return saved;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists a cookie preference choice and notifies active listeners on the page.
 */
export function saveCookieConsent(choice: CookieChoice): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    // Ignore storage failures in restricted browsing modes
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  }
}

/**
 * Clears the stored cookie preference so the consent banner can prompt again.
 */
export function clearCookieConsent(): void {
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    // Ignore storage failures in restricted browsing modes
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  }
}
