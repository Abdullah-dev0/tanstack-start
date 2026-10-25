// 🔐 Better Auth — the SERVER side.
// 📖 https://www.better-auth.com/docs/installation
// 📖 https://www.better-auth.com/docs/integrations/tanstack
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { getDb } from '../db/client.server'
import * as authSchema from '../db/auth-schema'
import { serverEnv } from '../utils/env.server'

// ☁️ On Cloudflare Workers we create Better Auth PER REQUEST, because the
// database client must be new for every request (Cloudflare Hyperdrive docs).
// ⚠️ Neither the Better Auth nor the Cloudflare docs show this exact combination —
//    it joins the two official patterns (we chose this together).
export async function getAuth() {
  const env = serverEnv() // 📋 Zod checks the secrets (read per request, like the docs say)
  const db = await getDb()

  return betterAuth({
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
    // 🚦 RATE LIMIT: stop password guessing.
    // 📖 https://www.better-auth.com/docs/concepts/rate-limit
    // Default: OFF in dev, ON in production (100 requests / 10s, sign-in: 3 / 10s).
    // We turn it on in dev too, so we can see it work.
    // Default storage is memory — not shared on Workers, so we store it in Postgres.
    rateLimit: {
      enabled: true,
      storage: 'database', // ☁️ shared by all Cloudflare machines (memory isn't)
    },
    plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array
  })
}
