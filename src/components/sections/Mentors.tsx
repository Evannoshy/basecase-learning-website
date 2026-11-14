import React from 'react';
import Image from 'next/image';
import { BookOpen, Award, Info, Quote } from 'lucide-react';
import { siteConfig, Mentor } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';

export interface MentorsProps {
  mentors?: Mentor[];
  disclaimer?: string;
  className?: string;
}

export function Mentors({
  mentors = siteConfig.mentors,
  disclaimer = siteConfig.brand.disclaimers.universityIndependence,
  className,
}: MentorsProps) {
  return (
    <section
      id="mentors"
      aria-labelledby="mentors-heading"
      className={cn('py-16 sm:py-20 bg-slate-50 border-t border-slate-200', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Our Teaching Team
          </p>
          <h2
            id="mentors-heading"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Meet the Mentors
          </h2>
          <div className="w-12 h-1 bg-teal-700 mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Led by NUS Computing students who explain concepts plainly and help students build projects they understand. Individual mentor details and official programme names are placeholders until confirmed before launch.
          </p>
        </div>

        {/* Mentor Profile Cards (2-Column Grid with 3:4 Headshot Slots) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
          {mentors.map((mentor) => (
            <article
              key={mentor.id}
              className="flex flex-col justify-between bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7"
            >
              <div>
                {mentor.statusLabel && (
                  <div className="mb-4">
                    <Badge variant="amber" size="sm">
                      {mentor.statusLabel}
                    </Badge>
                  </div>
                )}

                {/* Tutor Portrait + Core Info Split (Zenith / MindFlex style) */}
                <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                  {mentor.photoUrl ? (
                    <Image
                      src={mentor.photoUrl}
                      alt={`Photo of ${mentor.name}`}
                      width={192}
                      height={256}
                      className="w-full sm:w-44 aspect-[3/4] rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full sm:w-48 flex-shrink-0">
                      <PhotoPlaceholder
                        title={`${mentor.name} Portrait`}
                        aspectRatio="3:4"
                        dimensions="600 × 800 px"
                        shotGuide="Half-body portrait of tutor in smart-casual attire against a clean wall or NUS campus background."
                        fileHint={`public/images/${mentor.id}.jpg`}
                        ariaLabel={`Portrait placeholder for ${mentor.name}`}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {mentor.name}
                    </h3>
                    <p className="text-sm font-semibold text-teal-700 mt-0.5">
                      {mentor.role}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {mentor.degreeProgram} • {mentor.institution}
                    </p>

                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      {mentor.bio}
                    </p>
                  </div>
                </div>

                {/* Scholarships & Innovation Programmes (Typographic Only - NEG-07) */}
                <div className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Scholarships &amp; Innovation Programmes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.scholarships.map((scholarship) => (
                      <Badge key={scholarship} variant="slate" size="sm">
                        <Award className="w-3 h-3 mr-1 text-slate-600" aria-hidden="true" />
                        {scholarship}
                      </Badge>
                    ))}
                    {mentor.innovationBadges.map((badge) => (
                      <Badge key={badge} variant="amber" size="sm">
                        <Award className="w-3 h-3 mr-1 text-amber-700" aria-hidden="true" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Teaching Experience */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 mb-5 text-xs text-slate-700">
                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <strong className="text-slate-900 font-semibold block mb-0.5">
                        Teaching &amp; Mentorship Experience:
                      </strong>
                      {mentor.teachingExperience}
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teaching Approach Quote */}
              {mentor.highlightQuote && (
                <div className="pt-4 border-t border-slate-100 italic text-xs text-slate-600 flex items-start">
                  <Quote className="w-3.5 h-3.5 text-teal-600 mr-1.5 mt-0.5 flex-shrink-0 rotate-180" aria-hidden="true" />
                  <span>&ldquo;{mentor.highlightQuote}&rdquo;</span>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Prominent University Independence Disclaimer (NEG-08) */}
        <aside
          role="note"
          aria-label="Institutional Independence Disclaimer"
          className="p-5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed"
        >
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong className="font-semibold text-slate-900 block mb-1">
                Independence &amp; Institutional Affiliation Notice:
              </strong>
              <p>{disclaimer}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
