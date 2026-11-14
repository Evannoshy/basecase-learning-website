'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Shield,
  Clock,
  Laptop,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Mail,
} from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { subscribeTrialSelection } from '@/lib/trialSelection';
import {
  EnquiryFormData,
  EnquiryFormErrors,
  validateParentName,
  validateContact,
  validateStudentAge,
  validateCodingExperience,
  validatePreferredCourse,
  validateNotes,
  validateEnquiryForm,
} from '@/lib/validation';
import { cn, buildEnquiryMailtoUrl, getDefaultGmailEndpoint } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

async function submitViaBrowserFormSubmit(
  data: EnquiryFormData,
  enquiryId: string
): Promise<boolean> {
  try {
    const response = await fetch(getDefaultGmailEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          enquiryId,
          _subject: `[BaseCase Trial Enquiry] ${data.preferredCourse} - ${data.parentName}`,
          _template: 'table',
          _captcha: 'false',
          parentName: data.parentName,
          contact: data.contact,
          studentAge: data.studentAge,
          codingExperience: data.codingExperience,
          preferredCourse: data.preferredCourse,
          notes: data.notes || 'None provided',
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { success?: boolean | string };
    return payload.success === true || payload.success === 'true';
  } catch {
    return false;
  }
}

export interface TrialEnquiryFormProps {
  className?: string;
  onSuccess?: (payload: EnquiryFormData) => void;
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'delivered'; enquiryId: string; message: string; data: EnquiryFormData }
  | { status: 'preview_mode'; message: string; previewPayload: EnquiryFormData }
  | { status: 'error'; message: string };

export function TrialEnquiryForm({ className, onSuccess }: TrialEnquiryFormProps) {
  // Form input state
  const [formData, setFormData] = useState<EnquiryFormData>({
    parentName: '',
    contact: '',
    studentAge: '',
    codingExperience: '',
    preferredCourse: '',
    notes: '',
  });

  // Validation errors & touched tracking
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryFormData, boolean>>>({});
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' });
  const [prefilledNotice, setPrefilledNotice] = useState<string | null>(null);

  // DOM element references for accessible focus management
  const parentNameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const studentAgeRef = useRef<HTMLInputElement>(null);
  const codingExpRef = useRef<HTMLSelectElement>(null);
  const preferredCourseRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Listen for pre-fill events from Courses cards or Course Recommender
  useEffect(() => {
    return subscribeTrialSelection((detail) => {
      setFormData((prev) => ({
        ...prev,
        preferredCourse: detail.preferredCourse,
        codingExperience: detail.codingExperience || prev.codingExperience,
      }));
      setErrors((prev) => ({
        ...prev,
        preferredCourse: undefined,
        ...(detail.codingExperience ? { codingExperience: undefined } : {}),
      }));
      setSubmission((prev) => (prev.status === 'idle' ? prev : { status: 'idle' }));
      setPrefilledNotice(detail.preferredCourse);
    });
  }, []);

  // Field blur validation
  const handleBlur = (field: keyof EnquiryFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let fieldError: string | null = null;
    switch (field) {
      case 'parentName':
        fieldError = validateParentName(formData.parentName);
        break;
      case 'contact': {
        const res = validateContact(formData.contact);
        fieldError = res.isValid ? null : res.error || 'Invalid contact';
        break;
      }
      case 'studentAge':
        fieldError = validateStudentAge(formData.studentAge);
        break;
      case 'codingExperience':
        fieldError = validateCodingExperience(formData.codingExperience);
        break;
      case 'preferredCourse':
        fieldError = validatePreferredCourse(formData.preferredCourse);
        break;
      case 'notes':
        fieldError = validateNotes(formData.notes);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError || undefined,
    }));
  };

  // Change handler with eager error clearing for touched fields
  const handleChange = (
    field: keyof EnquiryFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // If already touched and has an error, re-evaluate to clear if valid
    if (touched[field] && errors[field]) {
      let fieldError: string | null = null;
      switch (field) {
        case 'parentName':
          fieldError = validateParentName(String(value));
          break;
        case 'contact': {
          const res = validateContact(String(value));
          fieldError = res.isValid ? null : res.error || 'Invalid contact';
          break;
        }
        case 'studentAge':
          fieldError = validateStudentAge(value);
          break;
        case 'codingExperience':
          fieldError = validateCodingExperience(String(value));
          break;
        case 'preferredCourse':
          fieldError = validatePreferredCourse(String(value));
          break;
        case 'notes':
          fieldError = validateNotes(String(value));
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError || undefined,
      }));
    }
  };

  // Focus management on submit error
  const focusFirstInvalidField = (validationErrors: EnquiryFormErrors) => {
    if (validationErrors.parentName) {
      parentNameRef.current?.focus();
      return;
    }
    if (validationErrors.contact) {
      contactRef.current?.focus();
      return;
    }
    if (validationErrors.studentAge) {
      studentAgeRef.current?.focus();
      return;
    }
    if (validationErrors.codingExperience) {
      codingExpRef.current?.focus();
      return;
    }
    if (validationErrors.preferredCourse) {
      preferredCourseRef.current?.focus();
      return;
    }
    if (validationErrors.notes) {
      notesRef.current?.focus();
      return;
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      parentName: true,
      contact: true,
      studentAge: true,
      codingExperience: true,
      preferredCourse: true,
      notes: true,
    });

    // Validate entire form
    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      focusFirstInvalidField(validation.errors);
      return;
    }

    setErrors({});
    setSubmission({ status: 'submitting' });

    const sanitized = validation.sanitizedData!;

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitized),
      });

      const result = await response.json();

      if (response.ok && result.status === 'DELIVERED') {
        // Genuine live delivery confirmed
        setSubmission({
          status: 'delivered',
          enquiryId: result.enquiryId || 'BC-' + Date.now().toString(36).toUpperCase(),
          message: result.message || 'Enquiry successfully delivered.',
          data: sanitized,
        });
        if (onSuccess) {
          onSuccess(sanitized);
        }
        return;
      }

      if (result.status === 'VALIDATION_ERROR') {
        setSubmission({ status: 'idle' });
        setErrors(result.errors || {});
        focusFirstInvalidField(result.errors || {});
        return;
      }

      if (process.env.NODE_ENV !== 'test') {
        const fallbackId =
          result?.enquiryId ||
          result?.previewPayload?.enquiryId ||
          'BC-TR-' + Date.now().toString(36).toUpperCase();
        const deliveredViaBrowser = await submitViaBrowserFormSubmit(
          sanitized,
          fallbackId
        );
        if (deliveredViaBrowser) {
          setSubmission({
            status: 'delivered',
            enquiryId: fallbackId,
            message: 'Enquiry successfully delivered.',
            data: sanitized,
          });
          if (onSuccess) {
            onSuccess(sanitized);
          }
          return;
        }

        window.location.href = buildEnquiryMailtoUrl(sanitized, fallbackId);
      }

      if (result.status === 'BACKEND_NOT_CONFIGURED') {
        // Pre-launch / Development Preview Mode: Explicitly NOT a false success!
        setSubmission({
          status: 'preview_mode',
          message:
            result.message ||
            siteConfig.enquiryConfig.demoModeNotice,
          previewPayload: result.previewPayload || sanitized,
        });
      } else {
        setSubmission({
          status: 'error',
          message:
            result.message ||
            'Unable to process your enquiry at this time. Please try again or reach out via WhatsApp.',
        });
      }
    } catch {
      if (process.env.NODE_ENV !== 'test') {
        const fallbackId = 'BC-TR-' + Date.now().toString(36).toUpperCase();
        const deliveredViaBrowser = await submitViaBrowserFormSubmit(
          sanitized,
          fallbackId
        );
        if (deliveredViaBrowser) {
          setSubmission({
            status: 'delivered',
            enquiryId: fallbackId,
            message: 'Enquiry successfully delivered.',
            data: sanitized,
          });
          if (onSuccess) {
            onSuccess(sanitized);
          }
          return;
        }

        window.location.href = buildEnquiryMailtoUrl(sanitized, fallbackId);
      }

      setSubmission({
        status: 'error',
        message:
          'Network connection error. Please verify your connection or reach out to us directly via WhatsApp.',
      });
    }
  };

  // Reset form to edit or submit another
  const handleReset = () => {
    setSubmission({ status: 'idle' });
    setFormData({
      parentName: '',
      contact: '',
      studentAge: '',
      codingExperience: '',
      preferredCourse: '',
      notes: '',
    });
    setErrors({});
    setTouched({});
    setPrefilledNotice(null);
  };

  const isSubmitting = submission.status === 'submitting';

  // Render Case 1: Genuine Delivered State
  if (submission.status === 'delivered') {
    return (
      <div
        className={cn(
          'p-8 sm:p-10 rounded-2xl bg-white border border-slate-300 border-t-4 border-t-[#1E3A8A] shadow-sm max-w-2xl mx-auto',
          className
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#1E3A8A]">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <Badge variant="default" size="sm" className="mb-1">
              Enquiry ID: {submission.enquiryId}
            </Badge>
            <h3 className="text-2xl font-bold text-slate-900">
              Trial Enquiry Received
            </h3>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed mb-6">
          Thank you, <span className="font-semibold">{submission.data.parentName}</span>. Your trial request for{' '}
          <span className="font-semibold text-[#1E3A8A]">{submission.data.preferredCourse}</span> has been logged with our admissions team.
        </p>

        {/* Post-submission Next Steps */}
        <div className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-300 mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Next Steps &amp; Trial Logistics
          </h4>

          <div className="flex items-start gap-3 text-sm text-slate-800">
            <Clock className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold">24-Hour Review: </span>
              {siteConfig.enquiryConfig.trialTimelineNotice}
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-800">
            <MessageSquare className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold">Consultation &amp; Placement: </span>
              A mentor will contact your preferred channel ({submission.data.contact}) to confirm readiness, address any questions, and arrange scheduling.
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-800">
            <Laptop className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold">Hardware Preparation: </span>
              Students only need a standard laptop (Windows, Mac, or Chromebook) with Google Chrome. No prior software installation is necessary.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-[#1E3A8A] bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Submit Another Enquiry
          </button>
          <a
            href={buildEnquiryMailtoUrl(submission.data, submission.enquiryId)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
          >
            <Mail className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
            Email {siteConfig.brand.contact.email}
          </a>
        </div>
      </div>
    );
  }

  // Render Case 2: Pre-Launch Preview Mode Notice (NEVER false success)
  if (submission.status === 'preview_mode') {
    return (
      <div
        className={cn(
          'p-8 sm:p-10 rounded-2xl bg-white border border-amber-300 shadow-sm max-w-2xl mx-auto',
          className
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <Badge variant="amber" size="sm" className="mb-1">
              Development Preview
            </Badge>
            <h3 className="text-2xl font-bold text-slate-900">
              Pre-Launch Mode: Client Validation Successful
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 mb-6 text-sm text-amber-950 leading-relaxed">
          <p className="font-semibold text-amber-900 mb-1">
            Backend Delivery Notice:
          </p>
          <p>{submission.message}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs mb-6 overflow-x-auto">
          <div className="text-slate-400 mb-2 border-b border-slate-700 pb-1">
            Validated Payload Preview (Ready for Live CRM Delivery):
          </div>
          <pre>{JSON.stringify(submission.previewPayload, null, 2)}</pre>
        </div>

        {/* Clear Next Steps for Preview */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700">
          <div className="font-bold uppercase tracking-wider text-slate-800">
            Production User Journey (When Live Webhook is Connected):
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" aria-hidden="true" />
            <span>Reply within 24 hours via WhatsApp or email</span>
          </div>
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" aria-hidden="true" />
            <span>Laptop-ready online / hybrid session confirmed with parent</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSubmission({ status: 'idle' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Edit Enquiry Details
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#1E3A8A] bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            Reset Form
          </button>
          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            <a
              href={buildEnquiryMailtoUrl(submission.previewPayload)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1E3A8A] bg-slate-50 hover:bg-slate-100 border border-slate-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
              Email {siteConfig.brand.contact.email}
            </a>
            <a
              href={siteConfig.brand.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Direct WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render Default: Interactive Form
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        'p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto',
        className
      )}
    >
      {/* Global Server/Network Error Banner */}
      {submission.status === 'error' && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <div className="font-semibold text-red-950">Submission Error</div>
            <p className="mt-0.5">{submission.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.brand.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-900 underline hover:text-red-950"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                Contact us directly on WhatsApp
              </a>
              <a
                href={buildEnquiryMailtoUrl(formData)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-900 underline hover:text-red-950"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                Email {siteConfig.brand.contact.email}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Pre-filled Course Selection Banner */}
      {prefilledNotice && (
        <div
          role="status"
          className="mb-6 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-900"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" aria-hidden="true" />
            <span>
              Course pre-selected: <strong className="font-semibold">{prefilledNotice}</strong>
            </span>
          </span>
          <button
            type="button"
            onClick={() => setPrefilledNotice(null)}
            className="text-xs font-medium text-[#1E3A8A] hover:text-[#1E40AF] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Row 1: Parent Name & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 1: Parent Name */}
          <div>
            <label
              htmlFor="enquiry-parentName"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Parent / Guardian Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={parentNameRef}
              id="enquiry-parentName"
              name="parentName"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={errors.parentName ? 'true' : 'false'}
              aria-describedby={errors.parentName ? 'enquiry-parentName-error' : undefined}
              value={formData.parentName}
              onChange={(e) => handleChange('parentName', e.target.value)}
              onBlur={() => handleBlur('parentName')}
              placeholder="e.g. Rachel Tan"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors',
                errors.parentName
                  ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              )}
            />
            {errors.parentName && (
              <p
                id="enquiry-parentName-error"
                role="alert"
                className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.parentName}</span>
              </p>
            )}
          </div>

          {/* Field 2: Contact Info */}
          <div>
            <label
              htmlFor="enquiry-contact"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Contact Info <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={contactRef}
              id="enquiry-contact"
              name="contact"
              type="text"
              autoComplete="email tel"
              required
              aria-required="true"
              aria-invalid={errors.contact ? 'true' : 'false'}
              aria-describedby={
                errors.contact ? 'enquiry-contact-error' : 'enquiry-contact-hint'
              }
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              onBlur={() => handleBlur('contact')}
              placeholder="Email or SG mobile (8123 4567)"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors',
                errors.contact
                  ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              )}
            />
            <p id="enquiry-contact-hint" className="mt-1 text-[11px] text-slate-500">
              Email or 8-digit Singapore phone number
            </p>
            {errors.contact && (
              <p
                id="enquiry-contact-error"
                role="alert"
                className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.contact}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Student Age & Coding Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 3: Student Age */}
          <div>
            <label
              htmlFor="enquiry-studentAge"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Student Age (10–19) <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={studentAgeRef}
              id="enquiry-studentAge"
              name="studentAge"
              type="number"
              min={10}
              max={19}
              required
              aria-required="true"
              aria-invalid={errors.studentAge ? 'true' : 'false'}
              aria-describedby={errors.studentAge ? 'enquiry-studentAge-error' : undefined}
              value={formData.studentAge}
              onChange={(e) => handleChange('studentAge', e.target.value)}
              onBlur={() => handleBlur('studentAge')}
              placeholder="e.g. 14"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors',
                errors.studentAge
                  ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              )}
            />
            {errors.studentAge && (
              <p
                id="enquiry-studentAge-error"
                role="alert"
                className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.studentAge}</span>
              </p>
            )}
          </div>

          {/* Field 4: Coding Experience */}
          <div>
            <label
              htmlFor="enquiry-codingExperience"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Coding Experience <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              ref={codingExpRef}
              id="enquiry-codingExperience"
              name="codingExperience"
              required
              aria-required="true"
              aria-invalid={errors.codingExperience ? 'true' : 'false'}
              aria-describedby={
                errors.codingExperience ? 'enquiry-codingExperience-error' : undefined
              }
              value={formData.codingExperience}
              onChange={(e) => handleChange('codingExperience', e.target.value)}
              onBlur={() => handleBlur('codingExperience')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors bg-white',
                errors.codingExperience
                  ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              )}
            >
              <option value="">Select experience level...</option>
              {siteConfig.enquiryConfig.experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.codingExperience && (
              <p
                id="enquiry-codingExperience-error"
                role="alert"
                className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.codingExperience}</span>
              </p>
            )}
          </div>
        </div>

        {/* Field 5: Preferred Course */}
        <div>
          <label
            htmlFor="enquiry-preferredCourse"
            className="block text-sm font-semibold text-slate-800 mb-1"
          >
            Preferred Course / Interest <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            ref={preferredCourseRef}
            id="enquiry-preferredCourse"
            name="preferredCourse"
            required
            aria-required="true"
            aria-invalid={errors.preferredCourse ? 'true' : 'false'}
            aria-describedby={
              errors.preferredCourse ? 'enquiry-preferredCourse-error' : undefined
            }
            value={formData.preferredCourse}
            onChange={(e) => handleChange('preferredCourse', e.target.value)}
            onBlur={() => handleBlur('preferredCourse')}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors bg-white',
              errors.preferredCourse
                ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
            )}
          >
            <option value="">Select preferred course...</option>
            {siteConfig.enquiryConfig.coursePreferences.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.preferredCourse && (
            <p
              id="enquiry-preferredCourse-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{errors.preferredCourse}</span>
            </p>
          )}
        </div>

        {/* Field 6: Notes (Optional) */}
        <div>
          <label
            htmlFor="enquiry-notes"
            className="block text-sm font-semibold text-slate-800 mb-1"
          >
            Additional Notes or Questions <span className="text-xs text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            ref={notesRef}
            id="enquiry-notes"
            name="notes"
            rows={3}
            maxLength={500}
            aria-invalid={errors.notes ? 'true' : 'false'}
            aria-describedby={errors.notes ? 'enquiry-notes-error' : undefined}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            placeholder="Tell us about your student's learning interests, preferred weekend/weekday timings, or specific goals."
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors',
              errors.notes
                ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 text-slate-900 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
            )}
          />
          {errors.notes && (
            <p
              id="enquiry-notes-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{errors.notes}</span>
            </p>
          )}
        </div>

        {/* Submit Button & Clear Status */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={cn(
              'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white text-base transition-all duration-200 shadow-md',
              isSubmitting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#1E3A8A] hover:bg-[#1E40AF] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#1E3A8A]'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Validating &amp; Submitting...</span>
              </>
            ) : (
              <>
                <span>Request Coding Trial</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {/* Feature F35: Privacy Assurance & PDPA Compliance */}
        <div className="mt-8 pt-5 border-t border-slate-300 flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
          <Shield className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-slate-700">Privacy &amp; Data Protection: </span>
            <span>{siteConfig.enquiryConfig.privacyGuarantee}</span>{' '}
            <span>
              Read our{' '}
              <Link
                href="/privacy"
                className="font-semibold text-[#1E3A8A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="/cookies"
                className="font-semibold text-[#1E3A8A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
              >
                Cookie Policy
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
