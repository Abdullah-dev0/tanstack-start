// 📦 TanStack Query "order slip" for the streaming demo: a KEY + how to fetch.
// 📖 https://tanstack.com/router/latest/docs/framework/react/integrations/query
import { queryOptions } from '@tanstack/react-query'
import { getPosts } from './demo-posts.functions'

// 📝 A name for this food (['demo-posts']) + who fetches it
export const postsQuery = queryOptions({
  queryKey: ['demo-posts'],
  queryFn: () => getPosts(),
})
