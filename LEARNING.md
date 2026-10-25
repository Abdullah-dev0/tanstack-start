# TanStack Start — My Learning Notes

What I have learned building a **Notes app** with TanStack Start v1, what is still left, and where to read more.

- **Versions:** `@tanstack/react-start` 1.169.x · `@tanstack/react-router` 1.170.x · React 19 · Vite 8
- **Last updated:** 2026-10-25

---

## How to search the docs

| Where | When to use it |
| --- | --- |
| [Start docs](https://tanstack.com/start/latest/docs/framework/react/overview) | Server stuff: server functions, middleware, SSR, deploy |
| [Router docs](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) | Pages & URLs: routes, links, params, loaders, search |
| **Local docs** in `node_modules/@tanstack/*/skills/**/SKILL.md` | Match my **exact installed version**. In VS Code: `Ctrl+Shift+F`, files to include `node_modules/@tanstack/**/skills/**`, turn OFF "Use Exclude Settings" |
| VS Code hover / `Ctrl+Click` / `Ctrl+Space` | See types, jump to source, list all options |
| [Official examples](https://github.com/TanStack/router/tree/main/examples/react) | Full working apps (look at `start-basic`) |

> **Rule:** Start is built **on top of** Router. Page/URL questions → Router docs. Server questions → Start docs.
> If a blog post disagrees with the local docs or the types, **trust the local docs**.

---

## ✅ What I have learned

### Lesson 1 — File-based routing

Files in `src/routes/` become pages.

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `notes/route.tsx` | layout for all `/notes/*` |
| `notes/index.tsx` | `/notes` exactly |
| `notes/new.tsx` | `/notes/new` |

- `createFileRoute('/path')` — define a page. The path must match the file location.
- `<Outlet />` — where the child page shows inside a layout.
- `<Link to="...">` — type-safe link, no full page reload. A typo = red error.
- `routeTree.gen.ts` — **auto-generated**, never edit by hand, do commit it.
- Folder style (`notes/route.tsx`) and flat style (`notes.tsx`) do the same thing.
- Special names: `$id` = param · `-file` = ignored (not a page) · `_name` = layout without URL · `(group)` = folder only · `__root.tsx` = wraps everything.

📖 [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) · [File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) · [Start: routing](https://tanstack.com/start/latest/docs/framework/react/guide/routing)

### Lesson 2 — Path params & search params

| URL part | Example | Read it with |
| --- | --- | --- |
| Path param | `/notes/2` | `Route.useParams()` |
| Search param | `/notes?q=hello` | `Route.useSearch()` |

- Link with params: `<Link to="/notes/$noteId" params={{ noteId: '2' }}>` — **never** build the string yourself.
- `validateSearch` — declares which `?query` values a page accepts, with types.
- `useNavigate({ from: '/notes/' })` + `navigate({ search: {...} })` — change the URL from code.
- `from` = the same text as in `createFileRoute('...')` of that page (note the trailing `/` for index routes).
- Search params in the URL survive refresh, sharing and the back button (`useState` does not).
- `replace: true` — update the URL without adding a history entry.

📖 [Path params](https://tanstack.com/router/latest/docs/framework/react/guide/path-params) · [Search params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params) · [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation)

### Lesson 3 — Where code runs (execution model)

> **All code is isomorphic** — it runs on BOTH the server and the browser.

| What I do | Loader runs on |
| --- | --- |
| Refresh (F5) / first visit | 🖥️ Server (log appears in the terminal) |
| Click a `<Link>` | 🌐 Browser (log appears in DevTools console) |
| Hover a link | 🌐 Browser — **preloading** (`defaultPreload: 'intent'`) |

- Loaders are **not** server-only. Never put secrets, database or file code directly in a loader.

📖 [Execution model](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model) · [Preloading](https://tanstack.com/router/latest/docs/framework/react/guide/preloading)

### Lesson 4 — Server functions (read data)

- `createServerFn().handler(async () => ...)` — code that **always runs on the server**. From the browser it becomes a network request (`/_serverFn/...`).
- `loader: () => getNotes()` + `Route.useLoaderData()` — load data before the page shows.
- `.validator((data: {...}) => data)` — declares and checks the input.
- The build removes server code from the browser bundle automatically (checked: 0 browser files contained `readFile`).
- File naming: `*.functions.ts` = server functions · `*.server.ts` = server-only helpers (cannot be imported by browser code).

📖 [Server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) · [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) · [Import protection](https://tanstack.com/start/latest/docs/framework/react/guide/import-protection)

### Lesson 5 — Mutations (create & delete)

- `createServerFn({ method: 'POST' })` — **GET to read, POST to change**.
- Validator runs **on the server**, so nobody can skip it (e.g. "Title is required").
- `useServerFn(fn)` — wrap a server function before calling it from a component.
- `router.invalidate()` — "my data is old, reload it". Call it after every change.
- **Bug I found:** `invalidate()` reloads the **current** page. After delete → `navigate` away **first**, then `invalidate`.
- Also used: `useState`, `<form onSubmit>`, `e.preventDefault()`, `async/await`, `try/catch`.

📖 [Data mutations](https://tanstack.com/router/latest/docs/framework/react/guide/data-mutations) · [Server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)

### Lesson 6 — Loading, error & not-found screens

One page, 4 possible screens — the router picks the right one:

```tsx
component: NoteDetail,           // ✅ success
pendingComponent: NoteLoading,   // ⏳ loading (only after 1s — pendingMs)
notFoundComponent: NoteNotFound, // 🔍 throw notFound() in the loader
errorComponent: NoteError,       // 💥 crash — "Try again" = router.invalidate()
```

- `head()` — browser tab title / meta tags (SEO).
- Two kinds of 404: no route matches (`/abc` → root `notFoundComponent`) vs. route matches but data missing (`/notes/99` → `throw notFound()`).

📖 [Not found & errors](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors) · [Error boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries) · [Document head](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management)

### Lesson 7 — Middleware & login

> **Two guards.** `beforeLoad` protects the **page** (UX). Middleware protects the **data** (real security).

- `createMiddleware({ type: 'function' }).server(async ({ next }) => ...)` — runs **before** the handler; `next()` = continue, `throw` = block.
- `.middleware([authMiddleware])` — attach to **every** server function with private data.
- `beforeLoad` + `throw redirect({ to: '/login' })` — send logged-out users to login.
- Session cookie: `setCookie` / `getCookie` / `deleteCookie` from `@tanstack/react-start/server`, with `httpOnly`, `sameSite: 'lax'`, `secure` in production.
- Server functions are public URLs — a page guard alone does **not** protect them.

📖 [Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware) · [Auth overview](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-overview) · [Auth server primitives](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives) · [Authenticated routes](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)

### Lesson 8 — Server routes (API endpoints)

- `createFileRoute('/api/notes')({ server: { handlers: { GET: ... } } })` — a real URL that returns a `Response`.
- `Response.json(data)` · `{ status: 401 }` = please log in · 404 = not found · 200 = OK.
- **Server function** = for my own pages. **Server route** = for outside callers (mobile app, webhooks, other sites).
- Shared logic lives in one `*.server.ts` file used by both.
- **Never** `fetch('/api/...')` from a loader — call the server function instead.
- Each server route needs its **own** auth check.

📖 [Server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)

### Lesson 9 — Making slow pages fast

| Tool | When |
| --- | --- |
| **Defer** — don't `await` slow data, render with `<Await promise fallback>` | Part of the page is slow, the rest is fast |
| **`staleTime: 30_000`** | Same data opened again and again |
| **Preload on hover** (`defaultPreload: 'intent'`, preload cache 30s by default) | Load before the click |
| **`pendingComponent`** | The whole page is slow |

- Streaming: on refresh, the fast part arrives first and the slow part streams in later.
- `router.invalidate()` still marks cached data old after a change.

📖 [Deferred data loading](https://tanstack.com/router/latest/docs/framework/react/guide/deferred-data-loading) · [Data loading (caching)](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) · [Preloading](https://tanstack.com/router/latest/docs/framework/react/guide/preloading)

---

### Lesson 10 — SSR, hydration, selective SSR, prerendering

**SSR (Server-Side Rendering):** on the first visit the server sends **finished HTML** (fast first paint, good for Google). **Hydration:** the browser then "takes over" that HTML and makes buttons work.

| Mode | Loader runs on (first load) | HTML built on | Use for |
| --- | --- | --- | --- |
| `ssr: true` (default) | 🖥️ Server | 🖥️ Server | Most pages, SEO |
| `ssr: 'data-only'` | 🖥️ Server | 🌐 Browser | Charts, maps, canvas (browser APIs) |
| `ssr: false` | 🌐 Browser | 🌐 Browser | Private dashboards, browser-only libraries |

- `ssr` only changes the **first load / refresh**. After that, all navigation happens in the browser anyway.
- Children can only be **more** restrictive than their parent (`true` → `false` OK, not the reverse).
- **Hydration error:** server HTML ≠ first browser render (e.g. `new Date()`, `window`, `localStorage`, `Math.random()`).
- Fixes: `useHydrated()` (false on server & first render, true after) · `<ClientOnly fallback>` (renders children only in the browser).
- **Prerendering:** build pages to static HTML at **build time** (`tanstackStart({ prerender: { enabled, filter } })`). Great for pages that are the same for everyone (`/about`).
- Proved with View Source / curl: `full` = content in HTML · `data-only` = data in HTML, no content · `client` = neither.

📖 [Router SSR](https://tanstack.com/router/latest/docs/framework/react/guide/ssr) · [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr) · [Hydration errors](https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors) · [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) · [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode) · [Code execution patterns](https://tanstack.com/start/latest/docs/framework/react/guide/code-execution-patterns)

---

### Lesson 11 — Env vars, secrets & Zod

- `.env` = locked drawer for secrets (in `.gitignore`, never uploaded). `.env.example` = fake values, uploaded.
- **No prefix** (`APP_PASSWORD`) = 🖥️ server only · **`VITE_` prefix** (`VITE_APP_NAME`) = 🌍 public, goes to the browser. Never put secrets in `VITE_`.
- Read secrets **inside** a handler (`serverEnv()` in `env.server.ts`), never at the top of a file. Restart the dev server after changing `.env`.
- Zod checks the env at startup of each request → clear error if something is missing.
- Zod schemas in `schemas.ts` = rules written **once**, used in the **browser** (`safeParse` → instant message) and the **server** (`.validator(NoteInput)` → real security). Never trust the browser.
- Proved by build: secret in 0 browser files, public name in browser files.

📖 [Environment variables](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables) · [Server functions (validation)](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) · [Zod](https://zod.dev)

---

### Lesson 12 — Real database: Postgres in Docker + Drizzle

- **Docker** runs Postgres in a box: `docker-compose.yml` → `npm run db:up` / `db:down`.
- **Schema** (`src/db/schema.ts`) = the table's columns, like Excel. **Drizzle** turns TypeScript into SQL (`select`, `insert`, `delete`, `where(eq(...))`).
- **Migrations** (`drizzle/*.sql`): `db:generate` writes the SQL from the schema, `db:migrate` runs it. Same files → same tables for everyone.
- **Seed** (`scripts/seed.ts`, `db:seed`): copied 85 notes from `notes.json` into the table. **Studio**: `db:studio` to browse the data.
- Only `notes.server.ts` changed — pages didn't, because all storage code lives in one file.
- `rows.at(0) ?? null` instead of `const [row] = ...` → TypeScript correctly knows "maybe not found".
- `DATABASE_URL` lives in `.env` (server only). Reading env at module top works on Node, but not on Cloudflare Workers (check at deploy).

📖 [Databases](https://tanstack.com/start/latest/docs/framework/react/guide/databases) · [Drizzle + Postgres](https://orm.drizzle.team/docs/get-started-postgresql) · [Drizzle migrations](https://orm.drizzle.team/docs/migrations)

---

### Lesson 13 — Caching (from the fresh docs)

**Caching = keep a copy so you don't do slow work again.** Two places, both from the docs:

**1. 🧊 Router cache (in the browser)** — built-in stale-while-revalidate cache for loaders.

| Option (route / router) | Default | Meaning |
| --- | --- | --- |
| `staleTime` / `defaultStaleTime` | `0` | How long loaded data counts as fresh. Stale → shown instantly, reloaded in the background |
| `preloadStaleTime` / `defaultPreloadStaleTime` | 30 s | How long hover-preloaded data stays fresh |
| `gcTime` / `defaultGcTime` | **5 min** | How long unused data stays in memory |
| `loaderDeps` | — | Extra cache-key parts (search params the loader uses). Change → always reload |
| `loader.staleReloadMode` | `'background'` | `'blocking'` = wait for fresh data instead |

- Cache key = the URL path (`/notes/1` ≠ `/notes/2`) + `loaderDeps`.
- `router.invalidate()` marks everything stale and reloads active routes (`sync: true` to wait).
- In my app: `staleTime: 30_000` on `$noteId.tsx`.

**2. 🌍 HTTP / CDN cache (ISR)** — the server labels responses with `Cache-Control`.

| Label | Meaning | In my app |
| --- | --- | --- |
| `public` | Anyone (browser, CDN) may keep it — **only** if the same for everyone | `/about`, `/api/stats` |
| `max-age=N` | Fresh for N seconds | |
| `s-maxage=N` | Like `max-age`, but only for CDNs | `/about` |
| `stale-while-revalidate=N` | Serve the old copy while fetching a new one, up to N seconds | `/about`, `/api/stats` |
| `private` (+ `Vary: Cookie, Authorization`) | Only the user's own browser may keep it | |
| `no-store` | Nobody may keep it (sensitive data) | `/notes/*`, `/api/notes` |

- **Page routes:** route `headers: () => ({ 'Cache-Control': '...' })`.
- **Server routes:** `Response.json(data, { headers: { 'Cache-Control': '...' } })` (or cache middleware).
- **Server functions:** `setResponseHeaders(new Headers({ ... }))` from `@tanstack/react-start/server`.
- ⚠️ `public` on logged-in data = one user's data shown to another. Docs: start with short cache times.
- Prerender + ISR can be combined (build once, CDN refreshes it).

📖 [Data loading — router cache](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) · [ISR](https://tanstack.com/start/latest/docs/framework/react/guide/isr) · [Server functions — headers](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)

---

### Lesson 14 — Real login with Better Auth (from the fresh docs)

Docs offer **managed** (Clerk, WorkOS) or **DIY** — I first built DIY, then switched to **Better Auth** (open source, runs inside my app, data in my Postgres).

| Piece | File | What it does |
| --- | --- | --- |
| ⚙️ Auth config | `src/lib/auth.ts` | `betterAuth({ database: drizzleAdapter(db, { provider: 'pg', schema }), emailAndPassword: { enabled: true }, plugins: [tanstackStartCookies()] })` |
| 🗄️ Tables | `src/db/auth-schema.ts` | generated by `npx auth@latest generate`: `user`, `session`, `account` (hashed password lives here), `verification` |
| 🌐 Auth API | `src/routes/api/auth/$.ts` | splat route → `auth.handler(request)` for every `/api/auth/*` URL |
| 🖥️ Browser client | `src/lib/auth-client.ts` | `createAuthClient()` → `signUp.email`, `signIn.email`, `signOut` |
| 🔐 Server helpers | `src/lib/auth.functions.ts` | `getSession`, `ensureSession` (Better Auth docs) + `authMiddleware` (TanStack docs pattern) → `context.user` |
| 📝 Notes owner | `src/db/schema.ts` | `notes.user_id` → `user.id`; every query uses `context.user.id` |
| 🚪 Guard | `src/routes/notes/route.tsx` | `beforeLoad` → `getSession()` → redirect to `/login` or return `{ user }` |

- `.env`: `BETTER_AUTH_SECRET` (32+ random chars, server only) + `BETTER_AUTH_URL` (my app's URL).
- Both are **checked by Zod** in `env.server.ts` and passed to `betterAuth({ secret, baseURL })`. Without this, a missing secret silently falls back to a placeholder in dev (Better Auth docs). `DATABASE_URL` is checked too (`client.server.ts`).
- With Drizzle, Better Auth only **generates** the schema; **drizzle-kit** makes and runs the migration.
- `tanstackStartCookies()` must be the **last** plugin (it lets server calls set cookies).
- Better Auth only accepts requests from its own URL (`BETTER_AUTH_URL`) — origin protection built in.
- Its docs show `.inputValidator(...)`; my installed TanStack Start uses `.validator(...)`.
- Tested ✅: sign up, user B can't read A's notes, wrong password → 401 "Invalid email or password", sign-out deletes the session → 401, password stored hashed.

📖 [TanStack auth overview](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-overview) · [Better Auth + TanStack Start](https://www.better-auth.com/docs/integrations/tanstack) · [Better Auth installation](https://www.better-auth.com/docs/installation) · [Drizzle adapter](https://www.better-auth.com/docs/adapters/drizzle) · [Basic usage](https://www.better-auth.com/docs/basic-usage)

---

### Lesson 15 — Errors, logging & security (from the fresh docs)

| Part | File | What it does | Docs |
| --- | --- | --- | --- |
| 🛡️ **CSRF** | `src/start.ts` | `createCsrfMiddleware({ filter: serverFn })` → server functions called from other websites get **403** | [Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware) |
| 📝 **Request logging** | `src/start.ts` | logs `method URL - status (ms)` for every request | [Observability](https://tanstack.com/start/latest/docs/framework/react/guide/observability) |
| 💥 **Default error screen** | `src/router.tsx` | `defaultErrorComponent` → no error ever shows a blank page | [Error boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries) |
| 🚦 **Rate limiting** | `src/lib/auth.ts` | Better Auth built-in; sign-in: 3 tries / 10s → **429** | [Better Auth rate limit](https://www.better-auth.com/docs/concepts/rate-limit) |
| ❤️ **Health check** | `src/routes/health.ts` | `/health` → 200 healthy / 503 if DB is down | [Observability](https://tanstack.com/start/latest/docs/framework/react/guide/observability) |

- ⚠️ **No `src/start.ts` → Start adds CSRF protection automatically. Once you create `src/start.ts`, you must add `createCsrfMiddleware` yourself** (a dev warning reminds you).
- `requestMiddleware` in `src/start.ts` runs for **every** request (pages, server routes, server functions). `functionMiddleware` only for server functions.
- Better Auth already does: CSRF/origin check on its own routes, `scrypt` password hashing, `httpOnly` + `sameSite: lax` cookies, 7-day sessions.
- Better Auth rate limit: **off in dev by default, on in production**; memory storage → use `storage: 'database'` with many servers.
- Logging rules (docs): never log passwords, tokens or personal data; log errors with context on the server, show a friendly message to the user.
- Error tracking services the docs mention: Sentry (partner), Bugsnag, Rollbar; APM: DataDog, New Relic, Honeycomb.
- **Security headers (CSP etc.):** not covered by the TanStack docs.
- Tested ✅: `/health` 200, CSRF 403 from other sites, rate limit `401 401 401 429 429`, log lines printed.

---

## ⏳ What I have NOT learned yet — production track 🏭

| # | Lesson | What |
| --- | --- | --- |
| 16 | **Deploy + CI** | Host (Vercel / Netlify / Cloudflare / Node), env vars in production, GitHub Actions |
| 17 | **SEO & performance polish** | Meta tags, sitemap |

📖 [Environment variables](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables) · [Databases](https://tanstack.com/start/latest/docs/framework/react/guide/databases) · [Auth overview](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-overview) · [Auth server primitives](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives) · [Observability](https://tanstack.com/start/latest/docs/framework/react/guide/observability) · [Error boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries) · [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) · [Server entry point](https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point) · [SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)

### Later / optional

| Topic | Docs |
| --- | --- |
| TanStack Query with the router | [Query integration](https://tanstack.com/router/latest/docs/framework/react/integrations/query) |
| Router context (pass auth/db clients to loaders) | [Router context](https://tanstack.com/router/latest/docs/framework/react/guide/router-context) |
| Type safety tricks | [Type safety](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety) |
| Testing (Vitest, Playwright) — skipped for now | [Setup testing](https://tanstack.com/router/latest/docs/framework/react/how-to/setup-testing) |
| Code splitting | [Code splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting) |
| React Server Components (experimental) | [Server components](https://tanstack.com/start/latest/docs/framework/react/guide/server-components) |

---

## 🗂️ My project files

| File | What it is |
| --- | --- |
| `src/router.tsx` | Creates the router (preload on hover) |
| `src/routes/__root.tsx` | HTML shell + global 404 page |
| `src/routes/notes/route.tsx` | Notes layout + login guard (`beforeLoad`) + logout |
| `src/routes/notes/index.tsx` | Notes list + search (`?q=`) |
| `src/routes/notes/new.tsx` | Create-note form |
| `src/routes/notes/$noteId.tsx` | One note: 4 screens, deferred stats, cache, delete |
| `src/routes/login.tsx` | Login page |
| `src/routes/api/notes.ts` | API endpoint `GET /api/notes` |
| `src/routes/ssr-lab/*` | SSR Lab: hydration demo + 3 SSR modes |
| `vite.config.ts` | Prerenders `/about` at build time |
| `src/start.ts` | Global middleware: CSRF + request logging |
| `src/routes/health.ts` | Health check `/health` |
| `src/utils/notes.functions.ts` | Notes server functions (all protected) |
| `src/utils/notes.server.ts` | Database queries for notes (server only) |
| `src/db/schema.ts` · `src/db/client.server.ts` | Table definition · database connection |
| `src/routes/api/stats.ts` | Public API with `Cache-Control: public` |
| `docker-compose.yml` · `drizzle.config.ts` · `drizzle/` | Local Postgres · Drizzle settings · migrations |
| `src/routes/register.tsx` | Create-account page (Better Auth `signUp.email`) |
| `src/lib/auth.ts` · `auth-client.ts` · `auth.functions.ts` | Better Auth server config · browser client · session helpers + middleware |
| `src/routes/api/auth/$.ts` | Better Auth API handler |
| `src/db/auth-schema.ts` | Better Auth tables (generated) |
| `data/notes.json` | Old notes, only used by the seed script now |

## ⚠️ Learning-only code to replace before production

- 2-second fake delay in `getNoteStats` → remove, or replace with a real slow service
- `BadClock` in `ssr-lab/index.tsx` causes a hydration error **on purpose** → delete the SSR Lab before launch
