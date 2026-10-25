// 📦 TanStack Query "recipes" for notes: a KEY (name in the cache) + how to fetch.
// Safe to import anywhere — the server functions run on the server.
// 📖 https://tanstack.com/router/latest/docs/framework/react/integrations/query
import { queryOptions } from '@tanstack/react-query'
import { getNote, getNotes } from './notes.functions'

// All my notes → cache key ['notes']
export const notesQuery = queryOptions({
  queryKey: ['notes'],
  queryFn: () => getNotes(),
})

// One note → cache key ['notes', id]
// (starts with 'notes', so invalidating ['notes'] refreshes this too)
export const noteQuery = (id: string) =>
  queryOptions({
    queryKey: ['notes', id],
    queryFn: () => getNote({ data: { id } }),
  })
