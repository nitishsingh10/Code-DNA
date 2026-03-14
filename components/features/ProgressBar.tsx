interface ProgressBarProps {
    current: number;
    total: number;
    label?: string;
    color?: string;
}

export default function ProgressBar({ current, total, label, color = 'var(--color-gh-green)' }: ProgressBarProps) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[var(--color-gh-text-secondary)]">
                {label && <span>{label}</span>}
                <span className="ml-auto font-mono">{current}/{total}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-gh-border-muted)] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
