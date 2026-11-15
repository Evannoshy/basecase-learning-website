'use client';

import React, { useState } from 'react';
import { siteConfig, ShowcaseProject } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { cn } from '@/lib/utils';
import { Terminal, Globe, Clock, Code2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export interface ShowcaseProps {
  projects?: ShowcaseProject[];
  className?: string;
  initialInteractiveActive?: boolean;
}

export function Showcase({
  projects = siteConfig.showcaseProjects,
  className,
}: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Python' | 'Web Development' | 'Study Tool'>('all');
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter((p) => p.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Python':
        return <Terminal className="w-4 h-4 text-[#166534]" aria-hidden="true" />;
      case 'Web Development':
        return <Globe className="w-4 h-4 text-[#166534]" aria-hidden="true" />;
      case 'Study Tool':
        return <Clock className="w-4 h-4 text-[#166534]" aria-hidden="true" />;
      default:
        return <Code2 className="w-4 h-4 text-[#166534]" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="projects"
      aria-labelledby="showcase-heading"
      className={cn('py-16 sm:py-24 bg-slate-50 border-t border-b border-slate-300', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#166534]">
            Student &amp; Curriculum Work
          </p>
          <h2
            id="showcase-heading"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            What Students Can Build
          </h2>
          <div className="w-12 h-1 bg-[#166534] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Example projects from our Python and Web courses: simple, practical tools that students write and understand themselves.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm">
            <span className="font-semibold uppercase tracking-wider text-[11px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
              Example Projects
            </span>
            <span>Sample curriculum projects to show what classes aim toward (not past student work).</span>
          </div>
        </div>

        {/* Project Cards Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Sample Project Gallery</h3>
            <p className="text-sm text-slate-600">Three examples across Python, Web, and study tools.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by track">
            {(['all', 'Python', 'Web Development', 'Study Tool'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:outline-none',
                  activeTab === tab
                    ? 'bg-[#166534] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                )}
              >
                {tab === 'all' ? 'All Examples' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const isCodeExpanded = expandedCodeId === project.id;
            const codeLines = project.codeSnippetPreview.code.split('\n');

            return (
              <article
                key={project.id}
                className="bg-white rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Project Output Screenshot Slot */}
                  <PhotoPlaceholder
                    title={`${project.title} Screenshot`}
                    aspectRatio="16:9"
                    dimensions="800 × 450 px"
                    shotGuide={`Clean screenshot or laptop screen photo of a working ${project.title} (${project.category} track).`}
                    fileHint={`public/images/project-${project.id}.png`}
                    className="rounded-none border-0 border-b-2 border-dashed border-slate-300"
                  />

                  <div className="p-6">
                    {/* Category & Status Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        {getCategoryIcon(project.category)}
                        {project.category}
                      </span>
                      <Badge variant="amber" size="sm">
                        Example Project
                      </Badge>
                    </div>

                    {/* Project Title */}
                    <h4 className="text-xl font-bold text-slate-900 mb-1">
                      {project.title}
                    </h4>

                    {/* Student Level Badge */}
                    <p className="text-xs font-semibold text-[#166534] mb-3">
                      {project.studentLevel}
                    </p>

                    {/* Project Description */}
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Skills Demonstrated */}
                    <div className="mb-4">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Topics Covered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skillsDemonstrated.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Outcome */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-800 leading-relaxed mb-4">
                      <strong className="font-semibold block mb-0.5 text-slate-900">What Students Learn:</strong>
                      {project.learningOutcome}
                    </div>

                    {/* Code Snippet Preview */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0F172A] rounded-t-lg border-b border-slate-800 text-xs font-mono text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-green-300" aria-hidden="true" />
                          {project.codeSnippetPreview.filename}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedCodeId(isCodeExpanded ? null : project.id)}
                          className="text-[11px] text-white hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1 flex items-center gap-0.5"
                          aria-expanded={isCodeExpanded}
                          aria-label={`${isCodeExpanded ? 'Collapse' : 'Expand'} code snippet for ${project.title}`}
                        >
                          {isCodeExpanded ? (
                            <>Less <ChevronUp className="w-3 h-3" /></>
                          ) : (
                            <>Full Code <ChevronDown className="w-3 h-3" /></>
                          )}
                        </button>
                      </div>
                      <pre
                        tabIndex={0}
                        aria-label={`Code snippet from ${project.codeSnippetPreview.filename}`}
                        className={cn(
                          'bg-[#0B132B] text-slate-100 p-3 rounded-b-lg text-xs font-mono overflow-x-auto focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all',
                          isCodeExpanded ? 'max-h-96' : 'max-h-36'
                        )}
                      >
                        <table className="w-full border-collapse">
                          <tbody>
                            {codeLines.map((line, idx) => (
                              <tr key={idx} className="hover:bg-slate-800">
                                <td className="text-slate-500 pr-3 select-none text-right align-top w-6 text-[11px]">
                                  {idx + 1}
                                </td>
                                <td className="text-slate-200 whitespace-pre font-mono">
                                  {line || ' '}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {project.categoryBadge}
                  </span>
                  <a
                    href="#courses"
                    className="text-xs font-semibold text-[#166534] hover:text-[#15803D] flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:outline-none rounded"
                  >
                    <span>Course Details</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
