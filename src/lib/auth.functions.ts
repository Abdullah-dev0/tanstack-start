// 🔐 Reading the session on the server.
// 📖 getSession / ensureSession: https://www.better-auth.com/docs/integrations/tanstack
// 📖 authMiddleware pattern: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

// Who is logged in? → the session (with .user), or null
export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    return session
  },
)

// Same, but throws if nobody is logged in
export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)

// 🔐 MIDDLEWARE: attach to every server function with private data.
// It checks the session and hands the user to the handler as context.user
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw new Error('Unauthorized')
    return next({ context: { user: session.user } })
  },
)
