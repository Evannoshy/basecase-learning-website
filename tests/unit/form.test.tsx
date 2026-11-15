import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';
import { siteConfig } from '@/config/siteConfig';

describe('TrialEnquiryForm Component & Accessibility Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders all required form fields with explicit <label htmlFor="..."> associations', () => {
    render(<TrialEnquiryForm />);

    // 1. Parent Name
    const nameLabel = screen.getByText(/parent \/ guardian name/i);
    expect(nameLabel).toHaveAttribute('for', 'enquiry-parentName');
    const nameInput = screen.getByLabelText(/parent \/ guardian name/i);
    expect(nameInput).toHaveAttribute('id', 'enquiry-parentName');

    // 2. Contact
    const contactLabel = screen.getByText(/^contact info/i);
    expect(contactLabel).toHaveAttribute('for', 'enquiry-contact');
    const contactInput = screen.getByLabelText(/^contact info/i);
    expect(contactInput).toHaveAttribute('id', 'enquiry-contact');

    // 3. Student Age
    const ageLabel = screen.getByText(/student age \(10–19\)/i);
    expect(ageLabel).toHaveAttribute('for', 'enquiry-studentAge');
    const ageInput = screen.getByLabelText(/student age \(10–19\)/i);
    expect(ageInput).toHaveAttribute('id', 'enquiry-studentAge');

    // 4. Coding Experience
    const expLabel = screen.getByText(/coding experience/i);
    expect(expLabel).toHaveAttribute('for', 'enquiry-codingExperience');
    const expSelect = screen.getByLabelText(/coding experience/i);
    expect(expSelect).toHaveAttribute('id', 'enquiry-codingExperience');

    // 5. Preferred Course
    const courseLabel = screen.getByText(/preferred course \/ interest/i);
    expect(courseLabel).toHaveAttribute('for', 'enquiry-preferredCourse');
    const courseSelect = screen.getByLabelText(/preferred course \/ interest/i);
    expect(courseSelect).toHaveAttribute('id', 'enquiry-preferredCourse');

    // 6. Notes (Optional)
    const notesLabel = screen.getByText(/additional notes or questions/i);
    expect(notesLabel).toHaveAttribute('for', 'enquiry-notes');
    const notesInput = screen.getByLabelText(/additional notes or questions/i);
    expect(notesInput).toHaveAttribute('id', 'enquiry-notes');
  });

  it('displays inline error with role="alert" when a field is blurred with invalid input', async () => {
    const user = userEvent.setup();
    render(<TrialEnquiryForm />);

    const nameInput = screen.getByLabelText(/parent \/ guardian name/i);
    await user.click(nameInput);
    await user.tab(); // Blur without typing

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/please enter parent or guardian name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'enquiry-parentName-error');
  });

  it('eagerly clears validation error once valid input is entered into a touched field', async () => {
    const user = userEvent.setup();
    render(<TrialEnquiryForm />);

    const ageInput = screen.getByLabelText(/student age \(10–19\)/i);
    await user.type(ageInput, '9');
    await user.tab(); // Blur -> triggers validation error (9 < 10)

    expect(screen.getByRole('alert')).toHaveTextContent(/between 10 and 19/i);

    // Now type valid age
    await user.clear(ageInput);
    await user.type(ageInput, '14');

    expect(screen.queryByText(/between 10 and 19/i)).not.toBeInTheDocument();
    expect(ageInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('shifts focus to the first invalid field upon failed form submission', async () => {
    render(<TrialEnquiryForm />);

    const submitBtn = screen.getByRole('button', { name: /request coding trial/i });
    fireEvent.click(submitBtn);

    const nameInput = screen.getByLabelText(/parent \/ guardian name/i);
    await waitFor(() => {
      expect(document.activeElement).toBe(nameInput);
    });

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(4);
  });

  it('never presents a false success state when backend returns BACKEND_NOT_CONFIGURED (NEG-05, AC #8)', async () => {
    const user = userEvent.setup();

    // Mock API returning BACKEND_NOT_CONFIGURED
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: siteConfig.enquiryConfig.demoModeNotice,
        previewPayload: {
          parentName: 'Jane Tan',
          contact: '91234567',
          studentAge: 14,
          codingExperience: 'Complete Beginner (Never coded before)',
          preferredCourse: 'Beginner Python',
        },
      }),
    });

    render(<TrialEnquiryForm />);

    // Fill valid form
    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Jane Tan');
    await user.type(screen.getByLabelText(/contact info/i), '91234567');
    await user.type(screen.getByLabelText(/student age/i), '14');
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

    // Verify preview notice is rendered
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /pre-launch mode: client validation successful/i,
        })
      ).toBeInTheDocument();
    });

    // CRITICAL: Ensure NO false delivery claim
    expect(screen.queryByText(/trial enquiry received/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/your enquiry has been delivered/i)).not.toBeInTheDocument();

    // Verify payload preview is visible
    expect(screen.getByText(/Jane Tan/)).toBeInTheDocument();
    expect(screen.getByText(/91234567/)).toBeInTheDocument();

    // Direct WhatsApp link exists
    const whatsappLink = screen.getByRole('link', { name: /direct whatsapp/i });
    expect(whatsappLink).toHaveAttribute('href', siteConfig.brand.contact.whatsappUrl);
  });

  it('displays verified delivery confirmation with 24h timeline when backend returns DELIVERED', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        status: 'DELIVERED',
        enquiryId: 'BC-TR-TEST-999',
        message: 'Enquiry successfully delivered.',
      }),
    });

    render(<TrialEnquiryForm />);

    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Rachel Tan');
    await user.type(screen.getByLabelText(/contact info/i), 'parent@example.com');
    await user.type(screen.getByLabelText(/student age/i), '15');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Some Self-Taught Python or Web Basics'
    );
    await user.selectOptions(
      screen.getByLabelText(/preferred course/i),
      'Introductory Web Development'
    );

    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    await waitFor(() => {
      expect(screen.getByText(/trial enquiry received/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/BC-TR-TEST-999/)).toBeInTheDocument();
    expect(screen.getByText(/24-hour review/i)).toBeInTheDocument();
    expect(screen.getByText(/laptop setup/i)).toBeInTheDocument();
  });

  it('displays error banner and preserves inputs when API returns server error', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<TrialEnquiryForm />);

    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'David Wong');
    await user.type(screen.getByLabelText(/contact info/i), '98765432');
    await user.type(screen.getByLabelText(/student age/i), '16');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Block Coding Only (Scratch / Micro:bit)'
    );
    await user.selectOptions(
      screen.getByLabelText(/preferred course/i),
      'Beginner Python'
    );

    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    await waitFor(() => {
      expect(screen.getByText(/submission error/i)).toBeInTheDocument();
    });

    // Inputs should be preserved
    expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('David Wong');
    expect(screen.getByLabelText(/contact info/i)).toHaveValue('98765432');
  });

  it('allows user to return to edit mode from pre-launch preview mode', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: 'Pre-launch mode',
        previewPayload: {
          parentName: 'Sam Lim',
          contact: '91234567',
          studentAge: 13,
          codingExperience: 'Complete Beginner (Never coded before)',
          preferredCourse: 'Beginner Python',
        },
      }),
    });

    render(<TrialEnquiryForm />);

    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Sam Lim');
    await user.type(screen.getByLabelText(/contact info/i), '91234567');
    await user.type(screen.getByLabelText(/student age/i), '13');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Complete Beginner (Never coded before)'
    );
    await user.selectOptions(
      screen.getByLabelText(/preferred course/i),
      'Beginner Python'
    );

    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    await waitFor(() => {
      expect(screen.getByText(/pre-launch mode: client validation successful/i)).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: /edit enquiry details/i });
    await user.click(editBtn);

    // Form inputs should reappear with values intact
    expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('Sam Lim');
  });

  it('renders PDPA privacy assurance note at the bottom of the form', () => {
    render(<TrialEnquiryForm />);
    expect(screen.getByText(/privacy & data protection/i)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.enquiryConfig.privacyGuarantee)).toBeInTheDocument();
  });
});
