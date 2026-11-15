import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Showcase } from '@/components/sections/Showcase';
import { InteractiveProject, QUIZ_QUESTIONS } from '@/components/showcase/InteractiveProject';
import { siteConfig } from '@/config/siteConfig';

describe('Showcase Section Component', () => {
  it('renders section landmark with id="projects" and accessible heading', () => {
    render(<Showcase />);
    const section = document.getElementById('projects');
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole('heading', { name: /what students can build/i });
    expect(heading).toBeInTheDocument();
  });

  it('clearly labels all projects as Example Projects', () => {
    render(<Showcase />);
    const exampleProjectBadges = screen.getAllByText(/example project/i);
    expect(exampleProjectBadges.length).toBeGreaterThanOrEqual(siteConfig.showcaseProjects.length);

    expect(
      screen.getByText(/curriculum project samples — showing what our courses help students build step by step/i)
    ).toBeInTheDocument();
  });

  it('renders student level tags for all project cards', () => {
    render(<Showcase />);
    siteConfig.showcaseProjects.forEach((project) => {
      expect(screen.getByText(project.studentLevel)).toBeInTheDocument();
    });
  });

  it('renders skills demonstrated for each showcase project', () => {
    render(<Showcase />);
    expect(screen.getByText('If-Else & Loops')).toBeInTheDocument();
    expect(screen.getByText('Page Structure')).toBeInTheDocument();
    expect(screen.getByText('Saving Progress')).toBeInTheDocument();
  });

  it('renders code snippet preview with line numbers and filename', () => {
    render(<Showcase />);
    expect(screen.getByText('quiz_runner.py')).toBeInTheDocument();
    expect(screen.getByText('index.html')).toBeInTheDocument();
    expect(screen.getByText('timer.js')).toBeInTheDocument();

    const codeBlocks = screen.getAllByLabelText(/code snippet from/i);
    expect(codeBlocks.length).toBeGreaterThanOrEqual(3);
    codeBlocks.forEach((block) => {
      expect(block).toHaveAttribute('tabIndex', '0');
    });
  });

  it('filters project cards when category filter tabs are clicked', () => {
    render(<Showcase />);
    const pythonFilter = screen.getByRole('button', { name: 'Python' });
    fireEvent.click(pythonFilter);

    expect(screen.getByText('Python Quiz Game')).toBeInTheDocument();
    expect(screen.queryByText('Personal Website')).not.toBeInTheDocument();

    // Reset filter
    const allFilter = screen.getByRole('button', { name: 'All Examples' });
    fireEvent.click(allFilter);
    expect(screen.getByText('Personal Website')).toBeInTheDocument();
  });

  it('expands full code snippet when "Full Code" toggle is clicked', () => {
    render(<Showcase />);
    const expandButtons = screen.getAllByRole('button', { name: /expand code snippet/i });
    expect(expandButtons.length).toBeGreaterThan(0);

    fireEvent.click(expandButtons[0]);
    expect(expandButtons[0]).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('InteractiveProject Component: Python Logic Quiz Simulator', () => {
  it('renders terminal window chrome, prompt, initial score, and progress', () => {
    render(<InteractiveProject />);

    expect(screen.getAllByText(/\$ python3 quiz\.py/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/BaseCase Python 3\.12 Runtime Initialized/i)).toBeInTheDocument();

    expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar', { name: /quiz progress/i });
    expect(progressBar).toHaveAttribute('aria-valuenow', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', QUIZ_QUESTIONS.length.toString());
  });

  it('renders Python code snippet with line numbers', () => {
    render(<InteractiveProject />);

    expect(screen.getByText(/msg = "BaseCase Learning"/i)).toBeInTheDocument();
    expect(screen.getByText(/prefix = msg\[:8\]/i)).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders accessible radiogroup with 4 multiple choice options', () => {
    render(<InteractiveProject />);

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);

    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-checked', 'false');
    });

    const executeBtn = screen.getByRole('button', { name: /run code & check answer/i });
    expect(executeBtn).toBeDisabled();
  });

  it('updates selection and enables execute button on option click', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]); // Option A

    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');

    const executeBtn = screen.getByRole('button', { name: /run code & check answer/i });
    expect(executeBtn).not.toBeDisabled();
  });

  it('supports keyboard navigation across radio options (Arrow keys, Space)', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    radios[0].focus();

    fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(radios[1], { key: 'ArrowDown' });
    expect(radios[2]).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(radios[2], { key: 'ArrowUp' });
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('evaluates correct answer: increments score, displays feedback and logs [PASS] in terminal', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);

    const executeBtn = screen.getByRole('button', { name: /run code & check answer/i });
    fireEvent.click(executeBtn);

    expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

    const feedbackBanner = screen.getByRole('status');
    expect(feedbackBanner).toHaveAttribute('aria-live', 'polite');
    expect(within(feedbackBanner).getByText(/✓ Correct! Execution Verified/i)).toBeInTheDocument();
    expect(within(feedbackBanner).getByText(/In Python slicing msg\[:8\]/i)).toBeInTheDocument();
    expect(within(feedbackBanner).getByText(/Mental Model: In Python, slice \[:n\]/i)).toBeInTheDocument();

    expect(screen.getByText(/\[PASS\] Assertion verified\. Return code 0\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('evaluates incorrect answer: preserves score, explains mental model bug and logs error in terminal', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]);

    const executeBtn = screen.getByRole('button', { name: /run code & check answer/i });
    fireEvent.click(executeBtn);

    expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

    const feedbackBanner = screen.getByRole('status');
    expect(within(feedbackBanner).getByText(/✗ Logic Bug Identified/i)).toBeInTheDocument();
    expect(within(feedbackBanner).getByText(/Remember the non-inclusive rule/i)).toBeInTheDocument();

    expect(screen.getByText(/\[LOGIC_ERROR\] Assertion failed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('advances to next question, updates code snippet, and clears selection', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

    fireEvent.click(screen.getByRole('button', { name: /next question/i }));

    expect(screen.getByText(`Question 2 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    expect(screen.getByText(/Topic: List References & Heap Mutation/i)).toBeInTheDocument();
    expect(screen.getByText(/bonus_scores = scores/i)).toBeInTheDocument();

    const newRadios = screen.getAllByRole('radio');
    newRadios.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('completes all questions and displays final score summary and restart options', () => {
    render(<InteractiveProject />);

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[q.correctOptionIndex]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      if (idx + 1 < QUIZ_QUESTIONS.length) {
        fireEvent.click(screen.getByRole('button', { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole('button', { name: /view final score/i }));
      }
    });

    expect(screen.getByRole('heading', { name: /quiz completed!/i })).toBeInTheDocument();
    expect(screen.getByText(/final score:/i)).toHaveTextContent(`Final Score: ${QUIZ_QUESTIONS.length} / ${QUIZ_QUESTIONS.length}`);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore beginner python/i })).toBeInTheDocument();
  });

  it('resets simulator state when Reset or Try Again button is clicked', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
    expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /restart quiz/i }));

    expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it('prevents double-scoring on rapid clicks after submission', () => {
    render(<InteractiveProject />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);

    const executeBtn = screen.getByRole('button', { name: /run code & check answer/i });
    fireEvent.click(executeBtn);
    fireEvent.click(radios[1]);

    expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });
});
