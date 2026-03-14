'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeBlock from '@/components/ui/CodeBlock';
import Badge from '@/components/ui/Badge';
import { ChevronDown, Lightbulb, Code2 } from 'lucide-react';

interface DSAProblemData {
    id: number;
    title: string;
    difficulty: string;
    topics: string[];
    repoInspiration: string;
    description: string;
    constraints: string[];
    examples: { input: string; output: string; explanation?: string }[];
    hint: string;
    starterCode: Record<string, string>;
    repoCodeSnippet?: string;
}

interface DSAProblemProps {
    problem: DSAProblemData;
}

const difficultyColors: Record<string, string> = {
    Easy: '#3fb950',
    Medium: '#d29922',
    Hard: '#f85149',
};

export default function DSAProblem({ problem }: DSAProblemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showRepoCode, setShowRepoCode] = useState(false);
    const [activeLang, setActiveLang] = useState(Object.keys(problem.starterCode || {})[0] || 'javascript');
    const [code, setCode] = useState(problem.starterCode?.[activeLang] || '');

    const languages = Object.keys(problem.starterCode || {});

    return (
        <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] overflow-hidden">
            {/* Header — always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-gh-surface-hover)] transition-colors"
            >
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono text-[var(--color-gh-text-muted)]">#{problem.id}</span>
                    <span className="text-sm font-semibold text-[var(--color-gh-text)]">{problem.title}</span>
                    <Badge color={difficultyColors[problem.difficulty]} variant="muted">
                        {problem.difficulty}
                    </Badge>
                    {problem.topics?.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-gh-bg)] text-[var(--color-gh-text-muted)]">
                            {t}
                        </span>
                    ))}
                </div>
                <ChevronDown className={`h-4 w-4 text-[var(--color-gh-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable body */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-[var(--color-gh-border)] p-4 space-y-4">
                            {/* Inspiration banner */}
                            <div className="flex items-start gap-2 rounded-md bg-[rgba(56,139,253,0.1)] border border-[rgba(56,139,253,0.3)] p-3">
                                <span className="text-sm">📌</span>
                                <p className="text-xs text-[var(--color-gh-blue)] leading-relaxed">{problem.repoInspiration}</p>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-[var(--color-gh-text)] leading-relaxed whitespace-pre-line">
                                {problem.description}
                            </div>

                            {/* Constraints */}
                            {problem.constraints?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--color-gh-text-secondary)] uppercase tracking-wide mb-2">Constraints</h4>
                                    <ul className="text-xs text-[var(--color-gh-text-muted)] space-y-1 list-disc list-inside">
                                        {problem.constraints.map((c, i) => <li key={i} className="font-mono">{c}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* Examples */}
                            {problem.examples?.map((ex, i) => (
                                <div key={i} className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-bg)] p-3">
                                    <p className="text-xs font-semibold text-[var(--color-gh-text-secondary)] mb-2">Example {i + 1}</p>
                                    <div className="space-y-1 text-xs font-mono">
                                        <p><span className="text-[var(--color-gh-text-muted)]">Input: </span><span className="text-[var(--color-gh-text)]">{ex.input}</span></p>
                                        <p><span className="text-[var(--color-gh-text-muted)]">Output: </span><span className="text-[var(--color-gh-text)]">{ex.output}</span></p>
                                        {ex.explanation && (
                                            <p className="text-[var(--color-gh-text-muted)] mt-1">💡 {ex.explanation}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Starter Code */}
                            {languages.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-0 border-b border-[var(--color-gh-border)] mb-0">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => { setActiveLang(lang); setCode(problem.starterCode[lang]); }}
                                                className={`px-3 py-1.5 text-xs border-b-2 transition-colors ${activeLang === lang
                                                        ? 'border-[var(--color-gh-orange)] text-[var(--color-gh-text)]'
                                                        : 'border-transparent text-[var(--color-gh-text-muted)] hover:text-[var(--color-gh-text-secondary)]'
                                                    }`}
                                            >
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full h-40 bg-[var(--color-gh-bg)] text-[var(--color-gh-text)] font-mono text-xs leading-relaxed border border-[var(--color-gh-border)] rounded-b-md p-3 resize-y focus:outline-none focus:border-[var(--color-gh-blue)] transition-colors"
                                        spellCheck={false}
                                    />
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-gh-border)] rounded-md text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface-hover)] transition-colors"
                                >
                                    <Lightbulb className="h-3.5 w-3.5" />
                                    {showHint ? 'Hide Hint' : 'Show Hint'}
                                </button>
                                {problem.repoCodeSnippet && (
                                    <button
                                        onClick={() => setShowRepoCode(!showRepoCode)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-gh-border)] rounded-md text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface-hover)] transition-colors"
                                    >
                                        <Code2 className="h-3.5 w-3.5" />
                                        {showRepoCode ? 'Hide Repo Code' : 'See Repo Code'}
                                    </button>
                                )}
                            </div>

                            {/* Hint */}
                            <AnimatePresence>
                                {showHint && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="rounded-md bg-[rgba(210,153,34,0.1)] border border-[rgba(210,153,34,0.3)] p-3"
                                    >
                                        <p className="text-xs text-[var(--color-gh-yellow)]">💡 {problem.hint}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Repo Code */}
                            <AnimatePresence>
                                {showRepoCode && problem.repoCodeSnippet && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <CodeBlock code={problem.repoCodeSnippet} language="javascript" filename="Repo snippet" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
