import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

// Link sets data-status="active" on the current route, so we style off that
const navLink =
  'rounded-md px-3 py-1.5 text-sm font-medium text-(--muted) transition hover:bg-(--sunken) hover:text-(--ink) data-[status=active]:text-(--ink) data-[status=active]:bg-(--sunken)'

export default function Header() {
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
          <Link to="/about" className={`${navLink} hidden sm:inline-flex`}>
            About
          </Link>
        </div>

        <span className="mx-1 h-5 w-px bg-(--line)" aria-hidden="true" />
        <ThemeToggle />
      </nav>
    </header>
  )
}
