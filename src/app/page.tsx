import { IMAGE, NAME, ROLE, TWITTER, GITHUB, LINKEDIN } from '@/constants'
import { getCloudflareData, CloudflareChart } from './cloudflare'
import {
    getWakaCodingActivity,
    getWakaLanguages,
    CodingHoursChart,
    LanguageDist,
    CodingCalendar,
} from '@/app/wakatime'
import { SectionHead } from '@/components/section-head'
import { cardClass } from '@/components/panel'
import { KpiTile, type KpiTileData } from '@/components/redesign/kpi-tile'
import { formatNumber, formatCompact, computeTrend } from '@/lib/utils'
import type { Metadata } from 'next'

const FULL_NAME = 'Hồ Văn Hòa'
const WAKATIME_PROFILE = 'https://wakatime.com/@hovanhoa'

const SECTION =
    'mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-[clamp(48px,6vw,80px)]'
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
    const [cloudflare, codingActivity, languages] = await Promise.all([
        getCloudflareData(),
        getWakaCodingActivity(),
        getWakaLanguages(),
    ])

    /* ---- derived series ---- */
    const codingSpark = codingActivity.map(
        (d) => Number(d['Coding Hours']) || 0
    )
    const totalHours = codingSpark.reduce((a, b) => a + b, 0)
    const activeDays = codingSpark.filter((h) => h > 0).length
    const avgDailyHours = activeDays ? totalHours / activeDays : 0

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
            v: formatNumber(totalHours),
            unit: 'h',
            sub: `${formatNumber(avgDailyHours)}h avg / active day`,
            trend: computeTrend(codingSpark),
            spark: codingSpark,
        },
        {
            k: 'page views',
            v: formatCompact(cloudflare.totalPageviews),
            unit: '',
            sub: 'Cloudflare · 30d',
            trend: computeTrend(pageViewsSpark),
            spark: pageViewsSpark,
        },
        {
            k: 'requests',
            v: formatCompact(cloudflare.totalRequests),
            unit: '',
            sub: 'Cloudflare · 30d',
            trend: computeTrend(requestsSpark),
            spark: requestsSpark,
        },
        {
            k: 'unique visitors',
            v: formatCompact(totalUniques),
            unit: '',
            sub: 'Cloudflare · 30d',
            trend: computeTrend(uniquesSpark),
            spark: uniquesSpark,
        },
    ]

    /* ---- editorial note derived from data ---- */
    const topLanguage = languages[0]?.name
    const trafficUp = computeTrend(pageViewsSpark).startsWith('+')
    const editorialNote = topLanguage
        ? `${topLanguage} led the coding time this month at ${Math.round(
              languages[0].percent
          )}% of tracked hours, and site traffic ${
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
                </div>
            </section>

            {/* ---- at a glance ---- */}
            <section className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)]">
                <div className={`rd-rise ${cardClass}`}>
                    <div className="flex items-center justify-between border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[var(--rd-text-3)]">
                        <span>At a glance</span>
                        <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
                            last 30 days
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-[var(--rd-line)] min-[900px]:grid-cols-4">
                        {kpis.map((t) => (
                            <KpiTile key={t.k} t={t} />
                        ))}
                    </div>
                    <p className="m-0 border-t border-[var(--rd-line)] px-[1.15rem] py-3.5 text-[0.9rem] leading-[1.55] text-[var(--rd-text-2)]">
                        {editorialNote}
                    </p>
                </div>
            </section>

            {/* ---- traffic ---- */}
            <section id="traffic" className={`${SECTION} scroll-mt-20`}>
                <SectionHead
                    title="Who stopped by"
                    links={[
                        {
                            label: 'Cloudflare',
                            href: 'https://www.cloudflare.com/web-analytics/',
                        },
                    ]}
                >
                    <p className="m-0 mt-2 max-w-[58ch] text-[0.95rem] leading-[1.6] text-[var(--rd-text-2)]">
                        Requests, page views and unique visitors per day.
                    </p>
                </SectionHead>
                <CloudflareChart data={cloudflare} />
            </section>

            {/* ---- coding ---- */}
            <section
                id="coding"
                className="mx-auto max-w-[var(--rd-maxw)] scroll-mt-20 px-[var(--rd-pad)] pb-[clamp(48px,6vw,80px)]"
            >
                <SectionHead
                    title="Time at the keyboard"
                    links={[{ label: 'WakaTime', href: WAKATIME_PROFILE }]}
                >
                    <p className="m-0 mt-2 max-w-[58ch] text-[0.95rem] leading-[1.6] text-[var(--rd-text-2)]">
                        Daily coding hours and the languages they went into.
                    </p>
                </SectionHead>
                <div className="grid gap-4 min-[900px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                    <CodingHoursChart data={codingActivity} />
                    <LanguageDist languages={languages} />
                </div>
                <div className="mt-4">
                    <CodingCalendar />
                </div>
            </section>
        </main>
    )
}
