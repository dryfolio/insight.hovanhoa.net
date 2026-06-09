'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const CURRENT = 'insight'

const APPS = [
    { label: 'home', href: 'https://hovanhoa.net' },
    { label: 'insight', href: 'https://insight.hovanhoa.net' },
    { label: 'gallery', href: 'https://gallery.hovanhoa.net' },
    { label: 'music', href: 'https://music.hovanhoa.net' },
    { label: 'status', href: 'https://status.hovanhoa.net' },
]

function Caret() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

function ThemeToggle() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        setDark(document.documentElement.classList.contains('dark'))
    }, [])

    const toggle = () => {
        const next = !dark
        setDark(next)
        document.documentElement.classList.toggle('dark', next)
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light')
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rd-text-3)] transition-colors hover:bg-[var(--rd-surface-2)] hover:text-[var(--rd-text)]"
        >
            {dark ? (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
            ) : (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
            )}
        </button>
    )
}

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const linkClass =
        'font-[family-name:var(--font-mono)] text-[13px] text-[var(--rd-text-3)] transition-colors duration-200 hover:text-[var(--rd-accent-ink)]'

    return (
        <nav className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-6">
                {/* logo */}
                <a
                    href="https://hovanhoa.net"
                    aria-label="hovanhoa home"
                    className="shrink-0"
                >
                    <Image
                        src="/avatar.png"
                        alt="hovanhoa"
                        width={34}
                        height={34}
                        className="rounded-full border border-[var(--rd-border)]"
                    />
                </a>
                {/* app switcher — orange-tinted, mono */}
                <div className="relative" ref={ref}>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--rd-accent-bg)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--rd-accent-ink)] transition-opacity hover:opacity-80"
                    >
                        <span className="text-[var(--rd-accent)]">/</span>
                        {CURRENT}
                        <Caret />
                    </button>
                    {open && (
                        <div className="absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-[var(--rd-border)] bg-[var(--rd-surface)] p-1 shadow-lg">
                            {APPS.map((a) => (
                                <a
                                    key={a.label}
                                    href={a.href}
                                    className={`block rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-[13px] transition-colors ${
                                        a.label === CURRENT
                                            ? 'bg-[var(--rd-accent-bg)] text-[var(--rd-accent-ink)]'
                                            : 'text-[var(--rd-text-2)] hover:bg-[var(--rd-surface-2)] hover:text-[var(--rd-text)]'
                                    }`}
                                >
                                    {a.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* inline links */}
                <div className="hidden items-center gap-5 sm:flex sm:gap-7">
                    {APPS.map((a) => (
                        <a
                            key={a.label}
                            href={a.href}
                            className={`${linkClass} ${
                                a.label === CURRENT
                                    ? 'text-[var(--rd-accent-ink)]'
                                    : ''
                            }`}
                        >
                            {a.label}
                        </a>
                    ))}
                </div>
            </div>

            <ThemeToggle />
        </nav>
    )
}
