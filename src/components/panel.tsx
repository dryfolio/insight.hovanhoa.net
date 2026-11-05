import type { ReactNode } from 'react'

export const cardClass =
    'overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)]'

// Panel — the one card shape used on the page: a quiet label row on top,
// content below. No shadows, never nested.
export function Panel({
    label,
    meta,
    children,
    flush = false,
    className = '',
}: {
    label: string
    meta?: ReactNode
    children: ReactNode
    /** skip the inner padding (for row lists that draw their own) */
    flush?: boolean
    className?: string
}) {
    return (
        <div className={`${cardClass} ${className}`}>
            <div className="flex items-center justify-between gap-3 border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[var(--rd-text-3)]">
                <span>{label}</span>
                {meta && (
                    <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
                        {meta}
                    </span>
                )}
            </div>
            {flush ? (
                children
            ) : (
                <div className="p-[clamp(14px,2vw,22px)]">{children}</div>
            )}
        </div>
    )
}

export default Panel
