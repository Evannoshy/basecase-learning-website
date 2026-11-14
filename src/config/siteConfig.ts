// src/config/siteConfig.ts

export interface ContactInfo {
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappUrl: string;
  location: string;
  locationDetail: string;
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Twitter' | 'Instagram' | 'YouTube';
  url: string;
  label: string;
}

export interface DisclaimersConfig {
  universityIndependence: string;
  operationalPricing: string;
  aiUsagePolicySummary: string;
}

export interface BrandConfig {
  /** Provisional academy name - edit here to rebrand across the entire site. */
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  url: string;
  foundedYear: number;
  targetDemographic: string;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  disclaimers: DisclaimersConfig;
}

export interface NavigationLink {
  label: string;
  href: string;
  badge?: string;
  isCta?: boolean;
  isRoadmap?: boolean;
  tooltip?: string;
}

export interface HeroConfig {
  headline: string;
  subheadline: string;
  badgeText: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  highlights: string[];
}

export interface UnconfirmedCourseDetails {
  ageRangeNotice: string;
  scheduleNotice: string;
  feeNotice: string;
  classSizeNotice: string;
  durationNotice: string;
  disclaimer: string;
}

export interface ExampleFinalProject {
  title: string;
  description: string;
  techStack: string[];
  highlight: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  trackBadge: string;
  status: 'active' | 'upcoming';
  intendedLearner: string;
  prerequisites: string;
  learningGoals: string[];
  exampleFinalProject: ExampleFinalProject;
  lessonFormat: string;
  unconfirmedDetails: UnconfirmedCourseDetails;
}

export interface CodeSnippetPreview {
  language: 'python' | 'html' | 'javascript' | 'typescript';
  filename: string;
  code: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: 'Python' | 'Web Development' | 'Study Tool';
  categoryBadge: string;
  description: string;
  skillsDemonstrated: string[];
  isInteractive: boolean;
  interactiveComponentId?: 'python-quiz-runner' | 'study-timer-widget';
  codeSnippetPreview: CodeSnippetPreview;
  studentLevel: string;
  learningOutcome: string;
}

export interface LearningStage {
  step: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  mentorRole: string;
  reasoningFocus: string;
  concreteExample: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  /** Optional photo path (e.g. "/images/mentors/alex.jpg"). Falls back to monogram initials when unset. */
  photoUrl?: string;
  degreeProgram: string;
  institution: string;
  teachingExperience: string;
  scholarships: string[];
  innovationBadges: string[];
  specializations: string[];
  bio: string;
  avatarPlaceholderText: string;
  statusLabel?: string;
  highlightQuote?: string;
}

export interface ProgressionStage {
  level: number;
  title: string;
  stageBadge: 'Available Now' | 'Proposed Track' | 'Future Plan' | 'Curriculum Roadmap' | 'Upcoming Extension';
  isAvailableNow: boolean;
  status: 'available' | 'roadmap' | 'upcoming';
  targetAudience: string;
  description: string;
  topics: string[];
  outcomes: string;
}

export interface FAQItem {
  id: string;
  category: 'admissions' | 'technology' | 'curriculum' | 'pedagogy' | 'operations';
  categoryLabel: string;
  question: string;
  answer: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  billingCycle: string;
  summary: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isFeatured?: boolean;
}

export interface PricingFaq {
  question: string;
  answer: string;
}

export interface PricingConfig {
  headline: string;
  subheadline: string;
  placeholderNotice: string;
  tiers: PricingTier[];
  includedItems: {
    title: string;
    description: string;
  }[];
  pricingFaqs: PricingFaq[];
}

export interface CourseRecommenderGoal {
  id: string;
  label: string;
  recommendedCourse: string;
  reason: string;
}

export interface TrialStep {
  step: number;
  title: string;
  description: string;
}

export interface EnquiryConfig {
  studentLevels: string[];
  experienceLevels: string[];
  coursePreferences: string[];
  trialTimelineNotice: string;
  privacyGuarantee: string;
  demoModeNotice: string;
  recommenderGoals: CourseRecommenderGoal[];
  trialSteps: TrialStep[];
  trialLogisticsNote: string;
  betweenLessonSupport: string[];
}

