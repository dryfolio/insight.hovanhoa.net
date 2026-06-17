'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
    RiBookOpenLine,
    RiGithubFill,
    RiHome5Line,
    RiImageLine,
    RiLinksLine,
    RiLinkedinBoxFill,
    RiMusic2Line,
    RiPulseLine,
    RiServerLine,
    RiTwitterXFill,
    type RemixiconComponentType,
} from '@remixicon/react'
import {
    BASE_URL,
    GALLERY_URL,
    GITHUB,
    INFO_URL,
    INSIGHT_URL,
    LINKEDIN,
    MUSIC_URL,
    STATUS_URL,
    TWITTER,
} from '@/constants'

const CURRENT = 'insight'

type Item = {
    label: string
    desc: string
    href: string
    icon: RemixiconComponentType
    external?: boolean
}
type Column = { title: string; items: Item[] }

// Every destination here is real — sourced from src/constants (site config).
const COLUMNS: Column[] = [
    {
        title: 'this site',
        items: [
            {
                label: 'home',
                desc: 'profile & writing',
                href: BASE_URL,
                icon: RiHome5Line,
            },
            {
                label: 'blog',
                desc: 'notes & posts',
                href: `${BASE_URL}/#blog`,
                icon: RiBookOpenLine,
            },
        ],
    },
    {
        title: 'the family',
        items: [
            {
                label: 'insight',
                desc: 'coding activity',
                href: INSIGHT_URL,
                icon: RiPulseLine,
                external: true,
            },
            {
                label: 'gallery',
                desc: 'photography',
                href: GALLERY_URL,
                icon: RiImageLine,
                external: true,
            },
            {
                label: 'music',
                desc: "what's on repeat",
                href: MUSIC_URL,
                icon: RiMusic2Line,
                external: true,
            },
            {
                label: 'status',
                desc: 'service uptime',
                href: STATUS_URL,
                icon: RiServerLine,
                external: true,
            },
            {
                label: 'info',
                desc: 'links & bio',
                href: INFO_URL,
                icon: RiLinksLine,
                external: true,
            },
        ],
    },
    {
        title: 'connect',
        items: [
            {
                label: 'github',
                desc: `@${GITHUB}`,
                href: `https://github.com/${GITHUB}`,
                icon: RiGithubFill,
                external: true,
            },
            {
                label: 'twitter',
                desc: `@${TWITTER}`,
                href: `https://twitter.com/${TWITTER}`,
                icon: RiTwitterXFill,
                external: true,
            },
            {
                label: 'linkedin',
                desc: `in/${LINKEDIN}`,
                href: `https://linkedin.com/in/${LINKEDIN}`,
                icon: RiLinkedinBoxFill,
                external: true,
            },
        ],
    },
]

// dev-native extras pinned to the footer (both routes exist)
const FOOTER_LINKS = [
    { label: 'llms.txt', href: `${BASE_URL}/llms.txt` },
    { label: 'sitemap', href: `${BASE_URL}/sitemap.xml` },
]

// the trigger icon mirrors the page you're on
const CurrentIcon =
    COLUMNS.flatMap((c) => c.items).find((it) => it.label === CURRENT)?.icon ??
    RiHome5Line

