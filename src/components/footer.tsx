// Family footer — identical on every *.hovanhoa.net site.

type FooterLink = { label: string; href: string }
type FooterSection = { title: string; links: FooterLink[] }

const HOME = 'https://hovanhoa.net'

const SECTIONS: FooterSection[] = [
    {
        title: 'apps',
        links: [
            { label: 'home', href: HOME },
            { label: 'blog', href: 'https://blog.hovanhoa.net' },
            { label: 'insight', href: 'https://insight.hovanhoa.net' },
            { label: 'gallery', href: 'https://gallery.hovanhoa.net' },
            { label: 'music', href: 'https://music.hovanhoa.net' },
            { label: 'status', href: 'https://status.hovanhoa.net' },
            { label: 'book', href: 'https://book.hovanhoa.net' },
        ],
    },
    {
        title: 'elsewhere',
        links: [
            { label: 'github', href: 'https://github.com/hovanhoa' },
            { label: 'twitter', href: 'https://twitter.com/_hovanhoa_' },
            { label: 'linkedin', href: 'https://linkedin.com/in/hovanhoa' },
        ],
    },
    {
        title: 'more',
        links: [
            { label: 'connect', href: 'https://info.hovanhoa.net' },
            { label: 'ls', href: `${HOME}/ls` },
            { label: 'llms.txt', href: `${HOME}/llms.txt` },
            { label: 'sitemap', href: `${HOME}/sitemap.xml` },
        ],
    },
]

const SOCIAL = [
    {
        label: 'github',
        href: 'https://github.com/hovanhoa',
        viewBox: '0 0 24 24',
        d: 'M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55C20.21 21.39 23.5 17.1 23.5 12 23.5 5.73 18.27.5 12 .5z',
    },
    {
        label: 'twitter',
        href: 'https://twitter.com/_hovanhoa_',
        viewBox: '0 0 16 16',
        d: 'M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z',
    },
    {
        label: 'linkedin',
        href: 'https://linkedin.com/in/hovanhoa',
        viewBox: '0 0 24 24',
        d: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
    },
]

const linkClass =
    'block py-1 text-sm text-[var(--rd-text-2)] transition-colors duration-150 hover:text-[var(--rd-accent-ink)]'

function Section({ title, links }: FooterSection) {
    return (
        <div>
            <h4 className="mb-[13px] font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--rd-accent-ink)]">
                {title}
            </h4>
            {links.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                    {l.label}
                </a>
            ))}
        </div>
    )
}

export function Footer() {
    return (
        <footer className="border-t border-[var(--rd-border)] bg-[var(--rd-bg-sub)]">
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-10 pt-[54px]">
                <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
                    <div className="max-w-[300px]">
                        <div className="mb-3 flex items-center gap-3">
                            {SOCIAL.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="inline-flex items-center text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-accent-ink)]"
                                >
                                    <svg
                                        viewBox={s.viewBox}
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    >
                                        <path d={s.d} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                        <a
                            href={HOME}
                            className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--rd-text)]"
                        >
                            hovanhoa
                            <span className="text-[var(--rd-accent)]">
                                .net
                            </span>
                        </a>
                        <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                            © {new Date().getFullYear()} · built in vietnam
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-14">
                        {SECTIONS.map((s) => (
                            <Section key={s.title} {...s} />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
