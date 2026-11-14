import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactCta } from '@/components/layout/FloatingContactCta';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@/config/siteConfig';
import { resolveSectionHref } from '@/lib/utils';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import HomePage from '@/app/page';
import PricingPage from '@/app/pricing/page';
import CookiesPage from '@/app/cookies/page';
import PrivacyPage from '@/app/privacy/page';
import { CookiePreferencesControl } from '@/components/layout/CookiePreferencesControl';

vi.mock('next/font/google', () => ({
  Plus_Jakarta_Sans: () => ({ variable: '--font-sans' }),
  JetBrains_Mono: () => ({ variable: '--font-mono' }),
}));

import { metadata as layoutMetadata } from '@/app/layout';

describe('Header Component', () => {
  it('renders brand identity and SVG graphic logo mark', () => {
    render(<Header />);
    const brandLinks = screen.getAllByRole('link', { name: new RegExp(siteConfig.brand.name, 'i') });
    expect(brandLinks.length).toBeGreaterThan(0);

    const logoMark = screen.getByTestId('brand-logo-mark');
    expect(logoMark.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText('BC')).not.toBeInTheDocument();
  });

  it('renders desktop navigation links and CTA button', () => {
    render(<Header />);
    const mainNav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(mainNav).toBeInTheDocument();

    // Check presence of coding-focused navigation links (no unavailable tuition classes advertised in top nav)
    expect(screen.getAllByText('Courses').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mentors').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Progression').length).toBeGreaterThan(0);
    expect(screen.queryByText('Academic Tuition')).not.toBeInTheDocument();

    // Check CTA button
    const ctaButtons = screen.getAllByRole('link', { name: /book a coding trial/i });
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('manages mobile menu toggle state and accessibility attributes', () => {
    render(<Header />);
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-navigation-drawer');

    // Open menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', 'Close navigation menu');

    const drawer = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(drawer).toBeInTheDocument();
    expect(drawer).not.toHaveClass('hidden');

    // Close on Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).toHaveClass('hidden');
  });

  it('closes mobile drawer when a navigation link is clicked', () => {
    render(<Header />);
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggleButton);

    const drawer = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(drawer).not.toHaveClass('hidden');

    // Find a link inside the drawer and click it
    const coursesLinks = screen.getAllByText('Courses');
    // The mobile link is inside the drawer
    fireEvent.click(coursesLinks[coursesLinks.length - 1]);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).toHaveClass('hidden');
  });

  it('renders a moving top announcement marquee with an aria-hidden loop track', () => {
    render(<Header />);
    const marquee = screen.getByTestId('top-announcement-marquee');
    expect(marquee).toHaveClass('animate-announcement-marquee');
    expect(marquee.children).toHaveLength(2);
    expect(marquee.children[0]).not.toHaveAttribute('aria-hidden', 'true');
    expect(marquee.children[1]).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Footer Component', () => {
  it('renders contentinfo landmark, SVG graphic logo mark, and brand summary', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getAllByText(siteConfig.brand.name).length).toBeGreaterThan(0);
    expect(screen.getByText(siteConfig.brand.description)).toBeInTheDocument();

    const logoMark = screen.getByTestId('brand-logo-mark');
    expect(logoMark.tagName.toLowerCase()).toBe('svg');
    expect(screen.queryByText('BC')).not.toBeInTheDocument();
  });

  it('renders secondary navigation links and enquiries section', () => {
    render(<Footer />);
    const footerNav = screen.getByRole('navigation', { name: /footer navigation/i });
    expect(footerNav).toBeInTheDocument();

    expect(screen.getByText(/Programmes/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Enquiries/i })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.brand.contact.email)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book a coding trial enquiry/i })).toHaveAttribute('href', '#trial-enquiry');
  });

  it('contains mandatory independence disclaimer, PDPA statement, and copyright', () => {
    render(<Footer />);
    const disclaimer = screen.getByText(/BaseCase Learning is an independent tuition initiative/i);
    expect(disclaimer).toBeInTheDocument();

    const pdpa = screen.getByText(/PDPA/i);
    expect(pdpa).toBeInTheDocument();

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});

