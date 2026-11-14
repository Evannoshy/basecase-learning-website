import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
