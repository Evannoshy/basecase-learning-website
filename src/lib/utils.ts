import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from '@/config/siteConfig';
import type { EnquiryFormData } from '@/lib/validation';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Resolves section hash hrefs so anchor navigation works on both the homepage and subpages.
 */
export function resolveSectionHref(href: string, pathname: string | null): string {
  const currentPath = pathname || '/';
  if (!href.startsWith('#')) {
    return href;
  }
  if (currentPath === '/') {
    return href;
  }
  if (href === '#main-content') {
    return '/';
  }
  if (href === '#trial-enquiry' && currentPath === '/pricing') {
    return '#trial-enquiry';
  }
  return `/${href}`;
}

/**
 * Returns the default FormSubmit AJAX endpoint addressed to the centre's Gmail inbox.
 */
export function getDefaultGmailEndpoint(): string {
  return `https://formsubmit.co/ajax/${siteConfig.brand.contact.email}`;
}

/**
 * Builds a pre-filled mailto link addressed to our Gmail inbox for trial enquiries.
 */
export function buildEnquiryMailtoUrl(
  data: Partial<EnquiryFormData>,
  enquiryId?: string
): string {
  const recipient = siteConfig.brand.contact.email;
  const subject = `[BaseCase Trial Enquiry] ${data.preferredCourse || 'General Enquiry'} - ${data.parentName || 'Parent'}`;
  const bodyLines = [
    ...(enquiryId ? [`Enquiry ID: ${enquiryId}`] : []),
    `Parent / Guardian Name: ${data.parentName || 'Not provided'}`,
    `Contact Info: ${data.contact || 'Not provided'}`,
    `Student Age: ${data.studentAge ?? 'Not provided'}`,
    `Coding Experience: ${data.codingExperience || 'Not provided'}`,
    `Preferred Course: ${data.preferredCourse || 'Not provided'}`,
    `Additional Notes: ${data.notes || 'None provided'}`,
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n'),
  });

  return `mailto:${recipient}?${params.toString().replace(/\+/g, '%20')}`;
}
