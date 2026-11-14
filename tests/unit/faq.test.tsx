import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Faq } from '@/components/sections/Faq';
import { Accordion } from '@/components/ui/Accordion';
import { siteConfig } from '@/config/siteConfig';

describe('Faq Section Component', () => {
  it('renders section landmark with id="faqs" and heading', () => {
    render(<Faq />);
    const section = document.getElementById('faqs');
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2, name: /parent questions/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders all 5 required parent FAQ questions from siteConfig', () => {
    render(<Faq />);

    // 1. Beginner suitability
    expect(
      screen.getByText(/My child has never coded before\. Is this suitable\?/i)
    ).toBeInTheDocument();

    // 2. Hardware / laptop
    expect(
      screen.getByText(/What laptop does my child need\?/i)
    ).toBeInTheDocument();

    // 3. Course selection
    expect(
      screen.getByText(/Should we pick Beginner Python or Introductory Web Development\?/i)
    ).toBeInTheDocument();

    // 4. Learning feedback
    expect(
      screen.getByText(/How will parents know how their child is doing\?/i)
    ).toBeInTheDocument();

    // 5. Responsible use of AI tools
    expect(
      screen.getByText(/What is your policy on ChatGPT and AI coding tools\?/i)
    ).toBeInTheDocument();
  });

  it('reveals the AI tools policy answer when the AI FAQ accordion trigger is clicked', () => {
    render(<Faq />);
    const aiTrigger = screen.getByRole('button', {
      name: /what is your policy on chatgpt and ai coding tools/i,
    });
    expect(aiTrigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(aiTrigger);
    expect(aiTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(siteConfig.faqs[4].answer)).toBeVisible();
  });
});

describe('Accordion UI Component (WCAG Disclosure Pattern)', () => {
  const testItems = [
    { id: 'item-1', question: 'Question One', answer: 'Answer One' },
    { id: 'item-2', question: 'Question Two', answer: 'Answer Two' },
  ];

  it('renders trigger buttons with aria-expanded and aria-controls attributes', () => {
    render(<Accordion items={testItems} defaultOpenId="item-1" />);

    const trigger1 = screen.getByRole('button', { name: /question one/i });
    const trigger2 = screen.getByRole('button', { name: /question two/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger1).toHaveAttribute('aria-controls', 'faq-panel-item-1');

    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-controls', 'faq-panel-item-2');
  });

  it('renders panel containers with role="region" and aria-labelledby matching trigger id', () => {
    render(<Accordion items={testItems} defaultOpenId="item-1" />);

    const panel1 = document.getElementById('faq-panel-item-1');
    expect(panel1).toHaveAttribute('role', 'region');
    expect(panel1).toHaveAttribute('aria-labelledby', 'faq-trigger-item-1');
    expect(panel1).not.toHaveAttribute('hidden');

    const panel2 = document.getElementById('faq-panel-item-2');
    expect(panel2).toHaveAttribute('role', 'region');
    expect(panel2).toHaveAttribute('aria-labelledby', 'faq-trigger-item-2');
    expect(panel2).toHaveAttribute('hidden');
  });

  it('toggles open state on button click', () => {
    render(<Accordion items={testItems} defaultOpenId="item-1" />);

    const trigger2 = screen.getByRole('button', { name: /question two/i });
    const panel2 = document.getElementById('faq-panel-item-2');

    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(panel2).toHaveAttribute('hidden');

    // Click to open
    fireEvent.click(trigger2);
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(panel2).not.toHaveAttribute('hidden');

    // Click to close
    fireEvent.click(trigger2);
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(panel2).toHaveAttribute('hidden');
  });

  it('toggles item on Enter and Space key events', () => {
    render(<Accordion items={testItems} defaultOpenId="item-1" />);

    const trigger2 = screen.getByRole('button', { name: /question two/i });
    const panel2 = document.getElementById('faq-panel-item-2');

    // Press Enter to open
    fireEvent.keyDown(trigger2, { key: 'Enter' });
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(panel2).not.toHaveAttribute('hidden');

    // Press Space to close
    fireEvent.keyDown(trigger2, { key: ' ' });
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(panel2).toHaveAttribute('hidden');
  });

  it('supports multiple simultaneously open items when allowMultiple is true', () => {
    render(<Accordion items={testItems} allowMultiple={true} defaultOpenId="item-1" />);

    const trigger1 = screen.getByRole('button', { name: /question one/i });
    const trigger2 = screen.getByRole('button', { name: /question two/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');

    // Open second item
    fireEvent.click(trigger2);

    // Both remain open
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
  });
});
