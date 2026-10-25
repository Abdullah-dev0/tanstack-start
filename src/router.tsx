import {
  createRouter as createTanStackRouter,
  ErrorComponent,
  Link,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
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

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
