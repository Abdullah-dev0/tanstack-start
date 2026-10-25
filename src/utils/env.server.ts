// 🔒 Server-only secrets, CHECKED with Zod.
import { z } from 'zod'

// The rules: what our secrets must look like
const ServerEnv = z.object({
  APP_PASSWORD: z.string().min(6, 'APP_PASSWORD must be at least 6 characters'),
  DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),
})

// Read the secrets. Call this INSIDE a handler, not at the top of a file.
// If .env is missing something, it fails with a clear message.
export function serverEnv() {
  return ServerEnv.parse(process.env)
}
