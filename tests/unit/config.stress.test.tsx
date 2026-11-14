import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { siteConfig, SiteConfig } from '@/config/siteConfig';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import HomePage from '@/app/page';

/**
 * Adversarial Stress Test Harness for Central siteConfig and Consumer Components
 * 
 * Objectives:
 * 1. Verify schema strictness, invariant compliance, and negative constraints.
 * 2. Probe mutability resilience and tamper susceptibility of the singleton.
 * 3. Stress-test consumer UI components (Header, Footer, HomePage) under adversarial conditions:
 *    - Extreme input sizes (5,000+ character strings)
 *    - Unicode, multi-byte emojis, and RTL character sets
 *    - HTML / XSS injection vectors
 *    - Empty arrays and missing optional fields
 *    - Rapid state toggle / event churn
 * 4. Verify critical metadata invariants (e.g. brand.url URL parsing in layout).
 */

describe('Adversarial Stress Testing: siteConfig Invariants & Schema Strictness', () => {
  it('enforces all top-level sections exist and are non-null', () => {
    const requiredSections: (keyof SiteConfig)[] = [
      'brand',
      'navigation',
      'hero',
      'courses',
      'showcaseProjects',
      'learningStages',
      'mentors',
      'progressionStages',
      'faqs',
      'enquiryConfig',
    ];

    requiredSections.forEach((section) => {
      expect(siteConfig[section], `Missing top-level section: ${section}`).toBeDefined();
      expect(siteConfig[section], `Top-level section is null: ${section}`).not.toBeNull();
    });
  });

  it('validates brand URL is an absolute, well-formed HTTPS URL', () => {
    expect(() => new URL(siteConfig.brand.url)).not.toThrow();
    const parsed = new URL(siteConfig.brand.url);
    expect(parsed.protocol).toBe('https:');
    expect(parsed.hostname).toBe('basecase-learning-website.vercel.app');
  });

  it('validates contact details against strict communication patterns', () => {
    const { contact } = siteConfig.brand;
    
    // RFC 5322 simplified email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(contact.email).toMatch(emailRegex);

    // Singapore phone format (+65 ...)
    expect(contact.phone).toMatch(/^\+65\s?\d{4}\s?\d{4}$/);
    expect(contact.phoneDisplay).toMatch(/^\+65\s?\d{4}\s?\d{4}$/);

    // WhatsApp URL and number
    expect(contact.whatsappUrl).toMatch(/^https:\/\/wa\.me\/65\d{8}/);
    expect(contact.whatsappNumber).toBe('6593509168');
  });

  it('audits negative constraints: zero prohibited claims or fabricated endorsements', () => {
    const serializedConfig = JSON.stringify(siteConfig).toLowerCase();

    // Prohibited marketing claims & false metrics
    const prohibitedTerms = [
      '100% pass',
      'guaranteed distinction',
      'official nus partner',
      'accredited by nus',
      'ministry of education accredited',
      'official scholarship partner',
      '$99/month',
      '$500',
      '500 students enrolled',
    ];

    prohibitedTerms.forEach((term) => {
      expect(serializedConfig).not.toContain(term);
    });

    // Unconfirmed operational details must be explicitly protected
    siteConfig.courses.forEach((course) => {
      expect(course.unconfirmedDetails.scheduleNotice.toLowerCase()).toContain('consultation');
      expect(course.unconfirmedDetails.feeNotice.toLowerCase()).toContain('consultation');
      expect(course.unconfirmedDetails.disclaimer.toLowerCase()).toContain('unconfirmed');
    });
  });
});

describe('Adversarial Stress Testing: Mutability & Singleton Tamper Analysis', () => {
  let originalSnapshot: string;

  beforeEach(() => {
    originalSnapshot = JSON.stringify(siteConfig);
  });

  afterEach(() => {
    // Restore original state completely
    const parsed = JSON.parse(originalSnapshot);
    Object.assign(siteConfig, parsed);
    cleanup();
  });

  it('probes singleton mutability status (finding: object is mutable at runtime)', () => {
    // Check if siteConfig is frozen
    const isFrozen = Object.isFrozen(siteConfig);
    const isBrandFrozen = Object.isFrozen(siteConfig.brand);

    // Document current mutability reality
    // In typical JS ESM exports, plain objects are mutable unless Object.freeze is explicitly called
    expect(typeof siteConfig).toBe('object');
    
    // Attempt mutation test
    const originalName = siteConfig.brand.name;
    siteConfig.brand.name = 'Tampered Academy';
    expect(siteConfig.brand.name).toBe('Tampered Academy');

    // Restore immediately
    siteConfig.brand.name = originalName;
    expect(siteConfig.brand.name).toBe(originalName);

    // The fact that isFrozen is false reveals an architectural finding:
    // Any consumer or malicious script can mutate siteConfig at runtime.
    expect(isFrozen).toBe(false);
    expect(isBrandFrozen).toBe(false);
  });
});

