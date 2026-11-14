'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

export function FloatingContactCta() {
  const [isHiddenAtFormOrFooter, setIsHiddenAtFormOrFooter] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const enquiryEl = document.getElementById('trial-enquiry');
    const footerEl = document.querySelector('footer');
    const targets = [enquiryEl, footerEl].filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) {
      return;
    }

    const visibleMap = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleMap.set(entry.target, entry.isIntersecting);
        });
        const anyVisible = Array.from(visibleMap.values()).some(Boolean);
        setIsHiddenAtFormOrFooter(anyVisible);
      },
      { threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop bottom-right floating WhatsApp pill */}
      <div
        aria-hidden={isHiddenAtFormOrFooter}
        className={cn(
          'hidden md:flex fixed bottom-6 right-6 z-40 transition-all duration-200',
          isHiddenAtFormOrFooter
            ? 'opacity-0 translate-y-4 pointer-events-none'
            : 'opacity-100 translate-y-0'
        )}
      >
        <a
          href={siteConfig.brand.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isHiddenAtFormOrFooter ? -1 : undefined}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-sm font-semibold shadow-lg border border-blue-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A] transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-white" aria-hidden="true" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>

      {/* Mobile sticky bottom action bar */}
      <div
        role="region"
        aria-label="Quick trial booking bar"
        aria-hidden={isHiddenAtFormOrFooter}
        className={cn(
          'flex md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-300 px-4 py-2.5 shadow-md transition-transform duration-200',
          isHiddenAtFormOrFooter
            ? 'translate-y-full pointer-events-none'
            : 'translate-y-0'
        )}
      >
        <div className="w-full flex items-center gap-2.5">
          <a
            href="#trial-enquiry"
            tabIndex={isHiddenAtFormOrFooter ? -1 : undefined}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A] transition-colors"
          >
            <span>Book a Trial</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.brand.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isHiddenAtFormOrFooter ? -1 : undefined}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </>
  );
}
