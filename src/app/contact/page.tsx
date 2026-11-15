import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';

export const metadata: Metadata = {
  title: 'Contact & Trial Enquiries',
  description:
    'Contact BaseCase Learning in Singapore via WhatsApp, email, or our trial booking form for coding classes and O-Level, A-Level, and IB Computing mentorship.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const { brand, enquiryConfig } = siteConfig;

  return (
    <div className="bg-white">
      <div className="bg-slate-50 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-500 font-medium">Contact</span>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
              Enquiries &amp; Admissions
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Contact {brand.name}
            </h1>
            <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Reach out to ask about small-group Python and Web Development coding classes, 1-on-1 O-Level / A-Level / IB Computing mentorship, or to book a 60-minute diagnostic trial in Singapore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <MessageSquare className="w-5 h-5 text-[#166534] mb-2" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">WhatsApp</h2>
              <a
                href={brand.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-[#166534] hover:underline"
              >
                {brand.contact.phoneDisplay}
              </a>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-[#166534] mb-2" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">Email</h2>
              <a
                href={`mailto:${brand.contact.email}`}
                className="mt-1 inline-block text-sm font-semibold text-[#166534] hover:underline break-all"
              >
                {brand.contact.email}
              </a>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-[#166534] mb-2" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">Location</h2>
              <p className="mt-1 text-sm text-slate-700">{brand.contact.locationDetail} &amp; Online</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-5 h-5 text-[#166534] mb-2" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">Reply Time</h2>
              <p className="mt-1 text-sm text-slate-700">{enquiryConfig.trialTimelineNotice}</p>
            </div>
          </div>

          <TrialEnquiryForm className="max-w-2xl mx-auto" />
        </div>
      </section>
    </div>
  );
}
