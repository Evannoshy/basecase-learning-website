import { describe, it, expect } from 'vitest';
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

describe('Validation Unit Tests: validateParentName', () => {
  it('rejects empty or whitespace-only parent names', () => {
    expect(validateParentName('')).toMatch(/please enter/i);
    expect(validateParentName('   ')).toMatch(/please enter/i);
    // @ts-expect-error test undefined input
    expect(validateParentName(undefined)).toMatch(/please enter/i);
  });

  it('rejects single character names (< 2 chars)', () => {
    expect(validateParentName('A')).toMatch(/at least 2 characters/i);
    expect(validateParentName(' T ')).toMatch(/at least 2 characters/i);
  });

  it('rejects names exceeding 100 characters', () => {
    const longName = 'A'.repeat(101);
    expect(validateParentName(longName)).toMatch(/must not exceed 100 characters/i);
  });

  it('accepts valid single, hyphenated, multi-word and unicode names', () => {
    expect(validateParentName('Tan Ah Kow')).toBeNull();
    expect(validateParentName('Mary-Jane Watson')).toBeNull();
    expect(validateParentName("D'Souza Peter")).toBeNull();
    expect(validateParentName('Li Wei')).toBeNull();
    expect(validateParentName('Dr. Jean-Luc Müller')).toBeNull();
    expect(validateParentName('Tan Ah Kow (陈亚狗)')).toBeNull();
  });
});

describe('Validation Unit Tests: validateContact', () => {
  it('rejects empty contact input', () => {
    const res = validateContact('');
    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/please enter/i);
  });

  it('accepts valid email addresses', () => {
    expect(validateContact('parent@gmail.com')).toEqual({ isValid: true, type: 'email' });
    expect(validateContact('student+trial@school.edu.sg')).toEqual({ isValid: true, type: 'email' });
    expect(validateContact('user.name-123@domain.co.uk')).toEqual({ isValid: true, type: 'email' });
    expect(validateContact('alex@basecaselearning.com')).toEqual({ isValid: true, type: 'email' });
  });

  it('accepts valid Singapore 8-digit phone numbers starting with 8 or 9', () => {
    expect(validateContact('81234567')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('98765432')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('8123 4567')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('+65 8123 4567')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('+65-9876-5432')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('6581234567')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('+65 89876543')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact('9000-1234')).toEqual({ isValid: true, type: 'phone' });
    expect(validateContact(' 91234567 ')).toEqual({ isValid: true, type: 'phone' });
  });

  it('rejects phone numbers starting with invalid digits (not 8 or 9)', () => {
    const res1 = validateContact('71234567');
    expect(res1.isValid).toBe(false);
    const res2 = validateContact('61234567');
    expect(res2.isValid).toBe(false);
    const res3 = validateContact('+65 31234567');
    expect(res3.isValid).toBe(false);
    const res4 = validateContact('12345678');
    expect(res4.isValid).toBe(false);
    const res5 = validateContact('+65 12345678');
    expect(res5.isValid).toBe(false);
  });

  it('rejects phone numbers with too few or too many digits', () => {
    expect(validateContact('8123456').isValid).toBe(false); // 7 digits
    expect(validateContact('812345678').isValid).toBe(false); // 9 digits
    expect(validateContact('12345').isValid).toBe(false);
  });

  it('rejects malformed email strings', () => {
    expect(validateContact('abc@').isValid).toBe(false);
    expect(validateContact('parent@').isValid).toBe(false);
    expect(validateContact('parent@domain').isValid).toBe(false);
    expect(validateContact('parent@.com').isValid).toBe(false);
    expect(validateContact('parent name@domain.com').isValid).toBe(false);
  });
});

