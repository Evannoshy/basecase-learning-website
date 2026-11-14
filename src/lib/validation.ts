import { siteConfig } from '@/config/siteConfig';

export interface EnquiryFormData {
  parentName: string;
  contact: string;
  studentAge: number | string;
  codingExperience: string;
  preferredCourse: string;
  notes?: string;
}

export type EnquiryFormErrors = Partial<Record<keyof EnquiryFormData, string>>;

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
  sanitizedData?: T;
}

// RFC 5322 compliant email regex (disallows leading/trailing/consecutive dots in local part)
export const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Singapore mobile phone numbers: 8 digits starting with 8 or 9 (optional +65 / 65 prefix)
export const SG_PHONE_REGEX = /^(?:\+?65[ -]?)?[89]\d{3}[ -]?\d{4}$/;

export function validateParentName(name: string): string | null {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) {
    return 'Please enter parent or guardian name.';
  }
  if (trimmed.length < 2) {
    return 'Parent or guardian name must be at least 2 characters.';
  }
  if (trimmed.length > 100) {
    return 'Name must not exceed 100 characters.';
  }
  return null;
}

export function validateContact(contact: string): {
  isValid: boolean;
  type?: 'email' | 'phone';
  error?: string;
} {
  const trimmed = typeof contact === 'string' ? contact.trim() : '';
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a contact email or Singapore mobile number.',
    };
  }

  // Check email
  if (EMAIL_REGEX.test(trimmed)) {
    return { isValid: true, type: 'email' };
  }

  // Check SG mobile phone
  const digitsOnly = trimmed.replace(/[\s\-()+.]/g, '');
  const localDigits =
    digitsOnly.startsWith('65') && digitsOnly.length === 10
      ? digitsOnly.slice(2)
      : digitsOnly;

  if (/^[89]\d{7}$/.test(localDigits)) {
    return { isValid: true, type: 'phone' };
  }

  return {
    isValid: false,
    error:
      'Please enter a valid email address or 8-digit Singapore phone number (e.g., 8123 4567 or parent@example.com).',
  };
}

export function validateStudentAge(age: number | string): string | null {
  const trimmed = typeof age === 'string' ? age.trim() : age;
  if (trimmed === '' || trimmed === undefined || trimmed === null) {
    return 'Please enter student age.';
  }
  const numeric = typeof trimmed === 'number' ? trimmed : Number(trimmed);
  if (isNaN(numeric) || !Number.isInteger(numeric)) {
    return 'Student age must be a valid whole number.';
  }
  if (numeric < 10 || numeric > 19) {
    return 'Student age must be between 10 and 19 years old.';
  }
  return null;
}

export function validateCodingExperience(
  exp: string,
  allowedOptions: string[] = siteConfig.enquiryConfig.experienceLevels
): string | null {
  const trimmed = typeof exp === 'string' ? exp.trim() : '';
  if (!trimmed) {
    return "Please select student's coding experience level.";
  }
  if (!allowedOptions.includes(trimmed)) {
    return 'Please select a valid experience option from the list.';
  }
  return null;
}

export function validatePreferredCourse(
  course: string,
  allowedOptions: string[] = siteConfig.enquiryConfig.coursePreferences
): string | null {
  const trimmed = typeof course === 'string' ? course.trim() : '';
  if (!trimmed) {
    return 'Please select a preferred course or trial interest.';
  }
  if (!allowedOptions.includes(trimmed)) {
    return 'Please select a valid course option from the list.';
  }
  return null;
}

export function validateNotes(notes?: string): string | null {
  if (!notes) return null;
  const trimmed = typeof notes === 'string' ? notes.trim() : '';
  if (trimmed.length > 500) {
    return 'Notes must not exceed 500 characters.';
  }
  return null;
}

export function validateEnquiryForm(
  data: Partial<EnquiryFormData>
): ValidationResult<EnquiryFormData> {
  const errors: EnquiryFormErrors = {};

  const nameError = validateParentName(data.parentName || '');
  if (nameError) errors.parentName = nameError;

  const contactRes = validateContact(data.contact || '');
  if (!contactRes.isValid && contactRes.error) {
    errors.contact = contactRes.error;
  }

  const ageError = validateStudentAge(data.studentAge ?? '');
  if (ageError) errors.studentAge = ageError;

  const expError = validateCodingExperience(data.codingExperience || '');
  if (expError) errors.codingExperience = expError;

  const courseError = validatePreferredCourse(data.preferredCourse || '');
  if (courseError) errors.preferredCourse = courseError;

  const notesError = validateNotes(data.notes);
  if (notesError) errors.notes = notesError;

  const isValid = Object.keys(errors).length === 0;

  let sanitizedData: EnquiryFormData | undefined;
  if (isValid) {
    sanitizedData = {
      parentName: (data.parentName || '').trim(),
      contact: (data.contact || '').trim(),
      studentAge: Number(data.studentAge),
      codingExperience: (data.codingExperience || '').trim(),
      preferredCourse: (data.preferredCourse || '').trim(),
      notes: (data.notes || '').trim() || undefined,
    };
  }

  return { isValid, errors, sanitizedData };
}
