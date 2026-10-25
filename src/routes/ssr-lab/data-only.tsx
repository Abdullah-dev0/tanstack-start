import { createFileRoute } from '@tanstack/react-router'
import { whoCooked } from './-demo'

// 📦 MEAL KIT — the server gets the data, the browser draws the page
export const Route = createFileRoute('/ssr-lab/data-only')({
  ssr: 'data-only',
  loader: () => whoCooked(),
  component: Page,
})

function Page() {
  const cook = Route.useLoaderData()
  return (
    <div>
      <h2>📦 ssr: 'data-only'</h2>
      <p>Data cooked by: {cook}</p>
      <p>Secret word: BANANA-DATA-ONLY</p>
    </div>
  )
}
