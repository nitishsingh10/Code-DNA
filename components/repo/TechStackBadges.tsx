'use client';

import { motion } from 'framer-motion';

interface TechItem {
    name: string;
    category: string;
    version?: string;
    color: string;
    usage: string;
}

interface TechStackBadgesProps {
    techs: TechItem[];
}

export default function TechStackBadges({ techs }: TechStackBadgesProps) {
    if (!techs || techs.length === 0) return null;

    return (
        <div>
            <h3 className="text-base font-semibold text-[var(--color-gh-text)] mb-3">Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {techs.map((tech, i) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                        className="group relative rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-3 hover:border-[var(--color-gh-border-muted)] transition-all duration-200"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: tech.color || 'var(--color-gh-text-muted)' }}
                            />
                            <span className="text-sm font-semibold text-[var(--color-gh-text)] truncate">
                                {tech.name}
                            </span>
                            {tech.version && (
                                <span className="text-[10px] text-[var(--color-gh-text-muted)] font-mono ml-auto">
                                    {tech.version}
                                </span>
                            )}
                        </div>
                        <span className="inline-block rounded-full bg-[var(--color-gh-bg)] px-2 py-0.5 text-[10px] text-[var(--color-gh-text-muted)] mb-1.5">
                            {tech.category}
                        </span>
                        <p className="text-xs text-[var(--color-gh-text-secondary)] leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-0 left-0 right-0 bg-[var(--color-gh-surface)] border-t border-[var(--color-gh-border)] p-3 rounded-b-md z-10">
                            {tech.usage}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
