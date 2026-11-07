// DistRows — hairline-separated rows with a labelled distribution bar. The
// top row carries the accent; the rest stay neutral.
export function DistRows({
    rows,
    color = 'var(--rd-accent)',
    empty = 'No data yet.',
    max: scale,
    highlight = true,
}: {
    rows: Array<{ name: string; pct: number; value?: string }>
    color?: string
    empty?: string
    /** shared bar scale when one list is split across columns */
    max?: number
    /** accent the first row */
    highlight?: boolean
}) {
    if (rows.length === 0)
        return (
            <p className="m-0 px-[1.15rem] py-6 text-[0.875rem] text-[var(--rd-text-3)]">
                {empty}
            </p>
        )
    const max = scale || Math.max(...rows.map((r) => r.pct)) || 1
    const withValue = rows.some((r) => r.value)
    return (
        <ul className="m-0 list-none p-0">
            {rows.map((r, i) => (
                <li
                    key={r.name}
                    className={`grid items-center gap-3 border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 last:border-b-0 ${
                        withValue
                            ? 'grid-cols-[minmax(0,1fr)_3.5rem_3rem_3.25rem] sm:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3rem_3.25rem]'
                            : 'grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.25rem]'
                    }`}
                >
                    <span className="truncate text-[0.875rem] text-[var(--rd-text)]">
                        {r.name}
                    </span>
                    <span className="rd-meter">
                        <i
                            style={{
                                width: `${(r.pct / max) * 100}%`,
                                background:
                                    highlight && i === 0
                                        ? color
                                        : 'var(--rd-text-4)',
                            }}
                        />
                    </span>
                    {withValue && (
                        <span className="text-right font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-2)]">
                            {r.value}
                        </span>
                    )}
                    <span className="text-right font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                        {Math.round(r.pct * 10) / 10}%
                    </span>
                </li>
            ))}
        </ul>
    )
}

export default DistRows
