'use client';

import { Star, GitFork, Eye } from 'lucide-react';
import { getLanguageColor } from '@/lib/github-colors';
import Badge from '@/components/ui/Badge';

interface RepoHeaderProps {
    owner: string;
    repo: string;
    meta: {
        description?: string;
        stargazers_count?: number;
        forks_count?: number;
        watchers_count?: number;
        language?: string;
        topics?: string[];
        license?: { spdx_id?: string };
        owner?: { avatar_url?: string };
    };
}

export default function RepoHeader({ owner, repo, meta }: RepoHeaderProps) {
    return (
        <div className="border-b border-[var(--color-gh-border)] bg-[var(--color-gh-bg)] py-4">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
                {/* Repo title row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {meta.owner?.avatar_url && (
                        <img
                            src={meta.owner.avatar_url}
                            alt={owner}
                            className="h-5 w-5 rounded-full"
                        />
                    )}
                    <a
                        href={`https://github.com/${owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-gh-blue)] hover:underline text-xl"
                    >
                        {owner}
                    </a>
                    <span className="text-[var(--color-gh-text-muted)] text-xl">/</span>
                    <a
                        href={`https://github.com/${owner}/${repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-gh-blue)] hover:underline text-xl font-semibold"
                    >
                        {repo}
                    </a>

                    {/* Stats */}
                    <div className="flex items-center gap-3 ml-auto text-xs text-[var(--color-gh-text-secondary)]">
                        {meta.stargazers_count != null && (
                            <span className="flex items-center gap-1 border border-[var(--color-gh-border)] rounded-md px-2.5 py-1 hover:bg-[var(--color-gh-surface)] transition-colors">
                                <Star className="h-3.5 w-3.5" />
                                {meta.stargazers_count.toLocaleString()}
                            </span>
                        )}
                        {meta.forks_count != null && (
                            <span className="flex items-center gap-1 border border-[var(--color-gh-border)] rounded-md px-2.5 py-1 hover:bg-[var(--color-gh-surface)] transition-colors">
                                <GitFork className="h-3.5 w-3.5" />
                                {meta.forks_count.toLocaleString()}
                            </span>
                        )}
                        {meta.watchers_count != null && (
                            <span className="flex items-center gap-1 border border-[var(--color-gh-border)] rounded-md px-2.5 py-1 hover:bg-[var(--color-gh-surface)] transition-colors">
                                <Eye className="h-3.5 w-3.5" />
                                {meta.watchers_count.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tags row */}
                <div className="flex items-center gap-2 flex-wrap">
                    {meta.language && (
                        <Badge color={getLanguageColor(meta.language)}>
                            {meta.language}
                        </Badge>
                    )}
                    {meta.topics?.slice(0, 5).map((topic) => (
                        <span
                            key={topic}
                            className="inline-block rounded-full bg-[rgba(56,139,253,0.15)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-gh-blue)] hover:bg-[rgba(56,139,253,0.25)] transition-colors"
                        >
                            {topic}
                        </span>
                    ))}
                    {meta.license?.spdx_id && (
                        <Badge variant="outline">{meta.license.spdx_id}</Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
