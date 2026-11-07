// 🃏 The posts for the streaming demo, plus the "loading" message shown before them.
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { postsQuery } from '../utils/demo-posts.queries'

// ⏳ Shown by <Suspense> while the posts are on their way
export function Cooking() {
  return <p className="animate-pulse text-(--muted)">🍳 Food is coming...</p>
}

// 💥 Shown by <CatchBoundary> if loading the posts fails (only this box, not the page)
export function PostsError({ error }: ErrorComponentProps) {
  return (
    <p className="text-sm text-red-700">
      {error instanceof Error ? error.message : 'Unknown error'}
    </p>
  )
}

// 🥘 THE FOOD: reads the posts from the Query cache.
// While they're not there yet, it "suspends" → <Suspense> shows <Cooking />.
// 📖 https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery
export function Posts() {
  const { data, isFetching } = useSuspenseQuery(postsQuery)

  return (
    <div>
      <ul className="space-y-2">
        {data.posts.map((p) => (
          <li key={p.id} className="font-semibold tracking-tight">
            {p.title}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-(--faint)">
        Server finished at {data.fetchedAt}
      </p>
      <p className="mt-1 text-xs text-red-800">
        {isFetching ? 'Fetching...' : 'Done fetching'}
      </p>
    </div>
  )
}
