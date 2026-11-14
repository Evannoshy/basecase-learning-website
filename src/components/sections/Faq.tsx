import React from 'react';
import { siteConfig, FAQItem } from '@/config/siteConfig';
import { Accordion } from '@/components/ui/Accordion';
import { cn } from '@/lib/utils';

export interface FaqProps {
  faqs?: FAQItem[];
  className?: string;
}

export function Faq({ faqs = siteConfig.faqs, className }: FaqProps) {
  const accordionItems = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    categoryLabel: faq.categoryLabel,
  }));

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-heading"
      className={cn('py-16 sm:py-20 bg-slate-50 border-t border-slate-200', className)}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
            FAQs
          </p>
          <h2
            id="faqs-heading"
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Parent Questions
          </h2>
          <div className="w-12 h-1 bg-[#1E3A8A] mx-auto mt-4" aria-hidden="true" />
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Common questions on beginners, laptops, progress updates, and AI tools.
          </p>
        </div>

        {/* Accessible Disclosure Accordion */}
        <Accordion items={accordionItems} allowMultiple={true} defaultOpenId="faq-beginner" />
      </div>
    </section>
  );
}