describe('Badge Component', () => {
  it('renders badge with correct default and variant styles', () => {
    const { rerender } = render(<Badge>Default Badge</Badge>);
    expect(screen.getByText('Default Badge')).toBeInTheDocument();

    rerender(<Badge variant="amber">Roadmap</Badge>);
    const amberBadge = screen.getByText('Roadmap');
    expect(amberBadge).toHaveClass('bg-amber-100');
    expect(amberBadge).toHaveClass('text-amber-800');

    rerender(<Badge variant="teal">Active</Badge>);
    const tealBadge = screen.getByText('Active');
    expect(tealBadge).toHaveClass('bg-teal-100');
  });
});

describe('Landmarks and Skip Link Integration', () => {
  it('renders accessible bypass block targeting main content', () => {
    render(
      <div>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          <h1>Main Content Area</h1>
        </main>
        <Footer />
      </div>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });
});

describe('FloatingContactCta Component', () => {
  it('renders desktop WhatsApp pill and mobile sticky bar actions with focus-visible classes', () => {
    render(<FloatingContactCta />);

    const desktopWaLink = screen.getByRole('link', { name: /ask on whatsapp/i });
    expect(desktopWaLink).toHaveAttribute('href', siteConfig.brand.contact.whatsappUrl);
    expect(desktopWaLink.className).toContain('focus-visible:ring-2');

    const mobileBookLink = screen.getByRole('link', { name: /book a trial/i });
    expect(mobileBookLink).toHaveAttribute('href', '#trial-enquiry');
    expect(mobileBookLink.className).toContain('focus-visible:ring-2');

    const mobileWaLink = screen.getByRole('link', { name: /whatsapp us/i });
    expect(mobileWaLink).toHaveAttribute('href', siteConfig.brand.contact.whatsappUrl);
    expect(mobileWaLink.className).toContain('focus-visible:ring-2');
  });

  it('auto-hides when #trial-enquiry enters the viewport via IntersectionObserver', () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [];
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
    }

    const originalIo = window.IntersectionObserver;
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    try {
      const enquirySection = document.createElement('section');
      enquirySection.id = 'trial-enquiry';
      document.body.appendChild(enquirySection);

      render(<FloatingContactCta />);
      const bar = screen.getByRole('region', { name: /quick trial booking bar/i });
      expect(bar).toHaveAttribute('aria-hidden', 'false');

      // Simulate scrolling to #trial-enquiry
      act(() => {
        observerCallback?.(
          [{ target: enquirySection, isIntersecting: true } as unknown as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(
        document.querySelector('[aria-label="Quick trial booking bar"]')
      ).toHaveAttribute('aria-hidden', 'true');

      enquirySection.remove();
    } finally {
      window.IntersectionObserver = originalIo;
    }
  });
});

describe('CookieBanner Component', () => {
  it('renders cookie notice with Privacy Policy & Cookie Policy links, inline summary toggle, and hides on Accept All', () => {
    window.localStorage.removeItem('basecase_cookie_consent');
    render(<CookieBanner />);

    const region = screen.getByRole('region', { name: /cookie notice/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByText('Cookies on this site')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /cookie policy/i })).toHaveAttribute('href', '/cookies');

    const summaryToggle = screen.getByRole('button', { name: /quick privacy summary/i });
    expect(summaryToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/we never sell student or parent data/i)).not.toBeInTheDocument();

    fireEvent.click(summaryToggle);
    expect(summaryToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/we never sell student or parent data/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /accept all/i }));
    expect(window.localStorage.getItem('basecase_cookie_consent')).toBe('accepted');
    expect(screen.queryByRole('region', { name: /cookie notice/i })).not.toBeInTheDocument();
  });

  it('stores declined choice and hides on Essential Only', () => {
    window.localStorage.removeItem('basecase_cookie_consent');
    render(<CookieBanner />);

    fireEvent.click(screen.getByRole('button', { name: /essential only/i }));
    expect(window.localStorage.getItem('basecase_cookie_consent')).toBe('declined');
    expect(screen.queryByRole('region', { name: /cookie notice/i })).not.toBeInTheDocument();
  });

  it('does not render when consent choice already exists in localStorage', () => {
    window.localStorage.setItem('basecase_cookie_consent', 'accepted');
    render(<CookieBanner />);

    expect(screen.queryByRole('region', { name: /cookie notice/i })).not.toBeInTheDocument();
    window.localStorage.removeItem('basecase_cookie_consent');
  });
});

