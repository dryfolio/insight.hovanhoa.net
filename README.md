# insight.hovanhoa.net

A personal analytics dashboard built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. It aggregates data from three external services — Cloudflare Analytics, Hashnode, and WakaTime — and displays them with Tremor charts.

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + Tremor design system
- Charts: Tremor / Recharts
- CMS: Hashnode Headless CMS
- Deployment: Vercel

## Data Sources

| Source | Client | Purpose |
|--------|--------|---------|
| Cloudflare Analytics | Apollo GraphQL (`src/lib/apollo-cloudflare-client.tsx`) | Web traffic stats |
| Hashnode | Apollo GraphQL (`src/lib/apollo-client.ts`) | Blog post data |
| WakaTime | Direct HTTP fetch | Coding activity |

GraphQL queries are defined in `src/lib/queries.ts`. Cloudflare API logic lives in `src/lib/cloudflare.tsx`.

## Running Locally

This application requires Node.js v18+.

```bash
git clone git@github.com:dryfolio/insight.hovanhoa.net.git
cd insight.hovanhoa.net
npm install
npm run dev
```

Create a `.env` file in the project root with the following variables:

```bash
NEXT_PUBLIC_HASHNODE_API_URL=
NEXT_PUBLIC_HASHNODE_API_KEY=
NEXT_PUBLIC_HASHNODE_HOST=
NEXT_PUBLIC_CLOUDFLARE_API_URL=
NEXT_PUBLIC_CLOUDFLARE_API_KEY=
NEXT_PUBLIC_CLOUDFLARE_ZONE_ID=
```

You can edit the information in `src/constants/index.tsx` to change the content of the website — personal info, URLs, API endpoints, and social links are all imported from this file.

## Commands

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run start         # Start production server
npm run lint           # ESLint
npm run format         # Prettier (write)
npm run format-check   # Prettier (check only)
```

## Architecture Notes

- All page data is fetched in async Server Components (no `useEffect` data fetching).
- ISR revalidation is set to `revalidate = 86400` (24 hours) on data-fetching components.
- Suspense boundaries wrap each data section with skeleton fallbacks (`src/components/skeleton-card.tsx`).
- `"use client"` is only used for Tremor chart wrappers (`src/components/Tremor.tsx`), since Recharts requires a browser environment.
- SEO routes: `src/app/sitemap.ts` (dynamic XML sitemap), `src/app/robot.ts` (robots.txt), `src/app/llms.txt/route.ts` (LLM metadata endpoint).

## License

Feel free to use this code for your own portfolio. But please do not copy it directly, and make sure to replace the info in `src/constants/index.tsx` with your own information.

Crediting the author is appreciated but not required :)

## Acknowledgement

The portfolio design is inspired by [LogWatch](https://logwatch.vercel.app/). Credit for the post card design on the home page goes to its creator.