export interface SiteConfig {
  brand: BrandConfig;
  navigation: NavigationLink[];
  /** Ready-to-enable navigation entries for future Secondary & JC academic tuition expansion. */
  futureNavigation?: NavigationLink[];
  hero: HeroConfig;
  courses: Course[];
  showcaseProjects: ShowcaseProject[];
  learningStages: LearningStage[];
  mentors: Mentor[];
  progressionStages: ProgressionStage[];
  faqs: FAQItem[];
  enquiryConfig: EnquiryConfig;
  pricing: PricingConfig;
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "BaseCase Learning",
    shortName: "BaseCase",
    tagline: "Practical coding classes for secondary, pre-poly/JC, and pre-university students in Singapore.",
    description: "Small-group coding classes led by NUS Computing undergraduates, focused on clear fundamentals and projects students can explain.",
    url: "https://basecase-learning-website.vercel.app",
    foundedYear: 2026,
    targetDemographic: "Secondary, pre-poly/JC, and pre-university students in Singapore",
    contact: {
      email: "basecaselearning@gmail.com",
      phone: "+65 9350 9168",
      phoneDisplay: "+65 9350 9168",
      whatsappNumber: "6593509168",
      whatsappUrl: "https://wa.me/6593509168?text=Hi%20BaseCase%20Learning%2C%20I%20would%20like%20to%20enquire%20about%20a%20coding%20trial.",
      location: "Singapore",
      locationDetail: "Singapore (Format & location TBC)",
    },
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/basecaselearning",
        label: "GitHub Organization",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/company/basecaselearning",
        label: "LinkedIn Page",
      },
    ],
    disclaimers: {
      universityIndependence:
        "BaseCase Learning is an independent tuition initiative run by undergraduate students. We are not affiliated with, sponsored by, or endorsed by the National University of Singapore (NUS) or any scholarship provider.",
      operationalPricing:
        "Schedules, class sizes, fees, and durations are not yet fixed and will be shared during consultation before enrolment.",
      aiUsagePolicySummary:
        "We expect students to write and debug their own code for core exercises rather than pasting AI-generated answers.",
    },
  },

  navigation: [
    { label: "Courses", href: "#courses" },
    { label: "Projects", href: "#projects" },
    { label: "How Learning Works", href: "#how-learning-works" },
    { label: "Mentors", href: "#mentors" },
    { label: "Progression", href: "#progression" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQs", href: "#faqs" },
    { label: "Book a coding trial", href: "#trial-enquiry", isCta: true },
  ],

  futureNavigation: [
    {
      label: "Secondary & JC Tuition",
      href: "#progression",
      badge: "Planned",
      isRoadmap: true,
      tooltip: "Planned future subjects for Secondary & JC students (not open for booking yet).",
    },
  ],

  hero: {
    headline: "Learn to code. Build something you’re proud of.",
    subheadline:
      "The best investment for your Child's future",
    badgeText: "Singapore Coding Academy • Secondary & Pre-U",
    primaryCta: {
      text: "Book a coding trial",
      href: "#trial-enquiry",
    },
    secondaryCta: {
      text: "Explore courses",
      href: "#courses",
    },
    highlights: [
      "Clear explanations, step by step",
      "Projects students actually understand",
      "Taught by NUS Computing students",
      "Honest insights on uni & tech paths",
    ],
  },

  courses: [
    {
      id: "beginner-python",
      title: "Beginner Python",
      slug: "beginner-python",
      tagline: "Core programming logic and terminal projects",
      trackBadge: "Foundations Track",
      status: "active",
      intendedLearner: "Secondary, pre-poly/JC, and pre-university students who are new to text-based coding.",
      prerequisites: "None. Comfortable using a laptop and keyboard.",
      learningGoals: [
        "Break down problems into clear steps before writing code",
        "Use variables, if-else branches, loops, lists, and dictionaries",
        "Write clean functions and handle invalid user input",
        "Read error messages and trace bugs line by line",
        "Build and test a complete terminal program from scratch",
      ],
      exampleFinalProject: {
        title: "Terminal Quiz Game & Score Tracker",
        description: "A command-line quiz app that loads questions from JSON, checks answers, and tracks scores.",
        techStack: ["Python 3", "JSON", "Standard Library"],
        highlight: "Students write the logic themselves and can explain how every part works.",
      },
      lessonFormat: "Live walkthroughs, guided coding, short solo challenges, and code feedback.",
      unconfirmedDetails: {
        ageRangeNotice: "Exact age groupings TBC before launch",
        scheduleNotice: "Timings arranged upon consultation (TBC)",
        feeNotice: "Fees shared upon consultation (TBC)",
        classSizeNotice: "Class sizes TBC before launch",
        durationNotice: "Course length TBC before launch",
        disclaimer: "Ages, fees, schedules, class sizes, and durations are unconfirmed and will be shared during consultation.",
      },
    },
    {
      id: "intro-web-dev",
      title: "Introductory Web Development",
      slug: "intro-web-dev",
      tagline: "Build and publish your own responsive website",
      trackBadge: "Applied Track",
      status: "active",
      intendedLearner: "Secondary, pre-poly/JC, and pre-university students who want to build websites and simple web tools.",
      prerequisites: "None. Basic Python helps, but no web experience is needed.",
      learningGoals: [
        "Structure clean, accessible pages with HTML5",
        "Style mobile-friendly layouts with CSS Flexbox and Grid",
        "Add interactive features and button events with JavaScript",
        "Update page content dynamically using the DOM",
        "Publish a working site online (e.g. GitHub Pages or Vercel)",
      ],
      exampleFinalProject: {
        title: "Personal Study Timer & Checklist",
        description: "A web-based Pomodoro timer and to-do list that saves progress in the browser.",
        techStack: ["HTML5", "CSS / Flexbox", "JavaScript", "GitHub Pages"],
        highlight: "Students leave with a live site they can open and use on their phone.",
      },
      lessonFormat: "Live layout demos, guided building, independent tasks, and mentor code review.",
      unconfirmedDetails: {
        ageRangeNotice: "Exact age groupings TBC before launch",
        scheduleNotice: "Timings arranged upon consultation (TBC)",
        feeNotice: "Fees shared upon consultation (TBC)",
        classSizeNotice: "Class sizes TBC before launch",
        durationNotice: "Course length TBC before launch",
        disclaimer: "Ages, fees, schedules, class sizes, and durations are unconfirmed and will be shared during consultation.",
      },
    },
  ],

  showcaseProjects: [
    {
      id: "python-quiz-game",
      title: "Python Quiz Game",
      category: "Python",
      categoryBadge: "Interactive Example",
      description: "A simple trivia game in Python showing loops, dictionaries, score tracking, and input checks.",
      skillsDemonstrated: [
        "If-Else & Loops",
        "Dictionaries & Lists",
        "Score Tracking",
        "Input Checks",
      ],
      isInteractive: true,
      interactiveComponentId: "python-quiz-runner",
      codeSnippetPreview: {
        language: "python",
        filename: "quiz_runner.py",
        code: `def run_quiz(questions):\n    score = 0\n    for idx, q in enumerate(questions, 1):\n        print(f"\\nQuestion {idx}: {q['prompt']}")\n        for opt in q['options']:\n            print(f"  {opt}")\n        answer = input("Your answer: ").strip().upper()\n        if answer == q['correct']:\n            score += 1\n            print("Correct!")\n        else:\n            print(f"Not quite - answer is {q['correct']}.")\n    print(f"\\nFinal score: {score}/{len(questions)}")\n    return score`,
      },
      studentLevel: "Example · Beginner Python",
      learningOutcome: "Combines loops, dictionaries, and user input into a complete playable program.",
    },
    {
      id: "personal-portfolio",
      title: "Personal Website",
      category: "Web Development",
      categoryBadge: "Example Project",
      description: "A clean personal page displaying school projects, hobbies, and notes with HTML and CSS Grid.",
      skillsDemonstrated: [
        "HTML5 Structure",
        "CSS Grid & Flexbox",
        "Mobile Layout",
        "Readable Type",
      ],
      isInteractive: false,
      codeSnippetPreview: {
        language: "html",
        filename: "index.html",
        code: `<main class="site-container">\n  <header class="hero-intro">\n    <h1>Alex Tan - Student Projects</h1>\n    <p>Python scripts and small web tools built in class.</p>\n  </header>\n  <section class="projects-grid" aria-label="Selected Projects">\n    <article class="project-card">\n      <h3>Kinematics Calculator</h3>\n      <p>Quick formula solver for secondary physics revision.</p>\n    </article>\n  </section>\n</main>`,
      },
      studentLevel: "Example · Intro Web Dev",
      learningOutcome: "Shows how clean HTML and CSS make a fast site that works on both phone and laptop.",
    },
    {
      id: "study-timer-tool",
      title: "Pomodoro Study Timer",
      category: "Study Tool",
      categoryBadge: "Example Project",
      description: "A 25-minute revision timer that tracks focus sessions in the browser with no external libraries.",
      skillsDemonstrated: [
        "Button Click Events",
        "JavaScript Timers",
        "Local Storage",
        "Accessible Status Updates",
      ],
      isInteractive: false,
      codeSnippetPreview: {
        language: "javascript",
        filename: "timer.js",
        code: `class StudyTimer {\n  constructor(minutes = 25, onTick, onComplete) {\n    this.remainingSeconds = minutes * 60;\n    this.timerId = null;\n    this.onTick = onTick;\n    this.onComplete = onComplete;\n  }\n  start() {\n    if (this.timerId) return;\n    this.timerId = setInterval(() => {\n      this.remainingSeconds--;\n      this.onTick(this.remainingSeconds);\n      if (this.remainingSeconds <= 0) {\n        clearInterval(this.timerId);\n        this.timerId = null;\n        this.onComplete();\n      }\n    }, 1000);\n  }\n}`,
      },
      studentLevel: "Example · Study Tool",
      learningOutcome: "Applies JavaScript timers and saved browser state to a tool students actually use.",
    },
  ],

  learningStages: [
    {
      step: 1,
      title: "Concept Breakdown & Notes",
      subtitle: "First 20 Mins · Summary Notes",
      badge: "Step 01",
      description: "Each topic starts with clear visual diagrams and concise summary notes so students grasp why the logic works before typing code.",
      mentorRole: "Introduces key principles on the board and checks understanding with quick 'What happens if...?' questions.",
      reasoningFocus: "Understanding core logic, inputs, and outputs before memorising syntax.",
      concreteExample: "Tracing list indexes step by step on paper to see why Python counting starts at 0.",
    },
    {
      step: 2,
      title: "Guided Class Walkthrough",
      subtitle: "Next 35 Mins · Worked Examples",
      badge: "Step 02",
      description: "Tutors walk through class examples live on screen while students code alongside them, breaking each question into clear steps.",
      mentorRole: "Demonstrates clean structure and common pitfalls line by line so no student is left behind.",
      reasoningFocus: "Turning question requirements into clean functions and loops.",
      concreteExample: "Building a working grade calculator step by step from sample test cases.",
    },
    {
      step: 3,
      title: "Independent Practice Drills",
      subtitle: "Next 45 Mins · Graded Worksheets",
      badge: "Step 03",
      description: "Students tackle progressively harder exercises on their own, practising how to spot bugs and test edge cases systematically.",
      mentorRole: "Circulates around the small group to nudge stuck students with guiding questions instead of giving answers away.",
      reasoningFocus: "Independent debugging, reading tracebacks, and verifying outputs against test cases.",
      concreteExample: "Fixing an off-by-one IndexError on timed in-class worksheet questions.",
    },
    {
      step: 4,
      title: "1-on-1 Code Review & Feedback",
      subtitle: "Final 20 Mins · 1-on-1 Marking",
      badge: "Step 04",
      description: "Every student gets individual marking and verbal feedback in class so mistakes are fixed on the spot before homework is assigned.",
      mentorRole: "Marks completed exercises 1-on-1 and highlights cleaner habits before wrapping up the lesson.",
      reasoningFocus: "Refining readability, edge-case handling, and explaining code aloud confidently.",
      concreteExample: "Simplifying repeated if-else checks into one clean dictionary lookup during review.",
    },
  ],

  /**
   * Editable mentor profile templates.
   * Individual names, photos, degree programmes, teaching experience, scholarships,
   * and official innovation programme names (including "C Innovators") are placeholders
   * until confirmed before launch. Do not publish unverified credentials.
   */
  mentors: [
    {
      id: "mentor-template-1",
      name: "Founding Mentor 01 (Profile TBC)",
      role: "Python & Foundations Mentor",
      photoUrl: undefined,
      degreeProgram: "NUS Computing Student (Degree programme TBC)",
      institution: "National University of Singapore (Undergraduate)",
      teachingExperience: "Individual teaching experience to be confirmed before launch.",
      scholarships: ["Scholarship details to be confirmed"],
      innovationBadges: ['Innovation programme ("C Innovators", official name TBC)'],
      specializations: ["Python Basics", "Problem Breakdown", "Debugging"],
      bio: "Editable profile template in src/config/siteConfig.ts. Replace with confirmed mentor name, photo, degree, and credentials before launch.",
      avatarPlaceholderText: "FM",
      statusLabel: "Profile Template (TBC)",
      highlightQuote: "Our goal is simple: students should be able to explain every line of code they write.",
    },
    {
      id: "mentor-template-2",
      name: "Evan Tan",
      role: "Co-Founder · Python, AI & Projects Mentor",
      photoUrl: "/images/evan-tan.jpg",
      degreeProgram: "Double Degree: BComp (Computer Science) & BBA (Finance)",
      institution: "National University of Singapore (Undergraduate)",
      teachingExperience:
        "Over 4 years of teaching N-Levels, O-Levels, and A-Levels, NUS Product Club Curriculum Design team, Experience in real world software systems.",
      scholarships: [
        "Residential College 4 (RC4)",
        "NUS Venture Initiation Programme",
      ],
      innovationBadges: [
        "NUS C-Innovators",
        "ML Tech Lead (NUS FinTech Society)",
      ],
      specializations: [
        "Python & FastAPI",
        "AI & Machine Learning",
        "Web & Data Projects",
        "Exam Summary Notes",
      ],
      bio: "NUS Computer Science and Business (Double Degree) undergraduate. Previously built enterprise AI and Python systems at RAiD (RSAF), ML pipelines at 10x.ai, and software at Dibs under NUS C-Innovators.",
      avatarPlaceholderText: "ET",
      statusLabel: "Co-Founder",
      highlightQuote:
        "Good summary notes and building projects you actually care about make tough concepts click.",
    },
  ],

  progressionStages: [
    {
      level: 1,
      title: "Programming Foundations",
      stageBadge: "Available Now",
      isAvailableNow: true,
      status: "available",
      targetAudience: "Secondary 1–4, IB & Pre-U Beginners",
      description: "Core problem-solving in Python: variables, branching, loops, functions, and basic debugging.",
      topics: [
        "Step-by-step logic",
        "Lists & dictionaries",
        "Writing clean functions",
        "Reading error tracebacks",
      ],
      outcomes: "Students write small programs on their own and explain how their code runs.",
    },
    {
      level: 2,
      title: "Guided Applied Projects",
      stageBadge: "Available Now",
      isAvailableNow: true,
      status: "available",
      targetAudience: "Students ready to build",
      description: "Build working web pages, simple study tools, and interactive terminal programs with mentor feedback.",
      topics: [
        "HTML, CSS & responsive layout",
        "Browser events in JavaScript",
        "Working with JSON data",
        "End-to-end mini projects",
      ],
      outcomes: "Students finish complete projects they can demo, update, and put in a portfolio.",
    },
    {
      level: 3,
      title: "Independent Building",
      stageBadge: "Proposed Track",
      isAvailableNow: false,
      status: "roadmap",
      targetAudience: "Intermediate Secondary & JC Students",
      description: "Plan and build larger personal projects from a blank folder, with code reviews along the way.",
      topics: [
        "Choosing data structures",
        "Basic databases & SQLite",
        "Hosting & sharing projects",
        "Personal capstone build",
      ],
      outcomes: "Students plan, build, and present their own project independently.",
    },
    {
      level: 4,
      title: "Secondary & JC Academic Tuition",
      stageBadge: "Future Plan",
      isAvailableNow: false,
      status: "upcoming",
      targetAudience: "O-Level & A-Level Computing / Maths",
      description: "Future school-syllabus tuition once our initial coding classes are up and running.",
      topics: [
        "O-Level Computing (7155)",
        "A-Level H2 Computing (9569)",
        "Trace tables & exam practice",
        "Secondary / JC Maths (planned)",
      ],
      outcomes: "Targeted school and exam support (not open for booking yet).",
    },
  ],

  faqs: [
    {
      id: "faq-beginner",
      category: "admissions",
      categoryLabel: "Beginners",
      question: "My child has never coded before. Is this suitable?",
      answer: "Yes. Both Beginner Python and Introductory Web Development start from zero experience. We explain each idea clearly with examples before expecting students to write code.",
    },
    {
      id: "faq-hardware",
      category: "technology",
      categoryLabel: "Laptop & Tools",
      question: "What laptop does my child need?",
      answer: "Any working Windows, Mac, or Chromebook/Linux laptop with a browser (Chrome, Edge, or Firefox) is enough. All tools we use, such as Python 3 and VS Code, are free, and mentors help set everything up.",
    },
    {
      id: "faq-selection",
      category: "curriculum",
      categoryLabel: "Choosing a Course",
      question: "Should we pick Beginner Python or Introductory Web Development?",
      answer: "Beginner Python suits students who like logic puzzles, maths, or plan to take school Computing. Web Development suits students who want to design pages they can open and share on their phone. If you're unsure, pick 'Undecided' in the form and we'll advise during the trial.",
    },
    {
      id: "faq-feedback",
      category: "pedagogy",
      categoryLabel: "Progress Feedback",
      question: "How will parents know how their child is doing?",
      answer: "Mentors share regular updates on what concepts your child has understood, where they get stuck, and what they built. Students also walk through their finished project at the end of a module.",
    },
    {
      id: "faq-ai-tools",
      category: "pedagogy",
      categoryLabel: "AI Tools Policy",
      question: "What is your policy on ChatGPT and AI coding tools?",
      answer: "Students must write and debug core exercises themselves without AI auto-generating the answers. Once they understand the basics, we show how to check AI-suggested code carefully instead of trusting it blindly.",
    },
    {
      id: "faq-operations",
      category: "operations",
      categoryLabel: "Schedules & Fees",
      question: "Why aren't class timings and fees listed on the site yet?",
      answer: "We are still finalising launch schedules, class sizes, fees, and age groupings. After you submit a trial enquiry, we will share confirmed details and arrange a timing that fits your child's school schedule.",
    },
  ],

  enquiryConfig: {
    studentLevels: [
      "Secondary 1",
      "Secondary 2",
      "Secondary 3",
      "Secondary 4 / O-Level",
      "Junior College 1",
      "Junior College 2 / A-Level",
      "International Baccalaureate (IB)",
      "Pre-Polytechnic / Other",
    ],
    experienceLevels: [
      "Complete Beginner (Never coded before)",
      "Block Coding Only (Scratch / Micro:bit)",
      "Some Self-Taught Python or Web Basics",
      "Formal School Computing / Elective",
    ],
    coursePreferences: [
      "Beginner Python",
      "Introductory Web Development",
      "Undecided (Please recommend during trial)",
    ],
    trialTimelineNotice:
      "We reply to trial enquiries within 24 hours via WhatsApp or email to confirm fit and share timings.",
    privacyGuarantee:
      "We only use these details to reply to your trial enquiry. Nothing is shared with third parties.",
    demoModeNotice:
      "Pre-launch preview: form checks work, but enquiries are not submitted yet until our enquiry webhook is connected.",
    recommenderGoals: [
      {
        id: "logic",
        label: "Logic puzzles, maths, or school Computing",
        recommendedCourse: "Beginner Python",
        reason: "Beginner Python builds step-by-step problem breakdown and prepares students for school Computing.",
      },
      {
        id: "web",
        label: "Designing websites & visual tools",
        recommendedCourse: "Introductory Web Development",
        reason: "Introductory Web Development lets students design and publish interactive pages they can open on their phone.",
      },
      {
        id: "unsure",
        label: "Not sure yet (open to either)",
        recommendedCourse: "Undecided (Please recommend during trial)",
        reason: "We’ll try a short hands-on activity in the trial and recommend whether Python or Web fits better.",
      },
    ],
    trialSteps: [
      {
        step: 1,
        title: "Quick Setup & Chat",
        description: "We check your laptop setup and ask what your child enjoys or finds tricky.",
      },
      {
        step: 2,
        title: "Hands-On Mini Build",
        description: "A guided coding activity with an NUS Computing tutor, writing and running real code rather than watching slides.",
      },
      {
        step: 3,
        title: "Parent Debrief & Next Steps",
        description: "Plain-English feedback on how your child did and which starting track fits best.",
      },
    ],
    trialLogisticsNote:
      "Trial format, duration, and any trial fee details are unconfirmed and will be shared during consultation when we arrange your slot.",
    betweenLessonSupport: [
      "WhatsApp help when stuck on code between lessons",
      "Clear summary notes & reference code after each topic",
      "Small-group pace with direct mentor feedback",
    ],
  },

  /* Editable placeholder pricing tiers - update SGD rates and billing cycles below as needed. */
  pricing: {
    headline: "Tuition Fees & Class Packages",
    subheadline:
      "Transparent, small-group coding tuition and 1-on-1 mentorship rates for secondary, JC, and IB students in Singapore.",
    placeholderNotice:
      "Sample rate guide shown below. Final term schedules and fee details are confirmed with parents during consultation before enrolment.",
    tiers: [
      {
        id: "trial-consultation",
        name: "1-on-1 Trial & Consultation",
        badge: "Start Here",
        price: "S$40",
        billingCycle: "per 60-min session",
        summary: "Diagnostic coding session and parent debrief (waived upon enrolment).",
        features: [
          "1-on-1 diagnostic coding activity with an NUS Computing tutor",
          "Assess current logic comfort (zero experience needed)",
          "Laptop and Python / VS Code environment setup check",
          "Plain-English parent feedback & track recommendation",
        ],
        ctaText: "Book a coding trial",
        ctaHref: "#trial-enquiry",
        isFeatured: false,
      },
      {
        id: "small-group-weekly",
        name: "Small-Group Weekly Tuition",
        badge: "Most Popular",
        price: "S$280",
        billingCycle: "per month (4 lessons)",
        summary: "Weekly 2-hour classes in small groups of 3–6 students.",
        features: [
          "4 weekly 2-hour coached sessions (Beginner Python or Web Dev)",
          "Small class ratio of 3–6 students per table",
          "Step-by-step practice sheets & guided debugging reviews",
          "WhatsApp homework and project Q&A between lessons",
          "End-of-module working project walkthrough for parents",
        ],
        ctaText: "Enquire for group slots",
        ctaHref: "#trial-enquiry",
        isFeatured: true,
      },
      {
        id: "private-mentorship",
        name: "1-on-1 Private Mentorship",
        badge: "Custom Pace",
        price: "S$85",
        billingCycle: "per hour",
        summary: "Individual coaching for O-Level / A-Level / IB Computing or custom projects.",
        features: [
          "Dedicated 1-on-1 NUS Computing mentor matched to goals",
          "Flexible pacing for school Computing or portfolio builds",
          "Focused trace-table, algorithm, and code-review coaching",
          "Flexible lesson timing around CCA and exam schedules",
        ],
        ctaText: "Request 1-on-1 coaching",
        ctaHref: "#trial-enquiry",
        isFeatured: false,
      },
    ],
    includedItems: [
      {
        title: "No Registration or Deposit Fees",
        description: "Pay only for classes attended, with no registration fees, software charges, or lock-in contracts.",
      },
      {
        title: "All Free Developer Tools",
        description: "Students learn on standard tools (Python 3, VS Code, HTML/CSS/JS) with zero paid subscriptions required.",
      },
      {
        title: "Between-Lesson WhatsApp Support",
        description: "Students can message their mentor when stuck on practice bugs instead of waiting a full week.",
      },
      {
        title: "Regular Parent Progress Notes",
        description: "Short written updates on topics mastered, debugging habits, and upcoming module goals.",
      },
    ],
    pricingFaqs: [
      {
        question: "Is the trial fee credited if we enrol?",
        answer:
          "Yes. If your child continues into our weekly small-group or 1-on-1 classes, the S$40 trial fee is offset against your first month's school fees.",
      },
      {
        question: "What happens if my child misses a weekly lesson due to school or CCA?",
        answer:
          "Let us know ahead of time on WhatsApp and we will arrange a catch-up slot or a short 1-on-1 recap before the next class so your child does not fall behind.",
      },
      {
        question: "How does billing work for months with 5 weeks or public holidays?",
        answer:
          "Monthly group packages cover 4 scheduled lessons. Any 5th-week sessions or public-holiday reschedules are adjusted transparently in advance during term confirmation.",
      },
    ],
  },
};
