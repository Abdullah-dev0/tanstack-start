import {
  createRouter as createTanStackRouter,
  Link,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
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