describe('SEO Metadata Routes, Icons & Structured Data', () => {
  it('declares favicon and SVG app icon files with graphic crest mark on disk and in root layout metadata', () => {
    const projectRoot = process.cwd();
    const appIconPath = path.join(projectRoot, 'src/app/icon.svg');
    expect(fs.existsSync(appIconPath)).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'public/icon.svg'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'public/favicon.svg'))).toBe(true);

    const iconSvg = fs.readFileSync(appIconPath, 'utf-8');
    expect(iconSvg).toContain('<path');
    expect(iconSvg).not.toContain('>BC<');

    expect(layoutMetadata.icons).toEqual({
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: ['/icon.svg'],
      apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    });
  });

  it('generates robots.txt pointing to canonical sitemap URL', () => {
    const result = robots();
    expect(result.rules).toEqual({
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    });
    expect(result.sitemap).toBe(`${siteConfig.brand.url}/sitemap.xml`);
  });

  it('generates sitemap.xml with canonical homepage, pricing, cookies, and privacy URLs', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(4);
    expect(entries[0].url).toBe(siteConfig.brand.url);
    expect(entries[0].changeFrequency).toBe('weekly');
    expect(entries[0].priority).toBe(1);
    expect(entries[0].lastModified).toBeInstanceOf(Date);

    expect(entries[1].url).toBe(`${siteConfig.brand.url}/pricing`);
    expect(entries[1].changeFrequency).toBe('weekly');
    expect(entries[1].priority).toBe(0.9);
    expect(entries[1].lastModified).toBeInstanceOf(Date);

    expect(entries[2].url).toBe(`${siteConfig.brand.url}/cookies`);
    expect(entries[2].changeFrequency).toBe('monthly');
    expect(entries[2].priority).toBe(0.5);
    expect(entries[2].lastModified).toBeInstanceOf(Date);

    expect(entries[3].url).toBe(`${siteConfig.brand.url}/privacy`);
    expect(entries[3].changeFrequency).toBe('monthly');
    expect(entries[3].priority).toBe(0.5);
    expect(entries[3].lastModified).toBeInstanceOf(Date);
  });

  it('renders JSON-LD structured data with EducationalOrganization, Course, and FAQPage schemas on HomePage', () => {
    const { container } = render(<HomePage />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const parsed = JSON.parse(script?.textContent || '{}');
    expect(parsed['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsed['@graph'])).toBe(true);

    const orgNode = parsed['@graph'].find((node: { '@type': string }) => node['@type'] === 'EducationalOrganization');
    expect(orgNode).toBeDefined();
    expect(orgNode.name).toBe(siteConfig.brand.name);
    expect(orgNode.url).toBe(siteConfig.brand.url);
    expect(orgNode.email).toBe(siteConfig.brand.contact.email);
    expect(orgNode.telephone).toBe(siteConfig.brand.contact.phone);

    const courseListNode = parsed['@graph'].find((node: { '@type': string }) => node['@type'] === 'ItemList');
    expect(courseListNode).toBeDefined();
    expect(courseListNode.itemListElement).toHaveLength(siteConfig.courses.length);
    expect(courseListNode.itemListElement[0].item['@type']).toBe('Course');

    const faqNode = parsed['@graph'].find((node: { '@type': string }) => node['@type'] === 'FAQPage');
    expect(faqNode).toBeDefined();
    expect(faqNode.mainEntity).toHaveLength(siteConfig.faqs.length);
    expect(faqNode.mainEntity[0]['@type']).toBe('Question');
  });
});

describe('PricingPage Component', () => {
  it('renders pricing heading, all 3 editable SGD tiers, and the trial enquiry section', () => {
    render(<PricingPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: siteConfig.pricing.headline })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: '1-on-1 Trial & Consultation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Small-Group Weekly Tuition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '1-on-1 Private Mentorship' })).toBeInTheDocument();

    expect(screen.getByText('S$40')).toBeInTheDocument();
    expect(screen.getByText('S$280')).toBeInTheDocument();
    expect(screen.getByText('S$75')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(document.getElementById('trial-enquiry')).toBeInTheDocument();
  });
});

describe('CookiesPage & CookiePreferencesControl', () => {
  it('renders standard Cookie Policy sections, reference table, and interactive preference control', () => {
    window.localStorage.removeItem('basecase_cookie_consent');
    render(<CookiesPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('basecase_cookie_consent')).toBeInTheDocument();
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('No preference saved yet');

    fireEvent.click(screen.getByRole('button', { name: /accept all cookies/i }));
    expect(window.localStorage.getItem('basecase_cookie_consent')).toBe('accepted');
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('Accepted All');

    fireEvent.click(screen.getByRole('button', { name: /essential cookies only/i }));
    expect(window.localStorage.getItem('basecase_cookie_consent')).toBe('declined');
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('Essential Only');

    fireEvent.click(screen.getByRole('button', { name: /reset preference/i }));
    expect(window.localStorage.getItem('basecase_cookie_consent')).toBeNull();
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('No preference saved yet');
  });

  it('syncs CookiePreferencesControl updates directly with stored choice', () => {
    window.localStorage.setItem('basecase_cookie_consent', 'accepted');
    render(<CookiePreferencesControl />);
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('Accepted All');
    window.localStorage.removeItem('basecase_cookie_consent');
  });
});

describe('PrivacyPage Component', () => {
  it('renders Singapore PDPA Privacy Policy sections, contact links, /cookies links, and preference control', () => {
    window.localStorage.removeItem('basecase_cookie_consent');
    render(<PrivacyPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 2, name: /1\. Personal Data We Collect/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /4\. Retention, Access, Correction & Withdrawal/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /cookie policy/i })[0]).toHaveAttribute('href', '/cookies');
    expect(screen.getByRole('link', { name: siteConfig.brand.contact.email })).toHaveAttribute(
      'href',
      `mailto:${siteConfig.brand.contact.email}`
    );
    expect(screen.getByRole('link', { name: siteConfig.brand.contact.phoneDisplay })).toHaveAttribute(
      'href',
      siteConfig.brand.contact.whatsappUrl
    );
    expect(screen.getByTestId('cookie-consent-status')).toHaveTextContent('No preference saved yet');
  });
});

