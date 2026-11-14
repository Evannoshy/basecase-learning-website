import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactCta } from '@/components/layout/FloatingContactCta';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@/config/siteConfig';

describe('Header Component', () => {
  it('renders brand identity and logo', () => {
    render(<Header />);
    const brandLinks = screen.getAllByRole('link', { name: new RegExp(siteConfig.brand.name, 'i') });
    expect(brandLinks.length).toBeGreaterThan(0);
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
});

describe('Footer Component', () => {
  it('renders contentinfo landmark and brand summary', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getAllByText(siteConfig.brand.name).length).toBeGreaterThan(0);
    expect(screen.getByText(siteConfig.brand.description)).toBeInTheDocument();
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
