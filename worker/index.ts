// Cloudflare Worker for insight.hovanhoa.net. Static assets (the Next.js
// export in ./out) are served by Cloudflare directly; only /api/* reaches this
// code (see run_worker_first in wrangler.jsonc).
import { getInsightData } from '../src/lib/insight-data'

type Env = { ASSETS: { fetch: (request: Request) => Promise<Response> } }
type Ctx = { waitUntil: (promise: Promise<unknown>) => void }

// Cloudflare analytics and WakaTime both move in daily steps, so an hour of
// caching per data center keeps the page current without hammering them.
const CACHE_SECONDS = 3600
// Bump to drop payloads already cached at the edge.
const CACHE_KEY = '/api/insight?v=2'

async function insight(request: Request, ctx: Ctx): Promise<Response> {
    const cache = (caches as unknown as { default: Cache }).default
    const cacheKey = new Request(new URL(CACHE_KEY, request.url))
    const cached = await cache.match(cacheKey)
    if (cached) return cached

    const data = await getInsightData()
    // Only cache a full payload, so a failed source is retried on the next
    // request instead of staying empty for an hour.
    const complete =
        data.cloudflare.chartData.length > 0 && data.codingActivity.length > 0
    const res = Response.json(data, {
        headers: {
            'Cache-Control': complete
                ? `public, max-age=${CACHE_SECONDS}`
                : 'no-store',
        },
    })
    if (complete) ctx.waitUntil(cache.put(cacheKey, res.clone()))
    return res
}

export default {
    async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
        const { pathname } = new URL(request.url)
        if (pathname === '/api/insight' && request.method === 'GET') {
            return insight(request, ctx)
        }
        return env.ASSETS.fetch(request)
    },
}
