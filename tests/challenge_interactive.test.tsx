import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import {
  InteractiveProject,
  QUIZ_QUESTIONS,
  QuizQuestion,
} from '@/components/showcase/InteractiveProject';

describe('Empirical Challenge: Interactive Python Logic Quiz Runner', () => {
  beforeEach(() => {
    // Mock scrollIntoView if not supported in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  // =========================================================================
  // 1. Full Question Progression & Scoring Oracles
  // =========================================================================
  describe('1. Full Question Progression & Scoring Oracles', () => {
    it('achieves 100% score (4/4) with correct progression, terminal logs, and "Outstanding!" verdict', () => {
      render(<InteractiveProject />);

      QUIZ_QUESTIONS.forEach((q, idx) => {
        // Verify current question badge and topic
        expect(screen.getByText(`Question ${idx + 1} of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
        expect(screen.getByText(`Topic: ${q.topic}`)).toBeInTheDocument();

        // Select correct option
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[q.correctOptionIndex]);
        expect(radios[q.correctOptionIndex]).toHaveAttribute('aria-checked', 'true');

        // Execute
        const runBtn = screen.getByRole('button', { name: /run code & check answer/i });
        fireEvent.click(runBtn);

        // Verify score incremented
        expect(screen.getByText(`Score: ${idx + 1} / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

        // Verify terminal logged [PASS]
        expect(screen.getAllByText(/\[PASS\] Assertion verified\. Return code 0\./i).length).toBe(idx + 1);

        // Advance
        if (idx + 1 < QUIZ_QUESTIONS.length) {
          const nextBtn = screen.getByRole('button', { name: /next question/i });
          fireEvent.click(nextBtn);
        } else {
          const finishBtn = screen.getByRole('button', { name: /view final score/i });
          fireEvent.click(finishBtn);
        }
      });

      // Completion screen verification
      expect(screen.getByRole('heading', { name: /quiz completed!/i })).toBeInTheDocument();
      expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 4 / 4 (100%)');
      expect(screen.getByText(/outstanding!/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /explore beginner python/i })).toHaveAttribute('href', '#courses');
    });

    it('handles 0% score (0/4) with all wrong answers, [LOGIC_ERROR] terminal logs, and "Good start!" verdict', () => {
      render(<InteractiveProject />);

      QUIZ_QUESTIONS.forEach((q, idx) => {
        // Choose wrong option
        const wrongIndex = (q.correctOptionIndex + 1) % q.options.length;
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[wrongIndex]);

        // Execute
        const runBtn = screen.getByRole('button', { name: /run code & check answer/i });
        fireEvent.click(runBtn);

        // Score remains 0
        expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

        // Terminal logged logic error
        expect(screen.getAllByText(/\[LOGIC_ERROR\] Assertion failed/i).length).toBe(idx + 1);

        // Advance
        if (idx + 1 < QUIZ_QUESTIONS.length) {
          fireEvent.click(screen.getByRole('button', { name: /next question/i }));
        } else {
          fireEvent.click(screen.getByRole('button', { name: /view final score/i }));
        }
      });

      // Completion screen verification
      expect(screen.getByRole('heading', { name: /quiz completed!/i })).toBeInTheDocument();
      expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 0 / 4 (0%)');
      expect(screen.getByText(/good start! programming is all about forming hypotheses/i)).toBeInTheDocument();
    });

    it('calculates partial score (2/4, 50%) and presents "Great effort!" verdict', () => {
      render(<InteractiveProject />);

      QUIZ_QUESTIONS.forEach((q, idx) => {
        const radios = screen.getAllByRole('radio');
        // Answer Q1 & Q3 correct, Q2 & Q4 wrong
        const isTargetCorrect = idx % 2 === 0;
        const choice = isTargetCorrect ? q.correctOptionIndex : (q.correctOptionIndex + 1) % q.options.length;

        fireEvent.click(radios[choice]);
        fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

        if (idx + 1 < QUIZ_QUESTIONS.length) {
          fireEvent.click(screen.getByRole('button', { name: /next question/i }));
        } else {
          fireEvent.click(screen.getByRole('button', { name: /view final score/i }));
        }
      });

      expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 2 / 4 (50%)');
      expect(screen.getByText(/great effort! you navigated several tricky edge cases/i)).toBeInTheDocument();
    });

    it('synchronizes progress bar aria attributes across every question and submission step', () => {
      render(<InteractiveProject />);
      const progressBar = screen.getByRole('progressbar', { name: /quiz progress/i });

      expect(progressBar).toHaveAttribute('aria-valuenow', '1');
      expect(progressBar).toHaveAttribute('aria-valuemin', '1');
      expect(progressBar).toHaveAttribute('aria-valuemax', '4');

      // Question 1: before submit (currentIndex = 0, hasSubmitted = false -> 0%)
      let innerBar = progressBar.firstElementChild as HTMLElement;
      expect(innerBar.style.width).toBe('0%');

      // After selecting and submitting:
      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      // hasSubmitted = true -> ((0 + 1) / 4) * 100% = 25%
      expect(innerBar.style.width).toBe('25%');

      // Move to Question 2
      fireEvent.click(screen.getByRole('button', { name: /next question/i }));
      // currentIndex = 1, hasSubmitted = false -> (1 / 4) * 100% = 25%
      expect(progressBar).toHaveAttribute('aria-valuenow', '2');
      expect(innerBar.style.width).toBe('25%');

      // Submit Q2
      const radiosQ2 = screen.getAllByRole('radio');
      fireEvent.click(radiosQ2[1]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
      // hasSubmitted = true -> ((1 + 1) / 4) * 100% = 50%
      expect(innerBar.style.width).toBe('50%');
    });
  });

  // =========================================================================
  // 2. Wrong Answer Selection -> Instructive Feedback Verification
  // =========================================================================
  describe('2. Wrong Answer Selection & Instructive Feedback Oracles', () => {
    QUIZ_QUESTIONS.forEach((q, qIdx) => {
      it(`presents exact instructive feedback and debugging tip for wrong answer on question ${qIdx + 1} (${q.id})`, () => {
        render(<InteractiveProject />);

        // Advance to question qIdx
        for (let i = 0; i < qIdx; i++) {
          const r = screen.getAllByRole('radio');
          fireEvent.click(r[QUIZ_QUESTIONS[i].correctOptionIndex]);
          fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
          fireEvent.click(screen.getByRole('button', { name: /next question/i }));
        }

        // Pick an incorrect option
        const wrongIdx = (q.correctOptionIndex + 1) % q.options.length;
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[wrongIdx]);

        // Run
        fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

        // Status banner
        const statusBanner = screen.getByRole('status');
        expect(statusBanner).toHaveAttribute('aria-live', 'polite');
        expect(within(statusBanner).getByText(/✗ Logic Bug Identified/i)).toBeInTheDocument();
        expect(within(statusBanner).getByText(q.explanationIncorrect)).toBeInTheDocument();
        expect(within(statusBanner).getByText(q.debuggingTip)).toBeInTheDocument();

        // Terminal output should reflect failure with expected output
        expect(screen.getByText(new RegExp(`\\[LOGIC_ERROR\\] Assertion failed\\. Expected "${q.simulatedOutput}"`, 'i'))).toBeInTheDocument();
      });
    });

    it('applies distinct accessible visual styling: emerald for correct, rose for selected wrong, muted for other options', () => {
      render(<InteractiveProject />);

      // Question 1 correct answer is 0. Pick option 2 (wrong).
      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[2]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      // Option 0 (correct answer): emerald styling
      expect(radios[0].className).toContain('border-emerald-500');
      expect(radios[0].className).toContain('bg-emerald-50');

      // Option 2 (selected wrong answer): rose styling
      expect(radios[2].className).toContain('border-rose-500');
      expect(radios[2].className).toContain('bg-rose-50');

      // Option 1 & 3 (unselected options): solid muted styling
      expect(radios[1].className).toContain('text-slate-500');
      expect(radios[3].className).toContain('text-slate-500');
    });
  });

  // =========================================================================
  // 3. Double-Click and Rapid Input State Stability
  // =========================================================================
  describe('3. Concurrency, Double-Click & Rapid Input State Stability', () => {
    it('prevents multiple score increments when Run Code is clicked rapidly 25 times', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]); // Correct answer

      const runBtn = screen.getByRole('button', { name: /run code & check answer/i });

      // Rapidly fire 25 clicks
      for (let i = 0; i < 25; i++) {
        fireEvent.click(runBtn);
      }

      // Score must strictly be 1, never 2+
      expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

      // Terminal should only have one [PASS] assertion line
      const passLogs = screen.getAllByText(/\[PASS\] Assertion verified/i);
      expect(passLogs).toHaveLength(1);
    });

    it('rejects option switching after submission even under rapid clicks', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]); // Select option 0
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      // Attempt to rapidly click options 1, 2, 3
      for (let i = 0; i < 10; i++) {
        fireEvent.click(radios[1]);
        fireEvent.click(radios[2]);
        fireEvent.click(radios[3]);
      }

      // Selected option must still be 0
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(radios[1]).toHaveAttribute('aria-checked', 'false');
      expect(radios[2]).toHaveAttribute('aria-checked', 'false');
      expect(radios[3]).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    });

    it('rapidly switching between options before submission correctly retains the last clicked option', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');

      // Click 0 -> 1 -> 2 -> 3 -> 1
      fireEvent.click(radios[0]);
      fireEvent.click(radios[1]);
      fireEvent.click(radios[2]);
      fireEvent.click(radios[3]);
      fireEvent.click(radios[1]);

      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(radios[2]).toHaveAttribute('aria-checked', 'false');
      expect(radios[3]).toHaveAttribute('aria-checked', 'false');

      // Option 1 is wrong for Q1 (Option 0 is correct)
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
      expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    });

    it('disables execution when no option is selected despite repeated clicks on disabled button', () => {
      render(<InteractiveProject />);

      const runBtn = screen.getByRole('button', { name: /run code & check answer/i });
      expect(runBtn).toBeDisabled();

      // Rapidly click disabled button
      for (let i = 0; i < 10; i++) {
        fireEvent.click(runBtn);
      }

      // Still question 1, no status banner rendered
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
    });

    it('resists rapid clicking on Next Question without skipping questions', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      const nextBtn = screen.getByRole('button', { name: /next question/i });

      // Click once
      fireEvent.click(nextBtn);

      // Now on Question 2, Next Question button is gone, replaced by disabled Run Code button
      expect(screen.getByText(`Question 2 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /next question/i })).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. Keyboard Navigation & ARIA Compliance
  // =========================================================================
  describe('4. Keyboard Navigation & ARIA Compliance', () => {
    it('supports full circular navigation with ArrowDown and ArrowRight (0 -> 1 -> 2 -> 3 -> 0)', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      radios[0].focus();

      // Down: 0 -> 1
      fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');

      // Right: 1 -> 2
      fireEvent.keyDown(radios[1], { key: 'ArrowRight' });
      expect(radios[2]).toHaveAttribute('aria-checked', 'true');

      // Down: 2 -> 3
      fireEvent.keyDown(radios[2], { key: 'ArrowDown' });
      expect(radios[3]).toHaveAttribute('aria-checked', 'true');

      // Down: 3 -> 0 (circular wrap)
      fireEvent.keyDown(radios[3], { key: 'ArrowDown' });
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('supports full circular navigation with ArrowUp and ArrowLeft (0 -> 3 -> 2 -> 1 -> 0)', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      radios[0].focus();

      // Up: 0 -> 3 (circular wrap backwards)
      fireEvent.keyDown(radios[0], { key: 'ArrowUp' });
      expect(radios[3]).toHaveAttribute('aria-checked', 'true');

      // Left: 3 -> 2
      fireEvent.keyDown(radios[3], { key: 'ArrowLeft' });
      expect(radios[2]).toHaveAttribute('aria-checked', 'true');

      // Up: 2 -> 1
      fireEvent.keyDown(radios[2], { key: 'ArrowUp' });
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');

      // Left: 1 -> 0
      fireEvent.keyDown(radios[1], { key: 'ArrowLeft' });
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('selects option with Space and Enter keys without auto-submitting', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      radios[2].focus();

      // Press Space on option 2
      fireEvent.keyDown(radios[2], { key: ' ' });
      expect(radios[2]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByRole('status')).not.toBeInTheDocument(); // has not submitted

      // Press Enter on option 1
      fireEvent.keyDown(radios[1], { key: 'Enter' });
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(radios[2]).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByRole('status')).not.toBeInTheDocument(); // has not submitted
    });

    it('enforces roving tabindex semantics: default 0 for first radio, shifts to selected radio', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');

      // Initially, nothing selected: radio[0] has tabIndex 0, others -1
      expect(radios[0]).toHaveAttribute('tabIndex', '0');
      expect(radios[1]).toHaveAttribute('tabIndex', '-1');
      expect(radios[2]).toHaveAttribute('tabIndex', '-1');
      expect(radios[3]).toHaveAttribute('tabIndex', '-1');

      // Click option 2
      fireEvent.click(radios[2]);

      expect(radios[0]).toHaveAttribute('tabIndex', '-1');
      expect(radios[1]).toHaveAttribute('tabIndex', '-1');
      expect(radios[2]).toHaveAttribute('tabIndex', '0');
      expect(radios[3]).toHaveAttribute('tabIndex', '-1');
    });

    it('locks keyboard navigation once submitted (Arrow keys & Space have no effect)', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      // Submit is complete. Try to press ArrowDown
      fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(radios[1]).toHaveAttribute('aria-checked', 'false');

      // Try Space on radio 1
      fireEvent.keyDown(radios[1], { key: ' ' });
      expect(radios[1]).toHaveAttribute('aria-checked', 'false');
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('gracefully ignores unrelated keys (e.g. Tab, Escape, letters) without state corruption', () => {
      render(<InteractiveProject />);

      const radios = screen.getAllByRole('radio');
      radios[0].focus();

      // Press Escape, Tab, Shift, or 'x'
      ['Escape', 'Tab', 'Shift', 'x', '1'].forEach((key) => {
        fireEvent.keyDown(radios[0], { key });
      });

      // No radio was artificially selected
      radios.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'false'));
      expect(screen.getByRole('button', { name: /run code & check answer/i })).toBeDisabled();
    });

    it('verifies accessibility landmarks: radiogroup is labelled by prompt id and has aria-disabled on radios post-submit', () => {
      render(<InteractiveProject />);

      const prompt = document.getElementById('interactive-question-prompt');
      expect(prompt).toBeInTheDocument();

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-labelledby', 'interactive-question-prompt');

      const radios = screen.getAllByRole('radio');
      radios.forEach((r) => expect(r).toHaveAttribute('aria-disabled', 'false'));

      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

      // Post-submit: all radios have aria-disabled="true"
      radios.forEach((r) => expect(r).toHaveAttribute('aria-disabled', 'true'));
    });
  });

  // =========================================================================
  // 5. Score Counter Calculation & Restart / Reset Flow
  // =========================================================================
  describe('5. Score Counter Calculation, Restart & Reset Flow', () => {
    it('resets simulator state cleanly via header Reset button mid-quiz', () => {
      render(<InteractiveProject />);

      // Question 1: Answer correct
      const radiosQ1 = screen.getAllByRole('radio');
      fireEvent.click(radiosQ1[0]);
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
      fireEvent.click(screen.getByRole('button', { name: /next question/i }));

      // Question 2: Now on question 2, score 1
      expect(screen.getByText(`Question 2 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.getByText(`Score: 1 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();

      // Click Reset in header
      const resetBtn = screen.getByRole('button', { name: /restart quiz/i });
      fireEvent.click(resetBtn);

      // Verify reset
      expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      const radiosReset = screen.getAllByRole('radio');
      radiosReset.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'false'));
    });

    it('resets simulator state cleanly via "Try Again" button on completion screen', () => {
      render(<InteractiveProject />);

      // Fast-forward to completion
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

      // Click "Try Again"
      const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(tryAgainBtn);

      // Verify returned to Question 1 with fresh state
      expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.getByText(`Score: 0 / ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /quiz completed!/i })).not.toBeInTheDocument();
    });

    it('supports multiple complete quiz cycles back-to-back without score accumulation', () => {
      render(<InteractiveProject />);

      // Cycle 1: Score 4/4
      for (let cycle = 0; cycle < 2; cycle++) {
        QUIZ_QUESTIONS.forEach((q, idx) => {
          const radios = screen.getAllByRole('radio');
          // In cycle 0, all correct; in cycle 1, all wrong
          const choice = cycle === 0 ? q.correctOptionIndex : (q.correctOptionIndex + 1) % q.options.length;
          fireEvent.click(radios[choice]);
          fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));

          if (idx + 1 < QUIZ_QUESTIONS.length) {
            fireEvent.click(screen.getByRole('button', { name: /next question/i }));
          } else {
            fireEvent.click(screen.getByRole('button', { name: /view final score/i }));
          }
        });

        if (cycle === 0) {
          expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 4 / 4 (100%)');
          fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        } else {
          // Cycle 1: score should be 0/4, NOT 4/4 or 4+0
          expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 0 / 4 (0%)');
        }
      }
    });

    it('supports custom question sets with arbitrary length (single question boundary)', () => {
      const singleQuestion: QuizQuestion[] = [
        {
          id: 'custom-single',
          topic: 'Variables & Types',
          difficulty: 'Foundations',
          codeSnippet: 'x = 42\nprint(type(x))',
          prompt: 'What type is x?',
          options: [
            { label: 'A', text: "<class 'int'>" },
            { label: 'B', text: "<class 'str'>" },
          ],
          correctOptionIndex: 0,
          explanationCorrect: 'Integer literal evaluates to int.',
          explanationIncorrect: 'Not a string.',
          debuggingTip: 'Check unquoted numbers.',
          simulatedOutput: "<class 'int'>",
        },
      ];

      render(<InteractiveProject questions={singleQuestion} />);

      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
      expect(screen.getByText('Score: 0 / 1')).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);

      fireEvent.click(radios[0]);

      // Execute button
      fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
      expect(screen.getByText('Score: 1 / 1')).toBeInTheDocument();

      // Since single question, button is immediately "View Final Score"
      const finishBtn = screen.getByRole('button', { name: /view final score/i });
      expect(finishBtn).toBeInTheDocument();
      fireEvent.click(finishBtn);

      // Verify completion screen
      expect(screen.getByRole('heading', { name: /quiz completed!/i })).toBeInTheDocument();
      expect(screen.getByText(/final score:/i)).toHaveTextContent('Final Score: 1 / 1 (100%)');
    });
  });

  // =========================================================================
  // 6. Terminal Scroll & Output Formatting Oracles
  // =========================================================================
  describe('6. Terminal Simulation & Output Formatting Oracles', () => {
    it('gracefully handles missing or non-functional scrollIntoView without throwing', () => {
      // Temporarily delete scrollIntoView
      const originalScroll = window.HTMLElement.prototype.scrollIntoView;
      // @ts-ignore
      delete window.HTMLElement.prototype.scrollIntoView;

      expect(() => {
        render(<InteractiveProject />);
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[0]);
        fireEvent.click(screen.getByRole('button', { name: /run code & check answer/i }));
      }).not.toThrow();

      // Restore
      window.HTMLElement.prototype.scrollIntoView = originalScroll;
    });

    it('terminal container is accessible with tabIndex 0 and descriptive aria-label', () => {
      render(<InteractiveProject />);

      const terminalBody = screen.getByLabelText(/simulated terminal output log/i);
      expect(terminalBody).toBeInTheDocument();
      expect(terminalBody).toHaveAttribute('tabIndex', '0');
    });
  });
});
