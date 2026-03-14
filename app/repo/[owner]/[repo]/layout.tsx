'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import RepoHeader from '@/components/repo/RepoHeader';
import TabBar from '@/components/layout/TabBar';
import Sidebar from '@/components/layout/Sidebar';
import { getCached, setCache, cacheKey, progressKey } from '@/lib/cache';

interface RepoData {
    owner: string;
    repo: string;
    meta: Record<string, unknown>;
    readme: string;
    fileTree: string[];
    langs: Record<string, number>;
    packageJson?: string;
}

interface Progress {
    flashcardsReviewed: number;
    flashcardsTotal: number;
    quizAnswered: number;
    quizTotal: number;
}

export default function RepoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ owner: string; repo: string }>;
}) {
    const { owner, repo } = use(params);
    const [repoData, setRepoData] = useState<RepoData | null>(null);
    const [progress, setProgress] = useState<Progress>({ flashcardsReviewed: 0, flashcardsTotal: 0, quizAnswered: 0, quizTotal: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, repo]);

    async function loadData() {
        // Check cache first
        const cached = getCached<RepoData>(cacheKey(owner, repo, 'meta'));
        if (cached) {
            setRepoData(cached);
            setLoading(false);
        } else {
            // Fetch fresh
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repoUrl: `${owner}/${repo}` }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setRepoData(data);
                    setCache(cacheKey(owner, repo, 'meta'), data, false);
                }
            } catch {
                // Handle error
            }
            setLoading(false);
        }

        // Load progress
        const savedProgress = getCached<Progress>(progressKey(owner, repo));
        if (savedProgress) setProgress(savedProgress);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-gh-bg)]">
                <Navbar />
                <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
                    <div className="space-y-4">
                        <div className="skeleton h-8 w-64" />
                        <div className="skeleton h-6 w-96" />
                        <div className="skeleton h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    const meta = (repoData?.meta || {}) as Record<string, unknown>;

    return (
        <div className="min-h-screen bg-[var(--color-gh-bg)]">
            <Navbar />
            <RepoHeader
                owner={owner}
                repo={repo}
                meta={meta as RepoData['meta'] & { description?: string; stargazers_count?: number; forks_count?: number; watchers_count?: number; language?: string; topics?: string[]; license?: { spdx_id?: string }; owner?: { avatar_url?: string } }}
            />
            <TabBar owner={owner} repo={repo} />

            <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">{children}</div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <Sidebar
                            meta={meta as { description?: string; license?: { spdx_id?: string }; stargazers_count?: number; forks_count?: number; watchers_count?: number; topics?: string[] }}
                            langs={repoData?.langs || {}}
                            fileCount={repoData?.fileTree?.length || 0}
                            progress={progress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
