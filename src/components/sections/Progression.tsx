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
      className={cn('py-16 sm:py-24 bg-white border-t border-slate-200/80', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="teal" size="md" className="mb-3">
            Pathway
          </Badge>
          <h2
            id="progression-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight"
          >
            Learning Progression
          </h2>
          <p className="mt-4 text-lg text-slate-700 leading-relaxed">
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
                  'relative flex flex-col justify-between rounded-2xl p-6 transition-all',
                  isAvailable
                    ? 'bg-white border-2 border-teal-600/60 shadow-sm'
                    : 'bg-slate-50/70 border-2 border-dashed border-slate-300'
                )}
              >
                <div>
                  {/* Top Level Indicator & Availability Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-slate-700">
                      LEVEL 0{stage.level}
                    </span>
                    <Badge variant={isAvailable ? 'teal' : 'amber'}>
                      {stage.stageBadge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    {stage.targetAudience}
                  </p>

                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Key Topics List */}
                  <div className="mt-5 pt-4 border-t border-slate-200/80">
                    <strong className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-2">
                      Syllabus Focus:
                    </strong>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {stage.topics.map((topic, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-teal-600 font-bold mr-1.5">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Outcome & Status Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <div className="text-xs text-slate-600 mb-3">
                    <strong className="text-slate-900 block font-semibold mb-0.5">
                      Stage Goal:
                    </strong>
                    {stage.outcomes}
                  </div>

                  {isAvailable ? (
                    <a
                      href="#courses"
                      className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                    >
                      <span>See available courses</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-xs font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
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
        <div className="mt-12 text-center text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          <p>
            * Note: Levels 1 and 2 are available at launch. Independent building and Secondary / JC subject tuition are future plans and are not open for enrolment yet.
          </p>
        </div>
      </div>
    </section>
  );
}
