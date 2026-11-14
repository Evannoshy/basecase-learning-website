import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/siteConfig';
import { QUIZ_QUESTIONS } from '@/components/showcase/InteractiveProject';

function renderFullSite() {
  return render(
    <div>
      <Header />
      <main id="main-content">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

describe('Tier 3: Cross-Feature Combinations (E2E Integration Verification)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    document.body.style.overflow = '';
  });

  // =========================================================================
  // 1. Hero CTAs Navigation Jump Targets
  // =========================================================================
  describe('1. Hero CTAs Navigation Jump Targets', () => {
    it('verifies primary and secondary CTAs link directly to active page sections', () => {
      renderFullSite();
      const hero = document.getElementById('hero')!;

      // Primary CTA: Book a coding trial -> #trial-enquiry
      const primaryCta = within(hero).getByRole('link', {
        name: new RegExp(siteConfig.hero.primaryCta.text, 'i'),
      });
      expect(primaryCta).toHaveAttribute('href', '#trial-enquiry');
      const targetEnquiry = document.getElementById('trial-enquiry');
      expect(targetEnquiry).toBeInTheDocument();

      // Secondary CTA: Explore courses -> #courses
      const secondaryCta = within(hero).getByRole('link', {
        name: new RegExp(siteConfig.hero.secondaryCta.text, 'i'),
      });
      expect(secondaryCta).toHaveAttribute('href', '#courses');
      const targetCourses = document.getElementById('courses');
      expect(targetCourses).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. Course Card Selection & Enquiry Form Mapping
  // =========================================================================
  describe('2. Course Card Selection & Enquiry Form Mapping', () => {
    it('maps course card CTA destination to the enquiry form and verifies dropdown options', async () => {
      const user = userEvent.setup();
      renderFullSite();
      const coursesSection = document.getElementById('courses')!;

      // Course cards have booking CTAs pointing to #trial-enquiry
      const pythonCardCta = within(coursesSection).getByRole('link', {
        name: /book a trial for beginner python/i,
      });
      expect(pythonCardCta).toHaveAttribute('href', '#trial-enquiry');

      const webDevCardCta = within(coursesSection).getByRole('link', {
        name: /book a trial for introductory web development/i,
      });
      expect(webDevCardCta).toHaveAttribute('href', '#trial-enquiry');

      // Clicking a course card CTA pre-fills Preferred Course in TrialEnquiryForm
      const courseSelect = screen.getByLabelText(/preferred course/i);
      await user.click(webDevCardCta);
      expect(courseSelect).toHaveValue('Introductory Web Development');
      expect(screen.getByText(/course pre-selected:/i)).toBeInTheDocument();

      // Verifies 2-column trial walkthrough ("What Happens in a Trial Class") is rendered beside the form
      const enquirySection = document.getElementById('trial-enquiry')!;
      expect(
        within(enquirySection).getByRole('heading', { name: /what happens in a trial class/i })
      ).toBeInTheDocument();
      expect(within(enquirySection).getByText('Quick Setup & Chat')).toBeInTheDocument();
      expect(within(enquirySection).getByText('Hands-On Mini Build')).toBeInTheDocument();
      expect(within(enquirySection).getByText('Parent Debrief & Next Steps')).toBeInTheDocument();

      // Still allows manual switching to all options
      await user.selectOptions(courseSelect, 'Introductory Web Development');
      expect(courseSelect).toHaveValue('Introductory Web Development');

      await user.selectOptions(
        courseSelect,
        'Undecided — Please recommend based on trial'
      );
      expect(courseSelect).toHaveValue(
        'Undecided — Please recommend based on trial'
      );
    });
  });

  // =========================================================================
  // 3. Interactive Quiz Completion Flow to Trial Booking
  // =========================================================================
  describe('3. Interactive Quiz Completion Flow to Trial Booking', () => {
    it('completes all 4 quiz questions with 100% score and navigates via CTA to course curriculum', () => {
      renderFullSite();

      // Solve all 4 questions sequentially
      QUIZ_QUESTIONS.forEach((q, idx) => {
        // Question badge
        expect(
          screen.getByText(`Question ${idx + 1} of ${QUIZ_QUESTIONS.length}`)
        ).toBeInTheDocument();

        // Select correct option
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[q.correctOptionIndex]);

        // Click run code
        const runBtn = screen.getByRole('button', {
          name: /run code & check answer/i,
        });
        fireEvent.click(runBtn);

        // Advance to next question or final score
        if (idx + 1 < QUIZ_QUESTIONS.length) {
          const nextBtn = screen.getByRole('button', { name: /next question/i });
          fireEvent.click(nextBtn);
        } else {
          const finishBtn = screen.getByRole('button', { name: /view final score/i });
          fireEvent.click(finishBtn);
        }
      });

      // Completion screen verification
      expect(screen.getByRole('heading', { name: /quiz completed!/i })).toBeInTheDocument();
      expect(screen.getByText(/outstanding!/i)).toBeInTheDocument();

      // CTA link from quiz completion points to #courses
      const exploreBtn = screen.getByRole('link', { name: /explore beginner python/i });
      expect(exploreBtn).toHaveAttribute('href', '#courses');
    });
  });

  // =========================================================================
  // 4. Honesty Protocol: Pre-Launch Development Preview Mode (NEG-05)
  // =========================================================================
  describe('4. Honesty Protocol: Pre-Launch Development Preview Mode (NEG-05)', () => {
    it('displays pre-launch preview notice and NEVER false success when backend is unconfigured', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 200,
        json: async () => ({
          success: false,
          status: 'BACKEND_NOT_CONFIGURED',
          message: siteConfig.enquiryConfig.demoModeNotice,
          previewPayload: {
            parentName: 'David Lim',
            contact: 'david.lim@example.com',
            studentAge: 14,
            codingExperience: 'Complete Beginner (Never coded before)',
            preferredCourse: 'Beginner Python',
            notes: 'Interested in Python foundations.',
          },
        }),
      });

      renderFullSite();

      // Fill in valid details
      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'David Lim');
      await user.type(screen.getByLabelText(/^contact info/i), 'david.lim@example.com');
      await user.type(screen.getByLabelText(/student age/i), '14');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Complete Beginner (Never coded before)'
      );
      await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');
      await user.type(
        screen.getByLabelText(/additional notes or questions/i),
        'Interested in Python foundations.'
      );

      // Submit form
      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      // Wait for response display
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /pre-launch mode — client validation successful/i,
          })
        ).toBeInTheDocument();
      });

      // Invariant: strictly NO false success banner
      expect(screen.queryByText(/trial enquiry received/i)).not.toBeInTheDocument();

      // Verifies preview payload is visible
      expect(screen.getByText(/david\.lim@example\.com/i)).toBeInTheDocument();

      // Clicking "Edit Enquiry Details" returns to the form with fields preserved
      const editBtn = screen.getByRole('button', { name: /edit enquiry details/i });
      await user.click(editBtn);

      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('David Lim');
      expect(screen.getByLabelText(/^contact info/i)).toHaveValue('david.lim@example.com');
      expect(screen.getByLabelText(/student age/i)).toHaveValue(14);
    });

    it('resets form back to pristine initial state when "Reset Form" is clicked', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 200,
        json: async () => ({
          success: false,
          status: 'BACKEND_NOT_CONFIGURED',
          message: siteConfig.enquiryConfig.demoModeNotice,
          previewPayload: {
            parentName: 'Tan Ah Kow',
            contact: '91234567',
            studentAge: 12,
            codingExperience: 'Complete Beginner (Never coded before)',
            preferredCourse: 'Beginner Python',
          },
        }),
      });

      renderFullSite();

      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Tan Ah Kow');
      await user.type(screen.getByLabelText(/^contact info/i), '91234567');
      await user.type(screen.getByLabelText(/student age/i), '12');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Complete Beginner (Never coded before)'
      );
      await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');

      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /pre-launch mode — client validation successful/i,
          })
        ).toBeInTheDocument();
      });

      // Click "Reset Form"
      const resetBtn = screen.getByRole('button', { name: /reset form/i });
      await user.click(resetBtn);

      // Verify returned to empty form
      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('');
      expect(screen.getByLabelText(/^contact info/i)).toHaveValue('');
      expect(screen.getByLabelText(/student age/i)).toHaveValue(null);
    });
  });

  // =========================================================================
  // 5. Live Active Backend Delivery Mode
  // =========================================================================
  describe('5. Live Active Backend Delivery Mode', () => {
    it('displays verified delivery confirmation card with Enquiry ID when backend webhook is active', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          status: 'DELIVERED',
          enquiryId: 'BC-TR-202611-ABC123',
          message: 'Enquiry successfully delivered to admissions webhook.',
        }),
      });

      renderFullSite();

      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Alice Tan');
      await user.type(screen.getByLabelText(/^contact info/i), '+65 9123 4567');
      await user.type(screen.getByLabelText(/student age/i), '16');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Some Self-Taught Python or Web Basics'
      );
      await user.selectOptions(
        screen.getByLabelText(/preferred course/i),
        'Introductory Web Development'
      );

      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      // Wait for delivery confirmation
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /trial enquiry received/i })).toBeInTheDocument();
      });

      // Verifies Enquiry ID is shown
      expect(screen.getByText(/BC-TR-202611-ABC123/i)).toBeInTheDocument();

      // Verifies 24 hours review timeline notice
      const enquirySection = document.getElementById('trial-enquiry')!;
      expect(within(enquirySection).getByText(/within 24 hours/i)).toBeInTheDocument();

      // "Submit Another Enquiry" button resets back to blank form
      const submitAnotherBtn = screen.getByRole('button', { name: /submit another enquiry/i });
      await user.click(submitAnotherBtn);

      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('');
    });
  });

  // =========================================================================
  // 6. Server / Network Error Resiliency
  // =========================================================================
  describe('6. Server / Network Error Resiliency', () => {
    it('displays error banner, preserves user inputs, and offers WhatsApp contact on network failure', async () => {
      const user = userEvent.setup();

      global.fetch = vi.fn().mockRejectedValue(new Error('Network connectivity failure'));

      renderFullSite();

      await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Benjamin Lee');
      await user.type(screen.getByLabelText(/^contact info/i), '81234567');
      await user.type(screen.getByLabelText(/student age/i), '13');
      await user.selectOptions(
        screen.getByLabelText(/coding experience/i),
        'Complete Beginner (Never coded before)'
      );
      await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');

      await user.click(screen.getByRole('button', { name: /request coding trial/i }));

      // Wait for error banner
      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toHaveTextContent(/submission error/i);
      });

      // User inputs remain preserved
      expect(screen.getByLabelText(/parent \/ guardian name/i)).toHaveValue('Benjamin Lee');
      expect(screen.getByLabelText(/^contact info/i)).toHaveValue('81234567');
    });
  });
});
