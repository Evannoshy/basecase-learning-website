'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Terminal as TerminalIcon,
  Sparkles,
} from 'lucide-react';

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: string;
  codeSnippet: string;
  prompt: string;
  options: QuizOption[];
  correctOptionIndex: number;
  explanationCorrect: string;
  explanationIncorrect: string;
  debuggingTip: string;
  simulatedOutput: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'py-q1-slicing',
    topic: 'String Slicing & Boundary Indices',
    difficulty: 'Foundations',
    codeSnippet: `msg = "BaseCase Learning"\nprefix = msg[:8]\nprint(f"prefix: {prefix}")`,
    prompt: 'What will be printed to the terminal when this script executes?',
    options: [
      { label: 'A', text: 'prefix: BaseCase' },
      { label: 'B', text: 'prefix: BaseCase ' },
      { label: 'C', text: 'prefix: BaseCas' },
      { label: 'D', text: 'IndexError: string slice out of range' },
    ],
    correctOptionIndex: 0,
    explanationCorrect:
      'Spot on! In Python slicing msg[:8], the start defaults to 0 and the stop index 8 is non-inclusive. Characters at indices 0 through 7 are "B","a","s","e","C","a","s","e" (length 8).',
    explanationIncorrect:
      'Remember the non-inclusive rule: msg[:8] extracts indices 0, 1, 2, 3, 4, 5, 6, and 7. The character at index 8 (" ") is excluded.',
    debuggingTip:
      'Mental Model: In Python, slice [:n] on a 0-indexed sequence yields exactly n characters from the beginning.',
    simulatedOutput: 'prefix: BaseCase',
  },
  {
    id: 'py-q2-references',
    topic: 'List References & Heap Mutation',
    difficulty: 'Intermediate',
    codeSnippet: `scores = [85, 92, 78]\nbonus_scores = scores\nbonus_scores.append(100)\nprint(len(scores))`,
    prompt: 'What value does len(scores) print?',
    options: [
      { label: 'A', text: '3' },
      { label: 'B', text: '4' },
      { label: 'C', text: '[85, 92, 78, 100]' },
      { label: 'D', text: 'AttributeError: list has no attribute append' },
    ],
    correctOptionIndex: 1,
    explanationCorrect:
      'Brilliant debugging! In Python, bonus_scores = scores creates a second reference to the exact same list in heap memory. Appending to bonus_scores mutates the list that scores also references.',
    explanationIncorrect:
      'Assignment (=) in Python never duplicates a list in memory. Both variables point to the same object, so len(scores) is now 4.',
    debuggingTip:
      'Mental Model: Variables hold object references. To create an independent copy, use scores.copy() or scores[:].',
    simulatedOutput: '4',
  },
  {
    id: 'py-q3-conditionals',
    topic: 'Boolean Logic & Precedence',
    difficulty: 'Foundations',
    codeSnippet: `status = "ready"\nretry_count = 0\n\nif status == "ready" and not retry_count > 0:\n    print("Launch initiated")\nelse:\n    print("Diagnostics required")`,
    prompt: 'Which message is output by this conditional evaluation?',
    options: [
      { label: 'A', text: 'Launch initiated' },
      { label: 'B', text: 'Diagnostics required' },
      { label: 'C', text: 'None' },
      { label: 'D', text: 'TypeError: unsupported operand' },
    ],
    correctOptionIndex: 0,
    explanationCorrect:
      'Exact! Relational operators (>) have higher precedence than not. retry_count > 0 is False. not False is True. Both sides of and are True, so the if-block prints "Launch initiated".',
    explanationIncorrect:
      'Check the precedence: retry_count > 0 evaluates to False. not False evaluates to True. Since status == "ready" is also True, True and True executes the if branch.',
    debuggingTip:
      'Mental Model: Comparison operators (> , ==) evaluate before logical operators (not, and, or).',
    simulatedOutput: 'Launch initiated',
  },
  {
    id: 'py-q4-loops',
    topic: 'Loop Range Boundaries & Accumulation',
    difficulty: 'Foundations',
    codeSnippet: `total = 0\nfor num in range(1, 5):\n    total += num\nprint(f"Total: {total}")`,
    prompt: 'What final total is printed by the loop?',
    options: [
      { label: 'A', text: 'Total: 15' },
      { label: 'B', text: 'Total: 10' },
      { label: 'C', text: 'Total: 5' },
      { label: 'D', text: 'Total: 4' },
    ],
    correctOptionIndex: 1,
    explanationCorrect:
      'Well reasoned! range(1, 5) produces 1, 2, 3, and 4 (stopping strictly before 5). The sum is 1 + 2 + 3 + 4 = 10.',
    explanationIncorrect:
      'The upper boundary in range(start, stop) is excluded. The loop iterates for 1, 2, 3, 4 only. 1+2+3+4 = 10 (not 15).',
    debuggingTip:
      'Mental Model: range(a, b) generates (b - a) numbers starting at a and ending at b - 1.',
    simulatedOutput: 'Total: 10',
  },
];

