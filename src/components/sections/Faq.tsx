import React from 'react';
import { siteConfig, FAQItem } from '@/config/siteConfig';
import { Badge } from '@/components/ui/Badge';
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
      className={cn('py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8', className)}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="teal" size="md" className="mb-3">
          FAQs
        </Badge>
        <h2
          id="faqs-heading"
          className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight"
        >
          Parent Questions
        </h2>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">
          Common questions on beginners, laptops, progress updates, and AI tools.
        </p>
      </div>

      {/* Accessible Disclosure Accordion */}
      <Accordion items={accordionItems} allowMultiple={true} defaultOpenId="faq-beginner" />
    </section>
  );
}
