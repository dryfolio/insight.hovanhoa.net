'use client'

import { AreaChart, BarChart } from '@tremor/react'

// Client-side chart wrappers so value formatters (functions) never cross
// the server/client boundary.

const compact = (v: number) =>
    Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(v)

export function TrafficChart({ data }: { data: Record<string, unknown>[] }) {
    return (
        <AreaChart
            className="rd-chart h-64 sm:h-80"
            data={data}
            index="date"
            categories={['Requests', 'Page Views', 'Unique Visitors']}
            colors={['stone', 'orange', 'zinc']}
            showGridLines={true}
            showYAxis={true}
            yAxisWidth={44}
            showLegend={true}
            showAnimation={true}
            valueFormatter={compact}
        />
    )
}

export function HoursChart({ data }: { data: Record<string, unknown>[] }) {
    return (
        <BarChart
            className="rd-chart h-60 sm:h-72"
            categories={['Coding Hours']}
            colors={['orange']}
            data={data}
            index="range.date"
            showGridLines={true}
            showLegend={false}
            yAxisWidth={36}
            valueFormatter={(v) => `${v}h`}
        />
    )
}
