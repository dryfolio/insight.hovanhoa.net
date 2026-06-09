import { AreaChart } from '@/components/Tremor'
import { CloudflareGraph } from '@/lib/cloudflare'
import { Eyebrow } from '@/components/redesign/eyebrow'

export interface CloudflarePoint {
    date: string
    'Page Views': number
    Requests: number
    'Unique Visitors': number
}

export interface CloudflareData {
    chartData: CloudflarePoint[]
    totalRequests: number
    totalPageviews: number
    generatedAt: string
}

const formatShortenedDate = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export async function getCloudflareData(): Promise<CloudflareData> {
    const { data, generatedAt, totalRequests, totalPageviews } =
        await CloudflareGraph.GetStatistic()

    const chartData: CloudflarePoint[] = (
        data.viewer.zones[0]?.httpRequests1dGroups ?? []
    ).map(
        (item: {
            date: { date: string }
            sum: { pageViews: number; requests: number }
            uniq: { uniques: number }
        }) => ({
            date: item.date.date,
            'Page Views': item.sum.pageViews,
            Requests: item.sum.requests,
            'Unique Visitors': item.uniq.uniques,
        })
    )

    return { chartData, totalRequests, totalPageviews, generatedAt }
}

export function CloudflareChart({ data }: { data: CloudflareData }) {
    return (
        <div className="rd-card p-[clamp(18px,2.2vw,26px)]">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <Eyebrow>Traffic · Cloudflare</Eyebrow>
                    <h3 className="mt-2.5 text-[1.35rem] tracking-[-0.03em] text-[var(--rd-text)]">
                        Who stopped by
                    </h3>
                </div>
                <span className="rd-chip font-[family-name:var(--font-mono)] text-[11px]">
                    30d
                </span>
            </div>
            <AreaChart
                className="h-64 sm:h-80"
                data={data.chartData}
                index="date"
                categories={['Requests', 'Page Views', 'Unique Visitors']}
                colors={['orange', 'gray', 'slate']}
                showGridLines={false}
                showYAxis={false}
                showLegend={true}
                showAnimation={true}
            />
            <div className="mt-4 text-right font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--rd-text-3)]">
                generated {formatShortenedDate(data.generatedAt)}
            </div>
        </div>
    )
}
