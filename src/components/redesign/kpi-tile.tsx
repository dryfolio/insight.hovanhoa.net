import { Sparkline } from './sparkline'

export interface KpiTileData {
    k: string
    v: string
    unit: string
    sub: string
    trend: string
    spark: number[]
    /** true when a negative trend is desirable (e.g. spend going down) */
    good?: boolean
}

// KpiTile — one cell of the "At a glance" strip. Renders without its own
// border/background so the parent card draws the hairlines between cells.
export function KpiTile({ t }: { t: KpiTileData }) {
    const up = t.trend.startsWith('+')
    const goodTrend = t.good ? !up : up
    return (
        <div className="flex h-full flex-col gap-3 bg-[var(--rd-surface)] p-[clamp(18px,2vw,24px)]">
            <span className="font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                {t.k}
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <span className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--rd-text)]">
                    {t.v}
                    {t.unit && <span className="rd-unit">{t.unit}</span>}
                </span>
                <span
                    className={`font-[family-name:var(--font-mono)] text-[0.68rem] ${
                        goodTrend && t.trend !== '0%'
                            ? 'text-[var(--rd-accent-ink)]'
                            : 'text-[var(--rd-text-3)]'
                    }`}
                >
                    {t.trend}
                </span>
            </div>
            <Sparkline data={t.spark} h={28} stroke="var(--rd-accent)" />
            <div className="mt-auto font-[family-name:var(--font-mono)] text-[0.7rem] text-[var(--rd-text-3)]">
                {t.sub}
            </div>
        </div>
    )
}

export default KpiTile
