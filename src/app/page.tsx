import Navbar from '@/components/nav'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Cloudflare } from './cloudflare'
import { SkeletonCard } from '../components/skeleton-card'
import Link from 'next/link'
import Image from 'next/image'
import { BASE_URL, IMAGE, NAME } from '@/constants'
import {CloudflareGraph} from "@/lib/cloudflare";


export const metadata = {
    title: 'hovanhoa | insight',
    description: 'Blog Insight from Cloudflare.',
}

export const revalidate = 86400


export default async function Insight() {
    return (
        <main className="min-h-screen relative pt-8">
            <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="items-center flex justify-between mb-6">
                    <Link href={BASE_URL}>
                        <Image
                            src={IMAGE}
                            alt={NAME}
                            className="h-12 w-12 rounded-full"
                            height={100}
                            width={100}
                        />
                    </Link>
                    <Navbar />
                </div>
                <div className="mt-20">
                    <Suspense fallback={<SkeletonCard />}>
                        <Cloudflare />
                    </Suspense>
                </div>
                <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                    <Footer />
                </div>
            </section>
        </main>
    )
}

