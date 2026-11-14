import React from 'react';
import Image from 'next/image';
import { BookOpen, Award, Info, Quote } from 'lucide-react';
import { siteConfig, Mentor } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
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
      className={cn('py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="teal" size="md" className="mb-3">
          Our Team
        </Badge>
        <h2
          id="mentors-heading"
          className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight"
        >
          Meet the Mentors
        </h2>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">
          Led by NUS Computing students who explain concepts plainly and help students build projects they understand. Individual mentor details and official programme names are placeholders until confirmed before launch.
        </p>
      </div>

      {/* Mentor Profile Cards (2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
        {mentors.map((mentor) => (
          <article
            key={mentor.id}
            className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            <div>
              {mentor.statusLabel && (
                <div className="mb-4">
                  <Badge variant="amber" size="sm">
                    {mentor.statusLabel}
                  </Badge>
                </div>
              )}

              {/* Profile Header with Editable Photo or Initial Monogram */}
              <div className="flex items-center space-x-4 mb-6">
                {mentor.photoUrl ? (
                  <Image
                    src={mentor.photoUrl}
                    alt={`Photo of ${mentor.name}`}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div
                    aria-label={`Portrait placeholder for ${mentor.name}`}
                    className="w-14 h-14 rounded-2xl bg-[#0B132B] text-teal-300 font-mono font-bold text-xl flex items-center justify-center border border-teal-800/60 shadow-inner flex-shrink-0"
                  >
                    {mentor.avatarPlaceholderText}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {mentor.name}
                  </h3>
                  <p className="text-sm font-semibold text-teal-700">
                    {mentor.role}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {mentor.degreeProgram} • {mentor.institution}
                  </p>
                </div>
              </div>

              {/* Scholarships & Innovation Programmes (Typographic Only - NEG-07) */}
              <div className="mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Scholarships &amp; Innovation Programmes:
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

              {/* Bio & Teaching Experience */}
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {mentor.bio}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs text-slate-700">
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
              <div className="mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
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
        className="p-5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed"
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
    </section>
  );
}
