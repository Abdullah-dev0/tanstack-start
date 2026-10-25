import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

// The SSR Lab layout: 4 links on top, the page below
export const Route = createFileRoute('/ssr-lab')({
  component: Layout,
})

function Layout() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 pt-16">
      <h1 className="text-4xl font-semibold">🧪 SSR Lab</h1>

      <nav className="flex gap-4">
        <Link to="/ssr-lab">📸 Awake?</Link>
        <Link to="/ssr-lab/full">🍝 ssr: true</Link>
        <Link to="/ssr-lab/data-only">📦 data-only</Link>
        <Link to="/ssr-lab/client">🥕 ssr: false</Link>
      </nav>

      <Outlet />
    </main>
  )
}
