# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format-check # Prettier (check only)
```

## Architecture

This is a **personal analytics dashboard** built with Next.js 14 App Router. It aggregates data from three external services and displays them via Tremor charts.

### Data Sources

| Source | Client | Purpose |
|--------|--------|---------|
| Cloudflare Analytics | Apollo GraphQL (`src/lib/apollo-cloudflare-client.tsx`) | Web traffic stats |
| Hashnode | Apollo GraphQL (`src/lib/apollo-client.ts`) | Blog post data |
| WakaTime | Direct HTTP fetch | Coding activity |

All GraphQL queries are defined in `src/lib/queries.ts`. Cloudflare API logic lives in `src/lib/cloudflare.tsx`.

### Rendering Strategy

- All page data is fetched in **async Server Components** (no `useEffect` data fetching)
- ISR revalidation: `revalidate = 86400` (24 hours) on data-fetching components
- **Suspense boundaries** wrap each data section with skeleton fallbacks (`src/components/skeleton-card.tsx`)
- `"use client"` is only used for Tremor chart wrappers (`src/components/Tremor.tsx`) since Recharts requires a browser environment

### Key Files

- `src/constants/index.tsx` — All site configuration: personal info, URLs, API endpoints, social links
- `src/app/page.tsx` — Main dashboard page composing all data sections
- `src/app/cloudflare.tsx` and `src/app/wakatime.tsx` — Top-level server components for each data source
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Styling

- Tailwind CSS with Tremor's design system extensions (colors, shadows, borders)
- Prettier config: no semicolons, single quotes, 4-space indent
- Primary color: `#0ea5e9` (sky blue / Tailwind `sky-500`)

### SEO Routes

- `src/app/sitemap.ts` — Dynamic XML sitemap
- `src/app/robot.ts` — robots.txt
- `src/app/llms.txt/route.ts` — LLM metadata endpoint
