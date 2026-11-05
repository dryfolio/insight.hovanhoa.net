import type { ReactNode } from 'react'

export function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className="grid h-48 place-content-center rounded-[var(--rd-r)] bg-[var(--rd-surface-2)] px-4 text-center text-[0.875rem] text-[var(--rd-text-3)]">
            {children}
        </div>
    )
}

export default EmptyState
