import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { Courses } from '@/components/sections/Courses';
import { HowLearningWorks } from '@/components/sections/HowLearningWorks';
import { Mentors } from '@/components/sections/Mentors';
import { Progression } from '@/components/sections/Progression';
import { siteConfig } from '@/config/siteConfig';

describe('Hero Section Component', () => {
  it('renders exact headline verbatim in h1', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Learn to code. Build something you’re proud of.');
    expect(heading).toHaveAttribute('id', 'hero-heading');
  });

  it('renders primary CTA linking to #trial-enquiry and secondary CTA linking to #courses', () => {
    render(<Hero />);
    const primaryCta = screen.getByRole('link', { name: /book a coding trial/i });
    expect(primaryCta).toHaveAttribute('href', '#trial-enquiry');

    const secondaryCta = screen.getByRole('link', { name: /explore courses/i });
    expect(secondaryCta).toHaveAttribute('href', '#courses');
  });

  it('renders all 4 value proposition highlights', () => {
    render(<Hero />);
    siteConfig.hero.highlights.forEach((highlight) => {
      expect(screen.getByText(highlight)).toBeInTheDocument();
    });
  });

  it('renders programming visual card with class definition and terminal dots without stock photos', () => {
    const { container } = render(<Hero />);
    expect(screen.getByText('quiz_project.py')).toBeInTheDocument();
    expect(screen.getByText('StudentProject')).toBeInTheDocument();
    expect(screen.getByText(/\$ python quiz_project\.py/i)).toBeInTheDocument();

    // Verify zero generic stock img tags in Hero
    const images = container.querySelectorAll('img');
    expect(images.length).toBe(0);
  });
});

