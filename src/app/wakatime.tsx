import { BarChart } from '@/components/Tremor'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { DistRows } from '@/components/redesign/dist-rows'

const WAKA_CODING_ACTIVITY_API =
    'https://wakatime.com/share/@hovanhoa/0d76f73e-d398-4c07-9bc6-781f52986fd8.json'

const WAKA_LANGUAGES_API =
    'https://wakatime.com/share/@hovanhoa/a5217728-f0aa-47b7-a4ea-fbd830e4f96b.json'

const WAKA_CALENDAR_SVG =
    'https://wakatime.com/share/@hovanhoa/0eb457d2-d35a-4eaf-b76a-0fa76610d320.svg'

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
    const raw = await fetch(WAKA_CODING_ACTIVITY_API)
    const data = (
        (await raw.json()) as {
            data: Omit<WakaActivityPoint, 'Coding Hours'>[]
        }
    ).data

    return data.map((item) => ({
        ...item,
        'Coding Hours': (item.grand_total.total_seconds / 3600).toFixed(1),
    }))
}

export async function getWakaLanguages(): Promise<WakaLanguage[]> {
    const raw = await fetch(WAKA_LANGUAGES_API)
    return ((await raw.json()) as { data: WakaLanguage[] }).data
}

export function CodingHoursChart({ data }: { data: WakaActivityPoint[] }) {
    return (
        <div className="rd-card p-[clamp(18px,2.2vw,26px)]">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <Eyebrow>Coding · WakaTime</Eyebrow>
                    <h3 className="mt-2.5 text-[1.35rem] tracking-[-0.03em]">
                        Hours per day
                    </h3>
                </div>
                <span className="rd-chip font-[family-name:var(--font-mono)] text-[11px]">
                    30d
                </span>
            </div>
            <BarChart
                categories={['Coding Hours']}
                colors={['orange']}
                data={data}
                index="range.date"
                showGridLines={false}
                showLegend={false}
            />
        </div>
    )
}

export function LanguageDist({ languages }: { languages: WakaLanguage[] }) {
    const rows = languages.slice(0, 8).map((language) => ({
        name: language.name,
        pct: Math.round(language.percent * 10) / 10,
    }))

    return (
        <div className="rd-card p-[clamp(18px,2.2vw,26px)]">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <Eyebrow>Languages · WakaTime</Eyebrow>
                    <h3 className="mt-2.5 text-[1.35rem] tracking-[-0.03em]">
                        What I wrote in
                    </h3>
                </div>
                <span className="rd-chip font-[family-name:var(--font-mono)] text-[11px]">
                    all time
                </span>
            </div>
            <DistRows rows={rows} />
        </div>
    )
}

export function CodingCalendar() {
    return (
        <div className="rd-card p-[clamp(18px,2.2vw,26px)]">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <Eyebrow>Activity · WakaTime</Eyebrow>
                    <h3 className="mt-2.5 text-[1.35rem] tracking-[-0.03em]">
                        Coding activity calendar
                    </h3>
                </div>
                <span className="rd-chip font-[family-name:var(--font-mono)] text-[11px]">
                    1y
                </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                alt="Coding activity calendar"
                src={WAKA_CALENDAR_SVG}
                className="h-auto w-full"
            />
        </div>
    )
}
