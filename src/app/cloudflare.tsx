import { TrafficChart } from '@/components/charts'
import { CloudflareGraph } from '@/lib/cloudflare'
import { Panel } from '@/components/panel'
import { EmptyState } from '@/components/empty-state'

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
    const res = await CloudflareGraph.GetStatistic()
    if (!res?.data?.viewer) {
        return {
            chartData: [],
            totalRequests: 0,
            totalPageviews: 0,
            generatedAt: '',
        }
    }
    const { data, generatedAt, totalRequests, totalPageviews } = res

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
