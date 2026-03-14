'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestionData {
    id: number;
    question: string;
    context?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizQuestionProps {
    question: QuizQuestionData;
    onAnswer: (correct: boolean) => void;
    answered: boolean;
}

export default function QuizQuestion({ question, onAnswer, answered }: QuizQuestionProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const isCorrect = selected === question.correctIndex;

    function handleSelect(idx: number) {
        if (answered) return;
        setSelected(idx);
        onAnswer(idx === question.correctIndex);
    }

    return (
        <div className="space-y-4">
            {/* Question */}
            <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-5">
                <p className="text-base font-semibold text-[var(--color-gh-text)] leading-relaxed mb-1">
                    {question.question}
                </p>
                {question.context && (
                    <div className="mt-3 rounded-md bg-[var(--color-gh-bg)] border border-[var(--color-gh-border)] p-3">
                        <code className="text-xs text-[var(--color-gh-text-secondary)] font-mono whitespace-pre-wrap">
                            {question.context}
                        </code>
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="space-y-2">
                {question.options.map((option, idx) => {
                    let borderColor = 'var(--color-gh-border)';
                    let bgColor = 'transparent';

                    if (answered && selected !== null) {
                        if (idx === question.correctIndex) {
                            borderColor = 'var(--color-gh-green)';
                            bgColor = 'rgba(15,45,26,0.5)';
                        } else if (idx === selected && !isCorrect) {
                            borderColor = 'var(--color-gh-red)';
                            bgColor = 'rgba(45,15,15,0.5)';
                        }
                    } else if (selected === idx) {
                        borderColor = 'var(--color-gh-blue)';
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={answered}
                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm rounded-md border transition-all duration-200 hover:bg-[var(--color-gh-surface-hover)]"
                            style={{
                                borderColor,
                                backgroundColor: bgColor,
                                cursor: answered ? 'default' : 'pointer',
                            }}
                        >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[var(--color-gh-border)] flex items-center justify-center text-xs text-[var(--color-gh-text-muted)]">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-[var(--color-gh-text)]">{option}</span>
                            {answered && idx === question.correctIndex && (
                                <span className="ml-auto text-[var(--color-gh-green)] text-xs">✓ Correct</span>
                            )}
                            {answered && idx === selected && !isCorrect && idx !== question.correctIndex && (
                                <span className="ml-auto text-[var(--color-gh-red)] text-xs">✗ Wrong</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
                {answered && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-l-3 border-[var(--color-gh-blue)] bg-[var(--color-gh-surface)] rounded-r-md p-4" style={{ borderLeftWidth: '3px', borderLeftColor: isCorrect ? 'var(--color-gh-green)' : 'var(--color-gh-blue)' }}>
                            <p className="text-sm text-[var(--color-gh-text)] leading-relaxed">
                                {question.explanation}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
