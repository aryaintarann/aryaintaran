# Graph Report - aryaintaran  (2026-10-28)

## Corpus Check
- 86 files · ~32,403 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 430 nodes · 734 edges · 29 communities (18 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53ca672f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- lib/content.ts
- migrate-content.ts
- devDependencies
- dependencies
- (site)/layout.tsx
- shadcn Config
- apiSecurity.ts
- TypeScript Config
- payload.config.ts
- next
- Dependency Overrides
- payload-types.ts
- (payload)/layout.tsx
- NPM Scripts
- overrides
- CVA
- PostCSS
- Vercel Cron
- eslint.config.mjs
- scripts
- package.json
- AGENTS.md
- class-variance-authority
- clsx
- @tailwindcss/typography@^0.5.19
- tailwindcss@^4
- @tailwindcss/postcss@^4
- @types/react@^19

## God Nodes (most connected - your core abstractions)
1. `next` - 34 edges
2. `payload` - 19 edges
3. `react` - 19 edges
4. `getContent` - 19 edges
5. `compilerOptions` - 16 edges
6. `useContent()` - 15 edges
7. `lucide-react` - 13 edges
8. `@gsap/react` - 11 edges
9. `gsap` - 11 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Struktur` --references--> `SiteContent`  [INFERRED]
  docs/payload-cms.md → src/types/content.ts
- `generateMetadata()` --calls--> `getContent`  [EXTRACTED]
  src/app/(site)/about/career/[index]/page.tsx → src/lib/content.ts
- `CareerDetailPage()` --calls--> `getContent`  [EXTRACTED]
  src/app/(site)/about/career/[index]/page.tsx → src/lib/content.ts
- `generateMetadata()` --calls--> `getContent`  [EXTRACTED]
  src/app/(site)/about/education/[index]/page.tsx → src/lib/content.ts
- `EducationDetailPage()` --calls--> `getContent`  [EXTRACTED]
  src/app/(site)/about/education/[index]/page.tsx → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (29 total, 11 thin omitted)

### Community 0 - "react"
Cohesion: 0.11
Nodes (29): gsap, @gsap/react, lucide-react, react, ProjectsPage(), ProjectDetailPage(), TYPE_COLORS, TYPE_LABELS (+21 more)

### Community 1 - "lib/content.ts"
Cohesion: 0.09
Nodes (26): GET(), CareerDetailPage(), dynamic, generateMetadata(), Props, dynamic, EducationDetailPage(), generateMetadata() (+18 more)

### Community 2 - "migrate-content.ts"
Cohesion: 0.07
Nodes (24): Admin panel (Payload CMS 3), Catatan, Environment, Mengubah schema, Setup pertama (produksi), Struktur, @payloadcms/richtext-lexical@3.92.1, esbuild@^0.25.12 (+16 more)

### Community 3 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, jsdom@^30.1.3, shadcn@^4.23.0, tw-animate-css@^1.4.0, @types/jsdom@^30.0.0, @types/node@^20, @types/react-dom@^19, @types/sanitize-html@^2.16.2 (+9 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, gsap@^3.14.2, @gsap/react@^2.1.2, lucide-react@^0.575.0, @marsidev/react-turnstile@^1.4.2, next@^16.4.3, payload@3.92.1, react@19.2.3 (+9 more)

### Community 5 - "(site)/layout.tsx"
Cohesion: 0.15
Nodes (13): @vercel/analytics@^2.0.1, @vercel/speed-insights@^2.0.0, @vercel/analytics, @vercel/speed-insights, jsonLd, metadata, RootLayout(), spaceGrotesk (+5 more)

### Community 6 - "shadcn Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 7 - "apiSecurity.ts"
Cohesion: 0.09
Nodes (21): fast-xml-parser@^5.11.2, @google/generative-ai@^0.24.1, fast-xml-parser, @google/generative-ai, extractCoverImage(), fetchFeed(), genAI, GET() (+13 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "payload.config.ts"
Cohesion: 0.13
Nodes (16): @payloadcms/db-postgres@3.92.1, payload, @payloadcms/db-postgres, ContactMessages, Media, Projects, Skills, Users (+8 more)

### Community 10 - "next"
Cohesion: 0.08
Nodes (26): @supabase/supabase-js@^2.98.0, next, @supabase/supabase-js, metadata, NewsPortal(), revalidate, ArticlePage(), revalidate (+18 more)

### Community 11 - "Dependency Overrides"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "payload-types.ts"
Cohesion: 0.07
Nodes (30): About, AboutSelect, Auth, CollectionsWidget, Config, Contact, ContactMessage, ContactMessagesSelect (+22 more)

### Community 13 - "(payload)/layout.tsx"
Cohesion: 0.09
Nodes (13): nextConfig, @payloadcms/next@3.92.1, @payloadcms/storage-s3@3.92.1, @payloadcms/next, @payloadcms/storage-s3, importMap, Args, Args (+5 more)

### Community 15 - "overrides"
Cohesion: 0.22
Nodes (9): overrides, brace-expansion, express-rate-limit, flatted, hono, @hono/node-server, picomatch, @tailwindcss/typography (+1 more)

### Community 19 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.1, eslint, eslint-config-next

### Community 20 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, db:migrate, db:migrate:create, dev, generate:types, lint, migrate:content (+2 more)

### Community 21 - "package.json"
Cohesion: 0.18
Nodes (10): browserslist, graphql@^16.14.2, radix-ui@^1.4.3, sanitize-html@^2.18.1, name, private, version, graphql (+2 more)

## Knowledge Gaps
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `react`, `lib/content.ts`, `dependencies`, `(site)/layout.tsx`, `apiSecurity.ts`, `payload.config.ts`, `(payload)/layout.tsx`, `package.json`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1109936575052854 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload.config.ts` to `lib/content.ts`, `migrate-content.ts`, `dependencies`, `apiSecurity.ts`, `(payload)/layout.tsx`, `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `lib/content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `dependencies`, `(site)/layout.tsx`, `next`, `(payload)/layout.tsx`, `package.json`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `migrate-content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._