'use client'

import { useEffect, useRef, useState } from 'react'
import {
    RiBookOpenLine,
    RiBookShelfLine,
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
    BLOG_URL,
    BOOK_URL,
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
                label: 'insight',
                desc: 'coding activity',
                href: INSIGHT_URL,
                icon: RiPulseLine,
            },
        ],
    },
    {
        title: 'the family',
        items: [
            {
                label: 'home',
                desc: 'profile & writing',
                href: BASE_URL,
                icon: RiHome5Line,
                external: true,
            },
            {
                label: 'blog',
                desc: 'notes & posts',
                href: BLOG_URL,
                icon: RiBookOpenLine,
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
            {
                label: 'book',
                desc: 'reading list',
                href: BOOK_URL,
                icon: RiBookShelfLine,
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

// dev-native extras pinned to the menu footer (both routes exist)
const FOOTER_LINKS = [
    { label: 'llms.txt', href: `${BASE_URL}/llms.txt` },
    { label: 'sitemap', href: `${BASE_URL}/sitemap.xml` },
]

// inline quick links — identical order on every family site; the breakpoint
// tiers decide how many fit beside the wordmark
const QUICK_LINKS = [
    { label: 'home', href: BASE_URL, tier: '' },
    { label: 'blog', href: BLOG_URL, tier: '' },
    { label: 'insight', href: INSIGHT_URL, tier: '' },
    { label: 'gallery', href: GALLERY_URL, tier: 'hidden lg:inline-flex' },
    { label: 'music', href: MUSIC_URL, tier: 'hidden lg:inline-flex' },
    { label: 'book', href: BOOK_URL, tier: 'hidden xl:inline-flex' },
    { label: 'status', href: STATUS_URL, tier: 'hidden xl:inline-flex' },
]

const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rd-bg)]'

function UpDown({ open }: { open?: boolean }) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`text-[var(--rd-text-3)] transition-transform duration-200 ${
                open ? 'rotate-180' : ''
            }`}
        >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
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
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--rd-text-2)] transition-colors hover:bg-[var(--rd-surface-2)] hover:text-[var(--rd-text)] ${focusRing}`}
        >
            {dark ? (
                <svg
                    width="16"
                    height="16"
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
                    width="16"
                    height="16"
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

    return (
        <header className="sticky top-0 z-50 w-full bg-[var(--rd-bg)]">
            <nav className="relative mx-auto flex h-[var(--rd-nav-h)] max-w-[var(--rd-maxw)] items-center gap-4 px-[var(--rd-pad)]">
                {/* wordmark — doubles as the family switcher */}
                <div ref={ref} className="relative shrink-0">
                    <button
                        ref={btnRef}
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        aria-label="Open the hovanhoa family menu"
                        className={`-ml-2 inline-flex h-9 items-center gap-1.5 rounded-md px-2 transition-opacity hover:opacity-80 ${focusRing}`}
                    >
                        <span className="text-[0.9375rem] font-medium lowercase tracking-[-0.03em] text-[var(--rd-text)]">
                            hovanhoa
                        </span>
                        <UpDown open={open} />
                    </button>

                    {open && (
                        <div
                            role="menu"
                            aria-label="explore hovanhoa"
                            className="rd-menu-in absolute left-0 top-full z-40 mt-1.5 w-[min(calc(100vw-2rem),26rem)] overflow-hidden rounded-[var(--rd-r-sm)] border border-[var(--rd-border)] bg-[var(--rd-bg)] shadow-[0_16px_40px_-12px_rgb(0_0_0_/_0.18),0_6px_12px_-6px_rgb(0_0_0_/_0.1)]"
                        >
                            <div className="max-h-[min(80vh,40rem)] overflow-y-auto p-1.5">
                                {COLUMNS.map((col) => (
                                    <div
                                        key={col.title}
                                        className="mb-1.5 last:mb-0"
                                    >
                                        <p className="px-1.5 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--rd-text-3)]">
                                            {col.title}
                                        </p>
                                        <div className="grid grid-cols-2 gap-1">
                                            {col.items.map((it) => {
                                                const active =
                                                    it.label === CURRENT
                                                const Icon = it.icon
                                                return (
                                                    <a
                                                        key={it.label}
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
                                                        className={`group flex items-center gap-2.5 rounded-md border px-2 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--rd-text)] ${
                                                            active
                                                                ? 'border-[var(--rd-border)] bg-[var(--rd-surface-2)]'
                                                                : 'border-transparent hover:border-[var(--rd-border)] hover:bg-[var(--rd-surface)]'
                                                        }`}
                                                    >
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--rd-border)] bg-[var(--rd-bg)] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
                                                            <Icon
                                                                size={15}
                                                                className="text-[var(--rd-text)]"
                                                            />
                                                        </span>
                                                        <span className="flex min-w-0 flex-col leading-tight">
                                                            <span className="truncate text-[13px] font-medium text-[var(--rd-text)]">
                                                                {it.label}
                                                            </span>
                                                            <span className="truncate text-[11px] text-[var(--rd-text-3)]">
                                                                {it.desc}
                                                            </span>
                                                        </span>
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-4 border-t border-[var(--rd-border)] bg-[var(--rd-bg-sub)] px-3.5 py-2.5">
                                <a
                                    href={`${BASE_URL}/ls`}
                                    onClick={() => setOpen(false)}
                                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--rd-text)] transition-opacity hover:opacity-80"
                                >
                                    browse everything
                                    <span aria-hidden>→</span>
                                </a>
                                <div className="flex items-center gap-4">
                                    {FOOTER_LINKS.map((l) => (
                                        <a
                                            key={l.label}
                                            href={l.href}
                                            onClick={() => setOpen(false)}
                                            className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-text)]"
                                        >
                                            {l.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* quick links — centred between wordmark and actions */}
                <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
                    {QUICK_LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            data-active={
                                l.label === CURRENT ? 'true' : undefined
                            }
                            aria-current={
                                l.label === CURRENT ? 'page' : undefined
                            }
                            className={`${
                                l.tier || 'inline-flex'
                            } h-8 items-center whitespace-nowrap rounded-full px-[0.7rem] text-[0.875rem] tracking-[-0.01em] text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-text)] data-[active=true]:text-[var(--rd-text)] ${focusRing}`}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
                    <ThemeToggle />
                    <a
                        href={INFO_URL}
                        className={`hidden h-9 items-center justify-center rounded-full bg-[var(--rd-text)] px-[1.05rem] text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--rd-bg)] transition-opacity hover:opacity-90 sm:inline-flex ${focusRing}`}
                    >
                        connect
                    </a>
                </div>
            </nav>
        </header>
    )
}
