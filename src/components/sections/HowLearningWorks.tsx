import React from 'react';
import { BookOpen, Code2, Bug, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { siteConfig, LearningStage } from '@/config/siteConfig';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';

export interface HowLearningWorksProps {
  stages?: LearningStage[];
  className?: string;
}

const stageIcons = [BookOpen, Code2, Bug, ClipboardCheck];

const stepPhotos = [
  {
    title: 'Step 1: Concept Notes Photo',
    shotGuide: 'Tutor explaining a visual logic diagram and printed summary notes to 2–3 students at a table.',
    fileHint: 'public/images/lesson-step-1.jpg',
  },
  {
    title: 'Step 2: Guided Walkthrough Photo',
    shotGuide: 'Tutor demonstrating code step by step on a screen while students follow along on their laptops.',
    fileHint: 'public/images/lesson-step-2.jpg',
  },
  {
    title: 'Step 3: Practice Drills Photo',
    shotGuide: 'Students working independently on practice coding exercises and checking error messages.',
    fileHint: 'public/images/lesson-step-3.jpg',
  },
  {
    title: 'Step 4: 1-on-1 Marking Photo',
    shotGuide: "Tutor reviewing a student's code line by line and giving 1-on-1 feedback.",
    fileHint: 'public/images/lesson-step-4.jpg',
  },
];

const weeklyDeliverables = [
  {
    title: 'Summary Notes & Cheat Sheets',
    detail: 'Concise printed and PDF topic sheets covering key syntax, logic traces, and common pitfalls.',
  },
  {
    title: 'Graded Practice Worksheets',
    detail: 'Step-by-step drills moving from guided warm-ups to challenge and school-style questions.',
  },
  {
    title: '1-on-1 Code Marking in Class',
    detail: 'Individual line-by-line review during every session so weak spots are corrected immediately.',
  },
  {
    title: 'WhatsApp Support & Parent Updates',
    detail: 'Homework help between weekly lessons plus regular notes to keep parents updated on progress.',
  },
];

export function HowLearningWorks({
  stages = siteConfig.learningStages,
  className,
}: HowLearningWorksProps) {
  return (
    <section
      id="how-learning-works"
      aria-labelledby="how-learning-works-heading"
      className={cn('py-16 sm:py-20 bg-white border-t border-slate-300', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
            How Classes Run
          </p>
          <h2
            id="how-learning-works-heading"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            How Our Weekly Lessons Work
          </h2>
          <div className="w-12 h-1 bg-[#1E3A8A] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every 2-hour weekly lesson follows a clear 4-part tuition format: summary notes, worked examples, timed practice drills, and 1-on-1 tutor marking.
          </p>
        </div>

        {/* 4-Stage Structured Tuition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, idx) => {
            const Icon = stageIcons[idx % stageIcons.length];
            const photo = stepPhotos[idx % stepPhotos.length];

            return (
              <article
                key={stage.step}
                className="flex flex-col bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Solid Academic Navy Tuition Step Bar */}
                <div className="bg-[#1E3A8A] text-white px-4 py-2.5 flex items-center justify-between gap-2 dark-surface">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                    {stage.badge}
                  </span>
                  <span className="text-[11px] font-medium text-white truncate">
                    {stage.subtitle}
                  </span>
                </div>

                {/* Lesson Step Photo Placeholder */}
                <PhotoPlaceholder
                  title={photo.title}
                  aspectRatio="16:10"
                  dimensions="800 × 500 px"
                  shotGuide={photo.shotGuide}
                  fileHint={photo.fileHint}
                  className="rounded-none border-0 border-b-2 border-dashed border-slate-300"
                />

                {/* Stage Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {stage.title}
                      </h3>
                      <span className="p-1.5 rounded-md bg-slate-100 text-[#1E3A8A] border border-slate-300 flex-shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Concrete In-Class Example */}
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-slate-800 leading-relaxed">
                    <span className="font-semibold text-amber-950 block mb-0.5">
                      In-Class Example:
                    </span>
                    <span>{stage.concreteExample}</span>
                  </div>

                  {/* Tutor's Role Callout */}
                  <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 rounded-lg p-3 text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Tutor&apos;s Role:
                    </span>
                    <span>{stage.mentorRole}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Weekly Tuition Deliverables Banner (Flex preserves first .grid test invariant) */}
        <div className="mt-10 bg-slate-50 rounded-xl border border-slate-300 border-t-4 border-t-[#1E3A8A] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center shadow-sm">
          <div className="w-full lg:w-1/2">
            <PhotoPlaceholder
              title="Weekly Small-Group Class & Notes"
              aspectRatio="16:9"
              dimensions="1000 × 560 px"
              shotGuide="Wide shot of a typical 2-hour tuition class with printed summary sheets and laptops open."
              fileHint="public/images/classroom-method.jpg"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
                Every Weekly Lesson
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                What Students Receive Every Week
              </h3>
            </div>

            <ul className="space-y-3">
              {weeklyDeliverables.map((item) => (
                <li key={item.title} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2
                    className="w-4 h-4 text-[#1E3A8A] mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">{item.title}: </span>
                    <span className="text-slate-600">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
