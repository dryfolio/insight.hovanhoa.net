import Navbar from '@/components/nav'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Cloudflare } from './cloudflare'
import { SkeletonCard } from '../components/skeleton-card'
import Link from 'next/link'
import Image from 'next/image'
import { BASE_URL, IMAGE, NAME, ROLE, TWITTER, GITHUB, LINKEDIN } from '@/constants'
import {CloudflareGraph} from "@/lib/cloudflare";
import Wakatime from '@/app/wakatime'
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
    return (
        <main className="min-h-screen relative pt-8">
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
            <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="items-center flex justify-between mb-6">
                    <Link href={BASE_URL}>
                        <div className="border border-slate-200 p-1 rounded-full">
                            <Image
                                src={IMAGE}
                                alt={NAME}
                                className="h-12 w-12 rounded-full"
                                height={100}
                                width={100}
                            />
                        </div>
                    </Link>
                    <Navbar />
                </div>
                <div className="mt-20">
                    <Suspense fallback={<SkeletonCard />}>
                        <Cloudflare />
                    </Suspense>
                    <Suspense fallback={<SkeletonCard />}>
                        <Wakatime />
                    </Suspense>
                </div>
                <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                    <Footer />
                </div>
            </section>
        </main>
    )
}

