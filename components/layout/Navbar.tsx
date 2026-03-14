'use client';

import Link from 'next/link';
import { GitBranch, Github } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#010409]">
            <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-[#e6edf3] no-underline hover:text-white transition-colors">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2ea043]">
                            <GitBranch className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[16px] font-semibold tracking-tight">CodeDNA</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-2 ml-4">
                        {['Features', 'Docs'].map((item) => (
                            <span
                                key={item}
                                className="px-2 py-1 text-[14px] font-medium text-[#e6edf3] hover:text-white rounded-md hover:bg-[rgba(177,186,196,0.12)] transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/nitishsingh10/CodeDNA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-8 w-8 rounded-full text-[#e6edf3] hover:bg-[rgba(177,186,196,0.12)] transition-colors"
                    >
                        <Github className="h-[22px] w-[22px]" />
                    </a>
                </div>
            </div>
        </header>
    );
}
