import { MetadataRoute } from 'next'
import { INSIGHT_URL, BASE_URL, GALLERY_URL, STATUS_URL, MUSIC_URL } from '@/constants'

const INFO_URL = 'https://info.hovanhoa.net'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: INSIGHT_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${INSIGHT_URL}/wakatime`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${INSIGHT_URL}/cloudflare`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: GALLERY_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: INFO_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: STATUS_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: MUSIC_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}
