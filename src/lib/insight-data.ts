import { getCloudflareData, type CloudflareData } from '@/lib/cloudflare-data'
import {
    getWakaCalendar,
    getWakaCodingActivity,
    getWakaLanguages,
    type CalendarDay,
    type WakaActivityPoint,
    type WakaLanguage,
} from '@/lib/wakatime-data'

export interface InsightData {
    cloudflare: CloudflareData
    codingActivity: WakaActivityPoint[]
    languages: WakaLanguage[]
    calendar: CalendarDay[]
}

// Everything the report renders, in one payload: used for the build-time
// render and by the /api/insight Worker (worker/index.ts).
export async function getInsightData(): Promise<InsightData> {
    const [cloudflare, codingActivity, languages, calendar] = await Promise.all(
        [
            getCloudflareData(),
            getWakaCodingActivity(),
            getWakaLanguages(),
            getWakaCalendar(),
        ]
    )
    return { cloudflare, codingActivity, languages, calendar }
}
