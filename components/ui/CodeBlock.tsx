'use client';

import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('py', python);

interface CodeBlockProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    filename?: string;
}

export default function CodeBlock({ code, language, showLineNumbers = true, filename }: CodeBlockProps) {
    const codeRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.removeAttribute('data-highlighted');
            hljs.highlightElement(codeRef.current);
        }
    }, [code, language]);

    function handleCopy() {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const lines = code.split('\n');

    return (
        <div className="relative rounded-md border border-[var(--color-gh-border)] overflow-hidden group">
            {filename && (
                <div className="flex items-center justify-between bg-[var(--color-gh-surface)] border-b border-[var(--color-gh-border)] px-4 py-2">
                    <span className="text-xs text-[var(--color-gh-text-secondary)] font-mono">{filename}</span>
                </div>
            )}
            <div className="relative">
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-[var(--color-gh-surface)] border border-[var(--color-gh-border)] hover:bg-[var(--color-gh-surface-hover)] text-[var(--color-gh-text-secondary)] hover:text-[var(--color-gh-text)]"
                    title="Copy code"
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-gh-green)]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                {showLineNumbers ? (
                    <div className="flex overflow-x-auto bg-[var(--color-gh-bg)]">
                        <div className="flex-shrink-0 py-4 pl-4 pr-2 select-none">
                            {lines.map((_, i) => (
                                <div key={i} className="text-right text-xs leading-[1.5] text-[var(--color-gh-text-muted)] font-mono">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <pre className="flex-1 m-0 p-0"><code ref={codeRef} className={`language-${language || 'plaintext'} hljs`} style={{ padding: '16px 16px 16px 8px' }}>{code}</code></pre>
                    </div>
                ) : (
                    <pre className="m-0"><code ref={codeRef} className={`language-${language || 'plaintext'} hljs`}>{code}</code></pre>
                )}
            </div>
        </div>
    );
}
