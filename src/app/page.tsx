import Navbar from '@/components/nav'
import { Footer } from '@/components/footer'
import {
    IMAGE,
    NAME,
    ROLE,
    TWITTER,
    GITHUB,
    LINKEDIN,
} from '@/constants'
import { getCloudflareData, CloudflareChart } from './cloudflare'
import {
    getWakaCodingActivity,
    getWakaLanguages,
    CodingHoursChart,
    LanguageDist,
    CodingCalendar,
} from '@/app/wakatime'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { Reveal } from '@/components/redesign/reveal'
import { KpiTile, type KpiTileData } from '@/components/redesign/kpi-tile'
import { formatNumber, formatCompact, computeTrend } from '@/lib/utils'
import type { Metadata } from 'next'

const FULL_NAME = 'Hồ Văn Hòa'
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
            k: 'Coding hours',
            v: formatNumber(totalHours),
            unit: 'h',
            sub: `${formatNumber(avgDailyHours)}h avg / active day`,
            trend: computeTrend(codingSpark),
            spark: codingSpark,
        },
        {
            k: 'Page views',
            v: formatCompact(cloudflare.totalPageviews),
            unit: '',
            sub: 'Cloudflare · 30d',
            trend: computeTrend(pageViewsSpark),
            spark: pageViewsSpark,
        },
        {
            k: 'Requests',
            v: formatCompact(cloudflare.totalRequests),
            unit: '',
            sub: 'Cloudflare · 30d',
            trend: computeTrend(requestsSpark),
            spark: requestsSpark,
        },
        {
            k: 'Unique visitors',
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
        <main className="min-h-screen">
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
            {/* ---- sticky header ---- */}
            <header className="sticky top-0 z-50 border-b border-[var(--rd-border-2)] bg-[var(--rd-bg-sub)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-3">
                    <Navbar />
                </div>
            </header>
            {/* ---- header panel ---- */}
            <div
                className="border-b border-[var(--rd-border)]"
                style={{
                    background:
                        'radial-gradient(100% 140% at 0% 0%, var(--rd-accent-bg), transparent 55%), var(--rd-surface-2)',
                }}
            >
                <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-12 pt-12">
                    <Eyebrow>hovanhoa · insight</Eyebrow>
                    <h1 className="mt-[18px] max-w-[20ch] text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-[-0.04em]">
                        My month in code and clicks.
                    </h1>
                    <p className="rd-lead mt-5">
                        A small corner of the web where I keep track of the hours
                        I spend coding and the people who drop by — pulled
                        straight from WakaTime and Cloudflare, refreshed every
                        day.
                    </p>
                    <div className="mt-4 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                        {generatedAt
                            ? `Last updated ${generatedAt}`
                            : 'Last 30 days'}{' '}
                        · sources: Cloudflare, WakaTime
                    </div>
                </div>
            </div>

            {/* ---- body ---- */}
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(56px,8vw,96px)] pt-[clamp(28px,4vw,44px)]">
                {/* ---- KPI tiles ---- */}
                <div className="rd-g4">
                    {kpis.map((t, i) => (
                        <Reveal key={t.k} delay={i * 50}>
                            <KpiTile t={t} />
                        </Reveal>
                    ))}
                </div>

                {/* ---- editorial note ---- */}
                <div className="rd-card mt-3 bg-[var(--rd-bg-sub)] p-[clamp(24px,3vw,34px)]">
                    <Eyebrow>The short version</Eyebrow>
                    <p className="mt-[14px] max-w-[58ch] text-[clamp(1.1rem,1.8vw,1.45rem)] leading-[1.45] tracking-[-0.015em]">
                        {editorialNote}
                    </p>
                </div>

                {/* ---- sections ---- */}
                <div className="mt-3 space-y-3">
                    <CloudflareChart data={cloudflare} />
                    <CodingHoursChart data={codingActivity} />
                    <LanguageDist languages={languages} />
                    <CodingCalendar />
                </div>
            </div>

            <Footer />
        </main>
    )
}
