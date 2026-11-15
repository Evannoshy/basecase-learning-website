'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/siteConfig';
import { BrandLogoMark } from '@/components/ui/BrandLogoMark';
import { resolveSectionHref } from '@/lib/utils';

export function Footer() {
  const pathname = usePathname();
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
              <BrandLogoMark className="h-10 w-auto mr-2.5 flex-shrink-0" />
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
                    href={resolveSectionHref('#courses', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    Beginner Python
                  </a>
                </li>
                <li>
                  <a
                    href={resolveSectionHref('#courses', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    Introductory Web Dev
                  </a>
                </li>
                <li>
                  <a
                    href={resolveSectionHref('#how-learning-works', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    How Learning Works
                  </a>
                </li>
                <li>
                  <a
                    href={resolveSectionHref('#projects', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    Example Projects
                  </a>
                </li>
                <li>
                  <a
                    href={resolveSectionHref('#mentors', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    Meet the Mentors
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
                  >
                    Tuition Fees &amp; Pricing
                  </a>
                </li>
                <li>
                  <a
                    href={resolveSectionHref('#faqs', pathname)}
                    className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
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
                  className="text-white underline hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
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
                  className="text-white underline hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
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
                href={resolveSectionHref('#trial-enquiry', pathname)}
                className="inline-flex items-center text-xs font-semibold text-white underline hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Book a coding trial enquiry &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Separator and Consolidated Notices */}
        <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
            <p>{siteConfig.brand.disclaimers.universityIndependence}</p>
            <p>
              {siteConfig.brand.disclaimers.operationalPricing} We only collect the contact details needed to answer your trial enquiry under Singapore’s PDPA.
            </p>
          </div>

          {/* Copyright & Legal Links Line */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-2">
            <p>&copy; {currentYear} {siteConfig.brand.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="text-slate-200 hover:text-white underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
              >
                Contact
              </Link>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <Link
                href="/privacy"
                className="text-slate-200 hover:text-white underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <Link
                href="/cookies"
                className="text-slate-200 hover:text-white underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors"
              >
                Cookie Policy
              </Link>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <p className="font-mono text-[11px] text-slate-400">
                Coding mentorship in Singapore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
