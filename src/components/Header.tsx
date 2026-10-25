import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

// Link sets data-status="active" on the current route, so we style off that
const navLink =
  'rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 data-[status=active]:bg-zinc-900/5 data-[status=active]:text-zinc-900 dark:text-zinc-400 dark:hover:text-white dark:data-[status=active]:bg-white/10 dark:data-[status=active]:text-white'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 rounded-full border border-zinc-900/5 bg-white/70 p-1.5 pl-4 shadow-sm shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
        <Link
          to="/"
          className="mr-auto flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="relative flex size-5 items-center justify-center rounded-md bg-zinc-900 dark:bg-white">
            <span className="h-2.5 w-1 -rotate-12 rounded-full bg-amber-400" />
          </span>
          TanStack Start
        </Link>

        <div className="flex items-center">
          <Link to="/" className={navLink}>
            Home
          </Link>
          <Link to="/notes" className={navLink}>
            Notes
          </Link>
          <Link to="/about" className={`${navLink} hidden sm:inline-flex`}>
            About
          </Link>
          <a
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            target="_blank"
            rel="noreferrer"
            className={`${navLink} hidden sm:inline-flex`}
          >
            Docs
          </a>
        </div>

        <div className="flex items-center">
          <a
            href="https://x.com/tan_stack"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full p-2 text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white sm:block"
          >
            <span className="sr-only">Follow TanStack on X</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
              <path
                fill="currentColor"
                d="M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
              />
            </svg>
          </a>
          <a
            href="https://github.com/TanStack"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full p-2 text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white sm:block"
          >
            <span className="sr-only">Go to TanStack GitHub</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
