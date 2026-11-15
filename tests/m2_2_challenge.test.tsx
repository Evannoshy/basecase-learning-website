import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import { Accordion } from '@/components/ui/Accordion';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { Courses } from '@/components/sections/Courses';
import { Showcase } from '@/components/sections/Showcase';
import { HowLearningWorks } from '@/components/sections/HowLearningWorks';
import { Mentors } from '@/components/sections/Mentors';
import { Progression } from '@/components/sections/Progression';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import HomePage from '@/app/page';
import { siteConfig } from '@/config/siteConfig';

describe('Empirical Challenge: Accordion Accessibility & Keyboard Interactions', () => {
  const sampleItems = [
    {
      id: 'acc-item-1',
      question: 'What is computational thinking?',
      answer: 'It is the process of breaking complex problems down into testable logic steps.',
      categoryLabel: 'Pedagogy',
    },
    {
      id: 'acc-item-2',
      question: 'Is prior coding experience required?',
      answer: 'No prior experience is necessary. We start from foundational first principles.',
      categoryLabel: 'Eligibility',
    },
    {
      id: 'acc-item-3',
      question: 'What laptop operating systems are supported?',
      answer: 'Any modern laptop running macOS, Windows 10/11, or Linux with at least 8GB RAM.',
      categoryLabel: 'Hardware',
    },
  ];

  it('renders trigger buttons wrapped inside level 3 headings with type="button"', () => {
    render(<Accordion items={sampleItems} />);

    sampleItems.forEach((item) => {
      const trigger = screen.getByRole('button', { name: new RegExp(item.question, 'i') });
      expect(trigger).toHaveAttribute('type', 'button');

      // The parent element of the button should be an h3 heading
      const heading = trigger.closest('h3');
      expect(heading).not.toBeNull();
    });
  });

  it('strictly synchronizes aria-expanded and aria-controls with panel DOM state', () => {
    render(<Accordion items={sampleItems} defaultOpenId="acc-item-1" />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const trigger2 = screen.getByRole('button', { name: new RegExp(sampleItems[1].question, 'i') });

    const panel1 = document.getElementById('faq-panel-acc-item-1');
    const panel2 = document.getElementById('faq-panel-acc-item-2');

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger1).toHaveAttribute('aria-controls', 'faq-panel-acc-item-1');
    expect(panel1).not.toBeNull();
    expect(panel1).not.toHaveAttribute('hidden');
    expect(panel1).not.toHaveClass('hidden');
    expect(panel1).toHaveAttribute('role', 'region');
    expect(panel1).toHaveAttribute('aria-labelledby', 'faq-trigger-acc-item-1');

    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-controls', 'faq-panel-acc-item-2');
    expect(panel2).not.toBeNull();
    expect(panel2).toHaveAttribute('hidden');
    expect(panel2).toHaveClass('hidden');
    expect(panel2).toHaveAttribute('role', 'region');
    expect(panel2).toHaveAttribute('aria-labelledby', 'faq-trigger-acc-item-2');
  });

  it('toggles accordion item state on Enter keydown and prevents default page behavior', () => {
    render(<Accordion items={sampleItems} defaultOpenId="acc-item-1" />);

    const trigger2 = screen.getByRole('button', { name: new RegExp(sampleItems[1].question, 'i') });
    const panel2 = document.getElementById('faq-panel-acc-item-2');

    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(panel2).toHaveAttribute('hidden');

    // Press Enter to expand
    const enterDown = fireEvent.keyDown(trigger2, { key: 'Enter', cancelable: true });
    expect(enterDown).toBe(false); // default was prevented
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(panel2).not.toHaveAttribute('hidden');
    expect(panel2).not.toHaveClass('hidden');

    // Press Enter again to collapse
    const enterCollapse = fireEvent.keyDown(trigger2, { key: 'Enter', cancelable: true });
    expect(enterCollapse).toBe(false);
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(panel2).toHaveAttribute('hidden');
  });

  it('toggles accordion item state on Space keydown and prevents default scrolling', () => {
    render(<Accordion items={sampleItems} defaultOpenId="acc-item-1" />);

    const trigger3 = screen.getByRole('button', { name: new RegExp(sampleItems[2].question, 'i') });
    const panel3 = document.getElementById('faq-panel-acc-item-3');

    expect(trigger3).toHaveAttribute('aria-expanded', 'false');
    expect(panel3).toHaveAttribute('hidden');

    // Press Space to expand
    const spaceDown = fireEvent.keyDown(trigger3, { key: ' ', cancelable: true });
    expect(spaceDown).toBe(false); // default was prevented to prevent page jump
    expect(trigger3).toHaveAttribute('aria-expanded', 'true');
    expect(panel3).not.toHaveAttribute('hidden');

    // Press Space to collapse
    const spaceCollapse = fireEvent.keyDown(trigger3, { key: ' ', cancelable: true });
    expect(spaceCollapse).toBe(false);
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');
    expect(panel3).toHaveAttribute('hidden');
  });

  it('ignores non-toggle keyboard inputs (Tab, Escape, Arrows, Alpha keys)', () => {
    render(<Accordion items={sampleItems} defaultOpenId="acc-item-1" />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const panel1 = document.getElementById('faq-panel-acc-item-1');

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    // Send irrelevant keys - state must not change
    fireEvent.keyDown(trigger1, { key: 'Tab' });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger1, { key: 'Escape' });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger1, { key: 'ArrowDown' });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger1, { key: 'ArrowUp' });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger1, { key: 'a' });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    expect(panel1).not.toHaveAttribute('hidden');
  });

  it('enforces single-open behavior when allowMultiple is false', () => {
    render(<Accordion items={sampleItems} allowMultiple={false} defaultOpenId="acc-item-1" />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const trigger2 = screen.getByRole('button', { name: new RegExp(sampleItems[1].question, 'i') });
    const trigger3 = screen.getByRole('button', { name: new RegExp(sampleItems[2].question, 'i') });

    const panel1 = document.getElementById('faq-panel-acc-item-1');
    const panel2 = document.getElementById('faq-panel-acc-item-2');
    const panel3 = document.getElementById('faq-panel-acc-item-3');

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');

    // Open item 2
    fireEvent.click(trigger2);

    // Item 2 opens, Item 1 must automatically collapse!
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');
    expect(panel1).toHaveAttribute('hidden');
    expect(panel2).not.toHaveAttribute('hidden');

    // Open item 3
    fireEvent.click(trigger3);

    // Item 3 opens, Item 2 must automatically collapse!
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(trigger3).toHaveAttribute('aria-expanded', 'true');
    expect(panel2).toHaveAttribute('hidden');
    expect(panel3).not.toHaveAttribute('hidden');

    // Click item 3 again -> collapses item 3 (0 items open)
    fireEvent.click(trigger3);
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');
    expect(panel3).toHaveAttribute('hidden');
  });

  it('supports multiple simultaneous open panels when allowMultiple is true', () => {
    render(<Accordion items={sampleItems} allowMultiple={true} defaultOpenId="acc-item-1" />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const trigger2 = screen.getByRole('button', { name: new RegExp(sampleItems[1].question, 'i') });
    const trigger3 = screen.getByRole('button', { name: new RegExp(sampleItems[2].question, 'i') });

    // Open item 2
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');

    // Open item 3
    fireEvent.click(trigger3);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger3).toHaveAttribute('aria-expanded', 'true');

    // Collapse only item 2
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(trigger3).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles rapid sequential toggle stress without desynchronization', () => {
    render(<Accordion items={sampleItems} allowMultiple={true} />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const panel1 = document.getElementById('faq-panel-acc-item-1');

    // 25 rapid toggle cycles mixing mouse clicks and Enter keys
    for (let i = 0; i < 25; i++) {
      if (i % 2 === 0) {
        fireEvent.click(trigger1);
      } else {
        fireEvent.keyDown(trigger1, { key: 'Enter' });
      }

      const shouldBeOpen = i % 2 === 0;
      expect(trigger1).toHaveAttribute('aria-expanded', shouldBeOpen ? 'true' : 'false');
      expect(panel1?.hasAttribute('hidden')).toBe(!shouldBeOpen);
    }
  });

  it('survives boundary conditions: empty array, non-matching defaultOpenId, and special characters', () => {
    // 1. Empty items array
    const { container: emptyContainer } = render(<Accordion items={[]} />);
    expect(emptyContainer.firstChild).toBeInTheDocument();

    // 2. Non-existent defaultOpenId
    render(<Accordion items={sampleItems} defaultOpenId="non-existent-id" />);
    sampleItems.forEach((item) => {
      const trigger = screen.getByRole('button', { name: new RegExp(item.question, 'i') });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    // 3. Special characters & XSS payload safety
    const adversarialItems = [
      {
        id: 'xss-1',
        question: '<script>alert("xss")</script> & "quotes"',
        answer: '<b>Escaped HTML</b> &amp; unicode: 🚀 → 💻',
      },
    ];
    render(<Accordion items={adversarialItems} defaultOpenId="xss-1" />);
    // Ensure rendered as plain text, not executed as HTML tags
    expect(screen.getByText('<script>alert("xss")</script> & "quotes"')).toBeInTheDocument();
    expect(screen.getByText('<b>Escaped HTML</b> &amp; unicode: 🚀 → 💻')).toBeInTheDocument();
  });

  it('rotates Chevron indicator icon only when item is open and marks it aria-hidden', () => {
    const { container } = render(<Accordion items={sampleItems} defaultOpenId="acc-item-1" />);

    const trigger1 = screen.getByRole('button', { name: new RegExp(sampleItems[0].question, 'i') });
    const trigger2 = screen.getByRole('button', { name: new RegExp(sampleItems[1].question, 'i') });

    const svg1 = trigger1.querySelector('svg');
    const svg2 = trigger2.querySelector('svg');

    expect(svg1).toHaveAttribute('aria-hidden', 'true');
    expect(svg2).toHaveAttribute('aria-hidden', 'true');

    expect(svg1?.getAttribute('class')).toContain('rotate-180');
    expect(svg2?.getAttribute('class')).not.toContain('rotate-180');

    // Toggle item 2 open
    fireEvent.click(trigger2);
    expect(svg2?.getAttribute('class')).toContain('rotate-180');
  });
});

describe('Empirical Challenge: Mobile Viewport (375px) Scaling & Zero Horizontal Overflow', () => {
  const srcDir = path.resolve(__dirname, '../src');

  // Helper to scan all tsx/ts files in src
  const getSourceFiles = (dir: string): string[] => {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(getSourceFiles(fullPath));
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(fullPath);
      }
    }
    return results;
  };

  it('enforces that no component declares an unconstrained fixed width > 340px', () => {
    const files = getSourceFiles(srcDir);
    const violatingClasses: { file: string; match: string }[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      // Look for arbitrary width classes like w-[350px], w-[400px], min-w-[360px]
      const matches = content.match(/(?:min-)?w-\[(\d+)px\]/g);
      if (matches) {
        matches.forEach((m) => {
          const px = parseInt(m.replace(/[^\d]/g, ''), 10);
          if (px > 340) {
            violatingClasses.push({ file: path.relative(srcDir, file), match: m });
          }
        });
      }
    }

    expect(violatingClasses).toEqual([]);
  });

  it('verifies all code blocks and pre elements provide explicit horizontal overflow containment', () => {
    const files = getSourceFiles(srcDir);
    const codeContainersWithoutOverflow: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('<pre') && !content.includes('overflow-x-auto') && !content.includes('overflow-auto')) {
        codeContainersWithoutOverflow.push(path.relative(srcDir, file));
      }
    }

    expect(codeContainersWithoutOverflow).toEqual([]);
  });

  it('verifies all 6 homepage sections render with responsive horizontal padding (px-4 or container mx-auto)', () => {
    render(<HomePage />);

    const sectionIds = [
      'hero',
      'classes',
      'mentors',
      'how-learning-works',
      'faqs',
      'trial-enquiry',
    ];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      expect(section).not.toBeNull();

      const className = section?.getAttribute('class') || '';
      const innerContainer = section?.querySelector('.max-w-7xl, .max-w-5xl, .max-w-4xl, .max-w-3xl, .mx-auto');
      const innerClass = innerContainer?.getAttribute('class') || '';

      const hasPadding =
        className.includes('px-4') ||
        innerClass.includes('px-4') ||
        className.includes('p-4') ||
        className.includes('p-6') ||
        className.includes('sm:px-6');

      expect(hasPadding).toBe(true);
    });
  });

  it('verifies Hero CTA buttons wrap vertically on mobile (flex-col sm:flex-row with w-full sm:w-auto)', () => {
    render(<Hero />);

    const primaryCta = screen.getByRole('link', { name: /book a coding trial/i });
    const secondaryCta = screen.getByRole('link', { name: /explore classes/i });

    expect(primaryCta.parentElement).toHaveClass('flex');
    expect(primaryCta.parentElement).toHaveClass('flex-col');
    expect(primaryCta.parentElement).toHaveClass('sm:flex-row');

    expect(primaryCta).toHaveClass('w-full');
    expect(primaryCta).toHaveClass('sm:w-auto');
    expect(secondaryCta).toHaveClass('w-full');
    expect(secondaryCta).toHaveClass('sm:w-auto');
  });

  it('verifies multi-card sections use single-column layouts on mobile (grid-cols-1)', () => {
    // Courses
    const { container: coursesContainer } = render(<Courses />);
    const coursesGrid = coursesContainer.querySelector('.grid');
    expect(coursesGrid?.className).toContain('grid-cols-1');
    expect(coursesGrid?.className).toContain('lg:grid-cols-2');

    // How Learning Works
    const { container: hlwContainer } = render(<HowLearningWorks />);
    const hlwGrid = hlwContainer.querySelector('.grid');
    expect(hlwGrid?.className).toContain('grid-cols-1');
    expect(hlwGrid?.className).toContain('md:grid-cols-2');

    // Mentors
    const { container: mentorsContainer } = render(<Mentors />);
    const mentorsGrid = mentorsContainer.querySelector('.grid');
    expect(mentorsGrid?.className).toContain('grid-cols-1');
    expect(mentorsGrid?.className).toContain('md:grid-cols-2');

    // Progression
    const { container: progContainer } = render(<Progression />);
    const progGrid = progContainer.querySelector('.grid');
    expect(progGrid?.className).toContain('grid-cols-1');
    expect(progGrid?.className).toContain('md:grid-cols-2');

    // Footer
    const { container: footerContainer } = render(<Footer />);
    const footerGrid = footerContainer.querySelector('.grid');
    expect(footerGrid?.className).toContain('grid-cols-1');
    expect(footerGrid?.className).toContain('md:grid-cols-2');
  });
});