describe('resolveSectionHref Helper', () => {
  it('preserves bare hash hrefs on the homepage and when pathname is null', () => {
    expect(resolveSectionHref('#courses', '/')).toBe('#courses');
    expect(resolveSectionHref('#main-content', '/')).toBe('#main-content');
    expect(resolveSectionHref('#trial-enquiry', '/')).toBe('#trial-enquiry');
    expect(resolveSectionHref('#courses', null)).toBe('#courses');
    expect(resolveSectionHref('#main-content', null)).toBe('#main-content');
  });

  it('resolves section links back to homepage paths on /cookies and /privacy', () => {
    for (const subpage of ['/cookies', '/privacy']) {
      expect(resolveSectionHref('#main-content', subpage)).toBe('/');
      expect(resolveSectionHref('#courses', subpage)).toBe('/#courses');
      expect(resolveSectionHref('#how-learning-works', subpage)).toBe('/#how-learning-works');
      expect(resolveSectionHref('#projects', subpage)).toBe('/#projects');
      expect(resolveSectionHref('#mentors', subpage)).toBe('/#mentors');
      expect(resolveSectionHref('#faqs', subpage)).toBe('/#faqs');
      expect(resolveSectionHref('#trial-enquiry', subpage)).toBe('/#trial-enquiry');
      expect(resolveSectionHref('/pricing', subpage)).toBe('/pricing');
    }
  });

  it('keeps #trial-enquiry local on /pricing while pointing other section hashes back to homepage', () => {
    expect(resolveSectionHref('#main-content', '/pricing')).toBe('/');
    expect(resolveSectionHref('#courses', '/pricing')).toBe('/#courses');
    expect(resolveSectionHref('#mentors', '/pricing')).toBe('/#mentors');
    expect(resolveSectionHref('#trial-enquiry', '/pricing')).toBe('#trial-enquiry');
    expect(resolveSectionHref('/pricing', '/pricing')).toBe('/pricing');
  });
});
