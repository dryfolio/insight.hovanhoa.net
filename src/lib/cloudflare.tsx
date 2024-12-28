import {GET_STATISTIC} from "./queries";
import cloudflareClient from "@/lib/apollo-cloudflare-client";
import {CloudflareAnalyticsByDate, CloudflareRes} from "../../packages/interface/cloudflare";


export const CloudflareGraph = {
    GetStatistic: async (): Promise<any> => {
        try {
            const res: CloudflareRes = await cloudflareClient.query({
                query: GET_STATISTIC,
                variables: {
                    zoneTag: process.env.NEXT_PUBLIC_CLOUDFLARE_ZONE_ID,
                    date_start: new Date(new Date().setDate(new Date().getDate() - 30))
                        .toISOString()
                        .split('T')[0],
                    date_end: new Date().toISOString().split('T')[0],
                },
                fetchPolicy: "no-cache",
            });

            const data = res.data;

            const zone = data.viewer.zones[0]

            const totalRequests = zone.httpRequests1dGroups.reduce(
                (total, i) => total + i.sum.requests,
                0,
            )

            const totalPageviews = zone.httpRequests1dGroups.reduce(
                (total, i) => total + i.sum.pageViews,
                0,
            )

            const generatedAt = new Date().toISOString()

            return {
                data,
                generatedAt,
                totalRequests,
                totalPageviews,
            }
        } catch (error) {
            console.error("[ERROR]", error);
            return error;
        }
    },
};
