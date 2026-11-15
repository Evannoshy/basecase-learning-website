# BaseCase Learning Website — Launch & Developer Handoff

Welcome to the **BaseCase Learning** web application. Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, the site is designed around a single central configuration file (`src/config/siteConfig.ts`) so brand details, courses, mentor profiles, FAQs, and future subject expansions can be updated without modifying UI components.

---

## 1. What Was Built

### Homepage Sections (`src/app/page.tsx`)
1. **Opening / Hero (`src/components/sections/Hero.tsx`)**:
   - Headline: *"Learn to code. Build something you’re proud of."*
   - Guided-project and approachable-mentorship positioning, primary CTA (*Book a coding trial* -> `#trial-enquiry`), secondary CTA (*Explore courses* -> `#courses`), and a programming-inspired code card (`first_principles.py`).
2. **Course Options (`src/components/sections/Courses.tsx`)**:
   - Editable course cards for **Beginner Python** and **Introductory Web Development** covering intended learner, prerequisites, learning goals, example final project, and lesson format.
   - Explicit **Unconfirmed Operational Details (TBC)** callouts stating that ages, fees, schedules, class sizes, and durations are unconfirmed and finalized upon consultation.
3. **Example Project Showcase (`src/components/sections/Showcase.tsx` & `src/components/showcase/InteractiveProject.tsx`)**:
   - Clearly labelled **Example Projects** (Python Quiz Game, Personal Website & Portfolio, Pomodoro Revision & Study Tool) with filter tabs and expandable code snippets.
   - Includes a live, browser-interactive **Python Logic Quiz Runner** with simulated terminal output, instant feedback, keyboard navigation, and score tracking.
4. **How Learning Works (`src/components/sections/HowLearningWorks.tsx`)**:
   - 4-stage learning cycle: *Understand Concept* -> *Build with Guidance* -> *Solve Challenge Independently* -> *Receive Feedback and Improve*, highlighting systematic debugging and code reasoning.
5. **Meet the Mentors (`src/components/sections/Mentors.tsx`)**:
   - Editable mentor profile cards supporting `name`, `photoUrl` (with monogram initials fallback), `degreeProgram`, `institution`, `teachingExperience`, `scholarships`, `innovationBadges`, and `specializations`.
   - Placeholder templates are used so no unconfirmed individuals, awards, grades, or university/scholarship logos are published. Includes a prominent independence & non-affiliation notice.
6. **Learning Progression (`src/components/sections/Progression.tsx`)**:
   - 4-level pathway clearly distinguishing currently available foundational tracks (*Level 01–02*) from proposed future stages (*Level 03 Independent Building*, *Level 04 Secondary & JC Academic Tuition*).
7. **Parent FAQs (`src/components/sections/Faq.tsx` & `src/components/ui/Accordion.tsx`)**:
   - Accessible accordion covering beginner suitability, laptop requirements, course selection, progress feedback, responsible AI tool usage, and unconfirmed schedule/fee transparency.
8. **Trial Enquiry (`src/components/forms/TrialEnquiryForm.tsx` & `src/app/api/enquiry/route.ts`)**:
   - Accessible form collecting parent/guardian name, contact (email or 8-digit SG mobile), student age (10–19), coding experience, preferred course, and optional notes.
   - Enforces inline validation (`role="alert"`, `aria-describedby`, focus jump to first invalid input) and an **honest delivery guard**: when `ENQUIRY_WEBHOOK_URL` is not configured, `/api/enquiry` returns `status: "BACKEND_NOT_CONFIGURED"` (`success: false`) and the UI shows a **Development Preview** notice rather than a false submission confirmation.

