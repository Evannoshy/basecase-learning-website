import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '@/app/api/enquiry/route';

describe('/api/enquiry Route Handler - Backend Safety & Honest Delivery Protocol', () => {
  const originalEnv = process.env.ENQUIRY_WEBHOOK_URL;
  const originalPreviewStatus = process.env.ENQUIRY_PREVIEW_STATUS;

  const validPayload = {
    parentName: 'Marcus Tan',
    contact: '+65 9123 4567',
    studentAge: 14,
    codingExperience: 'Complete Beginner (Never coded before)',
    preferredCourse: 'Beginner Python',
    notes: 'Interested in Saturday morning sessions.',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.ENQUIRY_WEBHOOK_URL;
    delete process.env.ENQUIRY_PREVIEW_STATUS;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.ENQUIRY_WEBHOOK_URL = originalEnv;
    } else {
      delete process.env.ENQUIRY_WEBHOOK_URL;
    }

    if (originalPreviewStatus !== undefined) {
      process.env.ENQUIRY_PREVIEW_STATUS = originalPreviewStatus;
    } else {
      delete process.env.ENQUIRY_PREVIEW_STATUS;
    }
  });

  describe('Pre-Launch / Demo Mode Safety Guard (Rule NEG-05 & Acceptance Criterion #8)', () => {
    it('returns status BACKEND_NOT_CONFIGURED with success: false when ENQUIRY_WEBHOOK_URL is unset', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
      expect(data.message).toContain('Development/Pre-Launch Preview');
      expect(data.previewPayload).toBeDefined();
      expect(data.previewPayload.parentName).toBe('Marcus Tan');
      expect(data.previewPayload.contact).toBe('+65 9123 4567');
      expect(data.previewPayload.studentAge).toBe(14);
      expect(data.previewPayload.enquiryId).toMatch(/^BC-TR-\d{6}-[A-Z0-9]+$/);
      expect(data.previewPayload.submittedAt).toBeDefined();

      // Enforce zero outbound network requests when unconfigured
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('treats empty string or whitespace ENQUIRY_WEBHOOK_URL as unconfigured', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = '   ';
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(data.success).toBe(false);
      expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
    });

    it('treats placeholder values like "demo", "disabled", or "none" as unconfigured', async () => {
      const placeholders = ['demo', 'DEMO', 'disabled', 'Disabled', 'none', 'undefined'];
      for (const ph of placeholders) {
        process.env.ENQUIRY_WEBHOOK_URL = ph;
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPayload),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
      }
    });

    it('respects custom ENQUIRY_PREVIEW_STATUS when configured (e.g. 503)', async () => {
      process.env.ENQUIRY_PREVIEW_STATUS = '503';
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      expect(res.status).toBe(503);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
    });
  });

  describe('Active Backend Delivery Workflow', () => {
    it('dispatches payload to active webhook and returns status DELIVERED with success: true', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ acknowledged: true }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe('DELIVERED');
      expect(data.message).toBe('Enquiry successfully delivered.');
      expect(data.enquiryId).toMatch(/^BC-TR-\d{6}-[A-Z0-9]+$/);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('https://crm.example.com/api/enquiries');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['X-Enquiry-Id']).toBe(data.enquiryId);

      const sentBody = JSON.parse(options.body);
      expect(sentBody.enquiryId).toBe(data.enquiryId);
      expect(sentBody.data.parentName).toBe('Marcus Tan');
      expect(sentBody.data.studentAge).toBe(14);
      expect(sentBody.source).toBe('basecase-learning-website');
    });

    it('returns HTTP 502 with status DELIVERY_FAILED when upstream returns non-ok response', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(502);
      expect(data.success).toBe(false);
      expect(data.status).toBe('DELIVERY_FAILED');
      expect(data.upstreamStatus).toBe(500);
    });

    it('returns HTTP 502 with status DELIVERY_FAILED when fetch throws a network error', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const mockFetch = vi.fn().mockRejectedValue(new Error('Connection refused'));
      vi.stubGlobal('fetch', mockFetch);

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(502);
      expect(data.success).toBe(false);
      expect(data.status).toBe('DELIVERY_FAILED');
      expect(data.message).toContain('Unable to connect');
    });

    it('returns HTTP 502 with timeout message when request is aborted due to timeout', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      const mockFetch = vi.fn().mockRejectedValue(abortError);
      vi.stubGlobal('fetch', mockFetch);

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(502);
      expect(data.success).toBe(false);
      expect(data.status).toBe('DELIVERY_FAILED');
      expect(data.message).toContain('timed out');
    });
  });

  describe('Server-Side Schema & Data Validation', () => {
    it('returns HTTP 400 with VALIDATION_ERROR when required fields are missing', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.status).toBe('VALIDATION_ERROR');
      expect(data.errors.parentName).toBeDefined();
      expect(data.errors.contact).toBeDefined();
      expect(data.errors.studentAge).toBeDefined();
      expect(data.errors.codingExperience).toBeDefined();
      expect(data.errors.preferredCourse).toBeDefined();
    });

    it('rejects invalid parentName under 2 characters', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, parentName: 'A' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.errors.parentName).toContain('at least 2 characters');
    });

    it('rejects invalid contact that is neither email nor 8-digit SG phone', async () => {
      const invalidContacts = ['12345', '12345678', 'invalid@', 'user@domain', '+1 555-1234'];

      for (const contact of invalidContacts) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, contact }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.errors.contact).toBeDefined();
      }
    });

    it('accepts valid Singapore phone numbers with various formats', async () => {
      const validSgPhones = ['91234567', '8123 4567', '+65 9123 4567', '+65-8123-4567', '9000-1234'];

      for (const contact of validSgPhones) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, contact }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.previewPayload.contact).toBe(contact.trim());
      }
    });

    it('accepts valid RFC email formats', async () => {
      const validEmails = ['parent@example.com', 'marcus.tan@school.edu.sg', 'user+tag@domain.co'];

      for (const contact of validEmails) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, contact }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.previewPayload.contact).toBe(contact.trim());
      }
    });

    it('rejects studentAge below 10 or above 19', async () => {
      const outOfBoundsAges = [9, 20, 0, -5, 25, 80];

      for (const studentAge of outOfBoundsAges) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, studentAge }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.errors.studentAge).toContain('between 10 and 19');
      }
    });

    it('correctly accepts string number representations of studentAge (e.g. "15")', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, studentAge: '15' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.previewPayload.studentAge).toBe(15);
    });

    it('rejects non-numeric string representations of studentAge', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, studentAge: 'fourteen' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.errors.studentAge).toBeDefined();
    });

    it('rejects unapproved codingExperience options', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, codingExperience: 'Senior Kernel Engineer' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.errors.codingExperience).toBeDefined();
    });

    it('rejects unapproved preferredCourse options', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, preferredCourse: 'Quantum Computing PhD' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.errors.preferredCourse).toBeDefined();
    });

    it('rejects notes exceeding 500 characters', async () => {
      const longNotes = 'A'.repeat(501);
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, notes: longNotes }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.errors.notes).toContain('500 characters');
    });
  });

  describe('Payload Hygiene & Protocol Robustness', () => {
    it('returns HTTP 400 with INVALID_JSON when body contains malformed JSON syntax', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"parentName": "broken json...',
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.status).toBe('INVALID_JSON');
    });

    it('strips extraneous or malicious fields from sanitized preview/delivery payload', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          injectedRole: 'admin',
          isStaff: true,
          token: 'hacker-token',
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.previewPayload.injectedRole).toBeUndefined();
      expect(data.previewPayload.isStaff).toBeUndefined();
      expect(data.previewPayload.token).toBeUndefined();
    });

    it('trims leading and trailing whitespace from string inputs', async () => {
      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          parentName: '  Marcus Tan  ',
          contact: '  91234567  ',
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.previewPayload.parentName).toBe('Marcus Tan');
      expect(data.previewPayload.contact).toBe('91234567');
    });

    it('returns HTTP 405 Method Not Allowed with Allow header on GET requests', async () => {
      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(405);
      expect(res.headers.get('Allow')).toBe('POST');
      expect(data.success).toBe(false);
      expect(data.status).toBe('METHOD_NOT_ALLOWED');
    });
  });
});
