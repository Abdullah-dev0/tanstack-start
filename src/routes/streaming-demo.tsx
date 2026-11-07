// 🎓 DEMO: streaming with TanStack Query (the "don't wait" loader)
// The page shell shows instantly, the slow posts stream in ~2s later.
// 📖 https://tanstack.com/router/latest/docs/framework/react/integrations/query
import { noop } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Cooking, Posts } from '../components/PostsCard'
import { postsQuery } from '../utils/demo-posts.queries'

// 🚪 THE PAGE: when you walk in, place the order right away
export const Route = createFileRoute('/streaming-demo')({
  loader: ({ context }) => {
    // Don't await, don't return → the order starts on the server and the food
    // is STREAMED to the browser when ready. .catch(noop) = ignore a failure here
    // (useSuspenseQuery in <Posts /> will show the error instead).
    context.queryClient.query(postsQuery).catch(noop)
  },
  component: StreamingDemo,
})

// 🍽️ YOUR TABLE: shows immediately, no waiting for the posts
function StreamingDemo() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-12 sm:pt-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        Streaming demo
      </h1>
      <p className="mt-2 text-(--muted)">
        This text arrived instantly. The posts below are still cooking on the
        server — they stream in when ready.
      </p>

      <section className="mt-8 rounded-xl border border-(--line) bg-(--card) p-6">
        <Suspense fallback={<Cooking />}>
          <Posts />
        </Suspense>
      </section>
    </main>
  )
}
