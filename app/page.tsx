'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { ArrowRight, Zap, BookOpen, Search, Layers, Code2, HelpCircle, Terminal } from 'lucide-react';

const examples = [
  { label: 'facebook/react', url: 'facebook/react' },
  { label: 'vercel/next.js', url: 'vercel/next.js' },
  { label: 'torvalds/linux', url: 'torvalds/linux' },
];

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    const encoded = encodeURIComponent(repoUrl.trim());
    router.push(`/analyze?repo=${encoded}`);
  }

  function handleExample(url: string) {
    setRepoUrl(url);
    router.push(`/analyze?repo=${encodeURIComponent(url)}`);
  }

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[40rem] bg-gradient-to-b from-[rgba(88,166,255,0.08)] to-transparent opacity-50 pointer-events-none rounded-full blur-3xl"></div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-6">
        {/* Hero Section */}
        <div className="pt-32 pb-20 max-w-3xl">
          <h1 className="text-[3.5rem] font-bold text-[#e6edf3] leading-[1.1] mb-6 tracking-tight">
            Turn any repository<br />into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3fb950]">learning system</span>.
          </h1>
          <p className="text-xl text-[#8b949e] leading-relaxed mb-10 max-w-2xl font-light">
            Instantly generate interactive documentation, intelligent flashcards, code challenges, and quizzes from real-world open source codebases.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8b949e] group-focus-within:text-[#58a6ff] transition-colors" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="w-full h-12 rounded-lg border border-[#30363d] bg-[#0d1117] pl-11 pr-4 text-base text-[#e6edf3] font-mono placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all shadow-[0_0_0_1px_transparent,0_1px_2px_rgba(0,0,0,0.4)] inset-shadow-sm hover:border-[#8b949e]"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              Analyze Repository
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center gap-3 text-sm text-[#8b949e]">
            <span className="font-semibold text-[#6e7681]">Try examples:</span>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.url}
                  onClick={() => handleExample(ex.url)}
                  className="px-2.5 py-1 rounded-md border border-[#30363d] bg-[#161b22] hover:border-[#8b949e] hover:text-[#e6edf3] transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {[
            { icon: Zap, label: 'Lightning Fast', desc: 'Powered by advanced AI models to instantly parse complex architectures.' },
            { icon: Layers, label: 'Smart Flashcards', desc: 'Automatically generated spaced-repetition cards for key concepts.' },
            { icon: Code2, label: 'DSA Extraction', desc: 'Finds algorithmic patterns in the repo and generates coding challenges.' },
            { icon: HelpCircle, label: 'Interactive Quizzes', desc: 'Test your understanding of the codebase with AI-generated questions.' },
            { icon: Terminal, label: 'Code Explanations', desc: 'Detailed, line-by-line breakdowns of complex files and functions.' },
            { icon: BookOpen, label: 'Open Access', desc: 'Process any public repository immediately without authentication.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group rounded-xl border border-[#30363d] bg-[#161b22] p-6 hover:border-[#8b949e] transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-[#21262d] flex items-center justify-center mb-4 group-hover:bg-[#30363d] transition-colors">
                <Icon className="h-5 w-5 text-[#8b949e] group-hover:text-[#e6edf3] transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-[#e6edf3] mb-2">{label}</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="py-24 border-t border-[#30363d]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#e6edf3] mb-4">How it works</h2>
            <p className="text-[#8b949e] max-w-2xl mx-auto">Three simple steps to decode any open-source project and accelerate your learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#30363d] to-transparent z-0"></div>

            {[
              { step: '01', title: 'Paste URL', desc: 'Enter any public GitHub repository URL into the search bar. No clone required.' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI agents instantly scan the file tree, package dependencies, and core logic.' },
              { step: '03', title: 'Start Learning', desc: 'Access generated documentation, flashcards, and quizzes perfectly tailored to the codebase.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-[#0d1117] border-2 border-[#30363d] flex items-center justify-center text-xl font-bold text-[#58a6ff] mb-6 shadow-[0_0_15px_rgba(88,166,255,0.15)]">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#e6edf3] mb-3">{item.title}</h3>
                <p className="text-sm text-[#8b949e] leading-relaxed max-w-[280px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-sm text-[#8b949e]">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="font-semibold text-[#e6edf3]">CodeDNA</span>
            <span>© 2024</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/nitishsingh10/CodeDNA" target="_blank" rel="noopener noreferrer" className="hover:text-[#58a6ff] transition-colors">
              Source Code
            </a>
            <a href="#" className="hover:text-[#58a6ff] transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
