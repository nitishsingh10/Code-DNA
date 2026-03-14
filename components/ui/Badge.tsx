interface BadgeProps {
    children: React.ReactNode;
    color?: string;
    variant?: 'default' | 'outline' | 'muted';
    size?: 'sm' | 'md';
}

export default function Badge({ children, color, variant = 'default', size = 'sm' }: BadgeProps) {
    const baseClasses = 'inline-flex items-center font-medium rounded-full whitespace-nowrap';
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    if (variant === 'outline') {
        return (
            <span
                className={`${baseClasses} ${sizeClasses} border`}
                style={{
                    borderColor: color || 'var(--color-gh-border)',
                    color: color || 'var(--color-gh-text-secondary)',
                }}
            >
                {children}
            </span>
        );
    }

    if (variant === 'muted') {
        return (
            <span
                className={`${baseClasses} ${sizeClasses}`}
                style={{
                    backgroundColor: color ? `${color}20` : 'var(--color-gh-surface)',
                    color: color || 'var(--color-gh-text-secondary)',
                }}
            >
                {children}
            </span>
        );
    }

    return (
        <span
            className={`${baseClasses} ${sizeClasses}`}
            style={{
                backgroundColor: color ? `${color}20` : 'var(--color-gh-surface)',
                color: color || 'var(--color-gh-text-secondary)',
            }}
        >
            {color && (
                <span
                    className="inline-block h-2 w-2 rounded-full mr-1.5"
                    style={{ backgroundColor: color }}
                />
            )}
            {children}
        </span>
    );
}
