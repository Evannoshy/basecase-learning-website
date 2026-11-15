import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { siteConfig, ProgressionStage } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface ProgressionProps {
  stages?: ProgressionStage[];
  className?: string;
}

export function Progression({
  stages = siteConfig.progressionStages,
  className,
}: ProgressionProps) {
  return (
    <section
      id="progression"
      aria-labelledby="progression-heading"
      className={cn('py-16 sm:py-20 bg-white border-t border-slate-300', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
            Student Pathway
          </p>
          <h2
            id="progression-heading"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Learning Progression
          </h2>
          <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Start with core coding concepts, move into guided projects, and grow toward independent builds. Secondary and JC school tuition tracks are planned for later.
          </p>
        </div>

        {/* 4-Level Stepper Pathway Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {stages.map((stage) => {
            const isAvailable = stage.isAvailableNow;
            return (
              <div
                key={stage.level}
                className={cn(
                  'relative flex flex-col justify-between rounded-lg p-6 transition-all border border-slate-300 border-t-4 shadow-sm',
                  isAvailable
                    ? 'bg-white border-t-[#166534]'
                    : 'bg-slate-50 border-t-amber-500 border-dashed'
                )}
              >
                <div>
                  {/* Top Level Indicator & Availability Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      LEVEL 0{stage.level}
                    </span>
                    <Badge variant={isAvailable ? 'default' : 'amber'}>
                      {stage.stageBadge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    {stage.targetAudience}
                  </p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Key Topics List */}
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <strong className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                      Syllabus Focus:
                    </strong>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {stage.topics.map((topic, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[#166534] font-bold mr-1.5">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Outcome & Status Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-600 mb-3">
                    <strong className="text-slate-900 block font-semibold mb-0.5">
                      Stage Goal:
                    </strong>
                    {stage.outcomes}
                  </div>

                  {isAvailable ? (
                    <a
                      href="#courses"
                      className="inline-flex items-center text-xs font-semibold text-[#166534] hover:text-[#15803D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
                    >
                      <span>See available courses</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                      Planned (Not Open Yet)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Plans Notice */}
        <div className="mt-10 text-center text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          <p>
            * Note: Levels 1 and 2 are available. Independent building and Secondary / JC subject tuition are future plans and are not open for enrolment yet.
          </p>
        </div>
      </div>
    </section>
  );
}
