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
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';
import { dispatchTrialSelection } from '@/lib/trialSelection';

export interface CoursesProps {
  courses?: Course[];
  className?: string;
}

const coursePhotoMeta: Record<string, { title: string; shotGuide: string; fileHint: string }> = {
  'python-foundations': {
    title: 'Beginner Python Course Photo',
    shotGuide: 'Student coding in VS Code / terminal or a clean photo of the Python Quiz project on screen.',
    fileHint: 'public/images/course-python.jpg',
  },
  'web-dev-intro': {
    title: 'Web Development Course Photo',
    shotGuide: 'Student building a responsive website with browser and HTML/CSS/JS code open side by side.',
    fileHint: 'public/images/course-web.jpg',
  },
};

export function Courses({ courses = siteConfig.courses, className }: CoursesProps) {
  const sharedDetails = courses[0]?.unconfirmedDetails;

  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className={cn('py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white', className)}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
          Our Programmes
        </p>
        <h2
          id="courses-heading"
          className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Starter Coding Courses
        </h2>
        <div className="w-12 h-1 bg-[#1E3A8A] mx-auto mt-4" aria-hidden="true" />
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          For secondary, pre-poly/JC, and pre-university students in Singapore. No coding background needed.
        </p>
      </div>

      {/* Courses 2-Column Image-Topped Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {courses.map((course) => {
          const coreGoals = course.learningGoals.slice(0, 3);
          const extraGoals = course.learningGoals.slice(3);
          const photo = coursePhotoMeta[course.id] ?? {
            title: `${course.title} Course Photo`,
            shotGuide: `Classroom or laptop photo illustrating students working on ${course.title}.`,
            fileHint: `public/images/course-${course.id}.jpg`,
          };

          return (
            <article
              key={course.id}
              className="flex flex-col justify-between bg-white rounded-xl border border-slate-300 border-t-4 border-t-[#1E3A8A] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div>
                {/* Course Cover Photo Slot */}
                <PhotoPlaceholder
                  title={photo.title}
                  aspectRatio="16:9"
                  dimensions="960 × 540 px"
                  shotGuide={photo.shotGuide}
                  fileHint={photo.fileHint}
                  className="rounded-none border-0 border-b-2 border-dashed border-slate-300"
                />

                <div className="p-6 sm:p-7">
                  {/* Header Badges & Title */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <Badge variant="default">{course.trackBadge}</Badge>
                    <Badge variant="slate">
                      {course.status === 'active' ? 'Trial Enquiries Open' : 'Upcoming'}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#1E3A8A]">
                    {course.tagline}
                  </p>

                  {/* Intended Learner */}
                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-start text-sm text-slate-700">
                    <GraduationCap className="w-4 h-4 text-slate-500 mr-2.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <strong className="text-slate-900 font-semibold">Intended Learners: </strong>
                      {course.intendedLearner}
                    </div>
                  </div>

                  {/* Core Learning Goals */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      What You Will Learn
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {coreGoals.map((goal, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compact Example Final Project Summary */}
                  <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-300">
                    <div className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-[#1E3A8A] mr-1.5" aria-hidden="true" />
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
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200 text-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Course Details (Prerequisites, Lesson Format, Extra Goals) */}
                  <details className="mt-5 border-t border-slate-200 pt-3">
                    <summary className="text-xs font-semibold text-[#1E3A8A] cursor-pointer hover:text-[#1E40AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded">
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
              </div>

              {/* Course Booking CTA Link */}
              <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-slate-200">
                <a
                  href="#trial-enquiry"
                  onClick={() =>
                    dispatchTrialSelection({
                      preferredCourse: course.title,
                    })
                  }
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] transition-colors"
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
        <div className="mt-8 px-5 py-4 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="inline-flex items-center font-bold uppercase tracking-wider text-amber-900 flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-700" aria-hidden="true" />
            Details TBC:
          </span>
          <p className="text-amber-950 leading-relaxed">
            <span>{sharedDetails.disclaimer}</span>{' '}
            <span className="text-amber-900">
              ({sharedDetails.ageRangeNotice} · {sharedDetails.scheduleNotice} · {sharedDetails.feeNotice})
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
