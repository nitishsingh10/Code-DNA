'use client';

import { useEffect, useState, use } from 'react';
import DSAProblem from '@/components/features/DSAProblem';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { getCached, setCache, cacheKey } from '@/lib/cache';
import { RefreshCw } from 'lucide-react';

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

export default function DSAPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
    const { owner, repo } = use(params);
    const [problems, setProblems] = useState<DSAProblemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCached, setIsCached] = useState(false);

    useEffect(() => {
        loadProblems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadProblems(force = false) {
        setLoading(true);
        setError('');

        if (!force) {
            const cached = getCached<DSAProblemData[]>(cacheKey(owner, repo, 'dsa'));
            if (cached) {
                setProblems(cached);
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

            const res = await fetch('/api/generate/dsa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate DSA problems');
            }

            const { data } = await res.json();
            const parsed = Array.isArray(data) ? data : [];
            setProblems(parsed);
            setCache(cacheKey(owner, repo, 'dsa'), parsed, true);
            setIsCached(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate DSA problems');
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                <p className="text-sm text-[var(--color-gh-yellow)]">⚠️ {error}</p>
                <button onClick={() => loadProblems(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Retry</button>
            </div>
        );
    }

    if (problems.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-[var(--color-gh-text-secondary)]">No DSA problems generated yet.</p>
                <button onClick={() => loadProblems(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Generate Now</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[var(--color-gh-text)]">
                    {problems.length} Problems
                </h2>
                {isCached && (
                    <button onClick={() => loadProblems(true)} className="flex items-center gap-1 text-xs text-[var(--color-gh-blue)] hover:underline">
                        <RefreshCw className="h-3 w-3" /> Regenerate
                    </button>
                )}
            </div>
            {problems.map((problem) => (
                <DSAProblem key={problem.id} problem={problem} />
            ))}
        </div>
    );
}
