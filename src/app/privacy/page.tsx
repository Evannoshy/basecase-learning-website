import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { CookiePreferencesControl } from '@/components/layout/CookiePreferencesControl';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How BaseCase Learning collects, uses, and protects parent and student enquiry information under Singapore’s Personal Data Protection Act (PDPA).',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const { brand } = siteConfig;

  return (
    <div className="bg-white">
      {/* Top Breadcrumb Bar */}
      <div className="bg-slate-50 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Link
              href="/cookies"
              className="hover:text-[#166534] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
            >
              Cookie Policy
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Policy Document */}
      <article className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Title Block */}
          <header className="border-b border-slate-200 pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
              Privacy &amp; Data Protection (Singapore PDPA)
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Effective date: 14 November 2026 &middot; Applies to{' '}
              <span className="font-medium text-slate-700">{brand.name}</span>
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              This Privacy Policy sets out how {brand.name} collects, uses, stores, and protects personal data provided by parents, guardians, and students under Singapore&apos;s Personal Data Protection Act 2012 (PDPA).
            </p>
          </header>

          {/* 1. Personal Data We Collect */}
          <section aria-labelledby="section-data-collected" className="space-y-3">
            <h2 id="section-data-collected" className="text-xl font-bold text-slate-900">
              1. Personal Data We Collect
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We only ask for practical details needed to answer enquiries and arrange trial lessons:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              <li>
                <strong className="font-semibold text-slate-800">Enquiry &amp; contact details:</strong>{' '}
                Parent or guardian name, email address or Singapore mobile number submitted through our Trial Enquiry Form or sent directly via WhatsApp or email.
              </li>
              <li>
                <strong className="font-semibold text-slate-800">Student learning context:</strong>{' '}
                Student age or school level (for example Secondary, IB, JC, or Pre-U), prior coding experience, preferred course track, and optional notes on learning goals or preferred timings.
              </li>
              <li>
                <strong className="font-semibold text-slate-800">Browser preference storage:</strong>{' '}
                Your cookie consent choice saved locally under{' '}
                <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                  basecase_cookie_consent
                </code>{' '}
                so we do not keep prompting you on every visit.
              </li>
            </ul>
          </section>

          {/* 2. How We Use Your Personal Data */}
          <section aria-labelledby="section-data-usage" className="space-y-3">
            <h2 id="section-data-usage" className="text-xl font-bold text-slate-900">
              2. How We Use Your Personal Data
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              <li>
                Reply to trial lesson and course enquiries within 24 hours via WhatsApp or email.
              </li>
              <li>
                Recommend an appropriate starting track (Beginner Python, Introductory Web Development, or 1-on-1 coaching) based on the student&apos;s age and background.
              </li>
              <li>
                Confirm trial schedules, arrange small-group or 1-on-1 lesson timings, and handle fee enquiries for enrolled students.
              </li>
              <li>
                Update parents on student attendance, completed homework, and project progress during the term.
              </li>
            </ul>
          </section>

          {/* 3. Data Protection & Third-Party Disclosure */}
          <section aria-labelledby="section-data-protection" className="space-y-3">
            <h2 id="section-data-protection" className="text-xl font-bold text-slate-900">
              3. Data Protection &amp; Third-Party Disclosure
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Access to parent and student enquiry information is kept strictly within our founding teaching team for lesson coordination and student support.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We never sell, rent, or share parent or student personal details with external advertisers, data brokers, or unrelated third parties, and we do not run third-party behavioural advertising trackers on this site.
            </p>
          </section>

          {/* 4. Retention, Access, Correction & Withdrawal (PDPA Rights) */}
          <section aria-labelledby="section-pdpa-rights" className="space-y-3">
            <h2 id="section-pdpa-rights" className="text-xl font-bold text-slate-900">
              4. Retention, Access, Correction &amp; Withdrawal (PDPA Rights)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We retain enquiry records only for as long as needed to coordinate your trial, support ongoing classes, or meet reasonable record-keeping duties. If an enquiry does not proceed to enrolment, you may ask us to remove your contact details at any time.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Under Singapore&apos;s PDPA, you have the right to request access to the personal data we hold about you, ask us to correct inaccurate details, or withdraw consent for us to contact you. Send your request using the contact details below and we will respond promptly.
            </p>
          </section>

          {/* 5. Cookies & Browser Storage */}
          <section aria-labelledby="section-cookies-summary" className="space-y-4">
            <h2 id="section-cookies-summary" className="text-xl font-bold text-slate-900">
              5. Cookies &amp; Browser Storage
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Essential storage keeps site forms working properly and remembers your cookie banner choice. For a breakdown of keys and durations, read our{' '}
              <Link
                href="/cookies"
                className="font-semibold text-[#166534] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
              >
                Cookie Policy
              </Link>
              , or update your choice directly below.
            </p>
            <CookiePreferencesControl />
          </section>

          {/* 6. Contact Us About Privacy */}
          <section aria-labelledby="section-privacy-contact" className="space-y-3 border-t border-slate-200 pt-8">
            <h2 id="section-privacy-contact" className="text-xl font-bold text-slate-900">
              6. Contact Us About Privacy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, or wish to access, update, or delete your enquiry details under Singapore&apos;s PDPA, reach us at{' '}
              <a
                href={`mailto:${brand.contact.email}`}
                className="font-semibold text-[#166534] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
              >
                {brand.contact.email}
              </a>{' '}
              or WhatsApp / call{' '}
              <a
                href={brand.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#166534] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
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
