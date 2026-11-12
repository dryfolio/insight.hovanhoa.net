'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { InsightData } from '@/lib/insight-data'

const InsightContext = createContext<InsightData | null>(null)

// The page is a static export rendered with the data from build time. Once
// loaded, the browser swaps in fresh data from the /api/insight Worker
// (worker/index.ts); a source that comes back empty keeps what it had.
export function InsightLive({
    initial,
    children,
}: {
    initial: InsightData
    children: React.ReactNode
}) {
    const [data, setData] = useState(initial)

    useEffect(() => {
        let cancelled = false
        fetch('/api/insight')
            .then((res) =>
                res.ok ? (res.json() as Promise<InsightData>) : null
            )
            .then((next) => {
                if (!next || cancelled) return
                setData((prev) => ({
                    cloudflare: next.cloudflare?.chartData?.length
                        ? next.cloudflare
                        : prev.cloudflare,
                    codingActivity: next.codingActivity?.length
                        ? next.codingActivity
                        : prev.codingActivity,
                    languages: next.languages?.length
                        ? next.languages
                        : prev.languages,
                    calendar: next.calendar?.length
                        ? next.calendar
                        : prev.calendar,
                }))
            })
            .catch(() => {
                // keep showing what we have
            })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <InsightContext.Provider value={data}>
            {children}
        </InsightContext.Provider>
    )
}

export function useInsight(): InsightData {
    const data = useContext(InsightContext)
    if (!data) throw new Error('useInsight must be used inside <InsightLive>')
    return data
}
