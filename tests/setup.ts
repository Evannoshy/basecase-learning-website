import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup DOM between tests
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Mock window.scrollTo for navigation jump link tests
window.scrollTo = vi.fn();

// Mock Element.prototype.scrollIntoView for terminal log scrolling
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = vi.fn();
}

// Mock window.matchMedia for responsive and reduced-motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }),
});
