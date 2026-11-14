import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { Header } from '@/components/layout/Header';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';
import HomePage from '@/app/page';
import {
  validateParentName,
  validateContact,
  validateStudentAge,
  validateNotes,
} from '@/lib/validation';

describe('Tier 2: Boundary & Corner Cases (E2E Boundary Verification)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  // =========================================================================
  // 1. Viewport Layout Tokens (375px Mobile vs 1280px+ Desktop)
  // =========================================================================
  describe('1. Viewport Layout Tokens & Responsive Architecture', () => {
    it('verifies mobile navigation toggle and drawer states (< 768px)', () => {
      render(<Header />);
      const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });
      const drawer = document.getElementById('mobile-navigation-drawer');

      // In mobile viewports (< 768px), button container is visible (md:hidden) and desktop nav is hidden (hidden md:flex)
      expect(menuBtn.parentElement).toHaveClass('md:hidden');
      const desktopNav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(desktopNav).toHaveClass('hidden');
      expect(desktopNav).toHaveClass('md:flex');

      // Drawer is initially hidden
      expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass('hidden');

      // Click to open mobile drawer
      fireEvent.click(menuBtn);
      expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
      expect(drawer).not.toHaveClass('hidden');
      expect(document.body.style.overflow).toBe('hidden');

      // Press Escape to close
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass('hidden');
      expect(document.body.style.overflow).toBe('');

      // Open again and click drawer link to close
      fireEvent.click(menuBtn);
      expect(document.body.style.overflow).toBe('hidden');
      const drawerLinks = drawer?.querySelectorAll('a');
      expect(drawerLinks && drawerLinks.length > 0).toBe(true);
      fireEvent.click(drawerLinks![0]);
      expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass('hidden');
      expect(document.body.style.overflow).toBe('');
    });

    it('verifies multi-column grid layouts collapse to single-column on mobile and expand on desktop', () => {
      const { container } = render(<HomePage />);

      // Hero 12-column grid
      const heroGrid = container.querySelector('#hero .grid');
      expect(heroGrid).toHaveClass('grid-cols-1');
      expect(heroGrid).toHaveClass('lg:grid-cols-12');

      // Courses 2-column grid
      const coursesGrid = container.querySelector('#courses .grid');
      expect(coursesGrid).toHaveClass('grid-cols-1');
      expect(coursesGrid).toHaveClass('lg:grid-cols-2');

      // Mentors 2-column grid
      const mentorsGrid = container.querySelector('#mentors .grid');
      expect(mentorsGrid).toHaveClass('grid-cols-1');
      expect(mentorsGrid).toHaveClass('md:grid-cols-2');

      // How Learning Works 4-column grid
      const learningGrid = container.querySelector('#how-learning-works .grid');
      expect(learningGrid).toHaveClass('grid-cols-1');
      expect(learningGrid).toHaveClass('lg:grid-cols-4');

      // Progression 4-column grid
      const progressionGrid = container.querySelector('#progression .grid');
      expect(progressionGrid).toHaveClass('grid-cols-1');
      expect(progressionGrid).toHaveClass('lg:grid-cols-4');
    });

    it('verifies that no fixed-width pixel containers exceed 375px mobile viewport without max-w constraint', () => {
      const { container } = render(<HomePage />);
      const allDivs = container.querySelectorAll('*');

      allDivs.forEach((el) => {
        const className = el.getAttribute('class') || '';
        // Match fixed w-[...px] classes that exceed 360px without max-w
        const fixedWidthMatch = className.match(/\bw-\[(\d+)px\]/);
        if (fixedWidthMatch) {
          const widthVal = parseInt(fixedWidthMatch[1], 10);
          if (widthVal > 360) {
            expect(className).toMatch(/max-w/);
          }
        }
      });
    });
  });

  // =========================================================================
  // 2. Student Age Numeric Boundaries (10 to 19 Years Old)
  // =========================================================================
  describe('2. Student Age Numeric Boundaries', () => {
    it('accepts exact lower limit (10) and upper limit (19)', () => {
      expect(validateStudentAge(10)).toBeNull();
      expect(validateStudentAge('10')).toBeNull();
      expect(validateStudentAge(19)).toBeNull();
      expect(validateStudentAge('19')).toBeNull();
    });

    it('accepts interior values between 10 and 19', () => {
      [11, 12, 13, 14, 15, 16, 17, 18].forEach((age) => {
        expect(validateStudentAge(age)).toBeNull();
        expect(validateStudentAge(String(age))).toBeNull();
      });
    });

    it('rejects values just outside boundaries: 9 and 20', () => {
      const age9Error = validateStudentAge(9);
      expect(age9Error).toMatch(/between 10 and 19 years old/i);

      const age20Error = validateStudentAge(20);
      expect(age20Error).toMatch(/between 10 and 19 years old/i);
    });

    it('rejects decimal ages as not whole numbers', () => {
      const floatAges = [9.9, 10.1, 10.5, 14.2, 18.9, 19.1, '10.5', '14.2', '19.8'];
      floatAges.forEach((fAge) => {
        const err = validateStudentAge(fAge);
        expect(err).toMatch(/valid whole number/i);
      });
    });

    it('rejects extreme negative, zero, and high out-of-range ages', () => {
      const extremeAges = [-100, -5, -1, 0, 1, 21, 50, 100, 999];
      extremeAges.forEach((eAge) => {
        expect(validateStudentAge(eAge)).toMatch(/between 10 and 19 years old/i);
      });
    });
  });

  // =========================================================================
  // 3. Whitespace Inputs & String Sanitization
  // =========================================================================
  describe('3. Whitespace Inputs & String Sanitization', () => {
    it('rejects whitespace-only strings with specific required field errors', () => {
      // Parent Name
      expect(validateParentName('   ')).toMatch(/please enter parent or guardian name/i);
      expect(validateParentName('\t\n ')).toMatch(/please enter parent or guardian name/i);

      // Student Age
      expect(validateStudentAge('   ')).toMatch(/please enter student age/i);
      expect(validateStudentAge('\t\n ')).toMatch(/please enter student age/i);

      // Contact
      const contactResult = validateContact('   ');
      expect(contactResult.isValid).toBe(false);
      expect(contactResult.error).toMatch(/please enter a contact email or singapore mobile number/i);
    });

    it('accepts valid inputs with leading and trailing whitespace', () => {
      expect(validateParentName('  Grace Hopper  ')).toBeNull();
      expect(validateStudentAge('  15  ')).toBeNull();
      const contactResult = validateContact('  91234567  ');
      expect(contactResult.isValid).toBe(true);
      expect(contactResult.type).toBe('phone');
    });
  });

  // =========================================================================
  // 4. Contact Info Regex Boundaries (SG Mobile vs RFC Email)
  // =========================================================================
  describe('4. Contact Info Regex Boundaries', () => {
    it('accepts valid Singapore 8-digit mobile numbers starting with 8 or 9', () => {
      const validNumbers = [
        '81234567',
        '91234567',
        '+65 8123 4567',
        '+65-9123-4567',
        '6591234567',
        '80000000',
        '99999999',
      ];
      validNumbers.forEach((phone) => {
        const res = validateContact(phone);
        expect(res.isValid, `Phone "${phone}" should be valid`).toBe(true);
        expect(res.type).toBe('phone');
      });
    });

    it('rejects Singapore landline numbers (prefix 6 or 3) and invalid prefixes', () => {
      const invalidPhones = ['61234567', '31234567', '71234567', '11234567'];
      invalidPhones.forEach((phone) => {
        const res = validateContact(phone);
        expect(res.isValid, `Phone "${phone}" should be rejected`).toBe(false);
        expect(res.error).toMatch(/valid email address or 8-digit singapore phone number/i);
      });
    });

    it('rejects phone numbers with length boundary violations (< 8 or > 8 digits)', () => {
      const badLengthPhones = ['8123456', '9123456', '812345678', '912345678'];
      badLengthPhones.forEach((phone) => {
        const res = validateContact(phone);
        expect(res.isValid, `Phone "${phone}" should be rejected`).toBe(false);
      });
    });

    it('accepts RFC compliant email addresses', () => {
      const validEmails = [
        'parent@example.com',
        'john.doe@domain.com.sg',
        'student+coding@school.edu.sg',
        'a@b.co',
      ];
      validEmails.forEach((email) => {
        const res = validateContact(email);
        expect(res.isValid, `Email "${email}" should be valid`).toBe(true);
        expect(res.type).toBe('email');
      });
    });

    it('rejects email addresses with leading, trailing, or consecutive dots in local part', () => {
      const invalidDotEmails = [
        '.user@domain.com',
        'user.@domain.com',
        'user..name@domain.com',
        'user@domain.com.',
        '@domain.com',
        'user@',
        'user@.com',
      ];
      invalidDotEmails.forEach((email) => {
        const res = validateContact(email);
        expect(res.isValid, `Email "${email}" should be rejected`).toBe(false);
      });
    });
  });

  // =========================================================================
  // 5. String Length Boundaries
  // =========================================================================
  describe('5. String Length Boundaries', () => {
    it('enforces parent name length boundaries (2 to 100 characters)', () => {
      expect(validateParentName('A')).toMatch(/at least 2 characters/i);
      expect(validateParentName('AB')).toBeNull(); // Boundary 2 chars
      expect(validateParentName('A'.repeat(100))).toBeNull(); // Boundary 100 chars
      expect(validateParentName('A'.repeat(101))).toMatch(/must not exceed 100 characters/i);
    });

    it('enforces optional notes length boundaries (max 500 characters)', () => {
      expect(validateNotes('')).toBeNull();
      expect(validateNotes(undefined)).toBeNull();
      expect(validateNotes('A'.repeat(500))).toBeNull();
      expect(validateNotes('A'.repeat(501))).toMatch(/must not exceed 500 characters/i);
    });
  });

  // =========================================================================
  // 6. Empty Form Submission & Sequential Focus Cascades
  // =========================================================================
  describe('6. Empty Form Submission & Sequential Focus Cascades', () => {
    it('triggers role="alert" on all 5 required fields on empty submit and focuses parentName', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      const submitBtn = screen.getByRole('button', { name: /request coding trial/i });
      await user.click(submitBtn);

      // All 5 required fields must display role="alert"
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBe(5);

      // Focus cascades to the first invalid field: parentName
      const parentNameInput = screen.getByLabelText(/parent \/ guardian name/i);
      expect(document.activeElement).toBe(parentNameInput);
    });

    it('cascades focus sequentially to contact field once parentName is corrected', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      // Fill valid name but leave others blank
      const parentNameInput = screen.getByLabelText(/parent \/ guardian name/i);
      await user.type(parentNameInput, 'Grace Hopper');

      const submitBtn = screen.getByRole('button', { name: /request coding trial/i });
      await user.click(submitBtn);

      // Focus should now advance to contact field
      const contactInput = screen.getByLabelText(/^contact info/i);
      expect(document.activeElement).toBe(contactInput);
    });
  });

  // =========================================================================
  // 7. Reduced Motion Media Query Compliance
  // =========================================================================
  describe('7. Reduced Motion Media Query Compliance', () => {
    it('verifies globals.css enforces reduced motion overrides', () => {
      const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      // Check media query presence
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');

      // Check essential reduced motion overrides
      expect(cssContent).toContain('scroll-behavior: auto !important');
      expect(cssContent).toContain('animation-duration: 0.01ms !important');
      expect(cssContent).toContain('transition-duration: 0.01ms !important');
      expect(cssContent).toContain('animation-iteration-count: 1 !important');
    });
  });
});