describe('Courses Section Component', () => {
  it('renders both Beginner Python and Introductory Web Development course cards', () => {
    render(<Courses />);
    expect(screen.getByRole('heading', { level: 3, name: 'Beginner Python' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Introductory Web Development' })).toBeInTheDocument();
  });

  it('renders intended learners, prerequisites, and learning goals for each course', () => {
    render(<Courses />);
    siteConfig.courses.forEach((course) => {
      expect(screen.getByText(course.intendedLearner)).toBeInTheDocument();
      expect(screen.getByText(course.prerequisites)).toBeInTheDocument();
      course.learningGoals.forEach((goal) => {
        expect(screen.getByText(goal)).toBeInTheDocument();
      });
    });
  });

  it('renders example final capstone project and tech stack tags', () => {
    render(<Courses />);
    expect(screen.getByText('Terminal Quiz Game & Score Tracker')).toBeInTheDocument();
    expect(screen.getByText('Personal Study Timer & Checklist')).toBeInTheDocument();
    expect(screen.getByText('Python 3')).toBeInTheDocument();
    expect(screen.getByText('GitHub Pages')).toBeInTheDocument();
  });

  it('renders operational transparency notices and enforces no invented pricing, ages, durations, or class sizes (NEG-04)', () => {
    render(<Courses />);
    // Notices for unconfirmed operational details rendered in the shared TBC bar
    expect(screen.getAllByText(/shared during consultation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fees shared upon consultation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Exact age groupings TBC before launch/i).length).toBeGreaterThanOrEqual(1);

    // Guardrail against rigid fabricated numbers
    expect(screen.queryByText(/\$480/)).toBeNull();
    expect(screen.queryByText(/\$500/)).toBeNull();
    expect(screen.queryByText(/4–6 students/)).toBeNull();
    expect(screen.queryByText(/8-to-10 week/)).toBeNull();
  });

  it('provides booking CTA links to #trial-enquiry for each course', () => {
    render(<Courses />);
    const pythonBooking = screen.getByRole('link', { name: /book a trial for beginner python/i });
    expect(pythonBooking).toHaveAttribute('href', '#trial-enquiry');

    const webBooking = screen.getByRole('link', { name: /book a trial for introductory web development/i });
    expect(webBooking).toHaveAttribute('href', '#trial-enquiry');
  });

  it('tucks prerequisites and lesson format into expandable details and dispatches selection on CTA click', () => {
    const spy = vi.fn();
    window.addEventListener('basecase:select-trial', spy);

    render(<Courses />);
    const detailsToggles = screen.getAllByText(/more details \(prerequisites & lesson format\)/i);
    expect(detailsToggles).toHaveLength(2);

    const pythonBooking = screen.getByRole('link', { name: /book a trial for beginner python/i });
    fireEvent.click(pythonBooking);
    expect(spy).toHaveBeenCalledTimes(1);

    window.removeEventListener('basecase:select-trial', spy);
  });
});

describe('HowLearningWorks Section Component', () => {
  it('renders all 4 pedagogical stages in sequential order', () => {
    render(<HowLearningWorks />);
    expect(screen.getByRole('heading', { level: 3, name: 'Understand the Concept' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Build with Guidance' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Solve a Challenge' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Get Feedback & Improve' })).toBeInTheDocument();

    expect(screen.getByText('Step 01')).toBeInTheDocument();
    expect(screen.getByText('Step 02')).toBeInTheDocument();
    expect(screen.getByText('Step 03')).toBeInTheDocument();
    expect(screen.getByText('Step 04')).toBeInTheDocument();
  });

  it('renders clear subtitle and description for each stage', () => {
    render(<HowLearningWorks />);
    siteConfig.learningStages.forEach((stage) => {
      expect(screen.getByText(stage.subtitle)).toBeInTheDocument();
      expect(screen.getByText(stage.description)).toBeInTheDocument();
    });
  });
});

describe('Mentors Section Component', () => {
  it('renders editable mentor profile templates with NUS undergraduate context and no invented people', () => {
    render(<Mentors />);
    expect(screen.getByRole('heading', { level: 3, name: 'Founding Mentor 01 (Profile TBC)' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Founding Mentor 02 (Profile TBC)' })).toBeInTheDocument();

    const undergraduateLabels = screen.getAllByText(/National University of Singapore \(Undergraduate\)/i);
    expect(undergraduateLabels).toHaveLength(2);
  });

  it('renders initial monogram avatars with accessible aria-label without broken images', () => {
    const { container } = render(<Mentors />);
    expect(screen.getByLabelText(/portrait placeholder for founding mentor 01/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/portrait placeholder for founding mentor 02/i)).toBeInTheDocument();

    // Verify zero img tags by default (no stock photos or unauthorized images)
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('renders provisional C Innovators and scholarship placeholders without fabricated awards (NEG-07)', () => {
    render(<Mentors />);
    const cInnovatorsBadges = screen.getAllByText(/"C Innovators" — official name TBC/i);
    expect(cInnovatorsBadges.length).toBeGreaterThanOrEqual(2);

    expect(screen.getAllByText(/Scholarship details to be confirmed/i).length).toBeGreaterThanOrEqual(2);
  });

  it('renders prominent university independence disclaimer in role="note" (NEG-08)', () => {
    render(<Mentors />);
    const disclaimerBox = screen.getByRole('note', { name: /institutional independence disclaimer/i });
    expect(disclaimerBox).toBeInTheDocument();
    expect(disclaimerBox).toHaveTextContent(siteConfig.brand.disclaimers.universityIndependence);
    expect(disclaimerBox).toHaveTextContent(/not affiliated with, sponsored by, or endorsed by the National University of Singapore/i);
  });
});

describe('Progression Section Component', () => {
  it('renders all 4 pathway progression levels', () => {
    render(<Progression />);
    expect(screen.getByRole('heading', { level: 3, name: 'Programming Foundations' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Guided Applied Projects' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Independent Building' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Secondary & JC Academic Tuition' })).toBeInTheDocument();
  });

  it('clearly demarcates available courses from upcoming roadmap (NEG-13)', () => {
    render(<Progression />);
    const availableBadges = screen.getAllByText('Available Now');
    expect(availableBadges).toHaveLength(2);

    expect(screen.getByText('Proposed Track')).toBeInTheDocument();
    expect(screen.getByText('Future Plan')).toBeInTheDocument();

    const inDevNotices = screen.getAllByText(/planned \(not open yet\)/i);
    expect(inDevNotices).toHaveLength(2);
  });

  it('renders syllabus focus topics and phased tuition extension notice', () => {
    render(<Progression />);
    expect(screen.getByText('Step-by-step logic')).toBeInTheDocument();
    expect(screen.getByText('O-Level Computing (7155)')).toBeInTheDocument();
    expect(screen.getByText('A-Level H2 Computing (9569)')).toBeInTheDocument();

    expect(screen.getByText(/not open for enrolment yet/i)).toBeInTheDocument();
  });
});