### Navigation, Accessibility & Styling
- **Coding-focused navigation (`src/components/layout/Header.tsx` & `Footer.tsx`)**: Top navigation focuses strictly on coding sections, while `siteConfig.futureNavigation` and `#progression` reserve clean hooks for future Secondary & JC tuition without advertising unavailable classes.
- **Accessibility (`src/app/layout.tsx` & `src/app/globals.css`)**: Semantic landmarks, skip-to-content link, visible `:focus-visible` outlines, WCAG AA contrast (warm ivory `#FAF8F5`, dark navy `#0B132B`, teal `#0D9488`, amber `#D97706`), and `@media (prefers-reduced-motion: reduce)` support.

---

## 2. How to Preview & Verify Locally

> **Windows PowerShell Note**: Use `npm.cmd` (or run from Command Prompt / Git Bash) if PowerShell blocks `npm.ps1`.

```bash
# 1. Start development server at http://localhost:3000
npm.cmd run dev

# 2. Run automated unit, component, validation, and E2E tests
npm.cmd test

# 3. Run TypeScript typechecking and ESLint
npm.cmd run typecheck
npm.cmd run lint

# 4. Build and preview the production bundle
npm.cmd run build
npm.cmd run start
```

---

## 3. Business Details & Integrations Needed Before Launch

Before deploying publicly, update the following items:

1. **Brand Name (Optional / Provisional)**:
   - Edit `siteConfig.brand.name` and `siteConfig.brand.shortName` in `src/config/siteConfig.ts`. The Header, Footer, Hero, and metadata update automatically.
2. **Confirmed Contact Details (`src/config/siteConfig.ts` -> `siteConfig.brand.contact`)**:
   - Replace placeholder `email`, `phone`, `phoneDisplay`, `whatsappNumber`, `whatsappUrl`, `locationDetail`, and `brand.socialLinks`.
3. **Mentor Profiles & Programme Names (`src/config/siteConfig.ts` -> `siteConfig.mentors`)**:
   - Replace `Founding Mentor 01/02 (Profile TBC)` with real mentor names, optional `photoUrl` paths (placed under `public/images/mentors/`), verified degree programmes, confirmed teaching experience, scholarship names, and the confirmed official name for the innovation programme currently referred to as `"C Innovators"`.
   - Do **not** add NUS or scholarship provider logos unless expressly permitted.
4. **Operational Course Details (`src/config/siteConfig.ts` -> `siteConfig.courses[*].unconfirmedDetails`)**:
   - Once finalized, update age ranges, schedules, class sizes, fees, and durations, and update `faq-operations` in `siteConfig.faqs`.
5. **Live Enquiry Delivery Integration (`RESEND_API_KEY` or `ENQUIRY_WEBHOOK_URL`)**:
   - **Recommended (Resend)**: Set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` (defaults to `basecaselearning@gmail.com`), and `ENQUIRY_FROM_EMAIL` (defaults to `BaseCase Enquiries <onboarding@resend.dev>`) in `.env.local` or Vercel Environment Variables. Note: Resend's default `onboarding@resend.dev` sender can only deliver to the email address registered on your Resend account unless a custom sending domain is verified.
   - **Optional Webhook Override (`ENQUIRY_WEBHOOK_URL`)**: If set, `POST /api/enquiry` sends the enquiry JSON payload directly to your webhook URL instead of Resend:
     ```json
     {
       "enquiryId": "BC-TR-YYYYMM-XXXXXX",
       "submittedAt": "2026-11-14T00:00:00.000Z",
       "data": {
         "parentName": "...",
         "contact": "...",
         "studentAge": 14,
         "codingExperience": "...",
         "preferredCourse": "...",
         "notes": "..."
       },
       "source": "basecase-learning-website",
       "environment": "production"
     }
     ```
   - Only when Resend or `ENQUIRY_WEBHOOK_URL` responds with HTTP `2xx` will `/api/enquiry` return `{ "success": true, "status": "DELIVERED" }` and display the confirmation screen to parents.
6. **Future Secondary & JC Tuition Expansion**:
   - When ready to launch Secondary or JC subjects, copy entries from `siteConfig.futureNavigation` into `siteConfig.navigation`, update `siteConfig.progressionStages`, and add corresponding course cards to `siteConfig.courses`.
