'use client';

import { getLanguageColor } from '@/lib/github-colors';
import { Star, GitFork, Eye, BookOpen, Scale } from 'lucide-react';

interface SidebarProps {
    meta: {
        description?: string;
        license?: { spdx_id?: string };
        stargazers_count?: number;
        forks_count?: number;
        watchers_count?: number;
        topics?: string[];
    };
    langs: Record<string, number>;
    fileCount: number;
    progress?: {
        flashcardsReviewed?: number;
        flashcardsTotal?: number;
        quizAnswered?: number;
        quizTotal?: number;
    };
}

export default function Sidebar({ meta, langs, fileCount, progress }: SidebarProps) {
    const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0);
    const langEntries = Object.entries(langs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);

    return (
        <aside className="space-y-4">
            {/* About */}
            <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4">
                <h3 className="text-sm font-semibold text-[var(--color-gh-text)] mb-2">About</h3>
                {meta.description && (
                    <p className="text-sm text-[var(--color-gh-text-secondary)] mb-3 leading-relaxed">
                        {meta.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-[var(--color-gh-text-secondary)]">
                    {meta.stargazers_count !== undefined && (
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {meta.stargazers_count.toLocaleString()}</span>
                    )}
                    {meta.forks_count !== undefined && (
                        <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {meta.forks_count.toLocaleString()}</span>
                    )}
                    {meta.watchers_count !== undefined && (
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {meta.watchers_count.toLocaleString()}</span>
                    )}
                </div>
                {meta.license?.spdx_id && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-gh-text-secondary)]">
                        <Scale className="h-3.5 w-3.5" /> {meta.license.spdx_id}
                    </div>
                )}
                {meta.topics && meta.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {meta.topics.slice(0, 8).map((t) => (
                            <span
                                key={t}
                                className="inline-block rounded-full bg-[rgba(56,139,253,0.15)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-gh-blue)] hover:bg-[rgba(56,139,253,0.25)] transition-colors cursor-default"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Languages */}
            {langEntries.length > 0 && (
                <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-gh-text)] mb-3">Languages</h3>
                    {/* Language bar */}
                    <div className="flex h-2 rounded-full overflow-hidden mb-3 gap-0.5">
                        {langEntries.map(([lang, bytes]) => (
                            <div
                                key={lang}
                                style={{
                                    width: `${(bytes / totalBytes) * 100}%`,
                                    backgroundColor: getLanguageColor(lang),
                                    minWidth: '3px',
                                }}
                                className="rounded-full"
                                title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                        {langEntries.map(([lang, bytes]) => (
                            <span key={lang} className="flex items-center gap-1.5 text-xs">
                                <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(lang) }}
                                />
                                <span className="text-[var(--color-gh-text)]">{lang}</span>
                                <span className="text-[var(--color-gh-text-muted)]">
                                    {((bytes / totalBytes) * 100).toFixed(1)}%
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4">
                <h3 className="text-sm font-semibold text-[var(--color-gh-text)] mb-2">Repository Stats</h3>
                <div className="text-xs text-[var(--color-gh-text-secondary)] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{fileCount} files indexed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-3.5 w-3.5 text-center">🔍</span>
                        <span>{langEntries.length} languages detected</span>
                    </div>
                </div>
            </div>

            {/* Progress */}
            {progress && (
                <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-gh-text)] mb-3">Your Progress</h3>
                    <div className="space-y-3">
                        {progress.flashcardsTotal != null && progress.flashcardsTotal > 0 && (
                            <div>
                                <div className="flex justify-between text-xs text-[var(--color-gh-text-secondary)] mb-1">
                                    <span>Flashcards</span>
                                    <span>{progress.flashcardsReviewed || 0}/{progress.flashcardsTotal}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[var(--color-gh-border-muted)]">
                                    <div
                                        className="h-full rounded-full bg-[var(--color-gh-green)] transition-all duration-300"
                                        style={{ width: `${((progress.flashcardsReviewed || 0) / progress.flashcardsTotal) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {progress.quizTotal != null && progress.quizTotal > 0 && (
                            <div>
                                <div className="flex justify-between text-xs text-[var(--color-gh-text-secondary)] mb-1">
                                    <span>Quiz</span>
                                    <span>{progress.quizAnswered || 0}/{progress.quizTotal}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[var(--color-gh-border-muted)]">
                                    <div
                                        className="h-full rounded-full bg-[var(--color-gh-blue)] transition-all duration-300"
                                        style={{ width: `${((progress.quizAnswered || 0) / progress.quizTotal) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
