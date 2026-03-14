'use client';

import { useEffect, useState, use } from 'react';
import QuizQuestion from '@/components/features/QuizQuestion';
import ProgressBar from '@/components/features/ProgressBar';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { getCached, setCache, cacheKey, progressKey } from '@/lib/cache';
import { RefreshCw, PartyPopper, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuizQuestionData {
    id: number;
    question: string;
    context?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export default function QuizPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
    const { owner, repo } = use(params);
    const router = useRouter();
    const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCached, setIsCached] = useState(false);
    const [answers, setAnswers] = useState<Record<number, boolean>>({});
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadQuiz(force = false) {
        setLoading(true);
        setError('');
        setAnswers({});
        setCurrent(0);
        setFinished(false);

        if (!force) {
            const cached = getCached<QuizQuestionData[]>(cacheKey(owner, repo, 'quiz'));
            if (cached) {
                setQuestions(cached);
                setIsCached(true);
                setLoading(false);
                return;
            }
        }

        try {
            const meta = getCached<{ fileTree: string[]; readme: string; packageJson?: string; langs: Record<string, number> }>(cacheKey(owner, repo, 'meta'));
            const context = meta
                ? `File tree:\n${meta.fileTree.join('\n')}\n\nREADME:\n${meta.readme}\n\nPackage.json:\n${meta.packageJson || 'N/A'}\n\nLanguages:\n${JSON.stringify(meta.langs)}`
                : `Repository: ${owner}/${repo}`;

            const res = await fetch('/api/generate/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate quiz');
            }

            const { data } = await res.json();
            const parsed = Array.isArray(data) ? data : [];
            setQuestions(parsed);
            setCache(cacheKey(owner, repo, 'quiz'), parsed, true);
            setIsCached(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate quiz');
        }
        setLoading(false);
    }

    function handleAnswer(correct: boolean) {
        setAnswers((prev) => ({ ...prev, [current]: correct }));
        // Save progress
        const answered = Object.keys({ ...answers, [current]: correct }).length;
        const prog = getCached<Record<string, number>>(progressKey(owner, repo)) || {};
        setCache(progressKey(owner, repo), { ...prog, quizAnswered: answered, quizTotal: questions.length }, false);
    }

    function handleNext() {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            setFinished(true);
        }
    }

    const correctCount = Object.values(answers).filter(Boolean).length;
    const totalAnswered = Object.keys(answers).length;

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="skeleton h-2 w-full rounded-full" />
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                <p className="text-sm text-[var(--color-gh-yellow)]">⚠️ {error}</p>
                <button onClick={() => loadQuiz(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Retry</button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-[var(--color-gh-text-secondary)]">No quiz questions generated yet.</p>
                <button onClick={() => loadQuiz(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Generate Now</button>
            </div>
        );
    }

    if (finished) {
        const passed = correctCount >= Math.ceil(questions.length / 2);
        return (
            <div className="max-w-lg mx-auto text-center py-12 space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${passed ? 'bg-[rgba(35,134,54,0.2)]' : 'bg-[rgba(248,81,73,0.2)]'}`}>
                    <PartyPopper className={`h-8 w-8 ${passed ? 'text-[var(--color-gh-green)]' : 'text-[var(--color-gh-red)]'}`} />
                </div>
                <h2 className="text-2xl font-semibold text-[var(--color-gh-text)]">
                    {correctCount}/{questions.length}
                </h2>
                <p className="text-sm text-[var(--color-gh-text-secondary)]">
                    {passed ? '🎉 You passed! Great understanding of this codebase.' : 'Review needed. Try the flashcards to strengthen your knowledge.'}
                </p>
                <div className="flex gap-3 justify-center pt-2">
                    <button
                        onClick={() => loadQuiz(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md border border-[var(--color-gh-border)] text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface)] transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Retry Quiz
                    </button>
                    <button
                        onClick={() => router.push(`/repo/${owner}/${repo}/flashcards`)}
                        className="px-4 py-2 text-sm rounded-md bg-[var(--color-gh-green)] hover:bg-[var(--color-gh-green-hover)] text-white transition-colors"
                    >
                        Go to Flashcards
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Progress */}
            <ProgressBar
                current={current + 1}
                total={questions.length}
                label={`Question ${current + 1} of ${questions.length}`}
                color="var(--color-gh-blue)"
            />

            {isCached && (
                <div className="flex justify-end">
                    <button onClick={() => loadQuiz(true)} className="flex items-center gap-1 text-xs text-[var(--color-gh-blue)] hover:underline">
                        <RefreshCw className="h-3 w-3" /> Regenerate
                    </button>
                </div>
            )}

            {/* Question */}
            <QuizQuestion
                question={questions[current]}
                onAnswer={handleAnswer}
                answered={answers[current] !== undefined}
            />

            {/* Next button */}
            {answers[current] !== undefined && (
                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 text-sm rounded-md bg-[var(--color-gh-green)] hover:bg-[var(--color-gh-green-hover)] text-white transition-colors"
                    >
                        {current < questions.length - 1 ? 'Next Question →' : 'See Results'}
                    </button>
                </div>
            )}
        </div>
    );
}
