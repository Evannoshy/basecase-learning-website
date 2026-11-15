import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { Courses } from '@/components/sections/Courses';
import { Showcase } from '@/components/sections/Showcase';
import { HowLearningWorks } from '@/components/sections/HowLearningWorks';
import { Mentors } from '@/components/sections/Mentors';
import { Progression } from '@/components/sections/Progression';
import { Faq } from '@/components/sections/Faq';
import { TrialEnquiryForm } from '@/components/forms/TrialEnquiryForm';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { siteConfig } from '@/config/siteConfig';

function sanitizeJsonLdText(value: string): string {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .trim();
}

function buildHomeJsonLd() {
  const baseUrl = siteConfig.brand.url;
  const orgId = `${baseUrl}/#organization`;
  const orgName = sanitizeJsonLdText(siteConfig.brand.name) || 'BaseCase Learning';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': orgId,
        name: orgName,
        url: baseUrl,
        description: sanitizeJsonLdText(siteConfig.brand.description),
        email: siteConfig.brand.contact.email,
        telephone: siteConfig.brand.contact.phone,
        areaServed: {
          '@type': 'Country',
          name: 'Singapore',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#courses`,
        name: 'Coding Courses at BaseCase Learning',
        itemListElement: siteConfig.courses.map((course, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Course',
            name: sanitizeJsonLdText(course.title),
            description: sanitizeJsonLdText(`${course.tagline}. ${course.intendedLearner}`),
            provider: {
              '@id': orgId,
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: siteConfig.faqs.map((faq) => ({
          '@type': 'Question',
          name: sanitizeJsonLdText(faq.question),
          acceptedAnswer: {
            '@type': 'Answer',
            text: sanitizeJsonLdText(faq.answer),
          },
        })),
      },
    ],
  };
}

export default function HomePage() {
  const jsonLd = buildHomeJsonLd();

  return (
    <div className="space-y-0 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* 1. Hero Section + Why BaseCase 4-Card Visual Strip */}
      <Hero />

      {/* 2. Course Options (Image-Topped Programme Cards) */}
      <Courses />

      {/* 3. Project Showcase & Interactive Lab */}
      <Showcase />

      {/* 4. How Learning Works Pedagogy */}
      <HowLearningWorks />

      {/* 5. Meet the Mentors (3:4 Headshot Portrait Cards) */}
      <Mentors />

      {/* 6. Learning Progression Pathway */}
      <Progression />

      {/* 7. Parent FAQs */}
      <Faq />

      {/* 8. Trial Enquiry Section (2-Column: Consultation Photo + Enquiry Form) */}
      <section
        id="trial-enquiry"
        aria-labelledby="enquiry-heading"
        className="py-16 sm:py-24 bg-white border-t border-slate-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
            Trial Booking
          </p>
          <h2 id="enquiry-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Book a Coding Trial
          </h2>
          <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Leave your details below and we’ll follow up to arrange a trial session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Consultation Photo Slot */}
          <div className="lg:col-span-5">
            <PhotoPlaceholder
              title="Trial Class & Consultation Photo"
              aspectRatio="4:3"
              dimensions="800 × 600 px"
              shotGuide="Friendly photo of a tutor speaking with a student and parent during a 1-on-1 trial consultation."
              fileHint="public/images/trial-consultation.jpg"
              className="shadow-sm"
            />
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
