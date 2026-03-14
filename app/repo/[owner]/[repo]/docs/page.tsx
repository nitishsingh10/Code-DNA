'use client';

import { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SkeletonCard, SkeletonLine } from '@/components/ui/SkeletonLoader';
import { getCached, setCache, cacheKey } from '@/lib/cache';
import { RefreshCw, Copy, Check, Download, FileText, Eye } from 'lucide-react';

export default function DocsPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
    const { owner, repo } = use(params);
    const [docs, setDocs] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCached, setIsCached] = useState(false);
    const [view, setView] = useState<'preview' | 'raw'>('preview');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadDocs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadDocs(force = false) {
        setLoading(true);
        setError('');

        if (!force) {
            const cached = getCached<string>(cacheKey(owner, repo, 'docs'));
            if (cached) {
                setDocs(cached);
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

            const res = await fetch('/api/generate/docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate documentation');
            }

            const { data } = await res.json();
            const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            setDocs(text);
            setCache(cacheKey(owner, repo, 'docs'), text, true);
            setIsCached(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate documentation');
        }
        setLoading(false);
    }

    function handleCopy() {
        navigator.clipboard.writeText(docs);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleDownload() {
        const blob = new Blob([docs], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${repo}-docs.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <SkeletonLine className="w-48" />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                <p className="text-sm text-[var(--color-gh-yellow)]">⚠️ {error}</p>
                <button onClick={() => loadDocs(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Top controls */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex rounded-md border border-[var(--color-gh-border)] overflow-hidden">
                    <button
                        onClick={() => setView('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${view === 'preview'
                                ? 'bg-[var(--color-gh-surface)] text-[var(--color-gh-text)]'
                                : 'text-[var(--color-gh-text-muted)] hover:text-[var(--color-gh-text-secondary)]'
                            }`}
                    >
                        <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    <button
                        onClick={() => setView('raw')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-l border-[var(--color-gh-border)] transition-colors ${view === 'raw'
                                ? 'bg-[var(--color-gh-surface)] text-[var(--color-gh-text)]'
                                : 'text-[var(--color-gh-text-muted)] hover:text-[var(--color-gh-text-secondary)]'
                            }`}
                    >
                        <FileText className="h-3.5 w-3.5" /> Raw
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {isCached && (
                        <button onClick={() => loadDocs(true)} className="flex items-center gap-1 text-xs text-[var(--color-gh-blue)] hover:underline">
                            <RefreshCw className="h-3 w-3" /> Regenerate
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-gh-border)] rounded-md text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface)] transition-colors"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-gh-green)]" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-gh-border)] rounded-md text-[var(--color-gh-text-secondary)] hover:bg-[var(--color-gh-surface)] transition-colors"
                    >
                        <Download className="h-3.5 w-3.5" /> Download .md
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] overflow-hidden">
                {view === 'preview' ? (
                    <div className="markdown-body p-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        value={docs}
                        onChange={(e) => setDocs(e.target.value)}
                        className="w-full min-h-[600px] bg-[var(--color-gh-bg)] text-[var(--color-gh-text)] font-mono text-xs leading-relaxed p-4 resize-y focus:outline-none"
                        spellCheck={false}
                    />
                )}
            </div>
        </div>
    );
}
