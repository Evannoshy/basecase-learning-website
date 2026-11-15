import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/enquiry/route';

const validPayload = {
  parentName: 'Marcus Tan',
  contact: 'marcus@example.com',
  studentAge: 14,
  codingExperience: 'Complete Beginner (Never coded before)',
  preferredCourse: 'Beginner Python',
  notes: 'Saturday mornings.',
};

function makeReq(body: unknown) {
  return new Request('http://localhost:3000/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/enquiry Resend delivery & honeypot', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.ENQUIRY_WEBHOOK_URL;
    process.env.RESEND_API_KEY = 're_test_key';
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    vi.unstubAllGlobals();
  });

  it('delivers via Resend and returns DELIVERED', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', mockFetch);

    const res = await POST(makeReq(validPayload));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.status).toBe('DELIVERED');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.headers.Authorization).toBe('Bearer re_test_key');
    const sent = JSON.parse(options.body);
    expect(sent.to).toEqual(['basecaselearning@gmail.com']);
    expect(sent.reply_to).toBe('marcus@example.com');
    expect(sent.text).toContain('Marcus Tan');
  });

  it('returns DELIVERY_FAILED (502) when Resend rejects the request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

    const res = await POST(makeReq(validPayload));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.success).toBe(false);
    expect(data.status).toBe('DELIVERY_FAILED');
    expect(data.upstreamStatus).toBe(403);
  });

  it('returns DELIVERY_FAILED (502) on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const res = await POST(makeReq(validPayload));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.status).toBe('DELIVERY_FAILED');
  });

  it('silently drops honeypot submissions without sending email', async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    const res = await POST(makeReq({ ...validPayload, website: 'http://spam.example' }));

    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
