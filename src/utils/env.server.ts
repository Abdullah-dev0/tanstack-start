// 🔒 Server-only secrets, CHECKED with Zod.
import { z } from 'zod'

// The rules: what our secrets must look like
const ServerEnv = z.object({
  // 🔐 Better Auth — without a secret it silently uses a placeholder in dev!
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),
})

// Read the secrets. Call this INSIDE a handler, not at the top of a file.
// If .env is missing something, it fails with a clear message.
export function serverEnv() {
  return ServerEnv.parse(process.env)
}
