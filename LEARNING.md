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

## ⏳ What I have NOT learned yet — production track 🏭

| # | Lesson | What |
| --- | --- | --- |
| 12 | **Real database: Postgres in Docker (local) + Drizzle ORM** | Docker Compose, tables, queries, migrations, replace `notes.json`. Hosted Postgres (e.g. Neon) at deploy time |
| 13 | **Caching** 🗄️ | Router cache recap, HTTP `Cache-Control` & CDNs, server-side caching of slow DB queries, TanStack Query |
| 14 | **Real authentication** | Users table, hashed passwords, sessions in the DB, rate limiting (and auth libraries like Better Auth) |
| 15 | **Errors, logging & security** | Global error handling, logging/monitoring, CSRF, security headers |
| 16 | **Testing** | Unit tests (Vitest), end-to-end tests (Playwright) |
| 17 | **Deploy + CI** | Host (Vercel / Netlify / Cloudflare / Node), env vars in production, GitHub Actions |
| 18 | **SEO & performance polish** | Meta tags, sitemap |

📖 [Environment variables](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables) · [Databases](https://tanstack.com/start/latest/docs/framework/react/guide/databases) · [Auth overview](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-overview) · [Auth server primitives](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives) · [Observability](https://tanstack.com/start/latest/docs/framework/react/guide/observability) · [Error boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries) · [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) · [Server entry point](https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point) · [SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)

### Later / optional

| Topic | Docs |
| --- | --- |
| TanStack Query with the router | [Query integration](https://tanstack.com/router/latest/docs/framework/react/integrations/query) |
| Router context (pass auth/db clients to loaders) | [Router context](https://tanstack.com/router/latest/docs/framework/react/guide/router-context) |
| Type safety tricks | [Type safety](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety) |
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
| `src/utils/notes.functions.ts` | Notes server functions (all protected) |
| `src/utils/notes.server.ts` | Reads/writes `data/notes.json` (server only) |
| `src/utils/auth.functions.ts` | `authMiddleware`, login, logout, status |
| `src/utils/auth.server.ts` | Password, sessions, cookies (server only) |
| `data/notes.json` | The "database" (for now) |

## ⚠️ Learning-only code to replace before production

- Hardcoded password `letmein` in `auth.server.ts` → real users + hashed passwords (Lesson 14)
- Sessions in server memory (lost on restart) → store in the database (Lesson 14)
- `data/notes.json` → Postgres in Docker (Lesson 12)
- 2-second fake delay in `getNoteStats` → remove, or replace with a real slow service
- `BadClock` in `ssr-lab/index.tsx` causes a hydration error **on purpose** → delete the SSR Lab before launch
