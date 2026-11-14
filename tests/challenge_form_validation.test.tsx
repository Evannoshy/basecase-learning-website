import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';
import {
  validateParentName,
  validateContact,
  validateStudentAge,
  validateCodingExperience,
  validatePreferredCourse,
  validateNotes,
  validateEnquiryForm,
} from '@/lib/validation';
import { siteConfig } from '@/config/siteConfig';

describe('Empirical Challenge: Form Validation Boundaries & Accessibility Stress Harness', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // =========================================================================
  // SUITE 1: PARENT NAME BOUNDARIES & UNICODE CHARACTER SETS
  // =========================================================================
  describe('1. Parent Name Validation Boundaries', () => {
    it('accepts multi-lingual Unicode names with accents, hanzi, tamil, and hyphens', () => {
      const validUnicodeNames = [
        'Tan Ah Kow (陈亚狗)',
        'Dr. Jean-Luc Müller',
        'Nurul Huda bte Mohd Ali',
        'S. Vijayakumar (விஜயகுமார்)',
        "Chloë O'Connor-Smith",
        'Renée Dupuis',
        'Aarav Patel (आराव)',
        'Lee Kuan Yew',
        'Mary-Jane Watson-Parker',
      ];

      validUnicodeNames.forEach((name) => {
        const error = validateParentName(name);
        expect(error, `Expected "${name}" to be accepted, but got: ${error}`).toBeNull();
      });
    });

    it('rejects single character names (< 2 chars)', () => {
      const singleCharInputs = ['A', 'Z', '9', ' ', ' T ', '\tX\n'];
      singleCharInputs.forEach((input) => {
        const error = validateParentName(input);
        expect(error, `Expected single char "${input}" to be rejected`).not.toBeNull();
        expect(error).toMatch(/at least 2 characters|please enter/i);
      });
    });

    it('rejects 200+ character names and tests strict 100-character boundary', () => {
      // Exactly 2 chars -> accepted
      expect(validateParentName('Bo')).toBeNull();
      expect(validateParentName('Li')).toBeNull();

      // Exactly 100 chars -> accepted
      const name100 = 'A'.repeat(100);
      expect(validateParentName(name100)).toBeNull();

      // Exactly 101 chars -> rejected
      const name101 = 'A'.repeat(101);
      const error101 = validateParentName(name101);
      expect(error101).toMatch(/must not exceed 100 characters/i);

      // 200+ chars -> rejected
      const name200 = 'A'.repeat(200);
      const error200 = validateParentName(name200);
      expect(error200).toMatch(/must not exceed 100 characters/i);

      const name350 = 'Tan '.repeat(70); // 280 chars
      const error350 = validateParentName(name350);
      expect(error350).toMatch(/must not exceed 100 characters/i);
    });

    it('rejects empty, whitespace-only, and falsy inputs', () => {
      expect(validateParentName('')).toMatch(/please enter/i);
      expect(validateParentName('   ')).toMatch(/please enter/i);
      expect(validateParentName('\n\t  ')).toMatch(/please enter/i);
      // @ts-expect-error test undefined
      expect(validateParentName(undefined)).toMatch(/please enter/i);
      // @ts-expect-error test null
      expect(validateParentName(null)).toMatch(/please enter/i);
    });
  });

  // =========================================================================
  // SUITE 2: CONTACT FIELD MATRIX (SINGAPORE PHONES & RFC EMAILS)
  // =========================================================================
  describe('2. Contact Field Stress Testing: SG Phone & Email Oracles', () => {
    it('accepts all specified Singapore phone permutations (81234567, 91234567, +65 81234567, +6591234567, 65 91234567)', () => {
      const validSgPhones = [
        '81234567',
        '91234567',
        '+65 81234567',
        '+6591234567',
        '65 91234567',
        '6581234567',
        '+65-8123-4567',
        '+65 9123 4567',
        '+65-9876-5432',
        '(65) 9123 4567',
        ' 81234567 ',
        ' 91234567 ',
        '8999 0000',
        '9000-1111',
      ];

      validSgPhones.forEach((phone) => {
        const result = validateContact(phone);
        expect(
          result.isValid,
          `Expected valid SG phone "${phone}" to pass, but got error: ${result.error}`
        ).toBe(true);
        expect(result.type).toBe('phone');
      });
    });

    it('rejects invalid phones (12345678, 71234567, 8123456, wrong country codes, invalid lengths)', () => {
      const invalidPhones = [
        '12345678', // Starts with 1 (invalid)
        '71234567', // Starts with 7 (invalid)
        '8123456', // 7 digits (too short)
        '+65 12345678', // SG prefix with starting digit 1
        '+65 71234567', // SG prefix with starting digit 7
        '812345678', // 9 digits (too long)
        '8123', // 4 digits
        '01234567', // Starts with 0
        '+60 12345678', // Malaysian prefix
        '+1 800 123 4567', // US toll-free
        '8123456a', // Alphanumeric
        'phone: 81234567', // Text prefix
      ];

      invalidPhones.forEach((phone) => {
        const result = validateContact(phone);
        expect(
          result.isValid,
          `Expected phone "${phone}" to fail, but it passed as type: ${result.type}`
        ).toBe(false);
        expect(result.error).toMatch(/valid email address or 8-digit Singapore phone/i);
      });
    });

    it('accepts valid RFC email formats across standard domains', () => {
      const validEmails = [
        'parent@gmail.com',
        'student+trial@school.edu.sg',
        'user.name-123@domain.co.uk',
        'alex@basecaselearning.com',
        'first.last@nus.edu.sg',
        'contact_me@company.org',
        'inquiry@sub.domain.edu.sg',
      ];

      validEmails.forEach((email) => {
        const result = validateContact(email);
        expect(
          result.isValid,
          `Expected email "${email}" to pass, but got error: ${result.error}`
        ).toBe(true);
        expect(result.type).toBe('email');
      });
    });

    it('rejects malformed email formats (test@, @test.com, test@.com, spaces, missing TLD)', () => {
      const invalidEmails = [
        'test@',
        '@test.com',
        'test@.com',
        'test',
        'test@domain',
        'test@domain..com',
        'test space@domain.com',
        'test@domain space.com',
        '@',
        'user@',
        '.user@domain.com',
      ];

      invalidEmails.forEach((email) => {
        const result = validateContact(email);
        expect(
          result.isValid,
          `Expected invalid email "${email}" to fail, but it was marked valid`
        ).toBe(false);
      });
    });
  });

  // =========================================================================
  // SUITE 3: STUDENT AGE BOUNDARIES & TYPE HARDENING
  // =========================================================================
  describe('3. Student Age Boundary Stress Testing', () => {
    it('accepts boundary ages: exactly 10 and exactly 19 inclusive (numeric and string)', () => {
      const validAges = [10, 11, 14, 15, 18, 19, '10', '14', '19'];
      validAges.forEach((age) => {
        const error = validateStudentAge(age);
        expect(error, `Expected age ${age} to be accepted, but got: ${error}`).toBeNull();
      });
    });

    it('rejects boundary outliers: age 9 and age 20', () => {
      const age9Error = validateStudentAge(9);
      expect(age9Error).toMatch(/between 10 and 19 years old/i);

      const age9StrError = validateStudentAge('9');
      expect(age9StrError).toMatch(/between 10 and 19 years old/i);

      const age20Error = validateStudentAge(20);
      expect(age20Error).toMatch(/between 10 and 19 years old/i);

      const age20StrError = validateStudentAge('20');
      expect(age20StrError).toMatch(/between 10 and 19 years old/i);
    });

    it('rejects negative numbers, zero, and extreme age values', () => {
      const extremeAges = [-1, -10, 0, 1, 5, 21, 50, 99, 1000];
      extremeAges.forEach((age) => {
        const error = validateStudentAge(age);
        expect(error, `Expected extreme age ${age} to be rejected`).not.toBeNull();
        expect(error).toMatch(/between 10 and 19 years old/i);
      });
    });

    it('rejects non-numeric strings, fractional numbers, and empty inputs', () => {
      const invalidAgeInputs = [
        'abc',
        'fourteen',
        '14.5',
        '10.2',
        10.5,
        14.8,
        'NaN',
        'Infinity',
        '',
        '   ',
        null,
        undefined,
      ];

      invalidAgeInputs.forEach((input) => {
        // @ts-expect-error testing untyped edge cases
        const error = validateStudentAge(input);
        expect(error, `Expected input ${String(input)} to be rejected`).not.toBeNull();
        expect(error).toMatch(/valid whole number|please enter/i);
      });
    });
  });

  // =========================================================================
  // SUITE 4: PREFERRED COURSE & EXPERIENCE DROPDOWN VALIDATION
  // =========================================================================
  describe('4. Preferred Course & Experience Tampering Protection', () => {
    it('accepts all configured course preferences and experience levels from siteConfig', () => {
      siteConfig.enquiryConfig.coursePreferences.forEach((course) => {
        expect(validatePreferredCourse(course)).toBeNull();
      });

      siteConfig.enquiryConfig.experienceLevels.forEach((exp) => {
        expect(validateCodingExperience(exp)).toBeNull();
      });
    });

    it('rejects unlisted or manipulated course values', () => {
      const unlistedCourses = [
        'Advanced Quantum Computing',
        'Master Degree in Machine Learning',
        'Hacking 101: Penetration Testing',
        '<script>alert("XSS")</script>',
        'Select preferred course...',
        'null',
        'undefined',
        '--',
      ];

      unlistedCourses.forEach((badCourse) => {
        const error = validatePreferredCourse(badCourse);
        expect(error, `Expected course "${badCourse}" to be rejected`).toMatch(
          /valid course option from the list/i
        );
      });
    });

    it('rejects unlisted or manipulated coding experience levels', () => {
      const unlistedExp = [
        '10 Years Senior Staff Engineer',
        'PhD Computer Science NUS',
        '<script>stealCookies()</script>',
        'Unknown Level',
      ];

      unlistedExp.forEach((badExp) => {
        const error = validateCodingExperience(badExp);
        expect(error, `Expected exp "${badExp}" to be rejected`).toMatch(
          /valid experience option from the list/i
        );
      });
    });

    it('rejects empty course and experience selections', () => {
      expect(validatePreferredCourse('')).toMatch(/select a preferred course/i);
      expect(validatePreferredCourse('   ')).toMatch(/select a preferred course/i);
      expect(validateCodingExperience('')).toMatch(/select student's coding experience/i);
      expect(validateCodingExperience('   ')).toMatch(/select student's coding experience/i);
    });
  });

  // =========================================================================
  // SUITE 5: ACCESSIBILITY & FOCUS MANAGEMENT ORACLES (COMPONENT LEVEL)
  // =========================================================================
  describe('5. Accessibility Oracles: Empty Submission, Focus Transfer & role="alert"', () => {
    it('on empty input submission: shifts keyboard focus to first invalid input and renders role="alert" on all invalid fields', async () => {
      render(<TrialEnquiryForm />);

      const submitButton = screen.getByRole('button', { name: /request coding trial/i });
      fireEvent.click(submitButton);

      // Oracle 1: Focus MUST shift to parentName (the first invalid field)
      const nameInput = screen.getByLabelText(/parent \/ guardian name/i);
      await waitFor(() => {
        expect(document.activeElement).toBe(nameInput);
      });

      // Oracle 2: All invalid fields must expose role="alert"
      const alertElements = screen.getAllByRole('alert');
      expect(alertElements.length).toBe(5); // parentName, contact, studentAge, codingExperience, preferredCourse

      // Oracle 3: Each field must have aria-invalid="true" and aria-describedby pointing to the alert id
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'enquiry-parentName-error');

      const contactInput = screen.getByLabelText(/^contact info/i);
      expect(contactInput).toHaveAttribute('aria-invalid', 'true');
      expect(contactInput).toHaveAttribute('aria-describedby', 'enquiry-contact-error');

      const ageInput = screen.getByLabelText(/student age \(10–19\)/i);
      expect(ageInput).toHaveAttribute('aria-invalid', 'true');
      expect(ageInput).toHaveAttribute('aria-describedby', 'enquiry-studentAge-error');

      const expSelect = screen.getByLabelText(/coding experience/i);
      expect(expSelect).toHaveAttribute('aria-invalid', 'true');
      expect(expSelect).toHaveAttribute('aria-describedby', 'enquiry-codingExperience-error');

      const courseSelect = screen.getByLabelText(/preferred course \/ interest/i);
      expect(courseSelect).toHaveAttribute('aria-invalid', 'true');
      expect(courseSelect).toHaveAttribute('aria-describedby', 'enquiry-preferredCourse-error');
    });

    it('cascades focus sequentially to the next invalid field when earlier fields are valid', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      const nameInput = screen.getByLabelText(/parent \/ guardian name/i);
      const contactInput = screen.getByLabelText(/^contact info/i);
      const ageInput = screen.getByLabelText(/student age \(10–19\)/i);
      const expSelect = screen.getByLabelText(/coding experience/i);
      const courseSelect = screen.getByLabelText(/preferred course \/ interest/i);
      const notesInput = screen.getByLabelText(/additional notes or questions/i);
      const submitButton = screen.getByRole('button', { name: /request coding trial/i });

      // Step A: Provide valid parentName -> Focus must move to contact
      await user.type(nameInput, 'Tan Ah Kow (陈亚狗)');
      await user.click(submitButton);
      await waitFor(() => {
        expect(document.activeElement).toBe(contactInput);
      });

      // Step B: Provide valid contact -> Focus must move to studentAge
      await user.type(contactInput, '+65 81234567');
      await user.click(submitButton);
      await waitFor(() => {
        expect(document.activeElement).toBe(ageInput);
      });

      // Step C: Provide valid studentAge -> Focus must move to codingExperience
      await user.type(ageInput, '14');
      await user.click(submitButton);
      await waitFor(() => {
        expect(document.activeElement).toBe(expSelect);
      });

      // Step D: Select valid codingExperience -> Focus must move to preferredCourse
      await user.selectOptions(expSelect, 'Complete Beginner (Never coded before)');
      await user.click(submitButton);
      await waitFor(() => {
        expect(document.activeElement).toBe(courseSelect);
      });

      // Step E: Select valid course, but make notes > 500 chars -> Focus must move to notes
      await user.selectOptions(courseSelect, 'Beginner Python');
      // Fire change directly with 505 chars
      fireEvent.change(notesInput, { target: { value: 'Z'.repeat(505) } });
      await user.click(submitButton);
      await waitFor(() => {
        expect(document.activeElement).toBe(notesInput);
      });
      expect(notesInput).toHaveAttribute('aria-invalid', 'true');
      expect(
        screen.getByText(/notes must not exceed 500 characters/i).closest('[role="alert"]')
      ).toBeInTheDocument();
    });

    it('interactively verifies Unicode names and rejects single-character / 200+ char names on blur', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      const nameInput = screen.getByLabelText(/parent \/ guardian name/i);

      // Case A: Unicode name "Dr. Jean-Luc Müller"
      await user.type(nameInput, 'Dr. Jean-Luc Müller');
      fireEvent.blur(nameInput);
      expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument();
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');

      // Case B: Single character "A"
      await user.clear(nameInput);
      await user.type(nameInput, 'A');
      fireEvent.blur(nameInput);
      const singleCharAlert = await screen.findByRole('alert');
      expect(singleCharAlert).toHaveTextContent(/at least 2 characters/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');

      // Case C: 200+ characters name
      await user.clear(nameInput);
      fireEvent.change(nameInput, { target: { value: 'Müller '.repeat(35) } }); // > 200 chars
      fireEvent.blur(nameInput);
      const longNameAlert = await screen.findByRole('alert');
      expect(longNameAlert).toHaveTextContent(/must not exceed 100 characters/i);
    });

    it('interactively validates contact field for valid phones vs invalid phones and emails', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      const contactInput = screen.getByLabelText(/^contact info/i);

      // Valid phone: 65 91234567
      await user.type(contactInput, '65 91234567');
      fireEvent.blur(contactInput);
      expect(screen.queryByText(/please enter a valid email address or 8-digit/i)).not.toBeInTheDocument();

      // Invalid phone: 12345678
      await user.clear(contactInput);
      await user.type(contactInput, '12345678');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/8-digit singapore phone number/i);

      // Invalid phone: 71234567
      await user.clear(contactInput);
      await user.type(contactInput, '71234567');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/8-digit singapore phone number/i);

      // Invalid phone: 8123456 (7 digits)
      await user.clear(contactInput);
      await user.type(contactInput, '8123456');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/8-digit singapore phone number/i);

      // Valid phone: +6591234567
      await user.clear(contactInput);
      await user.type(contactInput, '+6591234567');
      fireEvent.blur(contactInput);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      // Invalid email: test@
      await user.clear(contactInput);
      await user.type(contactInput, 'test@');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/valid email address or 8-digit/i);

      // Invalid email: @test.com
      await user.clear(contactInput);
      await user.type(contactInput, '@test.com');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/valid email address or 8-digit/i);

      // Invalid email: test@.com
      await user.clear(contactInput);
      await user.type(contactInput, 'test@.com');
      fireEvent.blur(contactInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/valid email address or 8-digit/i);

      // Valid RFC email
      await user.clear(contactInput);
      await user.type(contactInput, 'parent.trial@example.com');
      fireEvent.blur(contactInput);
      expect(screen.queryByText(/valid email address or 8-digit/i)).not.toBeInTheDocument();
    });

    it('interactively verifies student age boundaries (9 rejected, 10 accepted, 19 accepted, 20 rejected, non-numeric)', async () => {
      const user = userEvent.setup();
      render(<TrialEnquiryForm />);

      const ageInput = screen.getByLabelText(/student age \(10–19\)/i);

      // Age 9 -> rejected
      await user.type(ageInput, '9');
      fireEvent.blur(ageInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/between 10 and 19 years old/i);

      // Age 10 -> accepted
      await user.clear(ageInput);
      await user.type(ageInput, '10');
      fireEvent.blur(ageInput);
      expect(screen.queryByText(/between 10 and 19/i)).not.toBeInTheDocument();

      // Age 19 -> accepted
      await user.clear(ageInput);
      await user.type(ageInput, '19');
      fireEvent.blur(ageInput);
      expect(screen.queryByText(/between 10 and 19/i)).not.toBeInTheDocument();

      // Age 20 -> rejected
      await user.clear(ageInput);
      await user.type(ageInput, '20');
      fireEvent.blur(ageInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/between 10 and 19 years old/i);

      // Negative number -> rejected
      await user.clear(ageInput);
      await user.type(ageInput, '-5');
      fireEvent.blur(ageInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/between 10 and 19 years old/i);

      // Non-numeric string (browsers sanitize type="number" input to empty string)
      await user.clear(ageInput);
      fireEvent.change(ageInput, { target: { value: 'fourteen' } });
      fireEvent.blur(ageInput);
      expect(screen.getByRole('alert')).toHaveTextContent(/please enter student age|valid whole number/i);
    });
  });

  // =========================================================================
  // SUITE 6: DEEP ADVERSARIAL MATRIX & FUZZING ORACLES
  // =========================================================================
  describe('6. Deep Adversarial Matrix & Fuzzing Oracles', () => {
    it('exhaustively enforces Singapore mobile prefix separation (8 & 9 vs 3, 6, 1, 2, 4, 5, 7, 0)', () => {
      // Valid prefixes (Mobile: 8 & 9)
      const validMobileSamples = [
        '80000000',
        '89999999',
        '90000000',
        '99999999',
        '+65 8123 4567',
        '+65 9876 5432',
        '(65) 8111 2222',
        '+65-9222-3333',
        '+65.8333.4444',
      ];
      validMobileSamples.forEach((phone) => {
        const result = validateContact(phone);
        expect(result.isValid, `Valid mobile sample "${phone}" failed`).toBe(true);
        expect(result.type).toBe('phone');
      });

      // Invalid prefixes: Landline 3 (VoIP) and 6 (PSTN), plus unassigned/corporate 1, 2, 4, 5, 7, 0
      const invalidPrefixSamples = [
        '31234567',
        '+65 3123 4567',
        '30000000',
        '61234567',
        '+65 6123 4567',
        '65555555', // Starts with 6 (landline) even though digits are 65...
        '69999999',
        '12345678',
        '+65 1234 5678',
        '21234567',
        '41234567',
        '51234567',
        '71234567',
        '01234567',
      ];
      invalidPrefixSamples.forEach((phone) => {
        const result = validateContact(phone);
        expect(
          result.isValid,
          `Invalid prefix sample "${phone}" should have been rejected`
        ).toBe(false);
      });
    });

    it('exhaustively enforces email dot placement RFC rules (leading, trailing, consecutive dots)', () => {
      // Must reject invalid dot placements
      const invalidDotEmails = [
        '.user@domain.com',
        'user.@domain.com',
        'user..name@domain.com',
        'user...name@domain.com',
        '.user.name@domain.com',
        'user.name.@domain.com',
        'user@domain..com',
        'user@.domain.com',
        'user@domain.com.',
      ];
      invalidDotEmails.forEach((email) => {
        const result = validateContact(email);
        expect(
          result.isValid,
          `Malformed dot email "${email}" should have been rejected`
        ).toBe(false);
      });

      // Must accept valid single internal dots
      const validDotEmails = [
        'first.last@domain.com',
        'a.b.c.d@domain.edu.sg',
        'user.name+tag@sub.domain.co.uk',
      ];
      validDotEmails.forEach((email) => {
        const result = validateContact(email);
        expect(
          result.isValid,
          `Valid dot email "${email}" should have been accepted`
        ).toBe(true);
        expect(result.type).toBe('email');
      });
    });

    it('exhaustively tests student age boundary permutations and whitespace trimming', () => {
      // Whitespace and empty inputs must ask for student age
      expect(validateStudentAge('')).toMatch(/please enter student age/i);
      expect(validateStudentAge('   ')).toMatch(/please enter student age/i);
      expect(validateStudentAge('\t\n  ')).toMatch(/please enter student age/i);

      // Padded strings around valid numbers must be accepted
      expect(validateStudentAge(' 10 ')).toBeNull();
      expect(validateStudentAge(' 19 ')).toBeNull();
      expect(validateStudentAge(' 14 ')).toBeNull();

      // Leading zero numbers within bounds
      expect(validateStudentAge('010')).toBeNull();
      expect(validateStudentAge('019')).toBeNull();

      // Integer bounds: 10 to 19 inclusive
      expect(validateStudentAge(10)).toBeNull();
      expect(validateStudentAge(19)).toBeNull();
      expect(validateStudentAge('10')).toBeNull();
      expect(validateStudentAge('19')).toBeNull();

      // Just outside boundaries
      expect(validateStudentAge(9)).toMatch(/between 10 and 19/i);
      expect(validateStudentAge('9')).toMatch(/between 10 and 19/i);
      expect(validateStudentAge(20)).toMatch(/between 10 and 19/i);
      expect(validateStudentAge('20')).toMatch(/between 10 and 19/i);

      // Floats and decimals must be rejected as whole numbers
      const floatAges = [9.9, 10.1, 10.5, 14.2, 18.9, 19.1, '10.5', '14.2', '19.8'];
      floatAges.forEach((fAge) => {
        const error = validateStudentAge(fAge);
        expect(error, `Float age "${fAge}" must be rejected as not whole number`).toMatch(
          /valid whole number/i
        );
      });

      // Extreme values
      const extremeAges = [-100, -1, 0, 1, 21, 50, 100, 9999];
      extremeAges.forEach((eAge) => {
        expect(validateStudentAge(eAge)).toMatch(/between 10 and 19/i);
      });
    });
  });

  // =========================================================================
  // SUITE 7: STATE MACHINE, HONESTY PROTOCOL & ACCESSIBILITY ORACLES
  // =========================================================================
  describe('7. State Machine, Honesty Protocol & Accessibility Oracles', () => {
    it('verifies pre-launch preview mode allows editing and preserves form inputs without data loss', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 200,
        json: async () => ({
          success: false,
          status: 'BACKEND_NOT_CONFIGURED',
          message: siteConfig.enquiryConfig.demoModeNotice,
          previewPayload: {
            parentName: 'Sarah Jenkins',
            contact: '+65 9123 4567',
            studentAge: 15,
            codingExperience: 'Complete Beginner (Never coded before)',
            preferredCourse: 'Beginner Python',
            notes: 'Looking forward to the trial session.',
          },
        }),
      });

      render(<TrialEnquiryForm />);

      // Fill in valid details
      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Sarah Jenkins');
      await user.type(screen.getByLabelText(/^contact info/i), '+65 9123 4567');
      await user.type(screen.getByLabelText(/student age/i), '15');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Complete Beginner (Never coded before)'
      );
      await user.selectOptions(
        screen.getByLabelText(/preferred course/i),
        'Beginner Python'
      );
      await user.type(
        screen.getByLabelText(/additional notes or questions/i),
        'Looking forward to the trial session.'
      );

      // Submit form
      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      // Verify preview state
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /pre-launch mode — client validation successful/i,
          })
        ).toBeInTheDocument();
      });

      // Verify NO false success
      expect(screen.queryByText(/trial enquiry received/i)).not.toBeInTheDocument();

      // Click "Edit Enquiry Details"
      const editButton = screen.getByRole('button', { name: /edit enquiry details/i });
      await user.click(editButton);

      // Verify returned to form with inputs intact
      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('Sarah Jenkins');
      expect(screen.getByLabelText(/^contact info/i)).toHaveValue('+65 9123 4567');
      expect(screen.getByLabelText(/student age/i)).toHaveValue(15);
      expect(screen.getByLabelText(/coding experience/i)).toHaveValue(
        'Complete Beginner (Never coded before)'
      );
      expect(screen.getByLabelText(/preferred course/i)).toHaveValue('Beginner Python');
      expect(screen.getByLabelText(/additional notes or questions/i)).toHaveValue(
        'Looking forward to the trial session.'
      );
    });

    it('verifies reset form action restores form to pristine initial state', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 200,
        json: async () => ({
          success: false,
          status: 'BACKEND_NOT_CONFIGURED',
          message: siteConfig.enquiryConfig.demoModeNotice,
          previewPayload: {
            parentName: 'Sarah Jenkins',
            contact: '+65 9123 4567',
            studentAge: 15,
            codingExperience: 'Complete Beginner (Never coded before)',
            preferredCourse: 'Beginner Python',
          },
        }),
      });

      render(<TrialEnquiryForm />);

      // Fill in details
      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Sarah Jenkins');
      await user.type(screen.getByLabelText(/^contact info/i), '+65 9123 4567');
      await user.type(screen.getByLabelText(/student age/i), '15');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Complete Beginner (Never coded before)'
      );
      await user.selectOptions(
        screen.getByLabelText(/preferred course/i),
        'Beginner Python'
      );

      // Submit
      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /pre-launch mode — client validation successful/i,
          })
        ).toBeInTheDocument();
      });

      // Click "Reset Form"
      const resetButton = screen.getByRole('button', { name: /reset form/i });
      await user.click(resetButton);

      // Form should be blank
      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('');
      expect(screen.getByLabelText(/^contact info/i)).toHaveValue('');
      expect(screen.getByLabelText(/student age/i)).toHaveValue(null);
      expect(screen.getByLabelText(/coding experience/i)).toHaveValue('');
      expect(screen.getByLabelText(/preferred course/i)).toHaveValue('');
    });
  });
});

