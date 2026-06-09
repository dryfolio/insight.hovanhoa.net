import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Thousands-separated integer, e.g. 1234 -> "1,234". */
export function formatNumber(value: number): string {
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
        value || 0
    )
}

/** Compact notation, e.g. 12_300 -> "12.3K", 4_500_000 -> "4.5M". */
export function formatCompact(value: number): string {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value || 0)
}

/**
 * Percentage change of the most recent half of a series vs the prior half,
 * formatted with a leading sign (e.g. "+3.1%"). Returns "0%" when there is
 * not enough data or the prior window is empty (avoids NaN/Infinity).
 */
export function computeTrend(series: number[]): string {
    if (!series || series.length < 2) return '0%'
    const half = Math.floor(series.length / 2)
    const prev = series.slice(0, half).reduce((a, b) => a + (b || 0), 0)
    const recent = series.slice(half).reduce((a, b) => a + (b || 0), 0)
    if (prev === 0) return recent > 0 ? '+100%' : '0%'
    const pct = ((recent - prev) / prev) * 100
    const sign = pct >= 0 ? '+' : ''
    return `${sign}${pct.toFixed(1)}%`
}
