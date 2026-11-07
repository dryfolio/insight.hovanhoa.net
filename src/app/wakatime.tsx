import { HoursChart } from '@/components/charts'
import { DistRows } from '@/components/redesign/dist-rows'
import { Panel } from '@/components/panel'
import { EmptyState } from '@/components/empty-state'
import { SplitBar } from '@/components/redesign/split-bar'
import { formatCompact, formatNumber, formatPercent } from '@/lib/utils'

const WAKA_CODING_ACTIVITY_API =
    'https://wakatime.com/share/@hovanhoa/0d76f73e-d398-4c07-9bc6-781f52986fd8.json'

const WAKA_LANGUAGES_API =
    'https://wakatime.com/share/@hovanhoa/a5217728-f0aa-47b7-a4ea-fbd830e4f96b.json'

const WAKA_CALENDAR_SVG =
    'https://wakatime.com/share/@hovanhoa/0eb457d2-d35a-4eaf-b76a-0fa76610d320.svg'

const REVALIDATE = 86400

export interface WakaActivityPoint {
    range: {
        start: string
        end: string
        date: string
        text: string
        timezone: string
    }
    grand_total: {
        hours: number
        minutes: number
        total_seconds: number
        digital: string
        text: string
        ai_additions?: number
        human_additions?: number
        ai_sessions?: number
        ai_prompt_events_total?: number
        ai_output_tokens?: number
        ai_model_breakdown?: { name: string; lines: number }[]
    }
    'Coding Hours': string
    day: string
}

export interface WakaLanguage {
    name: string
    percent: number
    color: string
}

export async function getWakaCodingActivity(): Promise<WakaActivityPoint[]> {
    const raw = await fetch(WAKA_CODING_ACTIVITY_API, {
        next: { revalidate: REVALIDATE },
    })
    const data = (
        (await raw.json()) as {
            data: Omit<WakaActivityPoint, 'Coding Hours' | 'day'>[]
        }
    ).data

    // WakaTime answers {"error": ...} while it rebuilds a share — treat as empty
    if (!Array.isArray(data)) return []

    return data.map((item) => ({
        ...item,
        'Coding Hours': (item.grand_total.total_seconds / 3600).toFixed(1),
        day: shortDate(item.range.date),
    }))
}

export async function getWakaLanguages(): Promise<WakaLanguage[]> {
    const raw = await fetch(WAKA_LANGUAGES_API, {
        next: { revalidate: REVALIDATE },
    })
    const data = ((await raw.json()) as { data?: WakaLanguage[] }).data
    return Array.isArray(data) ? data : []
}

export interface CodingSummary {
    totalHours: number
    activeDays: number
    days: number
    longestStreak: number
    best: { date: string; hours: number } | null
    /** average hours per weekday, Monday first */
    weekdays: { day: string; hours: number }[]
    ai: {
        aiLines: number
        humanLines: number
        sessions: number
        prompts: number
        outputTokens: number
        models: { name: string; lines: number }[]
    }
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function summarizeCoding(data: WakaActivityPoint[]): CodingSummary {
    const hours = data.map((d) => d.grand_total.total_seconds / 3600)
    let longestStreak = 0
    let run = 0
    for (const h of hours) {
        run = h > 0 ? run + 1 : 0
        longestStreak = Math.max(longestStreak, run)
    }

    let best: CodingSummary['best'] = null
    const byWeekday = WEEKDAYS.map(() => ({ sum: 0, n: 0 }))
    const models = new Map<string, number>()
    const ai = {
        aiLines: 0,
        humanLines: 0,
        sessions: 0,
        prompts: 0,
        outputTokens: 0,
    }

    data.forEach((d, i) => {
        if (!best || hours[i] > best.hours)
            best = { date: d.range.date, hours: hours[i] }
        // range.date is a local calendar day; getUTCDay keeps it tz-proof
        const wd = (new Date(`${d.range.date}T00:00:00Z`).getUTCDay() + 6) % 7
        byWeekday[wd].sum += hours[i]
        byWeekday[wd].n += 1

        const g = d.grand_total
        ai.aiLines += g.ai_additions ?? 0
        ai.humanLines += g.human_additions ?? 0
        ai.sessions += g.ai_sessions ?? 0
        ai.prompts += g.ai_prompt_events_total ?? 0
        ai.outputTokens += g.ai_output_tokens ?? 0
        for (const m of g.ai_model_breakdown ?? [])
            models.set(m.name, (models.get(m.name) ?? 0) + m.lines)
    })

    return {
        totalHours: hours.reduce((a, b) => a + b, 0),
        activeDays: hours.filter((h) => h > 0).length,
        days: hours.length,
        longestStreak,
        best,
        weekdays: WEEKDAYS.map((day, i) => ({
            day,
            hours: byWeekday[i].n ? byWeekday[i].sum / byWeekday[i].n : 0,
        })),
        ai: {
            ...ai,
            models: Array.from(models, ([name, lines]) => ({ name, lines }))
                .filter((m) => m.lines > 0)
                .sort((a, b) => b.lines - a.lines),
        },
    }
}

const shortDate = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })

