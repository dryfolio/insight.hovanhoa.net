import Link from 'next/link'
import React from 'react'
import { BASE_URL } from '@/constants'

export default function NotFound() {
    return (
        <main className="mx-auto grid min-h-[70vh] max-w-[var(--rd-maxw)] place-content-center gap-5 px-[var(--rd-pad)] text-center">
            <p className="m-0 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--rd-text-3)]">
                404
            </p>
            <h1 className="rd-display m-0 text-[var(--rd-text)]">
                Nothing lives here.
            </h1>
            <div className="mt-2 flex justify-center gap-2">
                <Link
                    href="/"
                    className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--rd-text)] px-[1.05rem] text-[0.8125rem] font-medium text-[var(--rd-bg)] transition-opacity hover:opacity-90"
                >
                    Back to insight
                </Link>
                <Link
                    href={BASE_URL}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--rd-border)] bg-[var(--rd-surface)] px-[1.05rem] text-[0.8125rem] font-medium text-[var(--rd-text)] transition-colors hover:bg-[var(--rd-surface-2)]"
                >
                    hovanhoa.net
                </Link>
            </div>
        </main>
    )
}