describe('Validation Unit Tests: validateStudentAge', () => {
  it('accepts boundary ages 10 and 19 inclusive', () => {
    expect(validateStudentAge(10)).toBeNull();
    expect(validateStudentAge(19)).toBeNull();
    expect(validateStudentAge('10')).toBeNull();
    expect(validateStudentAge('19')).toBeNull();
    expect(validateStudentAge(13)).toBeNull();
    expect(validateStudentAge(15)).toBeNull();
    expect(validateStudentAge(16)).toBeNull();
    expect(validateStudentAge('14')).toBeNull();
  });

  it('rejects age below 10 or above 19', () => {
    expect(validateStudentAge(9)).toMatch(/between 10 and 19/i);
    expect(validateStudentAge('9')).toMatch(/between 10 and 19/i);
    expect(validateStudentAge(3)).toMatch(/between 10 and 19/i);
    expect(validateStudentAge(20)).toMatch(/between 10 and 19/i);
    expect(validateStudentAge(85)).toMatch(/between 10 and 19/i);
    expect(validateStudentAge(-1)).toMatch(/between 10 and 19/i);
    expect(validateStudentAge('25')).toMatch(/between 10 and 19/i);
  });

  it('rejects fractional and non-numeric inputs', () => {
    expect(validateStudentAge(14.5)).toMatch(/whole number/i);
    expect(validateStudentAge(13.5)).toMatch(/whole number/i);
    expect(validateStudentAge('fourteen')).toMatch(/whole number/i);
    expect(validateStudentAge('abc')).toMatch(/whole number/i);
    expect(validateStudentAge('')).toMatch(/please enter/i);
    // @ts-expect-error test null/undefined
    expect(validateStudentAge(null)).toMatch(/please enter/i);
    // @ts-expect-error test undefined
    expect(validateStudentAge(undefined)).toMatch(/please enter/i);
  });
});

describe('Validation Unit Tests: validateCodingExperience & validatePreferredCourse', () => {
  it('accepts all configured experience levels from siteConfig', () => {
    siteConfig.enquiryConfig.experienceLevels.forEach((level) => {
      expect(validateCodingExperience(level)).toBeNull();
    });
  });

  it('rejects empty or unlisted experience level', () => {
    expect(validateCodingExperience('')).toMatch(/select student's coding experience/i);
    expect(validateCodingExperience('Arbitrary Non-Existent Level')).toMatch(/valid experience option/i);
    // @ts-expect-error test null
    expect(validateCodingExperience(null)).toMatch(/select student's coding experience/i);
  });

  it('accepts all configured course preferences from siteConfig', () => {
    siteConfig.enquiryConfig.coursePreferences.forEach((course) => {
      expect(validatePreferredCourse(course)).toBeNull();
    });
  });

  it('rejects empty or unlisted course preference', () => {
    expect(validatePreferredCourse('')).toMatch(/select a preferred course/i);
    expect(validatePreferredCourse('Master Degree in Quantum ML')).toMatch(/valid course option/i);
    // @ts-expect-error test null
    expect(validatePreferredCourse(null)).toMatch(/select a preferred course/i);
  });
});

describe('Validation Unit Tests: validateNotes', () => {
  it('accepts undefined, empty, or short notes', () => {
    expect(validateNotes(undefined)).toBeNull();
    expect(validateNotes('')).toBeNull();
    expect(validateNotes('Student has done Scratch in primary school.')).toBeNull();
  });

  it('rejects notes exceeding 500 characters', () => {
    const longNotes = 'X'.repeat(501);
    expect(validateNotes(longNotes)).toMatch(/must not exceed 500 characters/i);
  });
});

describe('Validation Unit Tests: validateEnquiryForm Aggregator', () => {
  it('returns isValid: true and properly sanitized data for a fully valid submission', () => {
    const input = {
      parentName: '  Alice Tan  ',
      contact: ' +65 8123 4567 ',
      studentAge: '14',
      codingExperience: 'Complete Beginner (Never coded before)',
      preferredCourse: 'Beginner Python',
      notes: ' Looking forward to the trial session! ',
    };

    const result = validateEnquiryForm(input);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
    expect(result.sanitizedData).toEqual({
      parentName: 'Alice Tan',
      contact: '+65 8123 4567',
      studentAge: 14,
      codingExperience: 'Complete Beginner (Never coded before)',
      preferredCourse: 'Beginner Python',
      notes: 'Looking forward to the trial session!',
    });
  });

  it('returns isValid: false with errors mapped for all missing required fields', () => {
    const result = validateEnquiryForm({});
    expect(result.isValid).toBe(false);
    expect(result.errors.parentName).toBeDefined();
    expect(result.errors.contact).toBeDefined();
    expect(result.errors.studentAge).toBeDefined();
    expect(result.errors.codingExperience).toBeDefined();
    expect(result.errors.preferredCourse).toBeDefined();
  });
});
