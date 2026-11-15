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

export interface CourseCurriculumStage {
  stage: string;
  title: string;
  description: string;
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
  curriculumStages?: CourseCurriculumStage[];
  learningGoals: string[];
  exampleFinalProject: ExampleFinalProject;
  lessonFormat: string;
  unconfirmedDetails: UnconfirmedCourseDetails;
}

export interface CodingClass {
  id: string;
  title: string;
  shortDescription: string;
  trackBadge: string;
  targetLevel: string;
  prerequisites: string;
  format: string;
  overview: string;
  topics: string[];
  lessonApproach: string;
  outcomes: string[];
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
  classes: CodingClass[];
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
    tagline: "Coding Classes & Computing Tuition near Yishun MRT (Pri, Sec, IB, JC)",
    description: "Small-group coding classes and 1-on-1 O-Level, A-Level H2 & IB Computing tuition near Yishun MRT (Singapore) and online, taught by NUS Computing undergraduates.",
    url: "https://basecase-learning-website.vercel.app",
    foundedYear: 2026,
    targetDemographic: "Upper Primary, Secondary, IB, JC, and Poly-bound students in Singapore",
    contact: {
      email: "basecaselearning@gmail.com",
      phone: "+65 9350 9168",
      phoneDisplay: "+65 9350 9168",
      whatsappNumber: "6593509168",
      whatsappUrl: "https://wa.me/6593509168?text=Hi%20BaseCase%20Learning%2C%20I%20would%20like%20to%20enquire%20about%20a%20coding%20trial.",
      location: "Singapore",
      locationDetail: "Near Yishun MRT · Online options available",
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
        "We expect students to write and debug their own code for core exercises without pasting AI-generated answers.",
    },
  },

  navigation: [
    { label: "Classes", href: "/classes" },
    { label: "Projects", href: "/projects" },
    { label: "Mentors", href: "#mentors" },
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
      "Small-group coding classes and 1-on-1 O-Level, A-Level & IB Computing tuition near Yishun MRT and online — taught step by step by NUS Computing tutors.",
    badgeText: "Upper Pri · Sec · IB · JC",
    primaryCta: {
      text: "Book a coding trial",
      href: "#trial-enquiry",
    },
    secondaryCta: {
      text: "Explore classes",
      href: "#classes",
    },
    highlights: [
      "Small groups (3–6 students per table)",
      "Taught by NUS Computing tutors",
      "Zero coding experience needed to start",
      "Supports O-Level, H2 & IB Computing",
    ],
  },

  classes: [
    {
      id: "scratch",
      title: "Scratch",
      shortDescription: "Visual drag-and-drop coding that builds logic and problem-solving for younger beginners (Upper Pri – Lower Sec).",
      trackBadge: "Foundational Logic",
      targetLevel: "Upper Primary (P4–P6) & Lower Secondary Beginners",
      prerequisites: "No coding experience needed. Great for students new to coding logic.",
      format: "Small-group coaching (3–6 students) or 1-on-1 · Near Yishun MRT / Online",
      overview:
        "Scratch removes typing and spelling mistakes so younger students can focus on how instructions work together. Students learn to break problems into clear steps, spot why something behaves unexpectedly, and build strong thinking habits before moving to typed code.",
      topics: [
        "Step-by-step instructions, screen coordinates, and game events",
        "Repeating actions cleanly with loops and stop conditions",
        "Making decisions using if / else rules",
        "Tracking scores, lives, and changing game states",
        "Organising bigger projects into tidy reusable blocks",
      ],
      lessonApproach:
        "Tutors ask students to predict what their blocks will do before pressing run — building careful step-by-step thinking instead of random guessing.",
      outcomes: [
        "Think clearly through loops, conditions, and game logic",
        "Spot and fix mistakes calmly without guessing",
        "Transition smoothly into typed Python or school Computing later",
      ],
    },
    {
      id: "sicpy",
      title: "SICP in Python (SICPY)",
      shortDescription: "Deeper problem-solving in Python — ideal for strong learners, IP students, and DSA preparation.",
      trackBadge: "CS Fundamentals",
      targetLevel: "Secondary, IP & Pre-University Students",
      prerequisites: "Comfortable with basic Python variables, loops, and simple functions.",
      format: "Small-group coaching (3–6 students) or 1-on-1 · Near Yishun MRT / Online",
      overview:
        "Based on NUS's foundational Computer Science approach taught in Python, this class goes beyond memorising commands. Students learn how to break down unfamiliar problems cleanly, use recursion with confidence, and pick faster, neater ways to solve tough questions.",
      topics: [
        "Writing clean, reusable functions that simplify complex tasks",
        "Solving multi-step problems with recursion and tracing them on paper",
        "Comparing faster vs. slower ways to solve a problem",
        "Organising structured data clearly using lists and tree-like patterns",
        "Choosing the right coding style for larger problems",
      ],
      lessonApproach:
        "Instead of rushing through syntax, tutors walk through tricky examples on paper and screen, then review every line your child writes.",
      outcomes: [
        "Solve unfamiliar, multi-step problems cleanly without guessing",
        "Trace complex code on paper and spot efficiency bottlenecks",
        "Build strong foundations ahead of JC Computing, DSA, or university CS",
      ],
    },
    {
      id: "o-level-computing",
      title: "O-Level Computing (7155)",
      shortDescription: "Structured Paper 1 theory and Paper 2 Python practice for Sec 3–4 students.",
      trackBadge: "MOE O-Level Syllabus",
      targetLevel: "Secondary 3 & Secondary 4 Computing (7155) Students",
      prerequisites: "Taking or preparing for GCE O-Level Computing (7155).",
      format: "1-on-1 private coaching or small-group exam prep · Near Yishun MRT / Online",
      overview:
        "Focused coaching matched to the SEAB O-Level Computing (7155) syllabus across Paper 1 (written theory) and Paper 2 (Python and spreadsheet practical). We close weak topics early and train reliable exam technique.",
      topics: [
        "Number systems (binary, hexadecimal, text encoding) and logic gates",
        "Computer systems, networks, cybersecurity, and computing ethics",
        "Flowcharts, pseudocode, and completing trace tables accurately",
        "Paper 2 Python tasks: reading files, input checks, searching, and sorting",
        "Excel spreadsheet formulas, lookup tables, and data checks",
      ],
      lessonApproach:
        "Weekly lessons alternate between Paper 1 written answers (checking exact marking-scheme phrasing) and timed Paper 2 coding drills where students check their logic on paper first.",
      outcomes: [
        "Complete trace tables accurately under exam time pressure",
        "Score consistently on Paper 1 definitions, logic gates, and pseudocode",
        "Find and fix Paper 2 Python bugs calmly during practical exams",
      ],
    },
    {
      id: "a-level-computing",
      title: "A-Level H2 Computing (9569)",
      shortDescription: "Concept-first JC tuition covering algorithms, databases, and timed Paper 2 prep.",
      trackBadge: "MOE A-Level H2 Syllabus",
      targetLevel: "JC 1 & JC 2 H2 Computing (9569) Students",
      prerequisites: "Taking GCE A-Level H2 Computing (9569) in Junior College.",
      format: "1-on-1 private coaching or targeted JC revision · Near Yishun MRT / Online",
      overview:
        "Structured preparation for A-Level H2 Computing (9569) covering algorithms, data structures, databases, web concepts, and Paper 2 practical execution. Built for JC students who want clear first-principles explanations rather than rote memorisation.",
      topics: [
        "Core data structures: stacks, queues, linked lists, trees, and hash tables",
        "Recursion, sorting, searching, and comparing algorithm speed",
        "Structuring larger Python programs cleanly and testing edge cases",
        "Databases, organising tables cleanly (1NF–3NF), and SQL queries",
        "Networking, cybersecurity, and timed Paper 2 practical mastery",
      ],
      lessonApproach:
        "Tutors unpack difficult JC lecture topics from scratch, break down past prelim and A-Level questions, and check code correctness and edge cases line by line.",
      outcomes: [
        "Write and trace core data structures cleanly from scratch",
        "Approach unfamiliar Paper 1 & Paper 2 questions with a clear plan",
        "Avoid common boundary, loop, and SQL database mistakes",
      ],
    },
  ],

  courses: [
    {
      id: "beginner-python",
      title: "Beginner Python",
      slug: "beginner-python",
      tagline: "Functions, data lists, and working terminal projects",
      trackBadge: "Foundations Track",
      status: "active",
      intendedLearner: "Secondary, JC, IB, and Poly-bound students who are new to typed coding.",
      prerequisites: "None. Comfortable using a laptop and keyboard.",
      curriculumStages: [
        {
          stage: "Stage 01",
          title: "Functions & Tracing",
          description: "Inputs, loops, and reading code step by step.",
        },
        {
          stage: "Stage 02",
          title: "Organising Data",
          description: "Storing and updating lists, tables, and saved files.",
        },
        {
          stage: "Stage 03",
          title: "Complete Mini App",
          description: "Putting everything together into a working terminal app.",
        },
      ],
      learningGoals: [
        "Trace code step by step without guessing",
        "Write clean functions with clear inputs and outputs",
        "Organise real data with Python lists, dictionaries, and saved files",
        "Spot variable and logic mistakes early",
        "Build and explain a complete terminal project from scratch",
      ],
      exampleFinalProject: {
        title: "Terminal Quiz Game & Score Tracker",
        description: "A command-line quiz app that loads questions from a saved file, checks answers, and tracks scores.",
        techStack: ["Python 3", "Saved Data Files", "Built-in Tools"],
        highlight: "Students write the logic themselves and can explain how every part works.",
      },
      lessonFormat: "Live walkthroughs, guided coding, short solo challenges, and 1-on-1 code feedback.",
      unconfirmedDetails: {
        ageRangeNotice: "Age groupings confirmed before term start",
        scheduleNotice: "Class timings confirmed during trial consultation",
        feeNotice: "Fees confirmed during trial consultation",
        classSizeNotice: "3–6 students per table",
        durationNotice: "Term length confirmed before launch",
        disclaimer: "Exact timings, age groupings, and term details are unconfirmed and will be shared during consultation.",
      },
    },
    {
      id: "intro-web-dev",
      title: "Introductory Web Development",
      slug: "intro-web-dev",
      tagline: "Page layouts, interactive buttons, and live web projects",
      trackBadge: "Applied Track",
      status: "active",
      intendedLearner: "Secondary, JC, IB, and Poly-bound students who want to build websites and practical web tools.",
      prerequisites: "None. Basic Python helps, but no web experience is needed.",
      curriculumStages: [
        {
          stage: "Stage 01",
          title: "Page Layout & Design",
          description: "Clean page structure that fits both phones and laptops.",
        },
        {
          stage: "Stage 02",
          title: "Interactive Buttons",
          description: "Using JavaScript so clicks and inputs update the page live.",
        },
        {
          stage: "Stage 03",
          title: "Saving & Publishing",
          description: "Saving user progress in the browser and sharing a live link.",
        },
      ],
      learningGoals: [
        "Structure clean web pages with HTML",
        "Style mobile-friendly layouts that look neat on any screen",
        "Add working buttons, timers, and interactive features with JavaScript",
        "Update what appears on screen dynamically from user input",
        "Publish a live website your child can open and share on their phone",
      ],
      exampleFinalProject: {
        title: "Personal Study Timer & Checklist",
        description: "A web-based Pomodoro timer and to-do list that remembers progress right in the browser.",
        techStack: ["HTML & CSS", "Mobile Layout", "JavaScript", "Live Web Link"],
        highlight: "Students leave with a live site they can open and use on their phone.",
      },
      lessonFormat: "Live layout demos, guided building, solo tasks, and 1-on-1 tutor code review.",
      unconfirmedDetails: {
        ageRangeNotice: "Age groupings confirmed before term start",
        scheduleNotice: "Class timings confirmed during trial consultation",
        feeNotice: "Fees confirmed during trial consultation",
        classSizeNotice: "3–6 students per table",
        durationNotice: "Term length confirmed before launch",
        disclaimer: "Exact timings, age groupings, and term details are unconfirmed and will be shared during consultation.",
      },
    },
  ],

  showcaseProjects: [
    {
      id: "python-quiz-game",
      title: "Python Quiz Game",
      category: "Python",
      categoryBadge: "Interactive Example",
      description: "A simple trivia game in Python showing loops, score tracking, and checking user answers.",
      skillsDemonstrated: [
        "If-Else & Loops",
        "Data Lists & Tables",
        "Score Tracking",
        "Answer Checks",
      ],
      isInteractive: true,
      interactiveComponentId: "python-quiz-runner",
      codeSnippetPreview: {
        language: "python",
        filename: "quiz_runner.py",
        code: `def run_quiz(questions):\n    score = 0\n    for idx, q in enumerate(questions, 1):\n        print(f"\\nQuestion {idx}: {q['prompt']}")\n        for opt in q['options']:\n            print(f"  {opt}")\n        answer = input("Your answer: ").strip().upper()\n        if answer == q['correct']:\n            score += 1\n            print("Correct!")\n        else:\n            print(f"Not quite - answer is {q['correct']}.")\n    print(f"\\nFinal score: {score}/{len(questions)}")\n    return score`,
      },
      studentLevel: "Example · Beginner Python",
      learningOutcome: "Students combine loops, data tables, and answer checks into a playable terminal program.",
    },
    {
      id: "personal-portfolio",
      title: "Personal Website",
      category: "Web Development",
      categoryBadge: "Example Project",
      description: "A clean personal website showcasing school projects, hobbies, and notes that fits phones and laptops.",
      skillsDemonstrated: [
        "Page Structure",
        "Responsive Layout",
        "Mobile View",
        "Clean Styling",
      ],
      isInteractive: false,
      codeSnippetPreview: {
        language: "html",
        filename: "index.html",
        code: `<main class="site-container">\n  <header class="hero-intro">\n    <h1>Alex Tan - Student Projects</h1>\n    <p>Python scripts and small web tools built in class.</p>\n  </header>\n  <section class="projects-grid" aria-label="Selected Projects">\n    <article class="project-card">\n      <h3>Kinematics Calculator</h3>\n      <p>Quick formula solver for secondary physics revision.</p>\n    </article>\n  </section>\n</main>`,
      },
      studentLevel: "Example · Intro Web Dev",
      learningOutcome: "Students design a multi-section webpage that displays neatly on both mobile phones and laptops.",
    },
    {
      id: "study-timer-tool",
      title: "Pomodoro Study Timer",
      category: "Study Tool",
      categoryBadge: "Example Project",
      description: "A 25-minute revision timer that saves focus sessions right in the browser.",
      skillsDemonstrated: [
        "Button Click Events",
        "Countdown Timers",
        "Saving Progress",
        "Clear Screen Updates",
      ],
      isInteractive: false,
      codeSnippetPreview: {
        language: "javascript",
        filename: "timer.js",
        code: `class StudyTimer {\n  constructor(minutes = 25, onTick, onComplete) {\n    this.remainingSeconds = minutes * 60;\n    this.timerId = null;\n    this.onTick = onTick;\n    this.onComplete = onComplete;\n  }\n  start() {\n    if (this.timerId) return;\n    this.timerId = setInterval(() => {\n      this.remainingSeconds--;\n      this.onTick(this.remainingSeconds);\n      if (this.remainingSeconds <= 0) {\n        clearInterval(this.timerId);\n        this.timerId = null;\n        this.onComplete();\n      }\n    }, 1000);\n  }\n}`,
      },
      studentLevel: "Example · Study Tool",
      learningOutcome: "Students use JavaScript timers and browser storage to build a revision timer that remembers progress.",
    },
  ],

  learningStages: [
    {
      step: 1,
      title: "Concept Breakdown & Notes",
      subtitle: "First 20 Mins · Summary Notes",
      badge: "Step 01",
      description: "Tutors walk through summary notes and simple paper diagrams before students write code.",
      mentorRole: "Explains the big picture with visual diagrams and quick check-in questions.",
      reasoningFocus: "Understanding how functions and data work before memorising syntax.",
      concreteExample: "Using simple box-and-arrow diagrams on paper to show how Python stores data.",
    },
    {
      step: 2,
      title: "Guided Class Walkthrough",
      subtitle: "Next 35 Mins · Worked Examples",
      badge: "Step 02",
      description: "Tutors build worked examples live while students follow along step by step.",
      mentorRole: "Models how to break a big question into small steps so no one falls behind.",
      reasoningFocus: "Turning problem requirements into small steps and clear functions.",
      concreteExample: "Splitting a score calculator into small, easy-to-test helper steps.",
    },
    {
      step: 3,
      title: "Independent Practice Drills",
      subtitle: "Next 45 Mins · Graded Worksheets",
      badge: "Step 03",
      description: "Students work through graded practice questions on their own to build speed and confidence.",
      mentorRole: "Prompts stuck students to check their values on paper instead of guessing.",
      reasoningFocus: "Reading error messages calmly and checking tricky edge cases.",
      concreteExample: "Catching common loop and counting errors during timed practice.",
    },
    {
      step: 4,
      title: "1-on-1 Code Review & Feedback",
      subtitle: "Final 20 Mins · 1-on-1 Marking",
      badge: "Step 04",
      description: "Tutors check each student's code in class so mistakes are fixed before homework.",
      mentorRole: "Marks work 1-on-1 and checks that your child can explain their solution clearly.",
      reasoningFocus: "Clean, readable code and explaining logic aloud.",
      concreteExample: "Showing how to turn messy 20-line code into 5 clean lines.",
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
      role: "Python & Foundations Tutor",
      photoUrl: undefined,
      degreeProgram: "NUS Computing Student (Degree programme TBC)",
      institution: "National University of Singapore (Undergraduate)",
      teachingExperience: "Individual teaching background to be confirmed before term intake.",
      scholarships: ["Scholarship details to be confirmed"],
      innovationBadges: ['Innovation programme ("C Innovators", official name TBC)'],
      specializations: ["Python Basics", "Problem Breakdown", "Debugging"],
      bio: "Second founding NUS Computing tutor profile — full name and background to be confirmed before term intake.",
      avatarPlaceholderText: "FM",
      statusLabel: "Profile Template (TBC)",
      highlightQuote: "Students should be able to explain every line of code they write.",
    },
    {
      id: "mentor-template-2",
      name: "Evan Tan",
      role: "Co-Founder · Python, AI & Exam Prep Tutor",
      photoUrl: "/images/evan-tan.jpg",
      degreeProgram: "Double Degree: BComp (Computer Science) & BBA (Finance)",
      institution: "National University of Singapore (Undergraduate)",
      teachingExperience:
        "Over 4 years tutoring N-Level, O-Level, and A-Level students, NUS Product Club Curriculum Design team, and hands-on industry software experience.",
      scholarships: [
        "Residential College 4 (RC4)",
        "NUS Venture Initiation Programme",
      ],
      innovationBadges: [
        "NUS C-Innovators",
        "ML Tech Lead (NUS FinTech Society)",
      ],
      specializations: [
        "Python & Web Apps",
        "AI & Machine Learning",
        "O-Level & H2 Computing",
        "Exam Summary Notes",
      ],
      bio: "NUS Computer Science and Business (Double Degree) student with 4+ years of teaching N-Level, O-Level, and A-Level students. Previously built AI and software systems at RAiD (RSAF), 10x.ai, and Dibs under NUS C-Innovators.",
      avatarPlaceholderText: "ET",
      statusLabel: "Co-Founder",
      highlightQuote:
        "Clear summary notes and building projects students actually care about make tough concepts click.",
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
      description: "Core Python fundamentals: functions, loops, lists, dictionaries, and step-by-step code tracing.",
      topics: [
        "Functions, loops & base cases",
        "Lists, dictionaries & data modelling",
        "Variable scope & memory references",
        "Reading tracebacks & debugging",
      ],
      outcomes: "Students trace code accurately and build terminal programs they can explain.",
    },
    {
      level: 2,
      title: "Guided Applied Projects",
      stageBadge: "Available Now",
      isAvailableNow: true,
      status: "available",
      targetAudience: "Students ready to build",
      description: "Turn core concepts into interactive websites, study tools, and multi-file Python projects.",
      topics: [
        "HTML5 & responsive CSS layouts",
        "JavaScript events & DOM updates",
        "JSON data & browser state",
        "Guided end-to-end project builds",
      ],
      outcomes: "Students finish working projects for their portfolio or DSA application.",
    },
    {
      level: 3,
      title: "Independent Building",
      stageBadge: "Proposed Track",
      isAvailableNow: false,
      status: "roadmap",
      targetAudience: "Intermediate Secondary & JC Students",
      description: "Plan and build larger multi-file projects from scratch using APIs, databases, and mentor code reviews.",
      topics: [
        "Multi-file project structure",
        "SQLite databases & file storage",
        "Backend APIs & deployment",
        "End-to-end personal project",
      ],
      outcomes: "Students plan, test, and ship a complete project of their own.",
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
      answer: "Yes. Scratch, Beginner Python, and Introductory Web Development all start from zero experience. We explain each idea clearly with examples before expecting students to write code.",
    },
    {
      id: "faq-hardware",
      category: "technology",
      categoryLabel: "Laptop & Tools",
      question: "What laptop does my child need?",
      answer: "Any working Windows, Mac, or Chromebook laptop with a web browser (Chrome, Edge, or Firefox) is enough. All tools we use are free, and tutors help set everything up during the trial.",
    },
    {
      id: "faq-selection",
      category: "curriculum",
      categoryLabel: "Choosing a Course",
      question: "Should we pick Beginner Python or Introductory Web Development?",
      answer: "Beginner Python suits students who enjoy logic puzzles, maths, or plan to take school Computing. Web Development suits students who want to design pages and tools they can open on their phone. If you're unsure, pick 'Undecided' in the form and we'll advise during the trial.",
    },
    {
      id: "faq-feedback",
      category: "pedagogy",
      categoryLabel: "Progress Feedback",
      question: "How will parents know how their child is doing?",
      answer: "Tutors share regular updates on what concepts your child has mastered, where they get stuck, and what they built. Students also walk parents through their finished project at the end of each module.",
    },
    {
      id: "faq-ai-tools",
      category: "pedagogy",
      categoryLabel: "AI Tools Policy",
      question: "What is your policy on ChatGPT and AI coding tools?",
      answer: "Students write and fix core exercises themselves without letting AI generate the answers. Once they grasp the basics, we teach them how to check and verify AI-suggested code safely.",
    },
    {
      id: "faq-olevel-alevel",
      category: "curriculum",
      categoryLabel: "O-Level & JC Computing",
      question: "Do you offer O-Level Computing (7155), A-Level H2 Computing (9569), or IB Computer Science tuition?",
      answer: "Yes — through 1-on-1 private coaching (S$75/hr) or targeted exam prep tailored to O-Level Computing (7155), A-Level H2 Computing (9569), and IB Computer Science. Beginners can also build foundations in Scratch or Beginner Python first.",
    },
    {
      id: "faq-dsa-online",
      category: "admissions",
      categoryLabel: "DSA & Lesson Format",
      question: "Do you help with DSA coding portfolios, and are classes in-person or online?",
      answer: "Yes. We coach students preparing DSA coding portfolios for Secondary and JC admissions, and offer both in-person lessons near Yishun MRT and live online sessions.",
    },
    {
      id: "faq-singapore-classes",
      category: "admissions",
      categoryLabel: "Location & Class Size",
      question: "Where are BaseCase Learning coding classes held in Singapore, and how large are classes?",
      answer: "In-person small-group classes (3 to 6 students per table) are held near Yishun MRT, alongside live online and 1-on-1 options. New students start with a S$40 60-minute trial (credited toward your first month's fees if you enrol).",
    },
  ],

  enquiryConfig: {
    studentLevels: [
      "Primary 4–6",
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
      "Taking School Computing (O-Level / A-Level / IB)",
    ],
    coursePreferences: [
      "Scratch (Upper Pri – Lower Sec)",
      "SICP in Python (SICPY)",
      "O-Level Computing (7155)",
      "A-Level H2 Computing (9569)",
      "Beginner Python",
      "Introductory Web Development",
      "Undecided (Please recommend during trial)",
    ],
    trialTimelineNotice:
      "We reply to trial enquiries within 24 hours via WhatsApp or email to confirm fit and share timings near Yishun MRT or online.",
    privacyGuarantee:
      "We only use these details to reply to your trial enquiry. Nothing is shared with third parties.",
    demoModeNotice:
      "Preview mode: form checks work, and live enquiry delivery is being finalised. Please WhatsApp us directly at +65 9350 9168 if you'd like to book right away.",
    recommenderGoals: [
      {
        id: "logic",
        label: "Logic puzzles, maths, or school Computing",
        recommendedCourse: "Beginner Python",
        reason: "Students learn step-by-step problem breakdown in Python, which also prepares them for school Computing.",
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
        reason: "We’ll try a short hands-on activity in the trial and recommend whether Classes or Project Courses fit better.",
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
        description: "A guided coding activity with an NUS Computing tutor where your child tries writing and running code.",
      },
      {
        step: 3,
        title: "Parent Debrief & Next Steps",
        description: "Plain-English feedback on how your child did and which starting class or course fits best.",
      },
    ],
    trialLogisticsNote:
      "Exact timings near Yishun MRT or online are arranged during consultation when we confirm your trial slot.",
    betweenLessonSupport: [
      "WhatsApp help when stuck on homework between lessons",
      "Clear summary notes & reference code after each topic",
      "Small-group pace (3–6 students) with direct tutor feedback",
    ],
  },

  /* Editable placeholder pricing tiers - update SGD rates and billing cycles below as needed. */
  pricing: {
    headline: "Tuition Fees & Class Packages",
    subheadline:
      "Small-group coding classes near Yishun MRT & online, plus 1-on-1 mentorship for Primary, Secondary, JC, and IB students.",
    placeholderNotice:
      "Standard rate guide below. Exact class slots near Yishun MRT or online are confirmed with parents before enrolment.",
    tiers: [
      {
        id: "trial-consultation",
        name: "1-on-1 Trial & Consultation",
        badge: "Start Here",
        price: "S$40",
        billingCycle: "per 60-min session",
        summary: "Diagnostic coding session and parent debrief (credited to your first month's fees if you enrol).",
        features: [
          "1-on-1 diagnostic coding session with an NUS Computing tutor",
          "See how your child approaches problem-solving (no experience needed)",
          "Free software setup on your child's laptop so they're ready to code",
          "Plain-English parent feedback & recommended class or course",
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
        summary: "Weekly 2-hour classes in small groups of 3–6 students near Yishun MRT or online.",
        features: [
          "4 weekly 2-hour coached sessions (Classes or Project Courses)",
          "Small class ratio of 3–6 students per table",
          "Summary notes, graded practice sheets & 1-on-1 marking in class",
          "WhatsApp homework and project Q&A between lessons",
          "Regular parent progress updates & end-of-module walkthrough",
        ],
        ctaText: "Enquire for group slots",
        ctaHref: "#trial-enquiry",
        isFeatured: true,
      },
      {
        id: "private-mentorship",
        name: "1-on-1 Private Mentorship",
        badge: "Custom Pace",
        price: "S$75",
        billingCycle: "per hour",
        summary: "Personalised coaching for O-Level / A-Level / IB Computing, DSA portfolios, or custom projects.",
        features: [
          "Dedicated 1-on-1 NUS Computing tutor matched to your child's goals",
          "Custom pacing for school Computing exams or DSA portfolios",
          "Targeted exam prep: trace tables, algorithms, and step-by-step code review",
          "Flexible timing around CCA and school exam schedules",
        ],
        ctaText: "Request 1-on-1 coaching",
        ctaHref: "#trial-enquiry",
        isFeatured: false,
      },
    ],
    includedItems: [
      {
        title: "DSA & Uni Pathway Advice",
        description: "Practical guidance beyond weekly lessons on DSA portfolios, poly/JC computing choices, and university CS paths.",
      },
      {
        title: "No Extra Software Costs",
        description: "Students use free, industry-standard coding tools — zero paid subscriptions required.",
      },
      {
        title: "Between-Lesson WhatsApp Support",
        description: "Students can message their tutor on WhatsApp when stuck on homework bugs between classes.",
      },
      {
        title: "Regular Parent Progress Notes",
        description: "Short written updates on topics mastered, problem-solving habits, and upcoming goals.",
      },
    ],
    pricingFaqs: [
      {
        question: "Is the trial fee credited if we enrol?",
        answer:
          "Yes. If your child joins our weekly small-group or 1-on-1 classes, we deduct the S$40 trial fee from your first month's fees.",
      },
      {
        question: "What happens if my child misses a weekly lesson due to school or CCA?",
        answer:
          "Let us know ahead of time on WhatsApp and we will arrange a catch-up slot or a short 1-on-1 recap before the next class so your child does not fall behind.",
      },
      {
        question: "How does billing work for months with 5 weeks or public holidays?",
        answer:
          "Monthly group packages cover 4 scheduled lessons. If a month has a 5th week or a public holiday, we confirm the schedule and fee adjustment in advance.",
      },
    ],
  },
};
