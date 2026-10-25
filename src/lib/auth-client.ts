// 🔐 Better Auth — the BROWSER side (sign up, sign in, sign out).
// 📖 https://www.better-auth.com/docs/installation
// baseURL is optional when the app and the auth API are on the same domain.
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()
