'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CodeBlock from '@/components/ui/CodeBlock';
import Badge from '@/components/ui/Badge';

interface FlashCardData {
    id: number;
    front: string;
    back: string;
    codeExample?: string;
    category: string;
    difficulty: string;
    repoConnection: string;
}

interface FlashCardProps {
    card: FlashCardData;
    index: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
    onMark: (id: number, status: 'got-it' | 'review') => void;
    status?: 'got-it' | 'review';
}

const categoryColors: Record<string, string> = {
    'State Management': '#58a6ff',
    'API Design': '#3fb950',
    Architecture: '#d29922',
    Performance: '#f85149',
    Security: '#f85149',
    Testing: '#8957e5',
    Database: '#d18616',
    Other: '#8b949e',
};

const difficultyColors: Record<string, string> = {
    Beginner: '#3fb950',
    Intermediate: '#d29922',
    Advanced: '#f85149',
};

export default function FlashCard({ card, index, total, onNext, onPrev, onMark, status }: FlashCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="flex flex-col items-center">
            {/* Card */}
            <div
                className="perspective w-full max-w-[680px] cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className="preserve-3d relative w-full"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ minHeight: '280px' }}
                >
                    {/* Front */}
                    <div className="backface-hidden absolute inset-0 rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <Badge color={categoryColors[card.category]}>{card.category}</Badge>
                            <Badge color={difficultyColors[card.difficulty]} variant="outline">
                                {card.difficulty}
                            </Badge>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-lg text-[var(--color-gh-text)] text-center leading-relaxed font-medium">
                                {card.front}
                            </p>
                        </div>
                        <p className="text-xs text-[var(--color-gh-text-muted)] text-center mt-4">
                            Click to reveal →
                        </p>
                    </div>

                    {/* Back */}
                    <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-6 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                            <Badge color={categoryColors[card.category]}>{card.category}</Badge>
                        </div>
                        <p className="text-sm text-[var(--color-gh-text)] leading-relaxed mb-3">
                            {card.back}
                        </p>
                        {card.codeExample && (
                            <div className="mb-3">
                                <CodeBlock code={card.codeExample} language="javascript" showLineNumbers={false} />
                            </div>
                        )}
                        <p className="text-xs text-[var(--color-gh-text-muted)] mt-auto">
                            📌 {card.repoConnection}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); setIsFlipped(false); }}
                    disabled={index === 0}
                    className="px-3 py-1.5 text-sm text-[var(--color-gh-text-secondary)] border border-[var(--color-gh-border)] rounded-md hover:bg-[var(--color-gh-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>
                <span className="text-sm text-[var(--color-gh-text-muted)] font-mono">
                    {index + 1}/{total}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); setIsFlipped(false); }}
                    disabled={index === total - 1}
                    className="px-3 py-1.5 text-sm text-[var(--color-gh-text-secondary)] border border-[var(--color-gh-border)] rounded-md hover:bg-[var(--color-gh-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>

            {/* Mark buttons */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onMark(card.id, 'got-it'); }}
                    className={`px-4 py-1.5 text-sm rounded-md border transition-colors ${status === 'got-it'
                            ? 'bg-[rgba(35,134,54,0.2)] border-[var(--color-gh-green)] text-[var(--color-gh-green)]'
                            : 'border-[var(--color-gh-border)] text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface)]'
                        }`}
                >
                    ✓ Got it
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onMark(card.id, 'review'); }}
                    className={`px-4 py-1.5 text-sm rounded-md border transition-colors ${status === 'review'
                            ? 'bg-[rgba(248,81,73,0.2)] border-[var(--color-gh-red)] text-[var(--color-gh-red)]'
                            : 'border-[var(--color-gh-border)] text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface)]'
                        }`}
                >
                    ✗ Need review
                </button>
            </div>
        </div>
    );
}
