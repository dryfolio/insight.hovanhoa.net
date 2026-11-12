// Data side of the WakaTime chapters, kept apart from the views in
// src/app/wakatime.tsx so the /api/insight Worker can import it.
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

export const shortDate = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })

export interface CalendarDay {
    date: string
    hours: number
}

export const MONTHS = [
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
