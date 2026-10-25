import { createFileRoute } from '@tanstack/react-router'
import { whoCooked } from './-demo'

// 🍝 READY PLATE — the server does everything (this is the default)
export const Route = createFileRoute('/ssr-lab/full')({
  ssr: true,
  loader: () => whoCooked(),
  component: Page,
})

function Page() {
  const cook = Route.useLoaderData()
  return (
    <div>
      <h2>🍝 ssr: true</h2>
      <p>Data cooked by: {cook}</p>
      <p>Secret word: BANANA-FULL</p>
    </div>
  )
}
