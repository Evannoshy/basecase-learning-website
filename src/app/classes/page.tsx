import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Coding Classes & Syllabuses',
  description:
    'In-depth guide to theory and exam-prep coding classes at BaseCase Learning: Scratch, SICP in Python (SICPY), O-Level Computing (7155), and A-Level H2 Computing (9569).',
  alternates: {
    canonical: '/classes',
  },
};

export default function ClassesPage() {
  const { classes } = siteConfig;

  return (
    <div className="bg-white">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-500 font-medium">Coding Classes &amp; Syllabuses</span>
        </div>
      </div>

      {/* Page Header & Quick Jump Index */}
      <section aria-labelledby="classes-page-heading" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
              Theory &amp; Exam Prep
            </p>
            <h1
              id="classes-page-heading"
              className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Coding Classes &amp; Syllabuses
            </h1>
            <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Detailed guide to our structured classes near Yishun MRT and online — from beginner Scratch logic and deeper Python problem-solving to MOE O-Level and A-Level Computing exam preparation.
            </p>

            {/* Quick-jump navigation pills */}
            <nav aria-label="Jump to class details" className="mt-8 flex flex-wrap justify-center gap-2.5">
              {classes.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-[#166534] hover:text-white border border-slate-300 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* In-Depth Class Cards */}
          <div className="mt-12 space-y-10">
            {classes.map((item, idx) => (
              <article
                key={item.id}
                id={item.id}
                aria-labelledby={`${item.id}-title`}
                className="scroll-mt-32 bg-white rounded-xl border border-slate-300 border-t-4 border-t-[#166534] shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-[#166534]">
                        0{idx + 1}
                      </span>
                      <Badge variant="default">{item.trackBadge}</Badge>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{item.format}</span>
                  </div>

                  <h2
                    id={`${item.id}-title`}
                    className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                  >
                    {item.title}
                  </h2>
                  <p className="mt-2 text-base text-slate-700 leading-relaxed max-w-4xl">
                    {item.overview}
                  </p>

                  {/* Key Metadata Strip */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-slate-200 text-sm">
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#166534] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <strong className="text-slate-900 font-semibold">Who it&apos;s for: </strong>
                        <span className="text-slate-700">{item.targetLevel}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <strong className="text-slate-900 font-semibold">Prerequisites: </strong>
                        <span className="text-slate-700">{item.prerequisites}</span>
                      </div>
                    </div>
                  </div>

                  {/* Two-Column Deep Dive: Topics + Lesson Approach & Outcomes */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-slate-50 rounded-lg border border-slate-200 p-5 sm:p-6">
                      <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                        <Layers className="w-4 h-4 text-[#166534] mr-2" aria-hidden="true" />
                        Core Topics &amp; Syllabus Coverage
                      </h3>
                      <ul className="space-y-2.5 text-sm text-slate-700">
                        {item.topics.map((topic) => (
                          <li key={topic} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-[#166534] mr-2.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lg:col-span-5 space-y-5">
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                        <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                          <Users className="w-4 h-4 text-[#166534] mr-2" aria-hidden="true" />
                          How Lessons Run
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {item.lessonApproach}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                        <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                          <BookOpenCheck className="w-4 h-4 text-[#166534] mr-2" aria-hidden="true" />
                          Key Outcomes
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-700">
                          {item.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#166534] mr-2.5 mt-2 flex-shrink-0" aria-hidden="true" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Enquiry CTA */}
                  <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-slate-600">
                      Schedules and pacing are tailored to your child&apos;s current school level during trial consultation.
                    </p>
                    <Link
                      href="/#trial-enquiry"
                      className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#166534] hover:bg-[#15803D] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors flex-shrink-0"
                    >
                      <span>Enquire about {item.title}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Diagnostic Callout */}
          <div className="mt-14 rounded-xl bg-slate-50 border border-slate-300 p-6 sm:p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Not sure which class fits best?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Share your child&apos;s age, school subject, or goals in our trial form and an NUS Computing mentor will recommend the right starting track.
            </p>
            <div className="mt-5">
              <Link
                href="/#trial-enquiry"
                className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[#166534] hover:bg-[#15803D] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
              >
                <span>Book a coding trial</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
