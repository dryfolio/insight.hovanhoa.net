import { AreaChart, Flex, Metric, Text } from '@tremor/react'
import {CloudflareAnalyticsByDate} from "../../packages/interface/cloudflare";
import {CloudflareGraph} from "@/lib/cloudflare";


export interface CloudflareProps {
  data: CloudflareAnalyticsByDate
  totalRequests: number
  totalPageviews: number
  generatedAt: string
}

async function dataFormatter(number: number) {
  return Intl.NumberFormat('us').format(number).toString()
}

export async function Cloudflare() {
  const { data, generatedAt, totalRequests, totalPageviews } = await CloudflareGraph.GetStatistic()

  const chartData = data.viewer.zones[0]?.httpRequests1dGroups?.map((item: { date: { date: any; }; sum: { pageViews: any; requests: any; }; uniq: { uniques: any; }; }) => {
    return {
      date:  item.date.date,
      'Page Views': item.sum.pageViews,
      Requests: item.sum.requests,
      'Unique Visitors': item.uniq.uniques,
    }
  })

  const cards = [
    {
      title: 'Total Requests',
      value: await dataFormatter(totalRequests || 0),
      valueDesc: 'in 30 days',
    },
    {
      title: 'Total Page views',
      value: await dataFormatter(totalPageviews || 0),
      valueDesc: 'in 30 days',
    },
  ]

  return (
      <div className="w-1/2 mt-15 mx-auto">
        <Flex className="mb-10">
          {cards.map((card) => (
              <div key={card.title}>
                <Text className="text-gray-500 text-sm">{card.title}</Text>
                <Flex
                    alignItems="baseline"
                    className="space-x-3"
                    justifyContent="start"
                >
                  <Metric className="text-black text-2xl">{card.value}</Metric>
                  <Text className="mt-2 truncate text-gray-500">{card.valueDesc}</Text>
                </Flex>
              </div>
          ))}
        </Flex>
          <AreaChart
              className="hidden h-80 sm:block"
              data={chartData}
              index="date"
              categories={['Requests', 'Page Views', 'Unique Visitors']}
              colors={["blue", "teal", "violet"]}
              showGridLines={false}
              showYAxis={false}
              showLegend={true}
              showAnimation={true}
          />
        </div>
  )
}
