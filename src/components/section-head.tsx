import type { ReactNode } from 'react'

type LinkItem = { label: string; href: string }

export const sectionLink =
    'inline-flex items-center gap-1 text-[0.875rem] text-[var(--rd-text-2)] transition-colors hover:text-[var(--rd-text)]'

// SectionHead — serif section title on the left, quiet "→" links (or a mono
// meta line) on the right.
export function SectionHead({
    title,
    links,
    meta,
    children,
}: {
    title: string
    links?: LinkItem[]
    meta?: string
    children?: ReactNode
}) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <h2 className="rd-h-sec m-0 text-[var(--rd-text)]">{title}</h2>
                {children}
            </div>
            {(meta || (links && links.length > 0)) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {meta && (
                        <span className="font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                            {meta}
                        </span>
                    )}
                    {links?.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={sectionLink}
                        >
                            {l.label}
                            <span aria-hidden>→</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SectionHead
