import React from 'react';
import { siteConfig } from '@/config/siteConfig';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-[#0F172A] text-slate-100 pt-16 pb-12 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Brand & Academy Overview */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span
                className="w-7 h-7 rounded bg-teal-700 text-white font-bold text-xs inline-flex items-center justify-center mr-2 tracking-tight flex-shrink-0"
                aria-hidden="true"
              >
                BC
              </span>
              <span className="font-bold text-white tracking-tight text-lg">
                {siteConfig.brand.name}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {siteConfig.brand.description}
            </p>
          </div>

          {/* Column 2: Navigation & Learning Pathways */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Programmes
            </h3>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <a
                    href="#courses"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Beginner Python
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Introductory Web Dev
                  </a>
                </li>
                <li>
                  <a
                    href="#how-learning-works"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    How Learning Works
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Example Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#mentors"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Meet the Mentors
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Tuition Fees &amp; Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#faqs"
                    className="hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded transition-colors"
                  >
                    Parent FAQs
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Contact & Operations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Enquiries
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <span className="text-slate-400 block">Email:</span>
                <a
                  href={`mailto:${siteConfig.brand.contact.email}`}
                  className="text-teal-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                >
                  {siteConfig.brand.contact.email}
                </a>
              </li>
              <li>
                <span className="text-slate-400 block">WhatsApp / Phone:</span>
                <a
                  href={siteConfig.brand.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                >
                  {siteConfig.brand.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="text-slate-400 block">Response Time:</span>
                <span>Within 24 hours.</span>
              </li>
              <li>
                <span className="text-slate-400 block">Location:</span>
                <span>{siteConfig.brand.contact.locationDetail}</span>
              </li>
            </ul>
            <div className="mt-4">
              <a
                href="#trial-enquiry"
                className="inline-flex items-center text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
              >
                Book a coding trial enquiry &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Separator and Consolidated Notices */}
        <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
          <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5">
            <p>{siteConfig.brand.disclaimers.universityIndependence}</p>
            <p>
              {siteConfig.brand.disclaimers.operationalPricing} We only collect the contact details needed to answer your trial enquiry under Singapore’s PDPA.
            </p>
          </div>

          {/* Copyright Line */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2">
            <p>&copy; {currentYear} {siteConfig.brand.name}. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">
              Coding mentorship in Singapore.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
