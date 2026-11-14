'use client';

import React from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  Users,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { siteConfig, Course } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { dispatchTrialSelection } from '@/lib/trialSelection';

export interface CoursesProps {
  courses?: Course[];
  className?: string;
}

export function Courses({ courses = siteConfig.courses, className }: CoursesProps) {
  const sharedDetails = courses[0]?.unconfirmedDetails;

  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className={cn('py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="teal" size="md" className="mb-3">
          Courses
        </Badge>
        <h2
          id="courses-heading"
          className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight"
        >
          Starter Coding Courses
        </h2>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">
          For secondary, pre-poly/JC, and pre-university students in Singapore. No coding background needed.
        </p>
      </div>

      {/* Courses 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {courses.map((course) => {
          const coreGoals = course.learningGoals.slice(0, 3);
          const extraGoals = course.learningGoals.slice(3);

          return (
            <article
              key={course.id}
              className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
            >
              <div>
                {/* Header Badges & Title */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <Badge variant="teal">{course.trackBadge}</Badge>
                  <Badge variant="slate" className="font-mono">
                    {course.status === 'active' ? 'Trial Enquiries Open' : 'Upcoming'}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-teal-700">
                  {course.tagline}
                </p>

                {/* Intended Learner */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-start text-sm text-slate-700">
                  <GraduationCap className="w-4 h-4 text-slate-500 mr-2.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900 font-semibold">Intended Learners: </strong>
                    {course.intendedLearner}
                  </div>
                </div>

                {/* Core Learning Goals */}
                <div className="mt-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3">
                    What You Will Learn:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {coreGoals.map((goal, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compact Example Final Project Summary */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-teal-600 mr-1.5" aria-hidden="true" />
                    Example Final Project
                  </div>
                  <h5 className="text-base font-bold text-slate-900">
                    {course.exampleFinalProject.title}
                  </h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {course.exampleFinalProject.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {course.exampleFinalProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-200/80 text-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collapsible Course Details (Prerequisites, Lesson Format, Extra Goals) */}
                <details className="mt-5 border-t border-slate-100 pt-3">
                  <summary className="text-xs font-semibold text-teal-700 cursor-pointer hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded">
                    More details (prerequisites &amp; lesson format)
                  </summary>
                  <div className="mt-3 space-y-3 text-sm text-slate-700">
                    <div className="flex items-start">
                      <Sparkles className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <strong className="text-slate-900 font-semibold">Prerequisites: </strong>
                        {course.prerequisites}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-4 h-4 text-slate-500 mr-2.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <strong className="text-slate-900 font-semibold">Lesson Format: </strong>
                        {course.lessonFormat}
                      </div>
                    </div>
                    {extraGoals.length > 0 && (
                      <ul className="space-y-1.5 pl-6 text-xs text-slate-600 list-disc">
                        {extraGoals.map((goal, idx) => (
                          <li key={idx}>{goal}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </div>

              {/* Course Booking CTA Link */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href="#trial-enquiry"
                  onClick={() =>
                    dispatchTrialSelection({
                      preferredCourse: course.title,
                    })
                  }
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors"
                >
                  <span>Book a trial for {course.title}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Single Shared Unconfirmed Operational Details Note */}
      {sharedDetails && (
        <div className="mt-8 px-5 py-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="inline-flex items-center font-mono font-bold uppercase tracking-wider text-amber-800 flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" aria-hidden="true" />
            Details TBC:
          </span>
          <p className="text-amber-900/90 leading-relaxed">
            <span>{sharedDetails.disclaimer}</span>{' '}
            <span className="text-amber-800/80">
              ({sharedDetails.ageRangeNotice} · {sharedDetails.scheduleNotice} · {sharedDetails.feeNotice})
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
