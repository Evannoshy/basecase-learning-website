import { NextResponse } from 'next/server';
import { validateEnquiryForm, type EnquiryFormData } from '@/lib/validation';

/**
 * Interface contract for Enquiry API responses
 */
export interface EnquirySuccessResponse {
  success: true;
  status: 'DELIVERED';
  message: string;
  enquiryId: string;
}

export interface EnquiryPreviewResponse {
  success: false;
  status: 'BACKEND_NOT_CONFIGURED';
  message: string;
  previewPayload: EnquiryFormData & {
    enquiryId: string;
    submittedAt: string;
  };
}

export interface EnquiryValidationErrorResponse {
  success: false;
  status: 'VALIDATION_ERROR';
  message: string;
  errors: Partial<Record<keyof EnquiryFormData, string>>;
}

export interface EnquiryErrorResponse {
  success: false;
  status: 'DELIVERY_FAILED' | 'INVALID_JSON' | 'METHOD_NOT_ALLOWED';
  message: string;
  upstreamStatus?: number;
}

export type EnquiryApiResponse =
  | EnquirySuccessResponse
  | EnquiryPreviewResponse
  | EnquiryValidationErrorResponse
  | EnquiryErrorResponse;

/**
 * Generates an honest, unique reference ID for trial inquiries.
 * Format: BC-TR-YYYYMM-[RANDOM]
 */
function generateEnquiryId(): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BC-TR-${dateStr}-${randomSuffix}`;
}

/**
 * Checks whether an active, valid webhook URL is configured.
 */
function getActiveWebhookUrl(): string | null {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (
    !url ||
    url === '' ||
    url.toLowerCase() === 'demo' ||
    url.toLowerCase() === 'disabled' ||
    url.toLowerCase() === 'none' ||
    url.toLowerCase() === 'undefined'
  ) {
    return null;
  }
  return url;
}

/**
 * POST /api/enquiry
 * Validates trial booking enquiry submissions and dispatches to active backend CRM/webhook,
 * or returns a transparent pre-launch preview notice if no backend is configured.
 * 
 * Invariants (Rule NEG-05 & Acceptance Criterion #8):
 * - NEVER returns a successful delivery status unless an active backend verified receipt.
 * - In demo/pre-launch mode, returns success: false with status: 'BACKEND_NOT_CONFIGURED'.
 */
export async function POST(request: Request): Promise<NextResponse<EnquiryApiResponse>> {
  // 1. Parse JSON payload safely
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: 'INVALID_JSON',
        message: 'Malformed or invalid JSON in request body.',
      },
      { status: 400 }
    );
  }

  // 2. Validate payload using shared server/client validation rules
  if (!rawBody || typeof rawBody !== 'object') {
    return NextResponse.json(
      {
        success: false,
        status: 'VALIDATION_ERROR',
        message: 'Request body must be a valid JSON object.',
        errors: { parentName: 'Request body must be a valid JSON object.' },
      },
      { status: 400 }
    );
  }

  const validation = validateEnquiryForm(rawBody as Partial<EnquiryFormData>);
  if (!validation.isValid || !validation.sanitizedData) {
    return NextResponse.json(
      {
        success: false,
        status: 'VALIDATION_ERROR',
        message: 'Enquiry form validation failed. Please correct the highlighted errors.',
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  const sanitizedData = validation.sanitizedData;
  const enquiryId = generateEnquiryId();
  const submittedAt = new Date().toISOString();

  // 3. Backend Safety Guard (Honest Delivery Protocol)
  const webhookUrl = getActiveWebhookUrl();

  // Case A: Pre-Launch Preview / Demo Mode (No active backend service configured)
  if (!webhookUrl) {
    const previewStatus = Number(process.env.ENQUIRY_PREVIEW_STATUS) || 200;
    return NextResponse.json(
      {
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message:
          'Enquiry validated successfully in Development/Pre-Launch Preview. No live backend service is connected.',
        previewPayload: {
          ...sanitizedData,
          enquiryId,
          submittedAt,
        },
      },
      { status: previewStatus }
    );
  }

  // Case B: Active Live Backend Delivery
  const outboundPayload = {
    enquiryId,
    submittedAt,
    data: sanitizedData,
    source: 'basecase-learning-website',
    environment: process.env.NODE_ENV || 'development',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second delivery timeout

  try {
    const backendResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Enquiry-Id': enquiryId,
        'User-Agent': 'BaseCaseLearning-Website/1.0',
      },
      body: JSON.stringify(outboundPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          status: 'DELIVERY_FAILED',
          message:
            'The backend delivery service returned an error. Please contact us directly via WhatsApp or email.',
          upstreamStatus: backendResponse.status,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 'DELIVERED',
        message: 'Enquiry successfully delivered.',
        enquiryId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const isTimeout = error instanceof Error && error.name === 'AbortError';

    return NextResponse.json(
      {
        success: false,
        status: 'DELIVERY_FAILED',
        message: isTimeout
          ? 'Enquiry delivery request timed out. Please try again or reach out via WhatsApp.'
          : 'Unable to connect to live delivery endpoint. Please try again or reach out via WhatsApp.',
      },
      { status: 502 }
    );
  }
}

/**
 * Handle non-POST methods with HTTP 405 Method Not Allowed
 */
export async function GET(): Promise<NextResponse<EnquiryApiResponse>> {
  return NextResponse.json(
    {
      success: false,
      status: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed. Enquiry submissions require HTTP POST.',
    },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
