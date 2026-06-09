// DistRows — horizontal labelled distribution bars.
export function DistRows({
    rows,
    color = 'var(--rd-accent)',
}: {
    rows: Array<{ name: string; pct: number }>
    color?: string
}) {
    const max = Math.max(...rows.map((r) => r.pct))
    return (
        <div style={{ display: 'grid', gap: 11 }}>
            {rows.map((r, i) => (
                <div
                    key={i}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 12,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 13,
                                marginBottom: 5,
                            }}
                        >
                            <span
                                className="font-[family-name:var(--font-mono)]"
                                style={{
                                    color: 'var(--rd-text-2)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {r.name}
                            </span>
                            <span
                                className="font-[family-name:var(--font-mono)] text-[var(--rd-text-3)]"
                                style={{ fontSize: 12 }}
                            >
                                {r.pct}%
                            </span>
                        </div>
                        <div className="rd-meter">
                            <i
                                style={{
                                    width: `${(r.pct / max) * 100}%`,
                                    background:
                                        i === 0 ? color : 'var(--rd-text-3)',
                                    opacity: i === 0 ? 1 : 0.55,
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DistRows
