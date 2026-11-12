import { CloudflareGraph } from '@/lib/cloudflare'

// Data side of the Cloudflare chapter, kept apart from the views in
// src/app/cloudflare.tsx: this module carries the API token, so it must only be
// imported from build-time code and the Worker, never from a client component.
export interface CloudflarePoint {
    date: string
    day: string
    'Page Views': number
    Requests: number
    'Unique Visitors': number
}

export interface Share {
    name: string
    value: number
}

export interface CloudflareData {
    chartData: CloudflarePoint[]
    totalRequests: number
    totalPageviews: number
    totalBytes: number
    cachedBytes: number
    cachedRequests: number
    encryptedRequests: number
    threats: number
    countries: Share[]
    browsers: Share[]
    statusClasses: Share[]
    protocols: Share[]
    generatedAt: string
}

interface Group {
    date: { date: string }
    sum: {
        pageViews: number
        requests: number
        bytes: number
        cachedBytes: number
        cachedRequests: number
        encryptedRequests: number
        threats: number
        countryMap: { clientCountryName: string; requests: number }[]
        browserMap: { uaBrowserFamily: string; pageViews: number }[]
        responseStatusMap: { edgeResponseStatus: number; requests: number }[]
        clientHTTPVersionMap: { clientHTTPProtocol: string; requests: number }[]
    }
    uniq: { uniques: number }
}

const EMPTY: CloudflareData = {
    chartData: [],
    totalRequests: 0,
    totalPageviews: 0,
    totalBytes: 0,
    cachedBytes: 0,
    cachedRequests: 0,
    encryptedRequests: 0,
    threats: 0,
    countries: [],
    browsers: [],
    statusClasses: [],
    protocols: [],
    generatedAt: '',
}

// Sum a per-day breakdown map into one sorted list across the whole window.
function tally<T>(
    groups: Group[],
    pick: (g: Group) => T[] | undefined,
    key: (item: T) => string,
    value: (item: T) => number
): Share[] {
    const totals = new Map<string, number>()
    for (const g of groups) {
        for (const item of pick(g) ?? []) {
            const k = key(item)
            totals.set(k, (totals.get(k) ?? 0) + value(item))
        }
    }
    return Array.from(totals, ([name, v]) => ({ name, value: v })).sort(
        (a, b) => b.value - a.value
    )
}

const sumOf = (groups: Group[], pick: (g: Group) => number) =>
    groups.reduce((total, g) => total + (pick(g) || 0), 0)

export async function getCloudflareData(): Promise<CloudflareData> {
    const res = await CloudflareGraph.GetStatistic()
    if (!res?.data?.viewer) return EMPTY
    const { data, generatedAt, totalRequests, totalPageviews } = res
    const groups: Group[] = data.viewer.zones[0]?.httpRequests1dGroups ?? []

    const chartData: CloudflarePoint[] = groups.map((item) => ({
        date: item.date.date,
        day: new Date(`${item.date.date}T00:00:00Z`).toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric', timeZone: 'UTC' }
        ),
        'Page Views': item.sum.pageViews,
        Requests: item.sum.requests,
        'Unique Visitors': item.uniq.uniques,
    }))

    const statusClasses = tally(
        groups,
        (g) => g.sum.responseStatusMap,
        (s) => `${Math.floor(s.edgeResponseStatus / 100)}xx`,
        (s) => s.requests
    ).sort((a, b) => a.name.localeCompare(b.name))

    const protocols = tally(
        groups,
        (g) => g.sum.clientHTTPVersionMap,
        (p) => p.clientHTTPProtocol.replace('HTTP/1.0', 'HTTP/1.1'),
        (p) => p.requests
    ).sort((a, b) => a.name.localeCompare(b.name))

    return {
        chartData,
        totalRequests,
        totalPageviews,
        totalBytes: sumOf(groups, (g) => g.sum.bytes),
        cachedBytes: sumOf(groups, (g) => g.sum.cachedBytes),
        cachedRequests: sumOf(groups, (g) => g.sum.cachedRequests),
        encryptedRequests: sumOf(groups, (g) => g.sum.encryptedRequests),
        threats: sumOf(groups, (g) => g.sum.threats),
        countries: tally(
            groups,
            (g) => g.sum.countryMap,
            (c) => c.clientCountryName,
            (c) => c.requests
        ),
        browsers: tally(
            groups,
            (g) => g.sum.browserMap,
            (b) => b.uaBrowserFamily,
            (b) => b.pageViews
        ),
        statusClasses,
        protocols,
        generatedAt,
    }
}
