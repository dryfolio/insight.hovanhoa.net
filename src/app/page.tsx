import { IMAGE, NAME, ROLE, TWITTER } from '@/constants'
import { getInsightData } from '@/lib/insight-data'
import { InsightLive } from './insight-live'
import { InsightReport } from './insight-report'
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

// The static export is rendered with the data from build time; InsightLive
// then refreshes it in the browser from /api/insight (worker/index.ts).
export const dynamic = 'force-static'

export default async function Insight() {
    const initial = await getInsightData()

    return (
        <InsightLive initial={initial}>
            <InsightReport />
        </InsightLive>
    )
}