describe('Adversarial Stress Testing: Consumer UI Components under Extreme Inputs', () => {
  let originalSnapshot: string;

  beforeEach(() => {
    originalSnapshot = JSON.stringify(siteConfig);
  });

  afterEach(() => {
    // Full state restore after every stress scenario
    const parsed = JSON.parse(originalSnapshot);
    Object.assign(siteConfig, parsed);
    cleanup();
  });

  it('handles empty navigation links array gracefully without throwing', () => {
    siteConfig.navigation = [];

    expect(() => {
      render(<Header />);
    }).not.toThrow();

    // Header should still render brand logo
    expect(screen.getByText('BaseCase')).toBeInTheDocument();
    // Default CTA fallback should engage
    expect(screen.getAllByRole('link', { name: /book a coding trial/i }).length).toBeGreaterThan(0);
  });

  it('handles navigation items missing all optional properties (badge, isCta, isRoadmap, tooltip)', () => {
    siteConfig.navigation = [
      { label: 'Minimal Link 1', href: '#link1' },
      { label: 'Minimal Link 2', href: '#link2' },
    ];

    expect(() => {
      render(<Header />);
    }).not.toThrow();

    expect(screen.getAllByText('Minimal Link 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Minimal Link 2').length).toBeGreaterThan(0);
  });

  it('stress tests massive string inputs (10,000+ characters) without crashing layout or page', () => {
    const hugeString = 'A'.repeat(10000);
    siteConfig.brand.name = `BaseCase ${hugeString}`;
    siteConfig.brand.description = `Description: ${hugeString}`;
    siteConfig.hero.headline = `Headline: ${hugeString}`;
    siteConfig.hero.subheadline = `Subheadline: ${hugeString}`;
    siteConfig.brand.disclaimers.universityIndependence = `Disclaimer: ${hugeString}`;

    // Test Header rendering with giant brand name
    expect(() => {
      render(<Header />);
    }).not.toThrow();
    cleanup();

    // Test Footer rendering with giant description & disclaimers
    expect(() => {
      render(<Footer />);
    }).not.toThrow();
    cleanup();

    // Test HomePage rendering with giant hero headline & subheadline
    expect(() => {
      render(<HomePage />);
    }).not.toThrow();
  });

  it('stress tests multi-byte Unicode, Emojis, and RTL Arabic/Hebrew strings', () => {
    siteConfig.brand.name = 'BaseCase 🚀 学习编程 💻 עברית العربية';
    siteConfig.hero.headline = 'تعلم البرمجة • 🌟 First Principles 🐍';
    siteConfig.hero.badgeText = '🇸🇬 新加坡 • ⚡';
    siteConfig.brand.contact.locationDetail = 'Jurong East & Tampines 📍 日本語テスト';

    render(<Header />);
    expect(screen.getAllByLabelText(/BaseCase 🚀 学习编程 💻 עברית العربية/i).length).toBeGreaterThan(0);
    cleanup();

    render(<HomePage />);
    expect(screen.getByText('تعلم البرمجة • 🌟 First Principles 🐍')).toBeInTheDocument();
    expect(screen.getByText('🇸🇬 新加坡 • ⚡')).toBeInTheDocument();
    cleanup();

    render(<Footer />);
    expect(screen.getByText('Jurong East & Tampines 📍 日本語テスト')).toBeInTheDocument();
  });

  it('verifies JSX escaping resilience against XSS script injection payloads', () => {
    const xssPayload = '<script>alert("XSS")</script><img src=x onerror="alert(1)">';
    siteConfig.brand.name = xssPayload;
    siteConfig.hero.headline = xssPayload;

    render(<HomePage />);

    // In React, JSX safely escapes strings into HTML entities/text nodes.
    // Ensure that no actual script tag was parsed into DOM element.
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      expect(script.textContent).not.toContain('alert("XSS")');
    });

    // Verify it is rendered purely as literal text
    expect(screen.getAllByText((content) => content.includes('<script>alert("XSS")</script>')).length).toBeGreaterThan(0);
  });

  it('verifies that malformed brand.url causes URL constructor failure (critical invariant)', () => {
    // In src/app/layout.tsx: metadataBase: new URL(siteConfig.brand.url)
    // If brand.url is not a valid absolute URL, new URL throws TypeError at runtime/build-time
    const invalidUrls = [
      '',
      'basecaselearning.com',
      '//relative-url',
      'not a url',
      'http://',
    ];

    invalidUrls.forEach((badUrl) => {
      expect(() => new URL(badUrl)).toThrow(TypeError);
    });

    // Valid URLs must succeed and use HTTPS
    expect(() => new URL(siteConfig.brand.url)).not.toThrow();
    expect(new URL(siteConfig.brand.url).protocol).toBe('https:');
  });

  it('stress tests mobile menu toggle state machine under rapid click and keyboard churn', () => {
    render(<Header />);

    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i });
    const drawer = screen.getByRole('dialog', { name: /mobile navigation menu/i });

    // Rapid toggle 50 times
    for (let i = 0; i < 50; i++) {
      fireEvent.click(toggleButton);
    }
    // After 50 toggles (even number), it should be closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).toHaveClass('hidden');

    // Open once
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).not.toHaveClass('hidden');

    // Rapid Escape key presses
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(window, { key: 'Escape' });
    }
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).toHaveClass('hidden');
  });

  it('handles duplicate navigation labels without crashing render', () => {
    siteConfig.navigation = [
      { label: 'Duplicate', href: '#dup1' },
      { label: 'Duplicate', href: '#dup2' },
      { label: 'Book a coding trial', href: '#trial-enquiry', isCta: true },
    ];

    expect(() => {
      render(<Header />);
    }).not.toThrow();

    const items = screen.getAllByText('Duplicate');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it('demonstrates that missing hero primaryCta crashes HomePage (fragility finding)', () => {
    // Adversarial mutation: primaryCta removed or corrupted
    // @ts-expect-error Testing runtime vulnerability to corrupted config
    siteConfig.hero.primaryCta = undefined;

    expect(() => {
      render(<HomePage />);
    }).toThrow(TypeError);
  });
});

