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
  plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array
})