describe('Empirical Challenge: CTA Scroll Anchors & Keyboard Focus Transfer', () => {
  it('confirms the physical existence of #trial-enquiry and #classes targets in the DOM', () => {
    render(<HomePage />);

    const trialEnquirySection = document.getElementById('trial-enquiry');
    expect(trialEnquirySection).toBeInTheDocument();
    expect(trialEnquirySection?.tagName.toLowerCase()).toBe('section');

    const classesSection = document.getElementById('classes');
    expect(classesSection).toBeInTheDocument();
    expect(classesSection?.tagName.toLowerCase()).toBe('section');
  });

  it('verifies every CTA button and navigation link points to a valid destination ID', () => {
    render(
      <div>
        <Header />
        <HomePage />
        <Footer />
      </div>
    );

    // Find all links whose href starts with '#'
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    expect(anchorLinks.length).toBeGreaterThanOrEqual(10);

    const brokenAnchors: { text: string; href: string }[] = [];

    anchorLinks.forEach((link) => {
      const href = link.getAttribute('href')!;
      const targetId = href.replace('#', '');
      const target = document.getElementById(targetId);

      // Note: #main-content target is in RootLayout (outside Page), tested in RootLayout test
      if (targetId !== 'main-content' && !target) {
        brokenAnchors.push({ text: link.textContent?.trim() || '', href });
      }
    });

    expect(brokenAnchors).toEqual([]);
  });

  it('confirms Hero primary CTA links to #trial-enquiry and secondary CTA links to #classes', () => {
    render(<Hero />);

    const primary = screen.getByRole('link', { name: /book a coding trial/i });
    expect(primary).toHaveAttribute('href', '#trial-enquiry');

    const secondary = screen.getByRole('link', { name: /explore classes/i });
    expect(secondary).toHaveAttribute('href', '#classes');
  });

  it('confirms Courses card CTAs both link to #trial-enquiry with clear descriptive accessible names', () => {
    render(<Courses />);

    const bookingLinks = screen.getAllByRole('link', { name: /book a trial for/i });
    expect(bookingLinks).toHaveLength(2);

    bookingLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '#trial-enquiry');
    });
  });

  it('confirms Header desktop and mobile drawer CTAs link to #trial-enquiry', () => {
    render(<Header />);

    const ctaLinks = screen.getAllByRole('link', { name: /book a coding trial/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2);

    ctaLinks.forEach((cta) => {
      expect(cta).toHaveAttribute('href', '#trial-enquiry');
    });
  });

  it('empirically probes keyboard focus transfer behavior to anchor targets', () => {
    render(
      <div>
        <Header />
        <HomePage />
        <Courses />
      </div>
    );

    const trialSection = document.getElementById('trial-enquiry');
    const classesSection = document.getElementById('classes');
    const coursesSection = document.getElementById('courses');

    expect(trialSection).not.toBeNull();
    expect(classesSection).not.toBeNull();
    expect(coursesSection).not.toBeNull();

    // Adversarial Investigation: Can a browser or screen reader programmatically focus the target section?
    // In standard DOM / W3C specs, calling .focus() on a <div> or <section> without tabIndex does NOT focus it.
    trialSection?.focus();
    const trialFocused = document.activeElement === trialSection;

    classesSection?.focus();
    const classesFocused = document.activeElement === classesSection;

    coursesSection?.focus();
    const coursesFocused = document.activeElement === coursesSection;

    // Sections currently do NOT have tabIndex={-1}
    expect(trialSection).not.toHaveAttribute('tabindex');
    expect(classesSection).not.toHaveAttribute('tabindex');
    expect(coursesSection).not.toHaveAttribute('tabindex');

    // Document empirical reality:
    // Calling .focus() on an untabindexed section does not make it activeElement
    expect(trialFocused).toBe(false);
    expect(classesFocused).toBe(false);
    expect(coursesFocused).toBe(false);

    // Verify whether interactive children exist inside #courses to receive subsequent tab navigation
    const coursesInteractive = coursesSection?.querySelectorAll('a, button, input, select, textarea');
    expect(coursesInteractive && coursesInteractive.length > 0).toBe(true);

    // In #trial-enquiry (Milestone 3 form integration):
    const trialInteractive = trialSection?.querySelectorAll('a, button, input, select, textarea');
    // Interactive form controls inside #trial-enquiry section
    expect(trialInteractive && trialInteractive.length > 0).toBe(true);
  });
});
