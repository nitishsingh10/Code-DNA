interface SkeletonProps {
    className?: string;
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
    return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonBlock({ className = '' }: SkeletonProps) {
    return <div className={`skeleton h-24 ${className}`} />;
}

export function SkeletonCard() {
    return (
        <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] p-4 space-y-3">
            <SkeletonLine className="w-2/3" />
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-1/2" />
        </div>
    );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="skeleton h-4 w-4 rounded" />
                    <SkeletonLine className={`flex-1`} style-width={`${60 + Math.random() * 30}%`} />
                </div>
            ))}
        </div>
    );
}

export function SkeletonFileTree() {
    return (
        <div className="rounded-md border border-[var(--color-gh-border)] bg-[var(--color-gh-surface)] overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2 border-b border-[var(--color-gh-border)]"
                    style={{ paddingLeft: `${16 + (i % 3) * 16}px` }}
                >
                    <div className="skeleton h-4 w-4 rounded flex-shrink-0" />
                    <div className="skeleton h-3.5 rounded" style={{ width: `${80 + Math.random() * 120}px` }} />
                </div>
            ))}
        </div>
    );
}
