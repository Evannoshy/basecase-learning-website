import React from 'react';

export interface BrandLogoMarkProps {
  className?: string;
}

/** Official BaseCase Learning `</> BASECASE` logo mark. */
export function BrandLogoMark({ className = 'h-10 w-auto' }: BrandLogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 64"
      fill="none"
      aria-hidden="true"
      data-testid="brand-logo-mark"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="94"
        height="62"
        rx="10"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />
      {/* Left bracket < */}
      <path
        d="M34 15L21 26.5L34 38"
        stroke="#0A0A0A"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center slash / */}
      <line
        x1="53"
        y1="11"
        x2="43"
        y2="42"
        stroke="#0A0A0A"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Right bracket > */}
      <path
        d="M62 15L75 26.5L62 38"
        stroke="#0A0A0A"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark BASECASE */}
      <text
        x="49"
        y="56"
        textAnchor="middle"
        fill="#0A0A0A"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="2.6"
      >
        BASECASE
      </text>
    </svg>
  );
}
