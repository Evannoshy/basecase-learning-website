import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/config/siteConfig';

describe('Central siteConfig Integrity and Completeness', () => {
  it('should have the exact required brand information', () => {
    expect(siteConfig.brand.name).toBe('BaseCase Learning');
    expect(siteConfig.brand.tagline).toBeTruthy();
    expect(siteConfig.brand.description).toBeTruthy();
    expect(siteConfig.brand.contact.email).toContain('@');
    expect(siteConfig.brand.contact.phone).toBeTruthy();
  });

  it('should contain the mandatory university and scholarship independence disclaimer', () => {
    const disclaimer = siteConfig.brand.disclaimers.universityIndependence;
    expect(disclaimer).toContain('independent');
    expect(disclaimer).toContain('National University of Singapore');
    expect(disclaimer).toContain('scholarship');
  });

  it('should keep top navigation focused on coding and reserve academic tuition in futureNavigation', () => {
    const links = siteConfig.navigation;
    expect(links.length).toBeGreaterThanOrEqual(6);
    expect(links.some((l) => /academic tuition/i.test(l.label))).toBe(false);

    const futureLinks = siteConfig.futureNavigation || [];
    const tuitionLink = futureLinks.find((l) => l.isRoadmap === true);
    expect(tuitionLink).toBeDefined();
    expect(tuitionLink?.badge).toBe('Planned');
  });

  it('should contain both Beginner Python and Intro Web Dev courses with unconfirmed details', () => {
    expect(siteConfig.courses).toHaveLength(2);

    const pythonCourse = siteConfig.courses.find((c) => c.id === 'beginner-python');
    const webCourse = siteConfig.courses.find((c) => c.id === 'intro-web-dev');

    expect(pythonCourse).toBeDefined();
    expect(webCourse).toBeDefined();

    [pythonCourse, webCourse].forEach((course) => {
      expect(course?.intendedLearner).toBeTruthy();
      expect(course?.prerequisites).toBeTruthy();
      expect(course?.learningGoals.length).toBeGreaterThanOrEqual(4);
      expect(course?.exampleFinalProject.title).toBeTruthy();
      expect(course?.exampleFinalProject.techStack.length).toBeGreaterThan(0);
      expect(course?.lessonFormat).toBeTruthy();

      // Negative constraint: no fabricated firm pricing
      expect(course?.unconfirmedDetails.disclaimer).toBeTruthy();
      expect(course?.unconfirmedDetails.scheduleNotice).toContain('consultation');
    });
  });

  it('should contain showcase projects with at least one interactive item', () => {
    expect(siteConfig.showcaseProjects.length).toBeGreaterThanOrEqual(3);

    const interactiveProject = siteConfig.showcaseProjects.find((p) => p.isInteractive);
    expect(interactiveProject).toBeDefined();
    expect(interactiveProject?.interactiveComponentId).toBe('python-quiz-runner');
    expect(interactiveProject?.codeSnippetPreview.code).toBeTruthy();
  });

  it('should contain all 4 stages of learning with reasoning & debugging focus', () => {
    expect(siteConfig.learningStages).toHaveLength(4);
    const titles = siteConfig.learningStages.map((s) => s.title);
    expect(titles).toEqual([
      'Concept Breakdown & Notes',
      'Guided Class Walkthrough',
      'Independent Practice Drills',
      '1-on-1 Code Review & Feedback',
    ]);

    siteConfig.learningStages.forEach((stage) => {
      expect(stage.reasoningFocus).toBeTruthy();
      expect(stage.concreteExample).toBeTruthy();
    });
  });

  it('should list editable mentor profile templates with NUS student context and provisional C Innovators note without fabricated credentials', () => {
    expect(siteConfig.mentors.length).toBeGreaterThanOrEqual(2);

    siteConfig.mentors.forEach((mentor) => {
      expect(mentor.institution).toContain('National University of Singapore');
      expect(mentor.teachingExperience).toBeTruthy();
      expect(mentor.scholarships.length).toBeGreaterThan(0);
      expect(mentor.innovationBadges.some((b) => /C[- ]Innovators/i.test(b))).toBe(true);
      expect(mentor.avatarPlaceholderText).toMatch(/^[A-Z]{2}$/);
    });
  });

  it('should define progression stages clearly differentiating available from roadmap stages', () => {
    expect(siteConfig.progressionStages.length).toBe(4);

    const available = siteConfig.progressionStages.filter((p) => p.isAvailableNow);
    const roadmap = siteConfig.progressionStages.filter((p) => !p.isAvailableNow);

    expect(available.length).toBe(2);
    expect(roadmap.length).toBe(2);

    const academicTuition = siteConfig.progressionStages.find((p) => p.level === 4);
    expect(academicTuition?.title).toContain('Academic Tuition');
    expect(academicTuition?.stageBadge).toBe('Future Plan');
  });

  it('should cover the 5 required parent FAQ categories', () => {
    const questions = siteConfig.faqs.map((f) => f.question.toLowerCase());

    // 1. Beginner suitability
    expect(questions.some((q) => q.includes('never coded before') || q.includes('beginner'))).toBe(true);
    // 2. Hardware / laptops
    expect(questions.some((q) => q.includes('laptop') || q.includes('hardware'))).toBe(true);
    // 3. Course selection
    expect(questions.some((q) => q.includes('choose') || q.includes('pick beginner python'))).toBe(true);
    // 4. Progress feedback
    expect(questions.some((q) => q.includes('feedback') || q.includes('progress') || q.includes('child is doing'))).toBe(true);
    // 5. AI tools
    expect(questions.some((q) => q.includes('ai') || q.includes('chatgpt'))).toBe(true);
  });

  it('should contain complete options for the trial enquiry form', () => {
    expect(siteConfig.enquiryConfig.studentLevels.length).toBeGreaterThanOrEqual(5);
    expect(siteConfig.enquiryConfig.experienceLevels.length).toBeGreaterThanOrEqual(4);
    expect(siteConfig.enquiryConfig.coursePreferences.length).toBeGreaterThanOrEqual(3);
    expect(siteConfig.enquiryConfig.trialTimelineNotice).toBeTruthy();
    expect(siteConfig.enquiryConfig.privacyGuarantee).toBeTruthy();
  });
});
