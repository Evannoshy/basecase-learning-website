import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import HomePage from '@/app/page';
import { siteConfig } from '@/config/siteConfig';

/**
 * Shared helper rendering the unified shell: Header + Main HomePage + Footer
 */
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

describe('Tier 1: Feature Coverage (E2E Full Platform Verification)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  // =========================================================================
  // 1. Semantic Landmarks & Document Heading Hierarchy
  // =========================================================================
  describe('1. Semantic Landmarks & Heading Hierarchy', () => {
    it('renders all required HTML5 semantic landmarks and skip-to-main link', () => {
      const { container } = renderFullSite();

      // Landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
      const main = container.querySelector('main#main-content');
      expect(main).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // <footer>

      // All 8 sections are present with proper IDs
      const expectedSections = [
        'hero',
        'courses',
        'projects',
        'how-learning-works',
        'mentors',
        'progression',
        'faqs',
        'trial-enquiry',
      ];
      expectedSections.forEach((sectionId) => {
        const sec = document.getElementById(sectionId);
        expect(sec, `Section #${sectionId} must be present`).toBeInTheDocument();
        expect(sec?.tagName.toLowerCase()).toBe('section');
      });

      // Exactly one H1 in the document (Hero section)
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBe(1);
      expect(h1Elements[0]).toHaveTextContent(siteConfig.hero.headline);

      // Section H2 headings
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(7);
    });
  });

  // =========================================================================
  // 2. Navigation Header & Responsive Drawer
  // =========================================================================
  describe('2. Navigation Header & Responsive Drawer', () => {
    it('renders brand identity, desktop links, roadmap badge, and CTA button', () => {
      renderFullSite();

      // Brand Logo
      const brandLinks = screen.getAllByRole('link', { name: new RegExp(siteConfig.brand.name, 'i') });
      expect(brandLinks.length).toBeGreaterThanOrEqual(1);
      expect(brandLinks[0]).toHaveAttribute('href', '#main-content');

      // Desktop navigation links inside header
      const header = screen.getByRole('banner');
      const coursesLinks = within(header).getAllByRole('link', { name: /courses/i });
      expect(coursesLinks.some((l) => l.getAttribute('href') === '#courses')).toBe(true);

      const projectsLinks = within(header).getAllByRole('link', { name: /projects/i });
      expect(projectsLinks.some((l) => l.getAttribute('href') === '#projects')).toBe(true);

      const howItWorksLinks = within(header).getAllByRole('link', { name: /how learning works/i });
      expect(howItWorksLinks.some((l) => l.getAttribute('href') === '#how-learning-works')).toBe(true);

      const mentorsLinks = within(header).getAllByRole('link', { name: /mentors/i });
      expect(mentorsLinks.some((l) => l.getAttribute('href') === '#mentors')).toBe(true);

      const progressionLinks = within(header).getAllByRole('link', { name: /^progression$/i });
      expect(progressionLinks.some((l) => l.getAttribute('href') === '#progression')).toBe(true);

      // Primary navigation stays focused on coding (does not advertise unavailable tuition classes)
      expect(within(header).queryByRole('link', { name: /academic tuition/i })).not.toBeInTheDocument();

      const faqsLinks = within(header).getAllByRole('link', { name: /faqs/i });
      expect(faqsLinks.some((l) => l.getAttribute('href') === '#faqs')).toBe(true);

      // Header CTA
      const headerCtas = within(header).getAllByRole('link', { name: /book a coding trial/i });
      expect(headerCtas.length).toBeGreaterThanOrEqual(1);
      expect(headerCtas[0]).toHaveAttribute('href', '#trial-enquiry');
    });

    it('manages mobile drawer toggle states and body scroll lock', () => {
      renderFullSite();
      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      const drawer = document.getElementById('mobile-navigation-drawer');

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass('hidden');

      // Open drawer
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(drawer).not.toHaveClass('hidden');
      expect(document.body.style.overflow).toBe('hidden');

      // Close drawer via Escape key
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveClass('hidden');
      expect(document.body.style.overflow).toBe('');
    });
  });

  // =========================================================================
  // 3. Section 1: Hero Section
  // =========================================================================
  describe('3. Hero Section (#hero)', () => {
    it('renders headline, value highlights, and primary & secondary CTAs', () => {
      renderFullSite();
      const hero = document.getElementById('hero')!;

      expect(within(hero).getByRole('heading', { level: 1 })).toHaveTextContent(siteConfig.hero.headline);
      expect(within(hero).getByText(siteConfig.hero.subheadline)).toBeInTheDocument();

      const primaryCta = within(hero).getByRole('link', { name: new RegExp(siteConfig.hero.primaryCta.text, 'i') });
      expect(primaryCta).toHaveAttribute('href', siteConfig.hero.primaryCta.href);

      const secondaryCta = within(hero).getByRole('link', { name: new RegExp(siteConfig.hero.secondaryCta.text, 'i') });
      expect(secondaryCta).toHaveAttribute('href', siteConfig.hero.secondaryCta.href);

      // Value highlights
      siteConfig.hero.highlights.forEach((hl) => {
        expect(within(hero).getByText(hl)).toBeInTheDocument();
      });

      // Code preview card
      expect(within(hero).getAllByText(/quiz_project\.py/i).length).toBeGreaterThanOrEqual(1);
      expect(within(hero).getByText(/Python 3\.12/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. Section 2: Course Options
  // =========================================================================
  describe('4. Course Options (#courses)', () => {
    it('renders all courses with audience, prerequisites, learning goals, and unconfirmed badges', () => {
      renderFullSite();
      const section = document.getElementById('courses')!;

      siteConfig.courses.forEach((course) => {
        expect(within(section).getByRole('heading', { name: course.title })).toBeInTheDocument();
        expect(within(section).getByText(course.intendedLearner)).toBeInTheDocument();
        expect(within(section).getByText(course.prerequisites)).toBeInTheDocument();

        // Learning goals
        course.learningGoals.forEach((goal) => {
          expect(within(section).getByText(goal)).toBeInTheDocument();
        });

        // Example final project
        expect(within(section).getByText(course.exampleFinalProject.title)).toBeInTheDocument();

        // Unconfirmed operational details notice (NEG-04)
        const disclaimers = within(section).getAllByText(course.unconfirmedDetails.disclaimer);
        expect(disclaimers.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  // =========================================================================
  // 5. Section 3: Project Showcase & Interactive Widget
  // =========================================================================
  describe('5. Project Showcase & Interactive Widget (#projects)', () => {
    it('renders category filter buttons and authenticity badge', () => {
      renderFullSite();
      const section = document.getElementById('projects')!;
      const filterGroup = within(section).getByRole('group', { name: /filter projects by track/i });

      expect(within(filterGroup).getByRole('button', { name: /all examples/i })).toBeInTheDocument();
      expect(within(filterGroup).getByRole('button', { name: 'Python' })).toBeInTheDocument();
      expect(within(filterGroup).getByRole('button', { name: 'Web Development' })).toBeInTheDocument();
      expect(within(filterGroup).getByRole('button', { name: 'Study Tool' })).toBeInTheDocument();

      // Authenticity transparency notice badge
      expect(
        within(section).getByText(/sample curriculum projects to show what classes aim toward/i)
      ).toBeInTheDocument();
    });

    it('filters project cards by category selection', () => {
      renderFullSite();
      const section = document.getElementById('projects')!;
      const filterGroup = within(section).getByRole('group', { name: /filter projects by track/i });

      // Click Web Development filter
      fireEvent.click(within(filterGroup).getByRole('button', { name: 'Web Development' }));
      expect(within(section).getByText('Personal Website')).toBeInTheDocument();
      expect(within(section).queryByText('Pomodoro Study Timer')).not.toBeInTheDocument();

      // Reset to All
      fireEvent.click(within(filterGroup).getByRole('button', { name: /all examples/i }));
      expect(within(section).getByText('Personal Website')).toBeInTheDocument();
      expect(within(section).getByText('Pomodoro Study Timer')).toBeInTheDocument();
    });

    it('expands and collapses student project code snippet preview', () => {
      renderFullSite();
      const section = document.getElementById('projects')!;

      const expandBtns = within(section).getAllByRole('button', { name: /expand code snippet/i });
      expect(expandBtns.length).toBeGreaterThanOrEqual(1);

      fireEvent.click(expandBtns[0]);
      expect(within(section).getAllByRole('button', { name: /collapse code snippet/i }).length).toBeGreaterThanOrEqual(1);

      const collapseBtn = within(section).getAllByRole('button', { name: /collapse code snippet/i })[0];
      fireEvent.click(collapseBtn);
      expect(within(section).getAllByRole('button', { name: /expand code snippet/i }).length).toBe(expandBtns.length);
    });

    it('renders playable interactive Python Logic Quiz runner', () => {
      renderFullSite();
      expect(screen.getByRole('heading', { name: /interactive python logic quiz/i })).toBeInTheDocument();
      expect(screen.getByText(/try it live/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /run code & check answer/i })).toBeInTheDocument();
      expect(screen.getByRole('progressbar', { name: /quiz progress/i })).toBeInTheDocument();
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 6. Section 4: How Learning Works Pedagogy
  // =========================================================================
  describe('6. How Learning Works Pedagogy (#how-learning-works)', () => {
    it('renders 4-stage sequential cycle clearly', () => {
      renderFullSite();
      const section = document.getElementById('how-learning-works')!;

      siteConfig.learningStages.forEach((stage) => {
        expect(section.textContent).toContain(`Step 0${stage.step}`);
        expect(within(section).getByText(stage.title)).toBeInTheDocument();
        expect(within(section).getByText(stage.description)).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // 7. Section 5: Meet the Mentors
  // =========================================================================
  describe('7. Meet the Mentors (#mentors)', () => {
    it('renders authentic NUS Computing mentor profiles without university logos', () => {
      renderFullSite();
      const section = document.getElementById('mentors')!;

      siteConfig.mentors.forEach((mentor) => {
        expect(within(section).getByRole('heading', { name: mentor.name })).toBeInTheDocument();
        expect(section.textContent).toContain(mentor.degreeProgram);
        expect(section.textContent).toContain(mentor.institution);
        expect(section.textContent).toContain(mentor.teachingExperience);

        mentor.innovationBadges.forEach((badge) => {
          expect(within(section).getAllByText(badge).length).toBeGreaterThan(0);
        });
      });

      // No university logos or generic stock images (NEG-01, NEG-07)
      expect(section.querySelectorAll('img').length).toBe(0);

      // Prominent institutional independence disclaimer (NEG-08)
      const disclaimerBox = within(section).getByRole('note', { name: /institutional independence disclaimer/i });
      expect(disclaimerBox).toHaveTextContent(/independent tuition initiative/i);
      expect(disclaimerBox).toHaveTextContent(/not affiliated with/i);
    });
  });

  // =========================================================================
  // 8. Section 6: Learning Progression Pathway
  // =========================================================================
  describe('8. Learning Progression Pathway (#progression)', () => {
    it('renders 4 progression levels and distinguishes available courses from roadmap', () => {
      renderFullSite();
      const section = document.getElementById('progression')!;

      siteConfig.progressionStages.forEach((stage) => {
        expect(section.textContent).toContain(`LEVEL 0${stage.level}`);
        expect(within(section).getByText(stage.title)).toBeInTheDocument();
        expect(within(section).getAllByText(stage.stageBadge).length).toBeGreaterThan(0);
      });

      // Explicit academic tuition footnote
      expect(
        within(section).getByText(/not open for enrolment yet/i)
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 9. Section 7: Parent FAQs Accordion
  // =========================================================================
  describe('9. Parent FAQs Accordion (#faqs)', () => {
    it('renders all FAQ questions with accessible disclosure and default open item', () => {
      renderFullSite();
      const section = document.getElementById('faqs')!;

      siteConfig.faqs.forEach((faq) => {
        expect(within(section).getByText(faq.question)).toBeInTheDocument();
      });

      // Default open item ("faq-beginner")
      const firstAnswer = within(section).getByText(siteConfig.faqs[0].answer);
      expect(firstAnswer).toBeVisible();
    });
  });

  // =========================================================================
  // 10. Section 8: Trial Enquiry Form
  // =========================================================================
  describe('10. Trial Enquiry Form (#trial-enquiry)', () => {
    it('renders all required form fields with semantic label associations', () => {
      renderFullSite();
      const section = document.getElementById('trial-enquiry')!;

      const parentNameInput = within(section).getByLabelText(/parent \/ guardian name/i);
      expect(parentNameInput).toHaveAttribute('id', 'enquiry-parentName');
      expect(parentNameInput).toHaveAttribute('aria-required', 'true');

      const contactInput = within(section).getByLabelText(/^contact info/i);
      expect(contactInput).toHaveAttribute('id', 'enquiry-contact');
      expect(contactInput).toHaveAttribute('aria-required', 'true');

      const studentAgeInput = within(section).getByLabelText(/student age/i);
      expect(studentAgeInput).toHaveAttribute('id', 'enquiry-studentAge');
      expect(studentAgeInput).toHaveAttribute('aria-required', 'true');

      const expSelect = within(section).getByLabelText(/coding experience/i);
      expect(expSelect).toHaveAttribute('id', 'enquiry-codingExperience');
      expect(expSelect).toHaveAttribute('aria-required', 'true');

      const courseSelect = within(section).getByLabelText(/preferred course/i);
      expect(courseSelect).toHaveAttribute('id', 'enquiry-preferredCourse');
      expect(courseSelect).toHaveAttribute('aria-required', 'true');

      const notesTextarea = within(section).getByLabelText(/additional notes or questions/i);
      expect(notesTextarea).toHaveAttribute('id', 'enquiry-notes');

      // Submit button
      expect(within(section).getByRole('button', { name: /request coding trial/i })).toBeInTheDocument();

      // PDPA Privacy assurance statement (NEG-10)
      expect(within(section).getByText(/we only use these details to reply to your trial enquiry/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 11. Global Footer
  // =========================================================================
  describe('11. Global Footer (Contentinfo Landmark)', () => {
    it('renders 4 navigation columns, disclaimers, PDPA statement, and current copyright', () => {
      renderFullSite();
      const footer = screen.getByRole('contentinfo');

      // Brand description
      expect(within(footer).getByText(siteConfig.brand.description)).toBeInTheDocument();

      // Disclaimers
      expect(footer.textContent).toContain(siteConfig.brand.disclaimers.universityIndependence);
      expect(footer.textContent).toContain(siteConfig.brand.disclaimers.operationalPricing);

      // PDPA Notice
      expect(within(footer).getByText(/under Singapore’s PDPA/i)).toBeInTheDocument();

      // Copyright with year
      const currentYear = new Date().getFullYear().toString();
      expect(within(footer).getByText(new RegExp(currentYear))).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 12. Central Config Integrity
  // =========================================================================
  describe('12. Central Config-Driven Integrity', () => {
    it('verifies rendered text matches siteConfig properties with zero hardcoded drift', () => {
      renderFullSite();

      // Verify exact brand name rendered in title/header
      expect(screen.getAllByText(new RegExp(siteConfig.brand.name, 'i')).length).toBeGreaterThan(0);

      // Verify each course title comes from config
      siteConfig.courses.forEach((course) => {
        expect(screen.getAllByText(course.title).length).toBeGreaterThan(0);
      });

      // Verify each mentor name comes from config
      siteConfig.mentors.forEach((mentor) => {
        expect(screen.getAllByText(mentor.name).length).toBeGreaterThan(0);
      });
    });
  });
});
