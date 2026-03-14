'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import FileTree from '@/components/repo/FileTree';
import TechStackBadges from '@/components/repo/TechStackBadges';
import CodeBlock from '@/components/ui/CodeBlock';
import { SkeletonCard, SkeletonLine, SkeletonFileTree } from '@/components/ui/SkeletonLoader';
import { getCached, setCache, cacheKey } from '@/lib/cache';
import { RefreshCw, Lightbulb, CheckCircle2 } from 'lucide-react';

interface OverviewData {
    name: string;
    purpose: string;
    techStack: { name: string; category: string; version?: string; color: string; usage: string }[];
    architecture: string;
    entryPoints: { file: string; purpose: string }[];
    keyDirectories: { path: string; purpose: string; fileCount?: number }[];
    designPatterns: string[];
    difficulty: string;
    setupSteps: string[];
    highlights: string[];
}

export default function OverviewPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
    const { owner, repo } = use(params);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCached, setIsCached] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileExplanation, setFileExplanation] = useState('');
    const [fileExplLoading, setFileExplLoading] = useState(false);

    // Get file tree from meta cache
    const metaCache = typeof window !== 'undefined' ? getCached<{ fileTree: string[]; readme: string; packageJson?: string; langs: Record<string, number> }>(cacheKey(owner, repo, 'meta')) : null;
    const fileTree = metaCache?.fileTree || [];

    useEffect(() => {
        loadOverview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadOverview(force = false) {
        setLoading(true);
        setError('');

        if (!force) {
            const cached = getCached<OverviewData>(cacheKey(owner, repo, 'overview'));
            if (cached) {
                setOverview(cached);
                setIsCached(true);
                setLoading(false);
                return;
            }
        }

        try {
            const context = buildContext();
            const res = await fetch('/api/generate/overview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate overview');
            }

            const { data } = await res.json();
            setOverview(data);
            setCache(cacheKey(owner, repo, 'overview'), data, true);
            setIsCached(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate overview');
        }
        setLoading(false);
    }

    function buildContext() {
        const meta = getCached<{ fileTree: string[]; readme: string; packageJson?: string; langs: Record<string, number> }>(cacheKey(owner, repo, 'meta'));
        if (!meta) return `Repository: ${owner}/${repo}`;
        return `File tree:\n${meta.fileTree.join('\n')}\n\nREADME:\n${meta.readme}\n\nPackage.json:\n${meta.packageJson || 'N/A'}\n\nLanguages:\n${JSON.stringify(meta.langs)}`;
    }

    async function handleFileClick(path: string) {
        setSelectedFile(path);
        setFileExplLoading(true);
        setFileExplanation('');
        try {
            const context = `Repository: ${owner}/${repo}\nFile: ${path}\nFile tree context: ${fileTree.slice(0, 50).join(', ')}`;
            const res = await fetch('/api/generate/docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: `Explain what the file "${path}" does in this repository in 2-3 concise sentences. Context:\n${context}` }),
            });
            if (res.ok) {
                const { data } = await res.json();
                setFileExplanation(typeof data === 'string' ? data : JSON.stringify(data));
            }
        } catch {
            setFileExplanation('Unable to generate explanation.');
        }
        setFileExplLoading(false);
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonCard />
                <div className="grid grid-cols-3 gap-3">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
                <SkeletonFileTree />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] p-4">
                <p className="text-sm text-[var(--color-gh-yellow)]">⚠️ {error}</p>
                <button onClick={() => loadOverview(true)} className="mt-2 text-sm text-[var(--color-gh-blue)] hover:underline">Retry</button>
            </div>
        );
    }

    if (!overview) return null;

    return (
        <div className="space-y-6">
            {/* Cache indicator */}
            {isCached && (
                <div className="flex items-center justify-between text-xs text-[var(--color-gh-text-muted)]">
                    <span>Cached</span>
                    <button onClick={() => loadOverview(true)} className="flex items-center gap-1 text-[var(--color-gh-blue)] hover:underline">
                        <RefreshCw className="h-3 w-3" /> Regenerate
                    </button>
                </div>
            )}

            {/* Purpose banner */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-[rgba(56,139,253,0.3)] bg-[rgba(56,139,253,0.08)] p-4"
            >
                <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-[var(--color-gh-blue)] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[var(--color-gh-text)] leading-relaxed">{overview.purpose}</p>
                </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <TechStackBadges techs={overview.techStack} />
            </motion.div>

            {/* Architecture */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-base font-semibold text-[var(--color-gh-text)] mb-2">Architecture Overview</h3>
                <p className="text-sm text-[var(--color-gh-text-secondary)] leading-relaxed mb-3">{overview.architecture}</p>
                {overview.highlights && overview.highlights.length > 0 && (
                    <ul className="space-y-1.5">
                        {overview.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-gh-text-secondary)]">
                                <CheckCircle2 className="h-4 w-4 text-[var(--color-gh-green)] mt-0.5 flex-shrink-0" />
                                {h}
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>

            {/* Design Patterns */}
            {overview.designPatterns && overview.designPatterns.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-base font-semibold text-[var(--color-gh-text)] mb-2">Design Patterns</h3>
                    <div className="flex flex-wrap gap-2">
                        {overview.designPatterns.map((p) => (
                            <span key={p} className="px-2.5 py-1 text-xs rounded-full border border-[var(--color-gh-border)] text-[var(--color-gh-text-secondary)]">{p}</span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* File Tree */}
            {fileTree.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-base font-semibold text-[var(--color-gh-text)] mb-3">Repository Files</h3>
                    <FileTree files={fileTree} onFileClick={handleFileClick} selectedFile={selectedFile} />
                    {selectedFile && (
                        <div className="mt-3 rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4">
                            <p className="text-xs text-[var(--color-gh-text-muted)] font-mono mb-2">{selectedFile}</p>
                            {fileExplLoading ? (
                                <div className="space-y-2">
                                    <SkeletonLine className="w-full" />
                                    <SkeletonLine className="w-3/4" />
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--color-gh-text-secondary)] leading-relaxed">{fileExplanation}</p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Setup Guide */}
            {overview.setupSteps && overview.setupSteps.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h3 className="text-base font-semibold text-[var(--color-gh-text)] mb-3">Getting Started</h3>
                    <div className="space-y-2">
                        {overview.setupSteps.map((step, i) => (
                            <CodeBlock key={i} code={step} language="bash" showLineNumbers={false} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
