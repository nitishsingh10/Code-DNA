'use client';

import { useEffect, useState, use } from 'react';
import FlashCard from '@/components/features/FlashCard';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { getCached, setCache, cacheKey, progressKey } from '@/lib/cache';
import { RefreshCw } from 'lucide-react';

interface FlashCardData {
    id: number;
    front: string;
    back: string;
    codeExample?: string;
    category: string;
    difficulty: string;
    repoConnection: string;
}

export default function FlashcardsPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
    const { owner, repo } = use(params);
    const [cards, setCards] = useState<FlashCardData[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCached, setIsCached] = useState(false);
    const [marks, setMarks] = useState<Record<number, 'got-it' | 'review'>>({});
    const [filter, setFilter] = useState<string>('All');

    useEffect(() => {
        loadCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadCards(force = false) {
        setLoading(true);
        setError('');

        if (!force) {
            const cached = getCached<FlashCardData[]>(cacheKey(owner, repo, 'flashcards'));
            if (cached) {
                setCards(cached);
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

            const res = await fetch('/api/generate/flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate flashcards');
            }

            const { data } = await res.json();
            const parsed = Array.isArray(data) ? data : [];
            setCards(parsed);
            setCache(cacheKey(owner, repo, 'flashcards'), parsed, true);
            setIsCached(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
        }
        setLoading(false);
    }

    function handleMark(id: number, status: 'got-it' | 'review') {
        setMarks((prev) => ({ ...prev, [id]: status }));
        // Save progress
        const reviewed = Object.keys({ ...marks, [id]: status }).filter(
            (k) => marks[Number(k)] === 'got-it' || (Number(k) === id && status === 'got-it')
        ).length;
        const prog = getCached<Record<string, number>>(progressKey(owner, repo)) || {};
        setCache(progressKey(owner, repo), { ...prog, flashcardsReviewed: reviewed, flashcardsTotal: cards.length }, false);
    }

    const categories = ['All', ...new Set(cards.map((c) => c.category))];
    const filtered = filter === 'All' ? cards : cards.filter((c) => c.category === filter);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-6 w-24 rounded-full" />)}</div>
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                <p className="text-sm text-[var(--color-gh-yellow)]">⚠️ {error}</p>
                <button onClick={() => loadCards(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Retry</button>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-[var(--color-gh-text-secondary)]">No flashcards generated yet.</p>
                <button onClick={() => loadCards(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Generate Now</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1.5 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setFilter(cat); setCurrent(0); }}
                            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${filter === cat
                                    ? 'bg-[rgba(56,139,253,0.15)] text-[var(--color-gh-blue)]'
                                    : 'text-[var(--color-gh-text-muted)] hover:text-[var(--color-gh-text-secondary)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-gh-text-muted)]">
                    {isCached && (
                        <button onClick={() => loadCards(true)} className="flex items-center gap-1 text-[var(--color-gh-blue)] hover:underline">
                            <RefreshCw className="h-3 w-3" /> Regenerate
                        </button>
                    )}
                    <span className="font-mono">
                        {Object.values(marks).filter((v) => v === 'got-it').length}/{cards.length} reviewed
                    </span>
                </div>
            </div>

            {/* Card */}
            {filtered.length > 0 && (
                <FlashCard
                    card={filtered[Math.min(current, filtered.length - 1)]}
                    index={Math.min(current, filtered.length - 1)}
                    total={filtered.length}
                    onNext={() => setCurrent((c) => Math.min(c + 1, filtered.length - 1))}
                    onPrev={() => setCurrent((c) => Math.max(c - 1, 0))}
                    onMark={handleMark}
                    status={marks[filtered[Math.min(current, filtered.length - 1)]?.id]}
                />
            )}

            {/* Progress grid */}
            <div className="pt-4">
                <p className="text-xs text-[var(--color-gh-text-muted)] mb-2">Progress</p>
                <div className="flex gap-1 flex-wrap">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="w-4 h-4 rounded-sm transition-colors"
                            style={{
                                backgroundColor: marks[card.id] === 'got-it'
                                    ? 'var(--color-gh-green)'
                                    : marks[card.id] === 'review'
                                        ? 'var(--color-gh-red)'
                                        : 'var(--color-gh-border-muted)',
                            }}
                            title={`Card ${card.id}: ${marks[card.id] || 'not reviewed'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
