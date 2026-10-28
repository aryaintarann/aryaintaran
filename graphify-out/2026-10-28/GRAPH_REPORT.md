# Graph Report - aryaintaran  (2026-10-28)

## Corpus Check
- 64 files · ~25,282 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 336 nodes · 634 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fff936fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App Config & Shell
- About Detail Pages
- Admin Dashboard
- devDependencies
- dependencies
- Root Layout & Analytics
- shadcn Config
- Auth & Messages API
- TypeScript Config
- News Cron & Supabase
- Contact & UI Primitives
- Dependency Overrides
- package.json
- OpenGraph Image
- NPM Scripts
- overrides
- CVA
- PostCSS
- Vercel Cron
- eslint.config.mjs
- scripts
- react-dom@19.2.3

## God Nodes (most connected - your core abstractions)
1. `next` - 35 edges
2. `react` - 21 edges
3. `getContent()` - 18 edges
4. `lucide-react` - 16 edges
5. `compilerOptions` - 16 edges
6. `useContent()` - 15 edges
7. `@gsap/react` - 11 edges
8. `gsap` - 11 edges
9. `isValidAdminToken()` - 11 edges
10. `AboutEditor()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getContent()`  [EXTRACTED]
  src/app/about/career/[index]/page.tsx → src/lib/content.ts
- `CareerDetailPage()` --calls--> `getContent()`  [EXTRACTED]
  src/app/about/career/[index]/page.tsx → src/lib/content.ts
- `generateMetadata()` --calls--> `getContent()`  [EXTRACTED]
  src/app/about/education/[index]/page.tsx → src/lib/content.ts
- `EducationDetailPage()` --calls--> `getContent()`  [EXTRACTED]
  src/app/about/education/[index]/page.tsx → src/lib/content.ts
- `AboutPage()` --calls--> `getContent()`  [EXTRACTED]
  src/app/about/page.tsx → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (22 total, 5 thin omitted)

### Community 0 - "App Config & Shell"
Cohesion: 0.13
Nodes (27): gsap, @gsap/react, lucide-react, react, ProjectsPage(), ProjectDetailPage(), TYPE_COLORS, TYPE_LABELS (+19 more)

### Community 1 - "About Detail Pages"
Cohesion: 0.07
Nodes (26): CareerDetailPage(), dynamic, generateMetadata(), Props, dynamic, EducationDetailPage(), generateMetadata(), Props (+18 more)

### Community 2 - "Admin Dashboard"
Cohesion: 0.13
Nodes (29): AboutEditor(), AddBtn(), AdminDashboard(), ContactEditor(), Field(), HeroEditor(), InboxViewer, NAV (+21 more)

### Community 3 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, shadcn@^3.8.5, tailwindcss@^4, tw-animate-css@^1.4.0, @types/node@^20, @types/react@^19, @types/react-dom@^19, typescript@^5 (+7 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, gsap@^3.14.2, @gsap/react@^2.1.2, lucide-react@^0.575.0, @marsidev/react-turnstile@^1.4.2, next@^16.4.3, radix-ui@^1.4.3, react@19.2.3 (+10 more)

### Community 5 - "Root Layout & Analytics"
Cohesion: 0.15
Nodes (13): @vercel/analytics@^2.0.1, @vercel/speed-insights@^2.0.0, @vercel/analytics, @vercel/speed-insights, jsonLd, metadata, RootLayout(), spaceGrotesk (+5 more)

### Community 6 - "shadcn Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 7 - "Auth & Messages API"
Cohesion: 0.14
Nodes (24): isValidPassword(), POST(), isObj(), isStr(), isStrArr(), isTimelineItem(), isValidContent(), POST() (+16 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "News Cron & Supabase"
Cohesion: 0.22
Nodes (10): fast-xml-parser@^5.11.2, @google/generative-ai@^0.24.1, fast-xml-parser, @google/generative-ai, extractCoverImage(), fetchFeed(), genAI, GET() (+2 more)

### Community 10 - "Contact & UI Primitives"
Cohesion: 0.08
Nodes (24): nextConfig, @supabase/supabase-js@^2.98.0, next, @supabase/supabase-js, metadata, metadata, NewsPortal(), revalidate (+16 more)

### Community 11 - "Dependency Overrides"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "package.json"
Cohesion: 0.18
Nodes (10): browserslist, class-variance-authority@^0.7.1, clsx@^2.1.1, @tailwindcss/postcss@^4, name, private, version, class-variance-authority (+2 more)

### Community 13 - "OpenGraph Image"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 15 - "overrides"
Cohesion: 0.29
Nodes (7): overrides, brace-expansion, express-rate-limit, flatted, hono, @hono/node-server, picomatch

### Community 19 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.1, eslint, eslint-config-next

### Community 20 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Contact & UI Primitives` to `App Config & Shell`, `About Detail Pages`, `Admin Dashboard`, `dependencies`, `Root Layout & Analytics`, `Auth & Messages API`, `News Cron & Supabase`, `package.json`, `OpenGraph Image`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Should `App Config & Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.12804878048780488 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App Config & Shell` to `Admin Dashboard`, `dependencies`, `Root Layout & Analytics`, `Contact & UI Primitives`, `package.json`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `About Detail Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07422402159244265 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App Config & Shell` to `About Detail Pages`, `Admin Dashboard`, `dependencies`, `Contact & UI Primitives`, `package.json`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Admin Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.1319073083778966 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._