export interface InteractiveProjectProps {
  questions?: QuizQuestion[];
  className?: string;
}

export function InteractiveProject({
  questions = QUIZ_QUESTIONS,
  className,
}: InteractiveProjectProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ python3 quiz.py',
    '[BaseCase Python 3.12 Runtime Initialized]',
    `> Loading Question 1/${questions.length}... Ready for execution.`,
  ]);

  const radioRefs = useRef<(HTMLDivElement | null)[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex] || questions[0];
  const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

  useEffect(() => {
    if (terminalEndRef.current && typeof terminalEndRef.current.scrollIntoView === 'function') {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (hasSubmitted) return;

    let nextIndex = index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % currentQuestion.options.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + currentQuestion.options.length) % currentQuestion.options.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setSelectedOption(index);
      return;
    }

    if (nextIndex !== index) {
      setSelectedOption(nextIndex);
      radioRefs.current[nextIndex]?.focus();
    }
  };

  const handleExecute = () => {
    if (selectedOption === null || hasSubmitted) return;

    const chosenOption = currentQuestion.options[selectedOption];
    const correct = selectedOption === currentQuestion.correctOptionIndex;

    setHasSubmitted(true);
    if (correct) {
      setScore((prev) => prev + 1);
      setTerminalLogs((prev) => [
        ...prev,
        `> Executing chosen option [${chosenOption.label}]...`,
        `$ output = "${chosenOption.text}"`,
        `[PASS] Assertion verified. Return code 0.`,
      ]);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        `> Executing chosen option [${chosenOption.label}]...`,
        `$ output = "${chosenOption.text}"`,
        `[LOGIC_ERROR] Assertion failed. Expected "${currentQuestion.simulatedOutput}".`,
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setHasSubmitted(false);
      setTerminalLogs((prev) => [
        ...prev,
        `----------------------------------------`,
        `> Loading Question ${nextIdx + 1}/${questions.length}...`,
      ]);
    } else {
      setIsCompleted(true);
      setTerminalLogs((prev) => [
        ...prev,
        `========================================`,
        `[ALL TESTS COMPLETED] Final Score: ${score} / ${questions.length}`,
      ]);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setIsCompleted(false);
    setTerminalLogs([
      '$ python3 quiz.py',
      '[BaseCase Python 3.12 Runtime Initialized]',
      `> Loading Question 1/${questions.length}... Ready for execution.`,
    ]);
  };

  const codeLines = currentQuestion.codeSnippet.split('\n');

  return (
    <div className={cn('w-full', className)}>
      {/* Top Status Bar: Progress, Score, Restart */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="default" size="md">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          <span className="text-xs text-slate-500 font-mono">
            Topic: {currentQuestion.topic}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B132B] text-white font-mono text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
            <span>Score: {score} / {questions.length}</span>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart quiz"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:outline-none"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label="Quiz progress"
        className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-8"
      >
        <div
          className="bg-[#1E3A8A] h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + (hasSubmitted ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Quiz Completion View */}
      {isCompleted ? (
        <div className="text-center py-12 px-6 bg-slate-50 rounded-xl border border-slate-300">
          <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-800 mb-4">
            <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Quiz Completed!
          </h4>
          <p className="text-lg text-slate-700 mb-6 font-mono">
            Final Score: <strong className="text-[#1E3A8A]">{score}</strong> / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <p className="max-w-md mx-auto text-sm text-slate-600 mb-8 leading-relaxed">
            {score === questions.length
              ? 'Outstanding! You demonstrated rock-solid mental models for Python variables, slicing, conditionals, and loops.'
              : score >= questions.length / 2
              ? 'Great effort! You navigated several tricky edge cases. In our coding courses, we guide students through hands-on tracing exercises to make these concepts second nature.'
              : 'Good start! Programming is all about forming hypotheses and learning through error messages. Our small-group mentors help you build genuine computational reasoning from day one.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:outline-none transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Try Again</span>
            </button>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] shadow-sm focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:outline-none transition-colors"
            >
              <span>Explore Beginner Python</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        /* Active Quiz Grid: Left Side Code & Radio Options, Right Side Simulated Terminal */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Code Snippet & Multiple Choice (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Code Snippet Panel */}
            <div className="rounded-xl border border-slate-800 bg-[#0B132B] overflow-hidden shadow-md">
              <div className="flex items-center justify-between px-4 py-2 bg-[#111C3D] border-b border-slate-800 text-xs font-mono text-slate-200">
                <span className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-blue-300" aria-hidden="true" />
                  <span>quiz.py</span>
                </span>
                <span className="text-[11px] text-slate-300 font-mono">Python 3.12</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {codeLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-800 transition-colors">
                        <td className="text-slate-400 pr-4 select-none text-right align-top w-6 font-mono text-xs">
                          {idx + 1}
                        </td>
                        <td className="text-slate-100 font-mono text-xs sm:text-sm whitespace-pre">
                          {line || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Prompt */}
            <div>
              <p
                id="interactive-question-prompt"
                className="text-base sm:text-lg font-semibold text-slate-900 mb-3"
              >
                {currentQuestion.prompt}
              </p>

              {/* Radio Group Options */}
              <div
                role="radiogroup"
                aria-labelledby="interactive-question-prompt"
                className="space-y-2.5"
              >
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctOptionIndex;

                  let optionStyle = 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800';
                  if (isSelected && !hasSubmitted) {
                    optionStyle = 'border-[#1E3A8A] bg-slate-100 text-slate-950 ring-1 ring-[#1E3A8A]';
                  } else if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-medium ring-1 ring-rose-500';
                    } else {
                      optionStyle = 'border-slate-300 bg-slate-100 text-slate-500';
                    }
                  }

                  return (
                    <div
                      key={option.label}
                      ref={(el) => {
                        radioRefs.current[idx] = el;
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={
                        isSelected || (selectedOption === null && idx === 0) ? 0 : -1
                      }
                      aria-disabled={hasSubmitted}
                      onClick={() => !hasSubmitted && setSelectedOption(idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={cn(
                        'flex items-center gap-3.5 p-3.5 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2',
                        hasSubmitted && 'cursor-default',
                        optionStyle
                      )}
                    >
                      <span
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors',
                          isSelected && !hasSubmitted
                            ? 'bg-[#1E3A8A] text-white'
                            : hasSubmitted && isCorrectAnswer
                            ? 'bg-emerald-600 text-white'
                            : hasSubmitted && isSelected && !isCorrectAnswer
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="font-mono text-xs sm:text-sm">{option.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Execute & Next */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!hasSubmitted ? (
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={selectedOption === null}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:outline-none',
                    selectedOption !== null
                      ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white shadow-sm cursor-pointer'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  )}
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Run Code &amp; Check Answer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#0B132B] hover:bg-slate-800 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:outline-none transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Score'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Instructive Feedback Banner (Live Region) */}
            {hasSubmitted && (
              <div
                role="status"
                aria-live="polite"
                className={cn(
                  'p-4 rounded-xl border transition-all',
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="space-y-2">
                    <p className="font-bold text-sm">
                      {isCorrect ? '✓ Correct! Execution Verified' : '✗ Logic Bug Identified'}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {isCorrect ? currentQuestion.explanationCorrect : currentQuestion.explanationIncorrect}
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-xs">
                      <strong className="font-semibold block mb-0.5 text-slate-900">
                        Debugging Mental Model:
                      </strong>
                      <span className="italic text-slate-700">{currentQuestion.debuggingTip}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Simulated Terminal Output Panel (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-800 bg-[#0B132B] shadow-xl overflow-hidden font-mono text-xs">
              {/* Terminal Window Header (macOS style window chrome) */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#111C3D] border-b border-slate-800">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-[11px] text-slate-300 select-none">
                  bash — python3 quiz.py
                </span>
                <span className="w-10 text-right text-[10px] text-slate-400 select-none">
                  TTY
                </span>
              </div>

              {/* Terminal Body */}
              <div
                tabIndex={0}
                aria-label="Simulated terminal output log"
                className="p-4 h-80 overflow-y-auto space-y-1.5 text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                {terminalLogs.map((log, idx) => {
                  let logColor = 'text-slate-200';
                  if (log.startsWith('$')) logColor = 'text-blue-300 font-bold';
                  else if (log.startsWith('>')) logColor = 'text-amber-300';
                  else if (log.includes('[PASS]')) logColor = 'text-emerald-300 font-bold';
                  else if (log.includes('[LOGIC_ERROR]')) logColor = 'text-rose-300 font-bold';
                  else if (log.startsWith('=')) logColor = 'text-slate-100';

                  return (
                    <div key={idx} className={cn('whitespace-pre-wrap leading-relaxed', logColor)}>
                      {log}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Footer Info */}
              <div className="px-4 py-2 bg-[#111C3D] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-300">
                <span>Terminal Simulator: BaseCase Sandbox</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
