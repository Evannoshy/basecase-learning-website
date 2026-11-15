import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck } from 'lucide-react';
import { siteConfig, CodingClass } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

export interface ClassesProps {
  classes?: CodingClass[];
  className?: string;
}

export function Classes({ classes = siteConfig.classes, className }: ClassesProps) {
  return (
    <section
      id="classes"
      aria-labelledby="classes-heading"
      className={cn('py-16 sm:py-20 bg-slate-50 border-y border-slate-200', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">Theory &amp; Exam Prep</p>
          <h2 id="classes-heading" className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Coding Classes
          </h2>
          <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Concept-focused classes for school computing and computer-science fundamentals.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <BookOpenCheck className="w-5 h-5 text-[#166534]" aria-hidden="true" />
                <h3 className="mt-3 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.shortDescription}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/classes#${item.id}`}
                  className="inline-flex items-center text-xs font-semibold text-[#166534] hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
                >
                  <span>In-depth syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center space-y-3">
          <Link
            href="/classes"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#166534] hover:bg-[#15803D] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#166534] transition-colors"
          >
            <span>Explore full class details &amp; syllabuses</span>
            <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
          </Link>
          <p className="text-sm text-slate-600">
            Not sure which fits? Mention it in the enquiry form and we&apos;ll recommend one at the trial.
          </p>
        </div>
      </div>
    </section>
  );
}
