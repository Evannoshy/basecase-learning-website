'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

export function Header() {
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
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0]/80 bg-[#FAF8F5]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Logo / Home Anchor */}
          <a
            href="#main-content"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md"
            aria-label={`${siteConfig.brand.name} Homepage`}
          >
            <span className="font-mono text-teal-600 font-bold mr-1.5 text-lg">&gt;_</span>
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
                href={item.href}
                className="group flex items-center text-sm font-medium text-slate-700 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md py-1 transition-colors"
                title={item.tooltip}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button (>= 768px / md) */}
          <div className="hidden md:flex items-center">
            <a
              href={ctaLink.href}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
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
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
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
        className={`md:hidden transition-all duration-200 ease-in-out border-b border-[#E2E8F0] bg-[#FAF8F5] ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center justify-between py-2 text-base font-medium text-slate-700 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  {item.badge}
                </span>
              )}
            </a>
          ))}

          <div className="pt-4 mt-2 border-t border-slate-200">
            <a
              href={ctaLink.href}
              onClick={closeMenu}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
            >
              {ctaLink.label}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
