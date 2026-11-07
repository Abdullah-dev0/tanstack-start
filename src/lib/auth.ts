// 🔐 Better Auth — the SERVER side.
// 📖 https://www.better-auth.com/docs/installation
// 📖 https://www.better-auth.com/docs/integrations/tanstack
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '../db/client.server'
import * as authSchema from '../db/auth-schema'
import { serverEnv } from '../utils/env.server'

const env = serverEnv() // 📋 Zod checks the secrets first — clear error if one is missing

// The Better Auth server (used by /api/auth/* and to read the session)
export const auth = betterAuth({
  // 📖 https://www.better-auth.com/docs/reference/options
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL, // docs: set it explicitly, don't let it guess
  // Store users & sessions in OUR Postgres, through Drizzle
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema, // user, session, account, verification
  }),
  // Turn on email + password login
  emailAndPassword: {
    enabled: true,
  },
  // ⚡ COOKIE CACHE: keep a short-lived, signed copy of the session in a cookie,
  //    so checking "who is logged in?" (root beforeLoad, every click) skips the database.
  //    ⚠️ Trade-off (docs): a revoked session can stay active on other devices
  //    until maxAge runs out.
  // 📖 https://www.better-auth.com/docs/concepts/session-management
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes (in seconds)
    },
  },
  // 🚦 RATE LIMIT: stop password guessing.
  // 📖 https://www.better-auth.com/docs/concepts/rate-limit
  // Default: OFF in dev, ON in production (100 requests / 10s, sign-in: 3 / 10s).
  // We turn it on in dev too, so we can see it work.
  // Default storage is memory — we keep it in Postgres instead.
  rateLimit: {
    enabled: true,
    storage: 'database', // survives restarts + works if you run more than one server
  },
  plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array
})
