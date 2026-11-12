import { TrafficChart } from '@/components/charts'
import { Panel } from '@/components/panel'
import { EmptyState } from '@/components/empty-state'
import { DistRows } from '@/components/redesign/dist-rows'
import { SplitBar } from '@/components/redesign/split-bar'
import { formatCompact, formatPercent } from '@/lib/utils'
import type { CloudflareData, Share } from '@/lib/cloudflare-data'

export type {
    CloudflareData,
    CloudflarePoint,
    Share,
} from '@/lib/cloudflare-data'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const countryName = (code: string) => {
    try {
        return regionNames.of(code) ?? code
    } catch {
        return code
    }
}

const formatShortenedDate = (isoString: string): string =>
    new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

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
