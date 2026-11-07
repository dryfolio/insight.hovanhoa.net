export interface Stat {
    k: string
    v: string
    sub?: string
}

// StatStrip — a row of small secondary figures under the KPI tiles. Like
// KpiTile it draws no borders of its own; the parent card's gap-px grid
// supplies the hairlines.
export function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <div className="grid grid-cols-2 gap-px bg-[var(--rd-line)] min-[640px]:grid-cols-3 min-[1000px]:grid-cols-6">
            {stats.map((s) => (
                <div
                    key={s.k}
                    className="flex flex-col gap-1.5 bg-[var(--rd-surface)] px-[clamp(16px,1.8vw,20px)] py-4"
                >
                    <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-[var(--rd-text-3)]">
                        {s.k}
                    </span>
                    <span className="text-[1.15rem] font-medium leading-none tracking-[-0.02em] text-[var(--rd-text)]">
                        {s.v}
                    </span>
                    {s.sub && (
                        <span className="text-[0.75rem] leading-snug text-[var(--rd-text-3)]">
                            {s.sub}
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}

export default StatStrip
