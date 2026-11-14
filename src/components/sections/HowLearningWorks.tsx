import React from 'react';
import { Lightbulb, Code2, Bug, CheckCircle } from 'lucide-react';
import { siteConfig, LearningStage } from '@/config/siteConfig';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';

export interface HowLearningWorksProps {
  stages?: LearningStage[];
  className?: string;
}

const stageIcons = [Lightbulb, Code2, Bug, CheckCircle];

export function HowLearningWorks({
  stages = siteConfig.learningStages,
  className,
}: HowLearningWorksProps) {
  return (
    <section
      id="how-learning-works"
      aria-labelledby="how-learning-works-heading"
      className={cn('py-16 sm:py-20 bg-white border-t border-slate-200', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            How Lessons Run
          </p>
          <h2
            id="how-learning-works-heading"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            How Learning Works
          </h2>
          <div className="w-12 h-1 bg-teal-700 mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Students learn best by thinking through problems, writing code themselves, and fixing their own mistakes—not copying syntax off a slide.
          </p>
        </div>

        {/* 4-Stage Connected Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, idx) => {
            const Icon = stageIcons[idx % stageIcons.length];
            return (
              <div
                key={stage.step}
                className="relative flex flex-col bg-white rounded-lg border border-slate-200 border-t-4 border-t-teal-700 p-6 shadow-sm hover:shadow transition-shadow"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
                    {stage.badge}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-50 text-teal-700 border border-slate-200/70">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {stage.title}
                </h3>
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mt-0.5">
                  {stage.subtitle}
                </p>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Classroom in Action Feature Banner (Flex layout preserves first .grid selector expectations) */}
        <div className="mt-10 bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-1/2">
            <PhotoPlaceholder
              title="90-Minute Lesson in Action"
              aspectRatio="16:9"
              dimensions="1000 × 560 px"
              shotGuide="Wide shot of a typical class session: tutor reviewing logic on a screen while students test solutions on laptops."
              fileHint="public/images/classroom-method.jpg"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Inside Every Session
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Structured Practice Instead of Passive Slides
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We open each lesson with a short worked concept, move straight into guided coding together, give students solo mini-challenges to test their grasp, and close with individual feedback on how to clean up and debug their code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
