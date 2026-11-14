import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';

export interface HeroProps {
  headline?: string;
  subheadline?: string;
  badgeText?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  highlights?: string[];
  className?: string;
}

const whyChooseItems = [
  {
    title: 'Small-Group Coaching',
    description:
      'Focused class tables so mentors can spot logic gaps early instead of lecturing a packed room.',
    photoTitle: 'Small-Group Table Photo',
    shotGuide: '3–4 students around a table with a mentor walking through a problem.',
    fileHint: 'public/images/why-small-group.jpg',
  },
  {
    title: 'NUS Computing Mentors',
    description:
      'Taught directly by computing undergraduates who break concepts down into clear everyday steps.',
    photoTitle: 'Mentor Explaining Concept',
    shotGuide: 'Tutor sketching a diagram or logic flow on a whiteboard or iPad for a student.',
    fileHint: 'public/images/why-mentors.jpg',
  },
  {
    title: 'Hands-On Projects',
    description:
      'Every module ends with a working Python or web project students build and can explain line by line.',
    photoTitle: 'Student Project on Screen',
    shotGuide: 'Over-the-shoulder shot of a student testing their Python app or web page.',
    fileHint: 'public/images/why-projects.jpg',
  },
  {
    title: 'Step-by-Step Debugging',
    description:
      'Students learn to trace errors and test assumptions independently rather than guessing.',
    photoTitle: '1-on-1 Code Review',
    shotGuide: 'Mentor sitting next to a student helping them trace and fix an error.',
    fileHint: 'public/images/why-debugging.jpg',
  },
];

export function Hero({
  headline,
  subheadline,
  badgeText,
  primaryCta,
  secondaryCta,
  highlights,
  className,
}: HeroProps) {
  const activeHeadline = headline ?? siteConfig.hero.headline;
  const activeSubheadline = subheadline ?? siteConfig.hero.subheadline;
  const activeBadgeText = badgeText ?? siteConfig.hero.badgeText;
  const activePrimaryCta = primaryCta ?? siteConfig.hero.primaryCta;
  const activeSecondaryCta = secondaryCta ?? siteConfig.hero.secondaryCta;
  const activeHighlights = highlights ?? siteConfig.hero.highlights;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className={cn('relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-white border-b border-slate-200', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Split Hero: Copy Left + Classroom Photo Placeholder Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-3">
              {activeBadgeText}
            </p>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
            >
              {activeHeadline}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {activeSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href={activePrimaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
              >
                <span>{activePrimaryCta.text}</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
              <a
                href={activeSecondaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
              >
                <span>{activeSecondaryCta.text}</span>
                <BookOpen className="w-4 h-4 ml-2 text-slate-500" aria-hidden="true" />
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
                {activeHighlights.map((item) => (
                  <li key={item} className="flex items-start text-left">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Hero Classroom Photo Placeholder */}
          <div className="lg:col-span-6">
            <PhotoPlaceholder
              title="Classroom & Mentorship Hero Photo"
              aspectRatio="4:3"
              dimensions="1200 × 900 px"
              shotGuide="Shoot a bright, natural photo of 1 tutor seated beside 2–3 secondary or JC students with laptops, pointing at a screen together."
              fileHint="public/images/hero-classroom.jpg"
              className="shadow-sm"
            />
          </div>
        </div>

        {/* Bottom 4-Card "Why BaseCase Learning" Visual Grid (Zenith / EduFirst style) */}
        <div className="mt-14 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              The BaseCase Approach
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Parents &amp; Students Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <PhotoPlaceholder
                  title={item.photoTitle}
                  aspectRatio="16:10"
                  dimensions="800 × 500 px"
                  shotGuide={item.shotGuide}
                  fileHint={item.fileHint}
                  className="rounded-none border-0 border-b-2 border-dashed border-slate-300"
                />
                <div className="p-4 flex-1">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
