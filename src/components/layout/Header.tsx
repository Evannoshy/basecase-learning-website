'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { BrandLogoMark } from '@/components/ui/BrandLogoMark';
import { resolveSectionHref } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu on Escape key press and restore focus to toggle button
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Separate regular links from CTA
  const navLinks = siteConfig.navigation.filter((item) => !item.isCta);
  const ctaLink = siteConfig.navigation.find((item) => item.isCta) || {
    label: 'Book a coding trial',
    href: '#trial-enquiry',
  };
  const [brandPrimary, ...brandRest] = siteConfig.brand.name.split(' ');
  const brandSecondary = brandRest.join(' ');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-300 bg-white shadow-sm">
      {/* Moving Top Utility Announcement Marquee */}
      <div className="bg-[#166534] text-white text-xs py-2 border-b border-green-950 overflow-hidden dark-surface">
        <div
          data-testid="top-announcement-marquee"
          className="animate-announcement-marquee"
        >
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? 'track-duplicate' : 'track-primary'}
              aria-hidden={isDuplicate ? 'true' : undefined}
              className="flex items-center gap-6 whitespace-nowrap pr-6 flex-shrink-0"
            >
              <span className="font-medium text-white">
                Small-Group Coding Tuition in Singapore (Sec · IB · JC · Pre-U) · Taught by NUS Computing Undergrads
              </span>
              <span className="text-green-200" aria-hidden="true">•</span>
              <span className="bg-[#FACC15] text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                Trial Enquiries Open
              </span>
              <span className="text-green-200" aria-hidden="true">•</span>
              <span className="text-white font-medium">Small Class Ratio (3–6 Students per Table)</span>
              <span className="text-green-200" aria-hidden="true">•</span>
              <a
                href={siteConfig.brand.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isDuplicate ? -1 : undefined}
                className="text-white hover:text-[#FACC15] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded font-semibold transition-colors"
              >
                WhatsApp: {siteConfig.brand.contact.phoneDisplay}
              </a>
              <span className="text-green-200" aria-hidden="true">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Logo / Home Anchor */}
          <a
            href={resolveSectionHref('#main-content', pathname)}
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-md"
            aria-label={`${siteConfig.brand.name} Homepage`}
          >
            <BrandLogoMark className="h-10 w-auto mr-2.5 flex-shrink-0" />
            <span className="font-bold text-slate-900 tracking-tight text-lg">
              {brandPrimary}
            </span>
            {brandSecondary && (
              <span className="text-slate-600 font-medium ml-1 text-lg hidden sm:inline">
                {brandSecondary}
              </span>
            )}
          </a>

          {/* Desktop Navigation Links (>= 768px / md) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={resolveSectionHref(item.href, pathname)}
                className="group flex items-center text-sm font-medium text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-md py-1 transition-colors"
                title={item.tooltip}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button (>= 768px / md) */}
          <div className="hidden md:flex items-center">
            <a
              href={resolveSectionHref(ctaLink.href, pathname)}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#166534] hover:bg-[#15803D] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
            >
              {ctaLink.label}
            </a>
          </div>

          {/* Mobile Menu Toggle Button (< 768px / md) */}
          <div className="flex md:hidden items-center">
            <button
              ref={toggleButtonRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (< 768px / md) */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`md:hidden transition-all duration-200 ease-in-out border-b border-slate-300 bg-white ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={resolveSectionHref(item.href, pathname)}
              onClick={closeMenu}
              className="flex items-center justify-between py-2 text-base font-medium text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-md"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  {item.badge}
                </span>
              )}
            </a>
          ))}

          <div className="pt-4 mt-2 border-t border-slate-200">
            <a
              href={resolveSectionHref(ctaLink.href, pathname)}
              onClick={closeMenu}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold text-white bg-[#166534] hover:bg-[#15803D] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
            >
              {ctaLink.label}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
