import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tuition Fees & Pricing',
  description:
    'Transparent tuition fee tiers for small-group coding classes, 1-on-1 mentorship, and trial sessions at BaseCase Learning in Singapore.',
  alternates: {
    canonical: '/pricing',
  },
};

const comparisonRows = [
  {
    programme: 'Beginner Python',
    audience: 'Sec 1–4, IB & Pre-U Beginners',
    format: 'Small Group (3–6 students)',
    duration: '2 hours / week (4 lessons)',
    rate: 'S$280 / month',
  },
  {
    programme: 'Introductory Web Development',
    audience: 'Sec 1–4, IB, JC & Pre-U',
    format: 'Small Group (3–6 students)',
    duration: '2 hours / week (4 lessons)',
    rate: 'S$280 / month',
  },
  {
    programme: '1-on-1 Private Mentorship',
    audience: 'Custom Pace / School Computing / Projects',
    format: 'Private 1-on-1',
    duration: '1.5 – 2 hours / session',
    rate: 'S$85 / hour',
  },
];

export default function PricingPage() {
  const { pricing, brand } = siteConfig;

  return (
    <div className="bg-white">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-500 font-medium">Tuition Fees &amp; Pricing</span>
        </div>
      </div>

      {/* Page Header & Pricing Tier Cards */}
      <section aria-labelledby="pricing-heading" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Tuition Fees &amp; Schedules
            </p>
            <h1
              id="pricing-heading"
              className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              {pricing.headline}
            </h1>
            <div className="w-12 h-1 bg-teal-700 mx-auto mt-4" aria-hidden="true" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              {pricing.subheadline}
            </p>

            {/* Editable Rate Guide Notice */}
            <div className="mt-6 inline-flex items-start sm:items-center gap-2.5 text-left px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm max-w-2xl">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <span>{pricing.placeholderNotice}</span>
            </div>
          </div>

          {/* 3-Column Pricing Tiers Grid */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricing.tiers.map((tier) => (
              <article
                key={tier.id}
                className={cn(
                  'rounded-xl bg-white border p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md',
                  tier.isFeatured
                    ? 'border-slate-300 border-t-4 border-t-teal-700 ring-1 ring-teal-700/15'
                    : 'border-slate-200 border-t-4 border-t-slate-800'
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h2 className="text-xl font-bold text-slate-900">{tier.name}</h2>
                    {tier.badge && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border whitespace-nowrap',
                          tier.isFeatured
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed min-h-[2.75rem]">
                    {tier.summary}
                  </p>

                  {/* Price Callout */}
                  <div className="mt-5 pb-5 border-b border-slate-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                        {tier.price}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {tier.billingCycle}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tier CTAs */}
                <div className="mt-8 pt-5 border-t border-slate-100 space-y-2.5">
                  <a
                    href={tier.ctaHref}
                    className={cn(
                      'w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors',
                      tier.isFeatured
                        ? 'bg-[#0F766E] hover:bg-[#115E59] text-white'
                        : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                    )}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </a>
                  <a
                    href={brand.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    <span>WhatsApp {brand.contact.phoneDisplay}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included in Every Programme */}
      <section aria-labelledby="included-heading" className="py-14 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="included-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What&apos;s Included in Every Programme
            </h2>
            <div className="w-12 h-1 bg-teal-700 mx-auto mt-3" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.includedItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Programme & Format Comparison Table */}
          <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Programme &amp; Format Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50/70 text-xs uppercase tracking-wider text-slate-600">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Programme</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Target Students</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Class Format</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Duration</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Rate Guide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {comparisonRows.map((row) => (
                    <tr key={row.programme} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {row.programme}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{row.audience}</td>
                      <td className="px-6 py-4 text-slate-700">{row.format}</td>
                      <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{row.duration}</td>
                      <td className="px-6 py-4 font-bold text-teal-800 whitespace-nowrap">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Billing FAQs */}
      <section aria-labelledby="pricing-faq-heading" className="py-14 sm:py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="pricing-faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pricing &amp; Billing FAQs
            </h2>
            <div className="w-12 h-1 bg-teal-700 mx-auto mt-3" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            {pricing.pricingFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6"
              >
                <h3 className="text-base font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trial Enquiry Section */}
      <section
        id="trial-enquiry"
        aria-labelledby="pricing-enquiry-heading"
        className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Get Started
            </p>
            <h2
              id="pricing-enquiry-heading"
              className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Book a Trial or Ask About Fees
            </h2>
            <div className="w-12 h-1 bg-teal-700 mx-auto mt-4" aria-hidden="true" />
            <p className="mt-4 text-sm sm:text-base text-slate-600">
              Leave your details below and we&apos;ll reply within 24 hours with confirmed class timings and fee details.
            </p>
          </div>

          <TrialEnquiryForm className="max-w-none" />
        </div>
      </section>
    </div>
  );
}
