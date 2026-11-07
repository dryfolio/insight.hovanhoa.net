import { IMAGE, NAME, ROLE, TWITTER, GITHUB, LINKEDIN } from '@/constants'
import {
    getCloudflareData,
    CloudflareChart,
    TopCountries,
    TopBrowsers,
    ResponseHealth,
    Protocols,
} from './cloudflare'
import {
    getWakaCodingActivity,
    getWakaLanguages,
    getWakaCalendar,
    summarizeCoding,
    aiShare,
    CodingHoursChart,
    LanguageDist,
    CodingCalendar,
    CodingRhythm,
    AiAuthorship,
    AiModels,
} from '@/app/wakatime'
import type { ReactNode } from 'react'
import { SectionHead } from '@/components/section-head'
import { cardClass } from '@/components/panel'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { KpiTile, type KpiTileData } from '@/components/redesign/kpi-tile'
import { StatStrip, type Stat } from '@/components/redesign/stat-strip'
import {
    formatNumber,
    formatCompact,
    formatPercent,
    formatBytes,
    computeTrend,
} from '@/lib/utils'
import type { Metadata } from 'next'

const FULL_NAME = 'Hồ Văn Hòa'
const WAKATIME_PROFILE = 'https://wakatime.com/@hovanhoa'

const CHAPTERS = [
    { id: 'traffic', num: '01', label: 'Traffic' },
    { id: 'audience', num: '02', label: 'Audience' },
    { id: 'coding', num: '03', label: 'Coding' },
    { id: 'ai', num: '04', label: 'AI pairing' },
] as const

type ChapterId = (typeof CHAPTERS)[number]['id']

// Chapter — one numbered section of the report: eyebrow, serif title with
// source links, short lede, then content.
function Chapter({
    id,
    title,
    lede,
    source,
    children,
}: {
    id: ChapterId
    title: string
    lede: string
    source: { label: string; href: string }
    children: ReactNode
}) {
    const chapter = CHAPTERS.find((c) => c.id === id)!
    return (
        <section
            id={id}
            className="mx-auto max-w-[var(--rd-maxw)] scroll-mt-20 px-[var(--rd-pad)] pb-[clamp(48px,6vw,80px)]"
        >
            <div className="mb-[clamp(36px,4.5vw,56px)] border-t border-[var(--rd-line)]" />
            <Eyebrow num={chapter.num}>{chapter.label}</Eyebrow>
            <div className="mt-3">
                <SectionHead title={title} links={[source]}>
                    <p className="m-0 mt-2 max-w-[58ch] text-[0.95rem] leading-[1.6] text-[var(--rd-text-2)]">
                        {lede}
                    </p>
                </SectionHead>
            </div>
            {children}
        </section>
    )
}
const INSIGHT_URL = 'https://insight.hovanhoa.net'

