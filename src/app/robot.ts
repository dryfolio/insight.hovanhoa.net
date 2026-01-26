import { BASE_URL, INSIGHT_URL } from "@/constants";
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${INSIGHT_URL}/sitemap.xml`,
    host: INSIGHT_URL,
  };
}