function Caret({ open }: { open?: boolean }) {
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
            className={`transition-transform duration-200 ${
                open ? '-rotate-180' : ''
            }`}
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
        const v = next ? 'dark' : 'light'
        try {
            // shared across every *.hovanhoa.net subdomain
            document.cookie = `theme=${v}; path=/; max-age=31536000; samesite=lax`
            document.cookie = `theme=${v}; path=/; max-age=31536000; samesite=lax; domain=.hovanhoa.net`
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
            className="-m-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--rd-text-3)] transition-colors hover:bg-[var(--rd-surface-2)] hover:text-[var(--rd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rd-bg-sub)]"
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
    const ref = useRef<HTMLElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
                btnRef.current?.focus()
            }
        }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    const linkClass =
        'font-[family-name:var(--font-mono)] text-[13px] text-[var(--rd-text-2)] transition-colors duration-200 hover:text-[var(--rd-accent-ink)]'

    return (
        <nav
            ref={ref}
            className="relative flex items-center justify-between gap-3"
        >
            <div className="flex items-center gap-4 sm:gap-6">
                {/* logo */}
                <a
                    href="https://hovanhoa.net"
                    aria-label="hovanhoa home"
                    className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rd-bg-sub)]"
                >
                    <Image
                        src="/avatar.png"
                        alt="hovanhoa"
                        width={34}
                        height={34}
                        className="rounded-full border border-[var(--rd-border)]"
                    />
                </a>

                {/* mega-menu trigger */}
                <button
                    ref={btnRef}
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--rd-accent-bg)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--rd-accent-ink)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rd-bg-sub)]"
                >
                    <CurrentIcon
                        size={15}
                        className="text-[var(--rd-accent)]"
                    />
                    <span className="min-w-[5ch] text-center">{CURRENT}</span>
                    <Caret open={open} />
                </button>

                {/* inline quick links */}
                <div className="hidden items-center gap-5 sm:flex sm:gap-7">
                    <a href={`${BASE_URL}/#blog`} className={linkClass}>
                        blog
                    </a>
                    <a href={INSIGHT_URL} className={linkClass}>
                        insight
                    </a>
                    <a href={GALLERY_URL} className={linkClass}>
                        gallery
                    </a>
                </div>
            </div>

            <ThemeToggle />

            {/* mega-menu panel — content-aligned, spans the header width */}
            {open && (
                <div
                    role="menu"
                    aria-label="explore hovanhoa"
                    className="rd-menu-in absolute left-0 top-full z-40 mt-2 w-[min(100%,680px)] overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)] shadow-[0_16px_40px_-12px_rgb(0_0_0_/_0.18),0_6px_12px_-6px_rgb(0_0_0_/_0.1)]"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {COLUMNS.map((col, ci) => (
                            <div
                                key={col.title}
                                className={`px-3.5 py-3.5 ${
                                    ci > 0
                                        ? 'lg:border-l lg:border-[var(--rd-line)]'
                                        : ''
                                }`}
                            >
                                <h3 className="mb-1.5 px-2 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--rd-text-3)]">
                                    {col.title}
                                </h3>
                                <ul>
                                    {col.items.map((it) => {
                                        const active = it.label === CURRENT
                                        const Icon = it.icon
                                        return (
                                            <li key={it.label}>
                                                <a
                                                    href={it.href}
                                                    role="menuitem"
                                                    aria-current={
                                                        active
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                    className={`group flex items-center gap-2.5 rounded-[var(--rd-r-sm)] px-2 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--rd-accent)] ${
                                                        active
                                                            ? 'bg-[var(--rd-accent-bg)]'
                                                            : 'hover:bg-[var(--rd-surface-2)]'
                                                    }`}
                                                >
                                                    <Icon
                                                        size={16}
                                                        className={`shrink-0 ${
                                                            active
                                                                ? 'text-[var(--rd-accent-ink)]'
                                                                : 'text-[var(--rd-text-3)] group-hover:text-[var(--rd-accent-ink)]'
                                                        }`}
                                                    />
                                                    <span className="min-w-0">
                                                        <span
                                                            className={`flex items-center gap-1.5 text-[13px] font-medium leading-tight transition-colors ${
                                                                active
                                                                    ? 'text-[var(--rd-accent-ink)]'
                                                                    : 'text-[var(--rd-text)] group-hover:text-[var(--rd-accent-ink)]'
                                                            }`}
                                                        >
                                                            {it.label}
                                                            {active && (
                                                                <span
                                                                    aria-hidden
                                                                    className="h-1.5 w-1.5 rounded-full bg-[var(--rd-accent)]"
                                                                />
                                                            )}
                                                        </span>
                                                        <span className="block truncate text-[11.5px] leading-snug text-[var(--rd-text-2)]">
                                                            {it.desc}
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* footer row */}
                    <div className="flex items-center justify-between gap-4 border-t border-[var(--rd-border)] bg-[var(--rd-bg-sub)] px-4 py-2.5">
                        <a
                            href={`${BASE_URL}/ls`}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--rd-accent-ink)] transition-opacity hover:opacity-80"
                        >
                            browse everything
                            <span aria-hidden>→</span>
                        </a>
                        <div className="hidden items-center gap-5 sm:flex">
                            {FOOTER_LINKS.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--rd-text-2)] transition-colors hover:text-[var(--rd-text)]"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
