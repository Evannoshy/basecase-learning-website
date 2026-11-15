import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import { Showcase } from '@/components/sections/Showcase';
import { Courses } from '@/components/sections/Courses';
import { Progression } from '@/components/sections/Progression';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/siteConfig';

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

describe('Tier 4: Real-World Scenarios (End-to-End User Journeys)', () => {
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
  // Journey 1: Cautious Parent Evaluating Academy Credibility & Submitting Enquiry
  // =========================================================================
  it('Journey 1: Cautious parent evaluates academy credibility, disclaimers, AI policy, and submits trial enquiry', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: siteConfig.enquiryConfig.demoModeNotice,
        previewPayload: {
          parentName: 'Serene Tan',
          contact: 'serene.tan@gmail.com',
          studentAge: 13,
          codingExperience: 'Complete Beginner (Never coded before)',
          preferredCourse: 'Beginner Python',
          notes: 'Strong interest in math puzzles and computational thinking.',
        },
      }),
    });

    renderFullSite();
    render(<Courses />);

    // 1. Inspects Hero headline and confirms no stock photos
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(siteConfig.hero.headline);
    const hero = document.getElementById('hero')!;
    expect(hero.querySelectorAll('img').length).toBe(0);

    // 2. Inspects Course offerings and reads operational transparency disclaimer
    const courses = document.getElementById('courses')!;
    expect(within(courses).getByRole('heading', { name: 'Beginner Python' })).toBeInTheDocument();
    expect(within(courses).getAllByText(siteConfig.courses[0].unconfirmedDetails.disclaimer).length).toBeGreaterThan(0);

    // 3. Inspects Mentors section: verifies NUS Computing context without fabricated names/logos
    const mentors = document.getElementById('mentors')!;
    expect(within(mentors).getByRole('heading', { name: 'Founding Mentor 01 (Profile TBC)' })).toBeInTheDocument();
    expect(within(mentors).getByRole('heading', { name: 'Evan Tan' })).toBeInTheDocument();
    expect(mentors.textContent).toContain('National University of Singapore (Undergraduate)');
    expect(mentors.querySelectorAll('img').length).toBe(1);

    // 4. Reads Institutional Independence Disclaimer note
    const disclaimer = within(mentors).getByRole('note', { name: /institutional independence disclaimer/i });
    expect(disclaimer).toHaveTextContent(/not affiliated with/i);

    // 5. Locates Parent FAQs question covering AI tools policy
    const faqs = document.getElementById('faqs')!;
    expect(within(faqs).getByText(/what is your policy on chatgpt and ai coding tools/i)).toBeInTheDocument();

    // 6. Fills in the enquiry form with genuine details
    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Serene Tan');
    await user.type(screen.getByLabelText(/^contact info/i), 'serene.tan@gmail.com');
    await user.type(screen.getByLabelText(/student age/i), '13');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Complete Beginner (Never coded before)'
    );
    await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');
    await user.type(
      screen.getByLabelText(/additional notes or questions/i),
      'Strong interest in math puzzles and computational thinking.'
    );

    // 7. Submits form
    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    // 8. Verifies transparent Pre-Launch Preview notice without fake confirmation
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /pre-launch mode: client validation successful/i,
        })
      ).toBeInTheDocument();
    });
    expect(screen.queryByText(/trial enquiry received/i)).not.toBeInTheDocument();
    expect(screen.getByText(/serene\.tan@gmail\.com/i)).toBeInTheDocument();
  });

  // =========================================================================
  // Journey 2: Technically-Minded Parent & Student Exploring Curriculum & Testing Quiz
  // =========================================================================
  it('Journey 2: Technically-minded parent & student solve 4-question quiz, review pedagogy, and request trial', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: siteConfig.enquiryConfig.demoModeNotice,
        previewPayload: {
          parentName: 'Dr. Raymond Goh',
          contact: '+65 9876 5432',
          studentAge: 15,
          codingExperience: 'Block Coding Only (Scratch / Micro:bit)',
          preferredCourse: 'Beginner Python',
          notes: 'Completed the Python Logic Quiz with 100% score.',
        },
      }),
    });

    renderFullSite();
    render(<Showcase />);

    // 1. Filters projects by Python and expands code preview
    const projects = document.getElementById('projects')!;
    const filterGroup = within(projects).getByRole('group', { name: /filter projects by track/i });
    fireEvent.click(within(filterGroup).getByRole('button', { name: 'Python' }));

    const expandBtn = within(projects).getAllByRole('button', { name: /expand code snippet/i })[0];
    fireEvent.click(expandBtn);
    expect(within(projects).getAllByRole('button', { name: /collapse code snippet/i }).length).toBeGreaterThan(0);

    // 2. Reviews 4-stage pedagogy
    const pedagogy = document.getElementById('how-learning-works')!;
    expect(pedagogy.textContent).toContain('Independent Practice Drills');

    // 5. Proceeds to trial enquiry form
    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Dr. Raymond Goh');
    await user.type(screen.getByLabelText(/^contact info/i), '+65 9876 5432');
    await user.type(screen.getByLabelText(/student age/i), '15');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Block Coding Only (Scratch / Micro:bit)'
    );
    await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');
    await user.type(
      screen.getByLabelText(/additional notes or questions/i),
      'Completed the Python Logic Quiz with 100% score.'
    );

    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /pre-launch mode: client validation successful/i,
        })
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Journey 3: Parent Inquiring for Academic Computing Tuition (Roadmap)
  // =========================================================================
  it('Journey 3: Parent navigates via Academic Tuition roadmap badge and submits enquiry for future Sec 4 computing', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: siteConfig.enquiryConfig.demoModeNotice,
        previewPayload: {
          parentName: 'Mdm Kelly Koh',
          contact: '91234567',
          studentAge: 16,
          codingExperience: 'Taking School Computing (O-Level / A-Level / IB)',
          preferredCourse: 'Undecided (Please recommend during trial)',
          notes: 'Inquiring about Sec 4 O-Level Computing Syllabus 7155 tuition.',
        },
      }),
    });

    renderFullSite();
    render(<Progression />);

    // 1. Locates Pricing link in Header (keeping top nav focused on coding)
    const header = screen.getByRole('banner');
    const pricingLinks = within(header).getAllByRole('link', { name: /pricing/i });
    expect(pricingLinks.some((l) => l.getAttribute('href') === '/pricing')).toBe(true);

    // 2. Inspects Level 04 card in progression section
    const progression = document.getElementById('progression')!;
    expect(progression.textContent).toContain('Secondary & JC Academic Tuition');
    expect(within(progression).getAllByText(/planned \(not open yet\)/i).length).toBeGreaterThanOrEqual(1);

    // 3. Confirms academic tuition phased extension footnote
    expect(
      within(progression).getByText(/not open for enrolment yet/i)
    ).toBeInTheDocument();

    // 4. Scrolls to enquiry form and submits roadmap consultation
    await user.type(screen.getByLabelText(/parent \/ guardian name/i), 'Mdm Kelly Koh');
    await user.type(screen.getByLabelText(/^contact info/i), '91234567');
    await user.type(screen.getByLabelText(/student age/i), '16');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Taking School Computing (O-Level / A-Level / IB)'
    );
    await user.selectOptions(
      screen.getByLabelText(/preferred course/i),
      'Undecided (Please recommend during trial)'
    );
    await user.type(
      screen.getByLabelText(/additional notes or questions/i),
      'Inquiring about Sec 4 O-Level Computing Syllabus 7155 tuition.'
    );

    await user.click(screen.getByRole('button', { name: /request coding trial/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /pre-launch mode: client validation successful/i,
        })
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Journey 4: Mobile First-Time Parent Quick Enquiry & Error Recovery
  // =========================================================================
  it('Journey 4: Mobile parent triggers empty submission, recovers from validation alerts, and completes trial request', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 200,
      json: async () => ({
        success: false,
        status: 'BACKEND_NOT_CONFIGURED',
        message: siteConfig.enquiryConfig.demoModeNotice,
        previewPayload: {
          parentName: 'Rachel Tan',
          contact: '81234567',
          studentAge: 11,
          codingExperience: 'Complete Beginner (Never coded before)',
          preferredCourse: 'Beginner Python',
        },
      }),
    });

    renderFullSite();

    // 1. Opens mobile drawer and navigates to trial form
    const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    const drawer = document.getElementById('mobile-navigation-drawer')!;
    const drawerCta = within(drawer).getByRole('link', { name: /book a coding trial/i });
    fireEvent.click(drawerCta);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    // 2. Accidentally clicks Submit on blank form
    const submitBtn = screen.getByRole('button', { name: /request coding trial/i });
    await user.click(submitBtn);

    // 3. Verifies inline role="alert" messages and focus shift to parentName
    expect(screen.getAllByRole('alert').length).toBe(5);
    const parentNameInput = screen.getByLabelText(/parent \/ guardian name/i);
    expect(document.activeElement).toBe(parentNameInput);

    // 4. Enters name, then inputs invalid 7-digit contact number
    await user.type(parentNameInput, 'Rachel Tan');
    const contactInput = screen.getByLabelText(/^contact info/i);
    await user.type(contactInput, '8123456');
    fireEvent.blur(contactInput);

    // Verifies contact error alert is displayed
    const contactAlert = document.getElementById('enquiry-contact-error');
    expect(contactAlert).toBeInTheDocument();

    // 5. Corrects contact to valid 8-digit Singapore mobile
    await user.clear(contactInput);
    await user.type(contactInput, '81234567');
    fireEvent.blur(contactInput);
    expect(document.getElementById('enquiry-contact-error')).not.toBeInTheDocument();

    // 6. Fills remaining fields
    await user.type(screen.getByLabelText(/student age/i), '11');
    await user.selectOptions(
      screen.getByLabelText(/coding experience/i),
      'Complete Beginner (Never coded before)'
    );
    await user.selectOptions(screen.getByLabelText(/preferred course/i), 'Beginner Python');

    // 7. Submits successfully
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /pre-launch mode: client validation successful/i,
        })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/81234567/)).toBeInTheDocument();
  });
});
