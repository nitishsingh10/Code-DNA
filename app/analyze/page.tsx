'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2, Circle } from 'lucide-react';
import { cacheKey, setCache } from '@/lib/cache';

interface Step {
    label: string;
    status: 'pending' | 'active' | 'done';
}

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const repoUrl = searchParams.get('repo') || '';
    const [steps, setSteps] = useState<Step[]>([
        { label: 'Fetching repository metadata', status: 'pending' },
        { label: 'Reading file structure', status: 'pending' },
        { label: 'Analyzing codebase with Gemini...', status: 'pending' },
        { label: 'Generating learning content', status: 'pending' },
        { label: 'Building flashcards', status: 'pending' },
        { label: 'Creating DSA problems', status: 'pending' },
    ]);
    const [error, setError] = useState('');
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!repoUrl || hasStarted.current) return;
        hasStarted.current = true;
        analyze();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repoUrl]);

    async function updateStep(index: number, status: 'active' | 'done') {
        setSteps((prev) =>
            prev.map((s, i) => {
                if (i === index) return { ...s, status };
                if (i < index && s.status !== 'done') return { ...s, status: 'done' };
                return s;
            })
        );
        // Small delay for visual effect
        await new Promise((r) => setTimeout(r, 400));
    }

    async function analyze() {
        try {
            // Step 1-2: Fetch repo data
            await updateStep(0, 'active');
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to analyze repository');
            }

            const data = await res.json();
            await updateStep(0, 'done');
            await updateStep(1, 'done');

            // Cache the repo data
            const { owner, repo } = data;
            setCache(cacheKey(owner, repo, 'meta'), data, false);

            // Step 3: Generate overview with Gemini
            await updateStep(2, 'active');
            const context = `File tree:\n${data.fileTree.join('\n')}\n\nREADME:\n${data.readme}\n\nPackage.json:\n${data.packageJson || 'N/A'}\n\nLanguages:\n${JSON.stringify(data.langs)}`;

            try {
                const overviewRes = await fetch('/api/generate/overview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ context }),
                });

                if (overviewRes.ok) {
                    const overviewData = await overviewRes.json();
                    setCache(cacheKey(owner, repo, 'overview'), overviewData.data, true);
                }
            } catch {
                // Overview generation failed, continue anyway
            }

            await updateStep(2, 'done');
            await updateStep(3, 'done');
            await updateStep(4, 'done');
            await updateStep(5, 'done');

            // Navigate to repo page
            router.push(`/repo/${owner}/${repo}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-gh-bg)] flex items-center justify-center">
            <div className="w-full max-w-md px-4">
                {error ? (
                    <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                        <p className="text-sm text-[var(--color-gh-yellow)] mb-3">⚠️ {error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-[var(--color-gh-blue)] hover:underline"
                        >
                            ← Go back and try again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <p className="text-sm text-[var(--color-gh-text-secondary)] mb-4 font-mono">
                            Analyzing {repoUrl}
                        </p>
                        {steps.map((step, i) => (
                            <div
                                key={step.label}
                                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-300 ${step.status === 'active' ? 'bg-[var(--color-gh-surface)]' : ''
                                    } ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}
                                style={{
                                    animationDelay: `${i * 100}ms`,
                                }}
                            >
                                {step.status === 'done' && (
                                    <Check className="h-4 w-4 text-[var(--color-gh-green)] flex-shrink-0" />
                                )}
                                {step.status === 'active' && (
                                    <Loader2 className="h-4 w-4 text-[var(--color-gh-yellow)] animate-spin flex-shrink-0" />
                                )}
                                {step.status === 'pending' && (
                                    <Circle className="h-4 w-4 text-[var(--color-gh-text-muted)] flex-shrink-0" />
                                )}
                                <span className={`text-sm ${step.status === 'done'
                                        ? 'text-[var(--color-gh-text)]'
                                        : step.status === 'active'
                                            ? 'text-[var(--color-gh-text)]'
                                            : 'text-[var(--color-gh-text-muted)]'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--color-gh-bg)] flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-[var(--color-gh-text-muted)] animate-spin" />
            </div>
        }>
            <AnalyzeContent />
        </Suspense>
    );
}
