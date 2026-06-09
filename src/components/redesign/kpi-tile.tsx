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

export function KpiTile({ t }: { t: KpiTileData }) {
    const up = t.trend.startsWith('+')
    const goodTrend = t.good ? !up : up
    return (
        <div className="rd-card flex min-h-[168px] flex-col gap-3 p-[clamp(18px,2.2vw,26px)]">
            <div className="flex items-center justify-between">
                <span className="rd-eyebrow text-[10.5px]">{t.k}</span>
                <span
                    className={`font-[family-name:var(--font-mono)] text-[11.5px] ${
                        goodTrend
                            ? 'text-[var(--rd-ok)]'
                            : 'text-[var(--rd-text-3)]'
                    }`}
                >
                    {t.trend}
                </span>
            </div>
            <div className="text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-none tracking-[-0.04em]">
                {t.v}
                <span className="rd-unit">{t.unit}</span>
            </div>
            <Sparkline
                data={t.spark}
                h={34}
                stroke={t.good ? 'var(--rd-ok)' : 'var(--rd-accent)'}
            />
            <div className="font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--rd-text-3)]">
                {t.sub}
            </div>
        </div>
    )
}

export default KpiTile