function MiniStat({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-[var(--rd-text-3)]">
                {k}
            </span>
            <span className="text-[1.05rem] font-medium leading-none tracking-[-0.02em] text-[var(--rd-text)]">
                {v}
            </span>
        </div>
    )
}

export function CodingRhythm({ summary }: { summary: CodingSummary }) {
    const max = Math.max(...summary.weekdays.map((w) => w.hours)) || 1
    const peak = summary.weekdays.reduce((a, b) => (b.hours > a.hours ? b : a))
    return (
        <Panel
            label="Weekly rhythm"
            meta="avg hours by weekday"
            className="h-full"
        >
            {summary.days ? (
                <>
                    <div className="flex h-36 items-end gap-2">
                        {summary.weekdays.map((w) => (
                            <div
                                key={w.day}
                                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                            >
                                <span className="font-[family-name:var(--font-mono)] text-[0.66rem] text-[var(--rd-text-3)]">
                                    {formatNumber(
                                        Math.round(w.hours * 10) / 10
                                    )}
                                </span>
                                <span
                                    className="w-full max-w-[2.25rem] rounded-[6px]"
                                    style={{
                                        height: `${Math.max((w.hours / max) * 100, 2)}%`,
                                        background:
                                            w.day === peak.day
                                                ? 'var(--rd-accent)'
                                                : 'var(--rd-surface-2)',
                                        boxShadow:
                                            w.day === peak.day
                                                ? undefined
                                                : 'inset 0 0 0 1px var(--rd-border)',
                                    }}
                                />
                                <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-[var(--rd-text-2)]">
                                    {w.day}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--rd-line)] pt-4">
                        <MiniStat
                            k="active days"
                            v={`${summary.activeDays}/${summary.days}`}
                        />
                        <MiniStat
                            k="longest streak"
                            v={`${summary.longestStreak}d`}
                        />
                        <MiniStat
                            k={
                                summary.best
                                    ? `best · ${shortDate(summary.best.date)}`
                                    : 'best day'
                            }
                            v={
                                summary.best
                                    ? `${formatNumber(Math.round(summary.best.hours * 10) / 10)}h`
                                    : '—'
                            }
                        />
                    </div>
                </>
            ) : (
                <EmptyState>No coding activity recorded yet.</EmptyState>
            )}
        </Panel>
    )
}

export function AiAuthorship({ summary }: { summary: CodingSummary }) {
    const { ai } = summary
    return (
        <Panel
            label="Who wrote the lines"
            meta="added lines"
            className="h-full"
        >
            <SplitBar
                segments={[
                    {
                        name: 'ai',
                        label: 'AI-assisted',
                        value: ai.aiLines,
                        color: 'var(--rd-accent)',
                    },
                    {
                        name: 'human',
                        label: 'Typed by hand',
                        value: ai.humanLines,
                        color: 'var(--rd-text-4)',
                    },
                ]}
            />
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--rd-line)] pt-4">
                <MiniStat k="AI sessions" v={formatNumber(ai.sessions)} />
                <MiniStat k="prompts" v={formatNumber(ai.prompts)} />
                <MiniStat
                    k="output tokens"
                    v={formatCompact(ai.outputTokens)}
                />
            </div>
        </Panel>
    )
}

