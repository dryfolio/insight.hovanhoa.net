import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BASE_URL, NAME, IMAGE, TWITTER, ROLE } from '@/constants'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from '@/components/scroll-to-top'

const inter = Inter({ subsets: ['latin'] })
const FULL_NAME = 'Hồ Văn Hòa'
const INSIGHT_URL = 'https://insight.hovanhoa.net'

export const metadata: Metadata = {
    metadataBase: new URL(INSIGHT_URL),
    title: {
        default: `${NAME} | insight`,
        template: `%s | ${NAME}`,
    },
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
    ],
    authors: [{ name: FULL_NAME }],
    openGraph: {
        title: `${NAME} | insight`,
        description: `${FULL_NAME} - ${ROLE}. Blog insights and analytics from Cloudflare.`,
        url: INSIGHT_URL,
        siteName: NAME,
        images: [
            {
                url: IMAGE,
                width: 800,
                height: 600,
                alt: FULL_NAME,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>
                {children}
                <ScrollToTop />
            </body>
            <Analytics />
        </html>
    )
}
