import React from 'react';
import { siteConfig } from '@/config/siteConfig';
import { Hero } from '@/components/sections/Hero';
import { Courses } from '@/components/sections/Courses';
import { Showcase } from '@/components/sections/Showcase';
import { HowLearningWorks } from '@/components/sections/HowLearningWorks';
import { Mentors } from '@/components/sections/Mentors';
import { Progression } from '@/components/sections/Progression';
import { Faq } from '@/components/sections/Faq';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';

export default function HomePage() {
  const { trialSteps, trialLogisticsNote } = siteConfig.enquiryConfig;

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Course Options */}
      <Courses />

      {/* 3. Project Showcase & Interactive Lab */}
      <Showcase />

      {/* 4. How Learning Works Pedagogy */}
      <HowLearningWorks />

      {/* 5. Meet the Mentors */}
      <Mentors />

      {/* 6. Learning Progression Pathway */}
      <Progression />

      {/* 7. Parent FAQs */}
      <Faq />

      {/* 8. Trial Enquiry Section (2-Column: Trial Walkthrough + Enquiry Form) */}
      <section
        id="trial-enquiry"
        aria-labelledby="enquiry-heading"
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-teal-100 text-teal-800 border border-teal-200 mb-4">
            Trial Booking
          </span>
          <h2 id="enquiry-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book a Coding Trial
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Leave your details below and we’ll follow up to arrange a trial session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: What Happens in a Trial */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight">
                What Happens in a Trial Class
              </h3>
              <ol className="mt-5 space-y-5">
                {trialSteps.map((item) => (
                  <li key={item.step} className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-teal-700 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                {trialLogisticsNote}
              </p>
            </div>
          </div>

          {/* Right Column: Accessible Trial Enquiry Form */}
          <div className="lg:col-span-7">
            <TrialEnquiryForm className="max-w-none" />
          </div>
        </div>
      </section>
    </div>
  );
}
