// 🃏 The posts for the streaming demo, plus the "loading" message shown before them.
import { useSuspenseQuery } from '@tanstack/react-query'
import { postsQuery } from '../utils/demo-posts.queries'

// ⏳ Shown by <Suspense> while the posts are on their way
export function Cooking() {
  return <p className="animate-pulse text-(--muted)">🍳 Food is coming...</p>
}

// 🥘 THE FOOD: reads the posts from the Query cache.
// While they're not there yet, it "suspends" → <Suspense> shows <Cooking />.
// 📖 https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery
export function Posts() {
  const { data } = useSuspenseQuery(postsQuery)

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
    </div>
  )
}