export function AiModels({ summary }: { summary: CodingSummary }) {
    const total = summary.ai.models.reduce((a, m) => a + m.lines, 0)
    return (
        <Panel label="Models" meta="AI lines by model" flush className="h-full">
            <DistRows
                rows={summary.ai.models.slice(0, 6).map((m) => ({
                    name: m.name === 'Default' ? 'Unattributed' : m.name,
                    pct: total ? (m.lines / total) * 100 : 0,
                    value: formatCompact(m.lines),
                }))}
                empty="No AI-assisted lines recorded yet."
            />
        </Panel>
    )
}

export const aiShare = (s: CodingSummary) => {
    const total = s.ai.aiLines + s.ai.humanLines
    return total ? s.ai.aiLines / total : 0
}

export function CodingHoursChart({ data }: { data: WakaActivityPoint[] }) {
    return (
        <Panel label="Hours per day" meta="last 30 days" className="h-full">
            {data.length ? (
                <HoursChart
                    data={data as unknown as Record<string, unknown>[]}
                />
            ) : (
                <EmptyState>No coding activity recorded yet.</EmptyState>
            )}
        </Panel>
    )
}

export function LanguageDist({ languages }: { languages: WakaLanguage[] }) {
    const rows = languages.slice(0, 8).map((language) => ({
        name: language.name,
        pct: Math.round(language.percent * 10) / 10,
    }))

    return (
        <Panel label="Languages" meta="share of time" flush>
            {rows.length ? (
                <div className="grid min-[760px]:grid-cols-2 min-[760px]:divide-x min-[760px]:divide-[var(--rd-line)]">
                    <DistRows rows={rows.slice(0, 4)} max={rows[0].pct} />
                    <div className="border-t border-[var(--rd-line)] min-[760px]:border-t-0">
                        <DistRows
                            rows={rows.slice(4)}
                            max={rows[0].pct}
                            highlight={false}
                        />
                    </div>
                </div>
            ) : (
                <DistRows rows={[]} empty="No language data yet." />
            )}
        </Panel>
    )
}

export interface CalendarDay {
    date: string
    hours: number
}

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

// "7 hrs 24 mins 41 secs" -> hours
const parseDuration = (text: string) => {
    const unit = (re: RegExp) => Number(text.match(re)?.[1] ?? 0)
    return (
        unit(/(\d+) hrs?/) +
        unit(/(\d+) mins?/) / 60 +
        unit(/(\d+) secs?/) / 3600
    )
}

// WakaTime only shares the year calendar as an SVG, but every cell carries
// a "<duration> of coding on <Mon D YYYY>" title — parse those into days.
export async function getWakaCalendar(): Promise<CalendarDay[]> {
    try {
        const raw = await fetch(WAKA_CALENDAR_SVG, {
            next: { revalidate: REVALIDATE },
        })
        const svg = await raw.text()
        const days: CalendarDay[] = []
        for (const m of Array.from(
            svg.matchAll(
                /<title>(.*?) of coding on (\w{3}) (\d{1,2}) (\d{4})<\/title>/g
            )
        )) {
            const month = MONTHS.indexOf(m[2]) + 1
            if (!month) continue
            days.push({
                date: `${m[4]}-${String(month).padStart(2, '0')}-${m[3].padStart(2, '0')}`,
                hours: parseDuration(m[1]),
            })
        }
        return days.sort((a, b) => a.date.localeCompare(b.date))
    } catch {
        return []
    }
}

// hour thresholds for the five shades; level 0 is "no real coding"
const LEVELS = [0.25, 2, 4, 6]
const SHADES = [
    'var(--rd-surface-2)',
    'color-mix(in srgb, var(--rd-accent) 25%, var(--rd-surface-2))',
    'color-mix(in srgb, var(--rd-accent) 50%, var(--rd-surface-2))',
    'color-mix(in srgb, var(--rd-accent) 75%, var(--rd-surface-2))',
    'var(--rd-accent)',
]
const level = (h: number) => LEVELS.filter((t) => h >= t).length

const CELL = 10
const GAP = 3
const STEP = CELL + GAP
const LEFT = 30
const TOP = 18

