import React from 'react';
import { Lightbulb, Code2, Bug, CheckCircle } from 'lucide-react';
import { siteConfig, LearningStage } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
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
      className={cn('py-16 sm:py-24 bg-white border-t border-slate-200/80', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-3">
            How Lessons Run
          </Badge>
          <h2
            id="how-learning-works-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight"
          >
            How Learning Works
          </h2>
          <p className="mt-4 text-lg text-slate-700 leading-relaxed">
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
                className="relative flex flex-col bg-[#FAF8F5] rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow transition-shadow"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 border border-teal-200 px-2 py-0.5 rounded">
                    {stage.badge}
                  </span>
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {stage.title}
                </h3>
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mt-0.5">
                  {stage.subtitle}
                </p>

                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
