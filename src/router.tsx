// 🧭 Creates the router (and its Query cache). TanStack Start calls getRouter() per request.
import { QueryClient } from '@tanstack/react-query'
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
  Link,
} from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // 📦 TanStack Query's cache. Created INSIDE getRouter → a new one per request
  //    on the server, so one user's data never leaks to another (docs).
  // 📖 https://tanstack.com/router/latest/docs/framework/react/integrations/query
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        // 🙈 Errors the server sends to the browser are hidden ("redacted") by default,
        //    so secrets in error messages don't leak. Show the real message in dev only.
        // 📖 https://tanstack.com/query/latest/docs/framework/react/reference/functions/dehydrate
        shouldRedactErrors: () => !import.meta.env.DEV,
      },
    },
  })

  // 🐛 WORKAROUND for a TanStack Query bug: on a page reload, a query the server
  //    streamed while still loading ignores the retry set in its queryOptions.
  //    Setting it here (on the client itself) makes retry: false work right away.
  //    Remove when the fix ships (PR #12511).
  // 📖 https://github.com/TanStack/query/issues/12529
  // 📖 https://tanstack.com/query/latest/docs/reference/QueryClient (setQueryDefaults)
  queryClient.setQueryDefaults(['demo-posts'], { retry: false })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient }, // loaders can use context.queryClient
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Query is now the cache → hover-preloaded data is "stale" right away,
    // so Query (not the router) decides when to refetch.
    // 📖 https://tanstack.com/router/latest/docs/framework/react/guide/data-loading
    defaultPreloadStaleTime: 0,
    // 💥 Shown when an error bubbles up from a route WITHOUT its own errorComponent
    // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>This page does not exist.</p>
          <Link to="/">Go home</Link>
        </div>
      )
    },
  })

  // 🔗 Connects Query to SSR: server-fetched data is sent to the browser
  //    (no double fetching) and wraps the app in QueryClientProvider.
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
