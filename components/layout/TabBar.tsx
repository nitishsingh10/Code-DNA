'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Layers, Code2, HelpCircle, BookOpen } from 'lucide-react';

interface TabBarProps {
    owner: string;
    repo: string;
    counts?: {
        flashcards?: number;
        dsa?: number;
        quiz?: number;
    };
}

const tabs = [
    { label: 'Overview', icon: FileText, path: '' },
    { label: 'Flashcards', icon: Layers, path: '/flashcards' },
    { label: 'DSA', icon: Code2, path: '/dsa' },
    { label: 'Quiz', icon: HelpCircle, path: '/quiz' },
    { label: 'Docs', icon: BookOpen, path: '/docs' },
];

export default function TabBar({ owner, repo, counts }: TabBarProps) {
    const pathname = usePathname();
    const basePath = `/repo/${owner}/${repo}`;

    function isActive(tabPath: string) {
        if (tabPath === '') {
            return pathname === basePath || pathname === basePath + '/';
        }
        return pathname.startsWith(basePath + tabPath);
    }

    function getCount(label: string): number | undefined {
        if (!counts) return undefined;
        const key = label.toLowerCase() as keyof typeof counts;
        return counts[key];
    }

    return (
        <div className="border-b border-[var(--color-gh-border)] bg-[var(--color-gh-bg)]">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
                <nav className="flex gap-0 overflow-x-auto -mb-px" role="tablist">
                    {tabs.map((tab) => {
                        const active = isActive(tab.path);
                        const count = getCount(tab.label);
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.label}
                                href={`${basePath}${tab.path}`}
                                role="tab"
                                aria-selected={active}
                                className={`
                  flex items-center gap-2 px-3 py-2 text-[14px] leading-5 border-b-[2px] whitespace-nowrap transition-colors no-underline
                  ${active
                                        ? 'border-[#fd8c73] text-[#e6edf3] font-semibold'
                                        : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e] font-medium'
                                    }
                `}
                            >
                                <Icon className={`h-4 w-4 ${active ? 'text-[#e6edf3]' : 'text-[#8b949e]'}`} />
                                {tab.label}
                                {count !== undefined && (
                                    <span className="ml-1 rounded-full bg-[var(--color-gh-surface)] px-2 py-0.5 text-xs text-[var(--color-gh-text-secondary)]">
                                        {count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
