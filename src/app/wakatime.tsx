import { HoursChart } from '@/components/charts'
import { DistRows } from '@/components/redesign/dist-rows'
import { Panel } from '@/components/panel'
import { EmptyState } from '@/components/empty-state'

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
    }
    'Coding Hours': string
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
            data: Omit<WakaActivityPoint, 'Coding Hours'>[]
        }
    ).data

    // WakaTime answers {"error": ...} while it rebuilds a share — treat as empty
    if (!Array.isArray(data)) return []

    return data.map((item) => ({
        ...item,
        'Coding Hours': (item.grand_total.total_seconds / 3600).toFixed(1),
    }))
}

export async function getWakaLanguages(): Promise<WakaLanguage[]> {
    const raw = await fetch(WAKA_LANGUAGES_API, {
        next: { revalidate: REVALIDATE },
    })
    const data = ((await raw.json()) as { data?: WakaLanguage[] }).data
    return Array.isArray(data) ? data : []
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
        <Panel label="Languages" meta="share of time" flush className="h-full">
            <DistRows rows={rows} />
        </Panel>
    )
}

export function CodingCalendar() {
    return (
        <Panel label="Coding activity calendar" meta="last 12 months">
            <div className="overflow-x-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt="Coding activity calendar"
                    src={`${WAKA_CALENDAR_SVG}?d=${new Date().toISOString().slice(0, 10)}`}
                    className="rd-calendar h-auto w-full min-w-[640px]"
                />
            </div>
        </Panel>
    )
}