export const metadata: Metadata = {
    title: 'hovanhoa | insight',
    description: `${FULL_NAME} - ${ROLE}. Blog insights and analytics from Cloudflare.`,
    keywords: [
        FULL_NAME,
        'Hồ Văn Hòa',
        NAME,
        'hovanhoa',
        ROLE,
        'Software Engineer',
        'Developer',
        'Blog',
        'Tech Blog',
        'Vietnam Developer',
        'Cloudflare',
        'Insight',
        'Analytics',
        'Blog Analytics',
        'Wakatime',
    ],
    authors: [{ name: FULL_NAME }],
    openGraph: {
        title: `${NAME} | insight`,
        description: `${FULL_NAME} - ${ROLE}. Blog insights and analytics from Cloudflare.`,
        url: INSIGHT_URL,
        siteName: NAME,
        images: [{ url: IMAGE, width: 800, height: 600, alt: FULL_NAME }],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${NAME} | insight`,
        description: `${FULL_NAME} - ${ROLE}. Blog insights and analytics.`,
        creator: `@${TWITTER}`,
        images: [IMAGE],
    },
    alternates: {
        canonical: INSIGHT_URL,
    },
}

export const revalidate = 86400

export default async function Insight() {
    const [cloudflare, codingActivity, languages, calendar] = await Promise.all(
        [
            getCloudflareData(),
            getWakaCodingActivity(),
            getWakaLanguages(),
            getWakaCalendar(),
        ]
    )
    const coding = summarizeCoding(codingActivity)

    /* ---- derived series ---- */
    const codingSpark = codingActivity.map(
        (d) => Number(d['Coding Hours']) || 0
    )
    const avgDailyHours = coding.activeDays
        ? coding.totalHours / coding.activeDays
        : 0

    const pageViewsSpark = cloudflare.chartData.map((d) => d['Page Views'] || 0)
    const requestsSpark = cloudflare.chartData.map((d) => d.Requests || 0)
    const uniquesSpark = cloudflare.chartData.map(
        (d) => d['Unique Visitors'] || 0
    )
    const totalUniques = uniquesSpark.reduce((a, b) => a + b, 0)

    /* ---- KPI tiles (real data) ---- */
    const kpis: KpiTileData[] = [
        {
            k: 'coding hours',
            v: formatNumber(Math.round(coding.totalHours * 10) / 10),
            unit: 'h',
            sub: `${formatNumber(Math.round(avgDailyHours * 10) / 10)}h avg / active day`,
            trend: computeTrend(codingSpark),
            spark: codingSpark,
        },
        {
            k: 'page views',
            v: formatCompact(cloudflare.totalPageviews),
            unit: '',
            sub: `${formatCompact(cloudflare.totalPageviews / Math.max(cloudflare.chartData.length, 1))} / day`,
            trend: computeTrend(pageViewsSpark),
            spark: pageViewsSpark,
        },
        {
            k: 'requests',
            v: formatCompact(cloudflare.totalRequests),
            unit: '',
            sub: `${formatCompact(cloudflare.totalRequests / Math.max(cloudflare.chartData.length, 1))} / day`,
            trend: computeTrend(requestsSpark),
            spark: requestsSpark,
        },
        {
            k: 'unique visitors',
            v: formatCompact(totalUniques),
            unit: '',
            sub: 'sum of daily uniques',
            trend: computeTrend(uniquesSpark),
            spark: uniquesSpark,
        },
    ]

    /* ---- secondary figures ---- */
    const ratio = (part: number, whole: number) => (whole ? part / whole : 0)
    const stats: Stat[] = [
        {
            k: 'bandwidth',
            v: formatBytes(cloudflare.totalBytes),
            sub: 'served at the edge',
        },
        {
            k: 'cache hit',
            v: formatPercent(
                ratio(cloudflare.cachedRequests, cloudflare.totalRequests)
            ),
            sub: `${formatBytes(cloudflare.cachedBytes)} from cache`,
        },
        {
            k: 'encrypted',
            v: formatPercent(
                ratio(cloudflare.encryptedRequests, cloudflare.totalRequests)
            ),
            sub: 'requests over TLS',
        },
        {
            k: 'threats',
            v: formatNumber(cloudflare.threats),
            sub: 'flagged by Cloudflare',
        },
        {
            k: 'countries',
            v: formatNumber(cloudflare.countries.length),
            sub: cloudflare.countries[0]
                ? `led by ${cloudflare.countries[0].name}`
                : 'reached',
        },
        {
            k: 'AI-assisted',
            v: formatPercent(aiShare(coding), 0),
            sub: 'of lines added',
        },
    ]

    /* ---- editorial note derived from data ---- */
    const topLanguage = languages[0]?.name
    const trafficUp = computeTrend(pageViewsSpark).startsWith('+')
    const editorialNote = topLanguage
        ? `${topLanguage} led the coding time this month at ${Math.round(
              languages[0].percent
          )}% of tracked hours, ${formatPercent(aiShare(coding), 0)} of new lines came from an AI pair, and site traffic ${
              trafficUp ? 'climbed' : 'eased'
          } across the last 30 days.`
        : `A quiet view of coding time and site traffic across the last 30 days.`

    const generatedAt = cloudflare.generatedAt
        ? new Date(cloudflare.generatedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : null

    return (
        <main className="relative min-h-screen">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: `${NAME} | insight`,
                        url: INSIGHT_URL,
                        author: {
                            '@type': 'Person',
                            name: FULL_NAME,
                            alternateName: NAME,
                            jobTitle: ROLE,
                            image: `${INSIGHT_URL}${IMAGE}`,
                            sameAs: [
                                `https://twitter.com/${TWITTER}`,
                                `https://github.com/${GITHUB}`,
                                `https://linkedin.com/in/${LINKEDIN}`,
                            ],
                        },
                        description: `${FULL_NAME} - ${ROLE}. Blog insights and analytics from Cloudflare.`,
                    }),
                }}
            />
            {/* ---- page header ---- */}
            <section className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(2rem,4vw,3rem)] pt-[clamp(3.5rem,8vw,6.5rem)]">
                <div className="rd-rise max-w-[46rem]">
                    <h1 className="rd-display m-0 text-[var(--rd-text)] max-[799px]:text-[clamp(2.1rem,9vw,2.6rem)]">
                        My month in code and clicks.
                    </h1>
                    <p className="m-0 mt-[clamp(1.1rem,2vw,1.5rem)] max-w-[56ch] text-pretty text-[clamp(0.98rem,1.25vw,1.0625rem)] leading-[1.65] text-[var(--rd-text-2)]">
                        A small corner of the web where I keep track of the
                        hours I spend coding and the people who drop by, pulled
                        straight from WakaTime and Cloudflare and refreshed
                        every day.
                    </p>
                    <p className="m-0 mt-4 font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                        {generatedAt
                            ? `Last updated ${generatedAt}`
                            : 'Last 30 days'}{' '}
                        · sources: Cloudflare, WakaTime
                    </p>
                    <nav
                        aria-label="Report sections"
                        className="mt-6 flex flex-wrap gap-2"
                    >
                        {CHAPTERS.map((c) => (
                            <a
                                key={c.id}
                                href={`#${c.id}`}
                                className="rd-chip transition-colors hover:border-[var(--rd-border-2)] hover:text-[var(--rd-text)]"
                            >
                                <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-[var(--rd-accent)]">
                                    {c.num}
                                </span>
                                {c.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {/* ---- at a glance ---- */}
            <section className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(40px,5vw,64px)]">
                <div className={`rd-rise ${cardClass}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[var(--rd-text-3)]">
                        <span>At a glance</span>
                        <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
                            last 30 days · trend = last 15d vs prior 15d
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-[var(--rd-line)] min-[900px]:grid-cols-4">
                        {kpis.map((t) => (
                            <KpiTile key={t.k} t={t} />
                        ))}
                    </div>
                    <div className="border-t border-[var(--rd-line)]">
                        <StatStrip stats={stats} />
                    </div>
                    <p className="m-0 border-t border-[var(--rd-line)] px-[1.15rem] py-3.5 text-[0.9rem] leading-[1.55] text-[var(--rd-text-2)]">
                        {editorialNote}
                    </p>
                </div>
            </section>

            <Chapter
                id="traffic"
                title="Who stopped by"
                lede="Requests, page views and unique visitors per day, and how the edge answered them."
                source={{
                    label: 'Cloudflare',
                    href: 'https://www.cloudflare.com/web-analytics/',
                }}
            >
                <CloudflareChart data={cloudflare} />
                <div className="mt-4 grid gap-4 min-[900px]:grid-cols-2">
                    <ResponseHealth data={cloudflare} />
                    <Protocols data={cloudflare} />
                </div>
            </Chapter>

            <Chapter
                id="audience"
                title="Where they came from"
                lede="Countries by request volume, and the browsers behind the page views that could be identified."
                source={{
                    label: 'Cloudflare',
                    href: 'https://www.cloudflare.com/web-analytics/',
                }}
            >
                <div className="grid gap-4 min-[900px]:grid-cols-2">
                    <TopCountries data={cloudflare} />
                    <TopBrowsers data={cloudflare} />
                </div>
            </Chapter>

            <Chapter
                id="coding"
                title="Time at the keyboard"
                lede="Daily coding hours, the languages they went into, and which days of the week do the heavy lifting."
                source={{ label: 'WakaTime', href: WAKATIME_PROFILE }}
            >
                <div className="grid gap-4 min-[900px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <CodingHoursChart data={codingActivity} />
                    <CodingRhythm summary={coding} />
                </div>
                <div className="mt-4">
                    <CodingCalendar days={calendar} />
                </div>
                <div className="mt-4">
                    <LanguageDist languages={languages} />
                </div>
            </Chapter>

            <Chapter
                id="ai"
                title="Pairing with AI"
                lede="How much of the new code came through an AI assistant, and which models wrote it."
                source={{ label: 'WakaTime', href: WAKATIME_PROFILE }}
            >
                <div className="grid gap-4 min-[900px]:grid-cols-2">
                    <AiAuthorship summary={coding} />
                    <AiModels summary={coding} />
                </div>
            </Chapter>
        </main>
    )
}
