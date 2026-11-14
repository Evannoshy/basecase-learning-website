import React from 'react';

export interface BrandLogoMarkProps {
  className?: string;
}

/** Custom SVG emblem for BaseCase Learning: academic shield crest with terminal prompt `>_`. */
export function BrandLogoMark({ className = 'w-8 h-8' }: BrandLogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      data-testid="brand-logo-mark"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#1E3A8A" />
      <path
        d="M12 17C12 13.686 14.686 11 18 11H46C49.314 11 52 13.686 52 17V33.5C52 44.2 32 53 32 53C32 53 12 44.2 12 33.5V17Z"
        fill="#0F172A"
        stroke="#FACC15"
        strokeWidth="3"
      />
      <path
        d="M22 24L31 31.5L22 39"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="34"
        y1="39"
        x2="43"
        y2="39"
        stroke="#FACC15"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
