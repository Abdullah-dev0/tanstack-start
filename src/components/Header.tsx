// 🧭 Top navbar shown on every page: logo, links, who's logged in, and the theme button.
import { useQueryClient } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'
import { Route as RootRoute } from '../routes/__root'
import ThemeToggle from './ThemeToggle'

// Link sets data-status="active" on the current route, so we style off that
const navLink =
  'rounded-md px-3 py-1.5 text-sm font-medium text-(--muted) transition hover:bg-(--sunken) hover:text-(--ink) data-[status=active]:text-(--ink) data-[status=active]:bg-(--sunken)'

// The navbar itself
export default function Header() {
  // 👤 The user loaded ONCE in __root.tsx beforeLoad (null = logged out)
  // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/authentication
  const { user } = RootRoute.useRouteContext()
  const router = useRouter()
  const queryClient = useQueryClient()

  async function handleLogout() {
    await authClient.signOut() // 📖 Better Auth: ends the session
    // Re-run every beforeLoad → root gets user: null, /notes redirects to /login
    await router.invalidate()
    queryClient.clear() // 🧹 forget this user's cached data
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--paper)/85 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-6">
        <Link
          to="/"
          className="mr-auto flex items-center gap-2.5 font-serif text-lg font-medium tracking-tight"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-(--accent) font-sans text-xs font-bold text-(--accent-ink)">
            N
          </span>
          {/* 🌍 PUBLIC env var (VITE_ prefix) — safe to show in the browser */}
          {import.meta.env.VITE_APP_NAME}
        </Link>

        <div className="flex items-center gap-0.5">
          <Link to="/" className={navLink} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/notes" className={navLink}>
            Notes
          </Link>
          <Link to="/streaming-demo" className={navLink}>
            Streaming
          </Link>
          <Link to="/about" className={`${navLink} hidden sm:inline-flex`}>
            About
          </Link>
        </div>

        <span className="mx-1 h-5 w-px bg-(--line)" aria-hidden="true" />

        {/* 👤 Logged in → email + Log out. Logged out → Log in. */}
        {user ? (
          <>
            <span className="hidden max-w-40 truncate text-sm text-(--muted) md:inline">
              {user.email}
            </span>
            <button type="button" onClick={handleLogout} className={navLink}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className={navLink}>
            Log in
          </Link>
        )}

        <ThemeToggle />
      </nav>
    </header>
  )
}
