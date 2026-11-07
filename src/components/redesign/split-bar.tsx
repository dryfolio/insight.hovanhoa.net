import { formatCompact, formatPercent } from '@/lib/utils'

export interface Segment {
    name: string
    label: string
    value: number
    color: string
}

// SplitBar — one 100% stacked bar with a legend underneath. For "how is the
// whole divided" questions (status classes, protocols, AI vs. human lines).
export function SplitBar({ segments }: { segments: Segment[] }) {
    const total = segments.reduce((a, s) => a + s.value, 0)
    if (!total)
        return (
            <p className="m-0 py-4 text-[0.875rem] text-[var(--rd-text-3)]">
                No data yet.
            </p>
        )
    return (
        <div>
            <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-full">
                {segments
                    .filter((s) => s.value > 0)
                    .map((s) => (
                        <span
                            key={s.name}
                            title={`${s.label} · ${formatPercent(s.value / total)}`}
                            style={{
                                width: `${(s.value / total) * 100}%`,
                                minWidth: 3,
                                background: s.color,
                            }}
                        />
                    ))}
            </div>
            <ul className="m-0 mt-4 grid list-none gap-2.5 p-0">
                {segments.map((s) => (
                    <li
                        key={s.name}
                        className="grid grid-cols-[0.6rem_minmax(0,1fr)_auto_3.5rem] items-center gap-2.5 text-[0.875rem]"
                    >
                        <span
                            aria-hidden
                            className="h-2 w-2 rounded-full"
                            style={{ background: s.color }}
                        />
                        <span className="truncate text-[var(--rd-text)]">
                            {s.label}
                            {s.label !== s.name && (
                                <span className="ml-2 font-[family-name:var(--font-mono)] text-[0.7rem] text-[var(--rd-text-3)]">
                                    {s.name}
                                </span>
                            )}
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-2)]">
                            {formatCompact(s.value)}
                        </span>
                        <span className="text-right font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                            {formatPercent(s.value / total)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SplitBar
