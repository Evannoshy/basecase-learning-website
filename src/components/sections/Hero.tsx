import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Terminal } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
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
      className={cn('relative py-16 sm:py-24 lg:py-28 overflow-hidden bg-[#FAF8F5]', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 mb-6">
              <Badge variant="teal" size="md">
                <span className="font-mono mr-1">&gt;_</span>
                {activeBadgeText}
              </Badge>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B132B] leading-[1.15]"
            >
              {activeHeadline}
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {activeSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={activePrimaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
              >
                <span>{activePrimaryCta.text}</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
              <a
                href={activeSecondaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 transition-colors"
              >
                <span>{activeSecondaryCta.text}</span>
                <BookOpen className="w-4 h-4 ml-2 text-slate-500" aria-hidden="true" />
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="mt-10 pt-8 border-t border-slate-200/80">
              <p className="text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-3">
                What Students Build &amp; Learn:
              </p>
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

          {/* Programming Visual Card (First-Principles Code Preview) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B132B] text-slate-200 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111C3D] border-b border-slate-800">
                <div className="flex items-center space-x-2" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex items-center font-mono text-xs text-slate-400">
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-teal-400" aria-hidden="true" />
                  <span>quiz_project.py</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                  Python 3.12
                </span>
              </div>

              {/* Code Snippet */}
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                <p className="text-slate-500 mb-2"># How students learn in class</p>
                <p>
                  <span className="text-teal-400">class</span>{' '}
                  <span className="text-amber-300">StudentProject</span>:
                </p>
                <div className="pl-4 border-l border-slate-800 ml-1 mt-1 space-y-1">
                  <p>
                    <span className="text-teal-400">def</span>{' '}
                    <span className="text-blue-400">__init__</span>(self, name):
                  </p>
                  <p className="pl-4 text-slate-300">
                    self.name = name
                  </p>
                  <p className="pl-4 text-slate-300">
                    self.goal = <span className="text-emerald-300">&quot;Understand &amp; explain&quot;</span>
                  </p>
                  <p className="pl-4 text-slate-300">
                    self.debugging = <span className="text-emerald-300">&quot;Step-by-step tracing&quot;</span>
                  </p>
                  <p className="mt-2">
                    <span className="text-teal-400">def</span>{' '}
                    <span className="text-blue-400">run</span>(self):
                  </p>
                  <p className="pl-4 text-slate-300">
                    <span className="text-teal-400">return</span>{' '}
                    <span className="text-amber-300">Project</span>(working=True, yours=True)
                  </p>
                </div>
              </div>

              {/* Terminal Execution Feedback footer */}
              <div className="px-5 py-3 bg-[#080E21] border-t border-slate-800/80 font-mono text-xs flex items-center justify-between text-slate-400">
                <span className="flex items-center text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" aria-hidden="true" />
                  $ python quiz_project.py
                </span>
                <span className="text-slate-500">All checks pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