describe('Adversarial Stress Testing: Deep Schema Rules & Prototype Pollution', () => {
  let originalSnapshot: string;

  beforeEach(() => {
    originalSnapshot = JSON.stringify(siteConfig);
  });

  afterEach(() => {
    const parsed = JSON.parse(originalSnapshot);
    Object.assign(siteConfig, parsed);
    // Cleanup any prototype pollution
    // @ts-expect-error Cleanup
    delete Object.prototype.adversarialPollution;
    cleanup();
  });

  it('enforces strict course schema rules (slug format, status enum, non-empty goals)', () => {
    siteConfig.courses.forEach((course) => {
      expect(course.slug).toMatch(/^[a-z0-9-]+$/);
      expect(['active', 'upcoming']).toContain(course.status);
      expect(course.learningGoals.length).toBeGreaterThanOrEqual(3);
      course.learningGoals.forEach((goal) => {
        expect(goal.trim().length).toBeGreaterThan(10);
      });
      expect(course.exampleFinalProject.techStack.length).toBeGreaterThan(0);
      expect(course.unconfirmedDetails.disclaimer.length).toBeGreaterThan(20);
    });
  });

  it('enforces strict mentor schema rules (avatar 2-letter uppercase initials, NUS institution)', () => {
    siteConfig.mentors.forEach((mentor) => {
      expect(mentor.avatarPlaceholderText).toMatch(/^[A-Z]{2}$/);
      expect(mentor.institution).toContain('National University of Singapore');
      expect(mentor.specializations.length).toBeGreaterThanOrEqual(2);
      expect(mentor.bio.length).toBeGreaterThan(30);
    });
  });

  it('enforces strict progression hierarchy (4 levels, 2 available now, 2 roadmap/upcoming)', () => {
    expect(siteConfig.progressionStages).toHaveLength(4);
    const levels = siteConfig.progressionStages.map((s) => s.level);
    expect(levels).toEqual([1, 2, 3, 4]);

    const availableLevels = siteConfig.progressionStages.filter((s) => s.isAvailableNow).map((s) => s.level);
    expect(availableLevels).toEqual([1, 2]);

    const roadmapLevels = siteConfig.progressionStages.filter((s) => !s.isAvailableNow).map((s) => s.level);
    expect(roadmapLevels).toEqual([3, 4]);

    const tuition = siteConfig.progressionStages.find((s) => s.level === 4);
    expect(tuition?.title).toContain('Academic Tuition');
    expect(tuition?.isAvailableNow).toBe(false);
  });

  it('resists prototype pollution attacks without leaking inherited properties into config keys', () => {
    // Attempt prototype pollution
    // @ts-expect-error Adversarial injection
    Object.prototype.adversarialPollution = 'malicious_payload';

    // Verify siteConfig hasOwnProperty checks or known keys are unaffected
    const configKeys = Object.keys(siteConfig);
    expect(configKeys).not.toContain('adversarialPollution');

    // Rendering should still succeed without crashing
    expect(() => {
      render(<Header />);
      render(<Footer />);
      render(<HomePage />);
    }).not.toThrow();
  });

  it('verifies deep freeze resilience blueprint prevents runtime corruption', () => {
    function deepFreeze<T extends object>(obj: T): Readonly<T> {
      Object.keys(obj).forEach((prop) => {
        const val = (obj as Record<string, unknown>)[prop];
        if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
          deepFreeze(val);
        }
      });
      return Object.freeze(obj);
    }

    const clonedConfig = JSON.parse(JSON.stringify(siteConfig));
    const frozenConfig = deepFreeze(clonedConfig);

    expect(Object.isFrozen(frozenConfig)).toBe(true);
    expect(Object.isFrozen(frozenConfig.brand)).toBe(true);
    expect(Object.isFrozen(frozenConfig.navigation)).toBe(true);

    // Attempting mutation in strict mode on frozen clone throws TypeError
    expect(() => {
      (frozenConfig as { brand: { name: string } }).brand.name = 'Hacked Name';
    }).toThrow(TypeError);
  });
});

