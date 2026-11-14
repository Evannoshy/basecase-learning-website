import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { CookiePreferencesControl } from '@/components/layout/CookiePreferencesControl';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How BaseCase Learning uses essential cookies and browser local storage, how we handle analytics preferences, and how to manage your consent.',
  alternates: {
    canonical: '/cookies',
  },
};

const cookieInventory = [
  {
    name: 'basecase_cookie_consent',
    type: 'Strictly Necessary (Local Storage)',
    purpose: 'Stores whether you clicked "Accept All" or "Essential Only" so the cookie banner does not prompt you on every visit.',
    duration: 'Persistent until cleared in your browser',
  },
  {
    name: 'Session & Security State',
    type: 'Strictly Necessary',
    purpose: 'Supports core site navigation, form validation, and protection against abusive automated enquiry submissions.',
    duration: 'Browser session',
  },
  {
    name: 'Site Analytics (Optional)',
    type: 'Analytics & Performance',
    purpose: 'Used only when enabled and consented to help us measure aggregate page views and understand which course pages parents visit.',
    duration: 'Up to 12 months',
  },
];

export default function CookiesPage() {
  const { brand } = siteConfig;

  return (
    <div className="bg-white">
      {/* Top Breadcrumb Bar */}
      <div className="bg-slate-50 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#1E3A8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-500 font-medium">Cookie Policy</span>
        </div>
      </div>

      {/* Main Policy Document */}
      <article className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Title Block */}
          <header className="border-b border-slate-200 pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
              Privacy &amp; Browser Storage
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Cookie Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Effective date: 14 November 2026 &middot; Applies to{' '}
              <span className="font-medium text-slate-700">{brand.name}</span>
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              This Cookie Policy explains how {brand.name} uses cookies and browser local storage when you visit our website, what choices you have, and how those choices are respected under Singapore&apos;s Personal Data Protection Act (PDPA).
            </p>
          </header>

          {/* 1. What Are Cookies & Local Storage? */}
          <section aria-labelledby="section-what-are-cookies" className="space-y-3">
            <h2 id="section-what-are-cookies" className="text-xl font-bold text-slate-900">
              1. What Are Cookies &amp; Local Storage?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Cookies are small text files stored in your browser by websites you visit. Modern web applications also use browser local storage to remember simple preferences directly on your device without sending unnecessary data across the network.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We keep storage minimal: we do not sell visitor data or run third-party behavioural advertising trackers on students or parents.
            </p>
          </section>

          {/* 2. How We Use Cookies */}
          <section aria-labelledby="section-how-we-use-cookies" className="space-y-4">
            <h2 id="section-how-we-use-cookies" className="text-xl font-bold text-slate-900">
              2. How We Use Cookies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-lg border border-slate-300 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-900">
                  Strictly Necessary / Essential
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Required so the website functions reliably, such as remembering your cookie notice selection and keeping interactive forms working cleanly. These cannot be switched off without resetting browser storage.
                </p>
              </div>
              <div className="rounded-lg border border-slate-300 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-900">
                  Optional Analytics &amp; Performance
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Helps us understand aggregate visitor traffic (for example, which coding tracks or FAQs parents read most) so we can keep course information clear and helpful. Choosing &ldquo;Essential Only&rdquo; opts out of optional analytics.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Cookie & Local Storage Reference Table */}
          <section aria-labelledby="section-cookie-reference" className="space-y-4">
            <h2 id="section-cookie-reference" className="text-xl font-bold text-slate-900">
              3. Cookie &amp; Local Storage Reference
            </h2>
            <div className="rounded-xl border border-slate-300 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-700">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Name / Key</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Category</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Purpose</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {cookieInventory.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{item.type}</td>
                        <td className="px-5 py-4 text-slate-600 leading-relaxed">{item.purpose}</td>
                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4. Manage Your Cookie Preferences */}
          <section aria-labelledby="section-manage-cookies" className="space-y-4">
            <h2 id="section-manage-cookies" className="text-xl font-bold text-slate-900">
              4. Manage Your Cookie Preferences
            </h2>
            <CookiePreferencesControl />
          </section>

          {/* 5. Browser Controls & PDPA Contact Details */}
          <section aria-labelledby="section-browser-controls" className="space-y-3 border-t border-slate-200 pt-8">
            <h2 id="section-browser-controls" className="text-xl font-bold text-slate-900">
              5. Browser Controls &amp; PDPA Contact Details
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              You can also block, inspect, or delete cookies and site data at any time through your browser settings (Chrome, Safari, Firefox, or Edge).
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Under Singapore&apos;s PDPA, any personal information you choose to enter in our trial enquiry form is used solely to reply to your enquiry about classes. If you have questions about privacy or cookies, contact us at{' '}
              <a
                href={`mailto:${brand.contact.email}`}
                className="font-semibold text-[#1E3A8A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
              >
                {brand.contact.email}
              </a>{' '}
              or WhatsApp / call{' '}
              <a
                href={brand.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1E3A8A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
              >
                {brand.contact.phoneDisplay}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
