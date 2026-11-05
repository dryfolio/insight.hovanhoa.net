// DistRows — hairline-separated rows with a labelled distribution bar. The
// top row carries the accent; the rest stay neutral.
export function DistRows({
    rows,
    color = 'var(--rd-accent)',
}: {
    rows: Array<{ name: string; pct: number }>
    color?: string
}) {
    if (rows.length === 0)
        return (
            <p className="m-0 px-[1.15rem] py-6 text-[0.875rem] text-[var(--rd-text-3)]">
                No language data yet.
            </p>
        )
    const max = Math.max(...rows.map((r) => r.pct)) || 1
    return (
        <ul className="m-0 list-none p-0">
            {rows.map((r, i) => (
                <li
                    key={r.name}
                    className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.25rem] items-center gap-3 border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 last:border-b-0"
                >
                    <span className="truncate text-[0.875rem] text-[var(--rd-text)]">
                        {r.name}
                    </span>
                    <span className="rd-meter">
                        <i
                            style={{
                                width: `${(r.pct / max) * 100}%`,
                                background:
                                    i === 0 ? color : 'var(--rd-text-4)',
                            }}
                        />
                    </span>
                    <span className="text-right font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                        {r.pct}%
                    </span>
                </li>
            ))}
        </ul>
    )
}

export default DistRows
