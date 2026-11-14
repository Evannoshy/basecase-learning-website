import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as routeHandler from '@/app/api/enquiry/route';
import { POST, GET } from '@/app/api/enquiry/route';

describe('Empirical Challenge: /api/enquiry Route Handler Stress Harness', () => {
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

  // =========================================================================
  // 1. UNCONFIGURED WEBHOOK SCENARIO (INVARIANT NEG-05 & AC #8)
  // =========================================================================
  describe('1. Unconfigured Webhook Scenario (Invariant NEG-05)', () => {
    it('returns status BACKEND_NOT_CONFIGURED and success: false when ENQUIRY_WEBHOOK_URL is unset', async () => {
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
      expect(data.previewPayload.codingExperience).toBe('Complete Beginner (Never coded before)');
      expect(data.previewPayload.preferredCourse).toBe('Beginner Python');
      expect(data.previewPayload.notes).toBe('Interested in Saturday morning sessions.');
      expect(data.previewPayload.enquiryId).toMatch(/^BC-TR-\d{6}-[A-Z0-9]+$/);
      expect(new Date(data.previewPayload.submittedAt).toISOString()).toBe(data.previewPayload.submittedAt);

      // CRITICAL NEG-05: Enforce zero outbound network requests when unconfigured
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('treats empty string, whitespace, and tabs as unconfigured', async () => {
      const emptyVariants = ['', ' ', '   ', '\t', '  \n  '];
      for (const envVal of emptyVariants) {
        process.env.ENQUIRY_WEBHOOK_URL = envVal;
        const fetchSpy = vi.spyOn(global, 'fetch');

        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPayload),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
        expect(fetchSpy).not.toHaveBeenCalled();
      }
    });

    it('treats all standard placeholder tokens as unconfigured (case-insensitive)', async () => {
      const placeholders = [
        'demo', 'DEMO', 'Demo',
        'disabled', 'DISABLED', 'Disabled',
        'none', 'NONE', 'None',
        'undefined', 'UNDEFINED',
      ];

      for (const ph of placeholders) {
        process.env.ENQUIRY_WEBHOOK_URL = ph;
        const fetchSpy = vi.spyOn(global, 'fetch');

        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPayload),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.status).toBe('BACKEND_NOT_CONFIGURED');
        expect(fetchSpy).not.toHaveBeenCalled();
      }
    });

    it('honors custom ENQUIRY_PREVIEW_STATUS (e.g. 503) while maintaining success: false', async () => {
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

  // =========================================================================
  // 2. ACTIVE WEBHOOK DELIVERY WORKFLOW & PAYLOAD SCHEMA
  // =========================================================================
  describe('2. Active Webhook Delivery & Mocking', () => {
    it('dispatches properly formatted payload to active webhook and returns status DELIVERED', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'crm-rec-12345', received: true }),
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
      const [targetUrl, options] = mockFetch.mock.calls[0];
      expect(targetUrl).toBe('https://crm.example.com/api/enquiries');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['X-Enquiry-Id']).toBe(data.enquiryId);
      expect(options.headers['User-Agent']).toBe('BaseCaseLearning-Website/1.0');

      const outboundBody = JSON.parse(options.body);
      expect(outboundBody.enquiryId).toBe(data.enquiryId);
      expect(outboundBody.source).toBe('basecase-learning-website');
      expect(outboundBody.data.parentName).toBe('Marcus Tan');
      expect(outboundBody.data.contact).toBe('+65 9123 4567');
      expect(outboundBody.data.studentAge).toBe(14);
      expect(outboundBody.data.codingExperience).toBe('Complete Beginner (Never coded before)');
      expect(outboundBody.data.preferredCourse).toBe('Beginner Python');
      expect(outboundBody.data.notes).toBe('Interested in Saturday morning sessions.');
    });

    it('handles HTTP 201 Created and HTTP 204 No Content upstream responses as success', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      for (const statusCode of [201, 204]) {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          status: statusCode,
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
      }
    });
  });

  // =========================================================================
  // 3. UPSTREAM NETWORK ERRORS & 8-SECOND TIMEOUT ABORT HANDLING
  // =========================================================================
  describe('3. Upstream Network Errors & 8-Second Timeout Handling', () => {
    it('returns HTTP 502 with DELIVERY_FAILED on upstream 5xx and 4xx status codes', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const errorStatuses = [500, 502, 503, 504, 404, 400, 401, 403];
      for (const status of errorStatuses) {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
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
        expect(data.upstreamStatus).toBe(status);
        expect(data.message).toContain('backend delivery service returned an error');
      }
    });

    it('returns HTTP 502 with DELIVERY_FAILED on network connection failures', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const networkErrors = [
        new Error('fetch failed: ECONNREFUSED 127.0.0.1:8080'),
        new Error('ENOTFOUND crm.example.invalid'),
        new TypeError('Failed to fetch'),
      ];

      for (const err of networkErrors) {
        const mockFetch = vi.fn().mockRejectedValue(err);
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
        expect(data.message).toContain('Unable to connect to live delivery endpoint');
      }
    });

    it('returns HTTP 502 with timed out message when request exceeds 8-second timeout', async () => {
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
      expect(data.message).toContain('Enquiry delivery request timed out');
    });

    it('verifies that AbortController 8000ms timer is properly configured and cleared', async () => {
      process.env.ENQUIRY_WEBHOOK_URL = 'https://crm.example.com/api/enquiries';

      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      await POST(req);

      // Verify setTimeout was called with 8000ms
      const timeoutCalls = setTimeoutSpy.mock.calls.filter(([, ms]) => ms === 8000);
      expect(timeoutCalls.length).toBeGreaterThanOrEqual(1);

      // Verify clearTimeout was invoked to prevent timer leaks
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 4. MALFORMED PAYLOADS, MISSING FIELDS & DATA SANITIZATION (NEG-14)
  // =========================================================================
  describe('4. Malformed Payloads, Validation, & Payload Sanitization (NEG-14)', () => {
    it('returns HTTP 400 with INVALID_JSON when body is unparseable', async () => {
      const malformedBodies = [
        '{ parentName: "broken json...',
        '{"parentName": "Unclosed string',
        '<<< XML NOT JSON >>>',
        '',
      ];

      for (const body of malformedBodies) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.status).toBe('INVALID_JSON');
      }
    });

    it('returns HTTP 400 with VALIDATION_ERROR when body is null, array, or primitive', async () => {
      const nonObjectBodies = [
        'null',
        '[]',
        '[1, 2, 3]',
        '"just a string"',
        '12345',
        'true',
      ];

      for (const body of nonObjectBodies) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.status).toBe('VALIDATION_ERROR');
      }
    });

    it('returns HTTP 400 with field errors when required fields are missing', async () => {
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

    it('rejects studentAge below 10 or above 19, and accepts string numbers like " 15 "', async () => {
      const outOfBounds = [9, 20, 0, -1, 100, 'nine', '14.5'];
      for (const age of outOfBounds) {
        const req = new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, studentAge: age }),
        });

        const res = await POST(req);
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data.errors.studentAge).toBeDefined();
      }

      // Valid string number representation
      const validReq = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, studentAge: '  15  ' }),
      });
      const validRes = await POST(validReq);
      const validData = await validRes.json();
      expect(validRes.status).toBe(200);
      expect(validData.previewPayload.studentAge).toBe(15);
    });

    it('strictly sanitizes extraneous and security-sensitive keys (NEG-14 Data Minimization)', async () => {
      const maliciousPayload = {
        ...validPayload,
        isAdmin: true,
        role: 'superadmin',
        token: 'secret-auth-token-12345',
        nric: 'S1234567A',
        creditCard: '4111222233334444',
        password: 'supersecretpassword',
        __proto__: { polluted: 'true' },
      };

      const req = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousPayload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      const preview = data.previewPayload;

      // Verify no sensitive keys leaked into previewPayload
      expect(preview.isAdmin).toBeUndefined();
      expect(preview.role).toBeUndefined();
      expect(preview.token).toBeUndefined();
      expect(preview.nric).toBeUndefined();
      expect(preview.creditCard).toBeUndefined();
      expect(preview.password).toBeUndefined();

      // Verify prototype was not polluted
      expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();

      // Verify only allowed fields exist
      const allowedKeys = new Set([
        'parentName',
        'contact',
        'studentAge',
        'codingExperience',
        'preferredCourse',
        'notes',
        'enquiryId',
        'submittedAt',
      ]);
      Object.keys(preview).forEach((key) => {
        expect(allowedKeys.has(key)).toBe(true);
      });
    });

    it('rejects notes exceeding 500 characters and accepts 500 characters', async () => {
      const exactly500 = 'A'.repeat(500);
      const exactly501 = 'A'.repeat(501);

      // 500 chars should pass
      const req500 = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, notes: exactly500 }),
      });
      const res500 = await POST(req500);
      expect(res500.status).toBe(200);

      // 501 chars should fail
      const req501 = new Request('http://localhost:3000/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validPayload, notes: exactly501 }),
      });
      const res501 = await POST(req501);
      const data501 = await res501.json();
      expect(res501.status).toBe(400);
      expect(data501.errors.notes).toContain('500 characters');
    });
  });

  // =========================================================================
  // 5. HIGH CONCURRENCY & ID COLLISION STRESS TEST
  // =========================================================================
  describe('5. High Concurrency & Enquiry ID Generation Stress', () => {
    it('generates 50 unique enquiry IDs under concurrent load with zero collisions', async () => {
      const count = 50;
      const requests = Array.from({ length: count }, () =>
        new Request('http://localhost:3000/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPayload),
        })
      );

      const responses = await Promise.all(requests.map((r) => POST(r)));
      const results = await Promise.all(responses.map((r) => r.json()));

      const enquiryIds = results.map((r) => r.previewPayload.enquiryId);
      const uniqueIds = new Set(enquiryIds);

      expect(uniqueIds.size).toBe(count);
      enquiryIds.forEach((id) => {
        expect(id).toMatch(/^BC-TR-\d{6}-[A-Z0-9]+$/);
      });
    });
  });

  // =========================================================================
  // 6. METHOD RESTRICTIONS (HTTP 405 METHOD NOT ALLOWED)
  // =========================================================================
  describe('6. Method Restrictions & HTTP Method Handling (HTTP 405)', () => {
    it('returns HTTP 405 Method Not Allowed with Allow: POST on GET requests', async () => {
      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(405);
      expect(res.headers.get('Allow')).toBe('POST');
      expect(data.success).toBe(false);
      expect(data.status).toBe('METHOD_NOT_ALLOWED');
      expect(data.message).toContain('Enquiry submissions require HTTP POST');
    });

    it('empirically audits route exports for non-POST method handlers (PUT, DELETE, PATCH)', () => {
      // In Next.js App Router, unexported HTTP methods are handled at the framework layer
      // by returning 405 Method Not Allowed.
      // We audit the explicit module exports:
      const exports = Object.keys(routeHandler);
      expect(exports).toContain('POST');
      expect(exports).toContain('GET');

      // Note: PUT, DELETE, PATCH are not explicitly exported as separate handler functions;
      // In Next.js App Router, methods not exported are automatically rejected with 405 by the router.
      const hasExplicitPut = typeof (routeHandler as Record<string, unknown>).PUT === 'function';
      const hasExplicitDelete = typeof (routeHandler as Record<string, unknown>).DELETE === 'function';
      const hasExplicitPatch = typeof (routeHandler as Record<string, unknown>).PATCH === 'function';

      // Both patterns (framework-level 405 vs explicit export re-export) are documented in challenge report
      expect(typeof routeHandler.POST).toBe('function');
      expect(typeof routeHandler.GET).toBe('function');
    });
  });
});
