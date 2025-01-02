"use client";
import { BarChart, BarList, DonutChart, Legend } from '@tremor/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { StaticCard } from '@/components/static-card'
import { TextDataSource } from '@/components/text-data-source'

export const metadata = {
    title: '@duyet Coding Insights',
    description: 'Coding Insights data collected from Wakatime.',
}

const WAKA_CODING_ACTIVITY_API =
    'https://wakatime.com/share/@hovanhoa/0d76f73e-d398-4c07-9bc6-781f52986fd8.json'

const WAKA_LANGUAGES_API =
    'https://wakatime.com/share/@hovanhoa/a5217728-f0aa-47b7-a4ea-fbd830e4f96b.json'

const borderClasses = 'border rounded dark:border-gray-800'

export default async function Wakatime() {
    const codingActivity = await getWakaCodingActivity()
    const languages = await getWakaLanguages()
    const top10Languages = languages.slice(0, 10)

    return (
        <div className="mt-10 space-y-6">
            <div className="mb-10">
                <BarChart
                    categories={['Coding Hours']}
                    data={codingActivity}
                    index="range.date"
                />
                <TextDataSource>Wakatime (Last 30 days)</TextDataSource>
            </div>

            <div className={cn('mb-10 p-5')}>
                <div className="flex flex-row flex-wrap items-center gap-10">
                    <div className="basis-full md:basis-1/2">
                        <div className="text-bold mb-4 flex flex-row justify-between">
                            <span className="font-bold">
                                Top 10 languages tracked by Wakatime
                            </span>
                            <span className="font-bold">%</span>
                        </div>
                        <BarList
                            data={top10Languages.map((language) => ({
                                name: language.name,
                                value: language.percent,
                            }))}
                        />
                    </div>

                    <div className="flex grow flex-col items-center">
                        <DonutChart
                            category="percent"
                            className="mb-10 w-44"
                            data={languages}
                            index="name"
                            showLabel
                            variant="pie"
                        />
                        <Legend
                            categories={top10Languages.map(
                                (language) => language.name
                            )}
                            className="w-full md:w-min"
                        />
                    </div>
                </div>

                <TextDataSource>Wakatime (All Times)</TextDataSource>
            </div>

            <StaticCard
                extra={
                    <Image
                        alt="Wakatime"
                        className="mt-3"
                        height={30}
                        src="https://wakatime.com/badge/user/0a407644-11a2-4a9d-b59b-a5e85e3bae3c.svg"
                        unoptimized
                        width={200}
                    />
                }
                source="Wakatime (Last Year)"
                title="Coding Activity Calendar"
                url={{
                    light: 'https://wakatime.com/share/@hovanhoa/0eb457d2-d35a-4eaf-b76a-0fa76610d320.svg',
                    dark: 'https://wakatime.com/share/@hovanhoa/0eb457d2-d35a-4eaf-b76a-0fa76610d320.svg',
                }}
            />
        </div>
    )
}

interface WakaCodingActivity {
    data: {
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
    }[]
}

async function getWakaCodingActivity() {
    const raw = await fetch(WAKA_CODING_ACTIVITY_API)
    const data = ((await raw.json()) as WakaCodingActivity).data

    return data.map((item) => ({
        ...item,
        'Coding Hours': (item.grand_total.total_seconds / 3600).toFixed(1),
    }))
}

interface WakaLanguages {
    data: {
        name: string
        percent: number
        color: string
    }[]
}
async function getWakaLanguages() {
    const raw = await fetch(WAKA_LANGUAGES_API)
    const data = ((await raw.json()) as WakaLanguages).data

    return data
}
