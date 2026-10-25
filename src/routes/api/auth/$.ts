// 🔐 Better Auth's own API: /api/auth/sign-in/email, /api/auth/sign-up/email, ...
// The "$" (splat) catches every /api/auth/* URL and hands it to Better Auth.
// 📖 https://www.better-auth.com/docs/integrations/tanstack
import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../../../lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
    },
  },
})
