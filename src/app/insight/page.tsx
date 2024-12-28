import Navbar from '@/components/nav'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Cloudflare } from './cloudflare'
import { SkeletonCard } from '../../components/skeleton-card'
import {CloudflareGraph} from "@/lib/cloudflare";


export const metadata = {
    title: 'insight',
    description: 'Blog Insight from Cloudflare.',
}

export const revalidate = 86400


export default async function Insight() {

    return (
        <main className="min-h-screen relative">
            <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                <Navbar />
            </div>
            <Suspense fallback={<SkeletonCard />}>
                <Cloudflare />
            </Suspense>
            <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                <Footer />
            </div>
        </main>
    )
}