// HeatmapSvg — Monday-first week columns of day cells, scaled to its box.
function HeatmapSvg({
    days,
    label,
    className = '',
}: {
    days: CalendarDay[]
    label: string
    className?: string
}) {
    const weekday = (d: string) =>
        (new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7
    const lead = weekday(days[0].date)
    const cells = days.map((d, i) => ({
        ...d,
        col: Math.floor((i + lead) / 7),
        row: (i + lead) % 7,
    }))
    const weeks = cells[cells.length - 1].col + 1
    const width = LEFT + weeks * STEP - GAP
    const height = TOP + 7 * STEP - GAP

    const monthLabels = cells.filter(
        (c, i) => c.date.endsWith('-01') || (i === 0 && c.row === 0)
    )

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className={`block h-auto w-full ${className}`}
            role="img"
            aria-label={label}
        >
            {monthLabels.map((c) => (
                <text
                    key={c.date}
                    x={LEFT + c.col * STEP}
                    y={10}
                    className="fill-[var(--rd-text-3)] font-[family-name:var(--font-mono)] text-[9px]"
                >
                    {MONTHS[Number(c.date.slice(5, 7)) - 1]}
                </text>
            ))}
            {['Mon', 'Wed', 'Fri'].map((d, i) => (
                <text
                    key={d}
                    x={0}
                    y={TOP + i * 2 * STEP + CELL - 2}
                    className="fill-[var(--rd-text-3)] font-[family-name:var(--font-mono)] text-[9px]"
                >
                    {d}
                </text>
            ))}
            {cells.map((c) => (
                <rect
                    key={c.date}
                    x={LEFT + c.col * STEP}
                    y={TOP + c.row * STEP}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                    fill={SHADES[level(c.hours)]}
                >
                    <title>
                        {`${shortDate(c.date)}, ${c.date.slice(0, 4)} · ${formatNumber(Math.round(c.hours * 10) / 10)}h`}
                    </title>
                </rect>
            ))}
        </svg>
    )
}

export function CodingCalendar({ days }: { days: CalendarDay[] }) {
    if (!days.length)
        return (
            <Panel label="The past year" meta="daily coding hours">
                <EmptyState>
                    The yearly calendar is unavailable right now.
                </EmptyState>
            </Panel>
        )

    const coded = days.filter((d) => d.hours >= LEVELS[0])
    const total = days.reduce((a, d) => a + d.hours, 0)
    let streak = 0
    let run = 0
    for (const d of days) {
        run = d.hours >= LEVELS[0] ? run + 1 : 0
        streak = Math.max(streak, run)
    }
    const summaryLabel = `Daily coding hours over the past year: ${Math.round(total)} hours across ${coded.length} days`

    return (
        <Panel
            label="The past year"
            meta={`${shortDate(days[0].date)} – ${shortDate(days[days.length - 1].date)}`}
        >
            <div className="grid gap-x-6 min-[900px]:grid-cols-[minmax(0,1fr)_11rem] min-[900px]:items-center">
                <div className="min-w-0">
                    <HeatmapSvg
                        days={days}
                        label={summaryLabel}
                        className="max-[639px]:hidden"
                    />
                    {/* phones get the last 26 weeks so cells stay legible */}
                    <HeatmapSvg
                        days={days.slice(-182)}
                        label={summaryLabel}
                        className="min-[640px]:hidden"
                    />
                    <div className="mb-5 mt-3 flex min-[900px]:mb-0 items-center justify-end gap-1.5 font-[family-name:var(--font-mono)] text-[0.66rem] text-[var(--rd-text-3)]">
                        <span className="mr-1">0h</span>
                        {SHADES.map((shade) => (
                            <span
                                key={shade}
                                className="h-2.5 w-2.5 rounded-[3px]"
                                style={{ background: shade }}
                            />
                        ))}
                        <span className="ml-1">6h+</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-[var(--rd-line)] pt-4 min-[560px]:grid-cols-4 min-[900px]:grid-cols-1 min-[900px]:border-l min-[900px]:border-t-0 min-[900px]:pl-6 min-[900px]:pt-0">
                    <MiniStat
                        k="hours this year"
                        v={`${formatNumber(Math.round(total))}h`}
                    />
                    <MiniStat
                        k="days coded"
                        v={`${coded.length}/${days.length}`}
                    />
                    <MiniStat
                        k="avg / coded day"
                        v={`${formatNumber(Math.round((total / Math.max(coded.length, 1)) * 10) / 10)}h`}
                    />
                    <MiniStat k="longest streak" v={`${streak}d`} />
                </div>
            </div>
        </Panel>
    )
}
