'use client'

import { useId } from 'react'

// Sparkline — tiny inline-SVG sparkline chart.
export function Sparkline({
    data,
    h = 38,
    stroke = 'var(--rd-accent)',
    fill = true,
}: {
    data: number[]
    h?: number
    stroke?: string
    fill?: boolean
}) {
    // Stable id across SSR + client so the gradient ref doesn't cause a
    // hydration mismatch (Math.random() would differ between passes).
    const reactId = useId()
    if (data.length < 2) return <div style={{ height: h }} />
    const w = 120
    const max = Math.max(...data)
    const min = Math.min(...data)
    const rng = max - min || 1
    const step = w / (data.length - 1)
    const pts = data.map(
        (v, i) => [i * step, h - ((v - min) / rng) * (h - 4) - 2] as const
    )
    const line = pts
        .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
        .join(' ')
    const area = `${line} L${w} ${h} L0 ${h} Z`
    const gid = `sg${reactId.replace(/:/g, '')}`

    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: h, display: 'block' }}
        >
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={stroke} stopOpacity="0.16" />
                    <stop offset="1" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
            </defs>
            {fill && <path d={area} fill={`url(#${gid})`} />}
            <path
                d={line}
                fill="none"
                stroke={stroke}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

export default Sparkline
