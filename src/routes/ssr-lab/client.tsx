import { createFileRoute } from '@tanstack/react-router'
import { whoCooked } from './-demo'

// 🥕 COOK IT YOURSELF — the browser does everything
export const Route = createFileRoute('/ssr-lab/client')({
  ssr: false,
  loader: () => whoCooked(),
  component: Page,
})

function Page() {
  const cook = Route.useLoaderData()
  return (
    <div>
      <h2>🥕 ssr: false</h2>
      <p>Data cooked by: {cook}</p>
      <p>Secret word: BANANA-CLIENT</p>
    </div>
  )
}
