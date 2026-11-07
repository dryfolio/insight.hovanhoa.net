import { TrafficChart } from '@/components/charts'
import { CloudflareGraph } from '@/lib/cloudflare'
import { Panel } from '@/components/panel'
import { EmptyState } from '@/components/empty-state'
import { DistRows } from '@/components/redesign/dist-rows'
import { SplitBar } from '@/components/redesign/split-bar'
import { formatCompact, formatPercent } from '@/lib/utils'

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

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const countryName = (code: string) => {
    try {
        return regionNames.of(code) ?? code
    } catch {
        return code
    }
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

const formatShortenedDate = (isoString: string): string =>
    new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

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

export function CloudflareChart({ data }: { data: CloudflareData }) {
    return (
        <Panel
            label="Daily traffic"
            meta={
                data.generatedAt
                    ? `generated ${formatShortenedDate(data.generatedAt)}`
                    : 'last 30 days'
            }
        >
            {data.chartData.length ? (
                <TrafficChart
                    data={
                        data.chartData as unknown as Record<string, unknown>[]
                    }
                />
            ) : (
                <EmptyState>Traffic data is unavailable right now.</EmptyState>
            )}
        </Panel>
    )
}

// Turn absolute values into DistRows rows, as a share of `total`.
const toRows = (items: Share[], total: number, label = (n: string) => n) =>
    items.map((i) => ({
        name: label(i.name),
        pct: total ? (i.value / total) * 100 : 0,
        value: formatCompact(i.value),
    }))

export function TopCountries({ data }: { data: CloudflareData }) {
    const total = data.countries.reduce((a, c) => a + c.value, 0)
    return (
        <Panel
            label="Top countries"
            meta={`${data.countries.length} reached · by requests`}
            flush
            className="h-full"
        >
            <DistRows
                rows={toRows(data.countries.slice(0, 8), total, countryName)}
                empty="No country data yet."
            />
        </Panel>
    )
}

export function TopBrowsers({ data }: { data: CloudflareData }) {
    const total = data.browsers.reduce((a, b) => a + b.value, 0)
    const unknown = data.browsers.find((b) => b.name === 'Unknown')?.value ?? 0
    const known = data.browsers.filter((b) => b.name !== 'Unknown')
    const knownTotal = total - unknown
    return (
        <Panel
            label="Browsers"
            meta="identified page views"
            flush
            className="flex h-full flex-col"
        >
            <DistRows
                rows={toRows(known.slice(0, 7), knownTotal)}
                empty="No browser data yet."
            />
            {total > 0 && (
                <p className="m-0 mt-auto border-t border-[var(--rd-line)] px-[1.15rem] py-3 text-[0.8rem] leading-[1.5] text-[var(--rd-text-3)]">
                    {formatPercent(unknown / total)} of page views carry no
                    recognisable browser — mostly crawlers, scripts and bots.
                </p>
            )}
        </Panel>
    )
}

const STATUS_TONE: Record<string, string> = {
    '2xx': 'var(--rd-ok)',
    '3xx': 'var(--rd-text-4)',
    '4xx': 'var(--rd-warn)',
    '5xx': 'var(--rd-down)',
}

const STATUS_LABEL: Record<string, string> = {
    '2xx': 'Success',
    '3xx': 'Redirect',
    '4xx': 'Client error',
    '5xx': 'Server error',
}

const PROTOCOL_TONE: Record<string, string> = {
    'HTTP/1.1': 'var(--rd-text-4)',
    'HTTP/2': 'var(--rd-text-2)',
    'HTTP/3': 'var(--rd-accent)',
}

export function ResponseHealth({ data }: { data: CloudflareData }) {
    return (
        <Panel label="Responses" meta="by status class" className="h-full">
            <SplitBar
                segments={data.statusClasses.map((s) => ({
                    name: s.name,
                    label: STATUS_LABEL[s.name] ?? s.name,
                    value: s.value,
                    color: STATUS_TONE[s.name] ?? 'var(--rd-text-4)',
                }))}
            />
        </Panel>
    )
}

export function Protocols({ data }: { data: CloudflareData }) {
    return (
        <Panel label="Protocols" meta="client HTTP version" className="h-full">
            <SplitBar
                segments={data.protocols.map((p) => ({
                    name: p.name,
                    label: p.name,
                    value: p.value,
                    color: PROTOCOL_TONE[p.name] ?? 'var(--rd-text-4)',
                }))}
            />
        </Panel>
    )
}
