# Graph Report - aryaintaran  (2026-10-28)

## Corpus Check
- 67 files · ~26,099 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 357 nodes · 681 edges · 26 communities (16 shown, 10 thin omitted)
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
- class-variance-authority
- shadcn Config
- Auth & Messages API
- TypeScript Config
- @google/generative-ai
- app/layout.tsx
- Dependency Overrides
- ContactSection.tsx
- OpenGraph Image
- NPM Scripts
- overrides
- CVA
- PostCSS
- Vercel Cron
- eslint.config.mjs
- scripts
- react-dom@19.2.3
- admin/layout.tsx
- projects/layout.tsx
- react-markdown
- @vercel/speed-insights

## God Nodes (most connected - your core abstractions)
1. `next` - 36 edges
2. `react` - 21 edges
3. `getContent()` - 19 edges
4. `lucide-react` - 16 edges
5. `compilerOptions` - 16 edges
6. `useContent()` - 15 edges
7. `isAdminRequest()` - 13 edges
8. `@gsap/react` - 11 edges
9. `gsap` - 11 edges
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

## Communities (26 total, 10 thin omitted)

### Community 0 - "App Config & Shell"
Cohesion: 0.09
Nodes (33): nextConfig, gsap, @gsap/react, lucide-react, next, react, Home(), metadata (+25 more)

### Community 1 - "About Detail Pages"
Cohesion: 0.06
Nodes (38): sanitize-html@^2.18.1, sanitize-html, CareerDetailPage(), dynamic, generateMetadata(), Props, dynamic, EducationDetailPage() (+30 more)

### Community 2 - "Admin Dashboard"
Cohesion: 0.13
Nodes (29): AboutEditor(), AddBtn(), AdminDashboard(), ContactEditor(), Field(), HeroEditor(), InboxViewer, NAV (+21 more)

### Community 3 - "devDependencies"
Cohesion: 0.12
Nodes (23): browserslist, devDependencies, shadcn@^4.23.0, tailwindcss@^4, @tailwindcss/postcss@^4, tw-animate-css@^1.4.0, @types/node@^20, @types/react@^19 (+15 more)

### Community 4 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, clsx@^2.1.1, fast-xml-parser@^5.11.2, gsap@^3.14.2, @gsap/react@^2.1.2, lucide-react@^0.575.0, @marsidev/react-turnstile@^1.4.2, next@^16.4.3 (+12 more)

### Community 5 - "class-variance-authority"
Cohesion: 0.33
Nodes (4): class-variance-authority@^0.7.1, @vercel/analytics@^2.0.1, class-variance-authority, @vercel/analytics

### Community 6 - "shadcn Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 7 - "Auth & Messages API"
Cohesion: 0.10
Nodes (33): DELETE(), GET(), isValidPassword(), POST(), extractCoverImage(), fetchFeed(), genAI, GET() (+25 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.11
Nodes (19): @supabase/supabase-js@^2.98.0, @supabase/supabase-js, jsonLd, metadata, RootLayout(), spaceGrotesk, metadata, NewsPortal() (+11 more)

### Community 11 - "Dependency Overrides"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "ContactSection.tsx"
Cohesion: 0.45
Nodes (6): ContactSection(), Button(), buttonVariants, Input(), Textarea(), cn()

### Community 13 - "OpenGraph Image"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 15 - "overrides"
Cohesion: 0.22
Nodes (9): overrides, brace-expansion, express-rate-limit, flatted, hono, @hono/node-server, picomatch, @tailwindcss/typography (+1 more)

### Community 19 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.1, eslint, eslint-config-next

### Community 20 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `App Config & Shell` to `About Detail Pages`, `Admin Dashboard`, `devDependencies`, `dependencies`, `Auth & Messages API`, `app/layout.tsx`, `OpenGraph Image`, `admin/layout.tsx`, `projects/layout.tsx`?**
  _High betweenness centrality (0.356) - this node is a cross-community bridge._
- **Should `App Config & Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.08874912648497554 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App Config & Shell` to `Admin Dashboard`, `devDependencies`, `dependencies`, `app/layout.tsx`, `ContactSection.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `About Detail Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06313497822931785 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App Config & Shell` to `About Detail Pages`, `Admin Dashboard`, `devDependencies`, `dependencies`, `ContactSection.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `Admin Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.1319073083778966 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._