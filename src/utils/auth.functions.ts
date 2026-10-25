import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { PASSWORD, endSession, isLoggedIn, startSession } from './auth.server'

// 🔐 MIDDLEWARE: a guard that runs BEFORE a server function's handler.
// Attach it to any server function that needs a logged-in user.
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    if (!isLoggedIn()) {
      console.log('🚫 authMiddleware BLOCKED a request (not logged in)')
      throw new Error('Unauthorized — please log in')
    }
    return next() // ✅ logged in → continue to the handler
  },
)

// Is the current user logged in? (used by the page guard)
export const getAuthStatus = createServerFn().handler(async () => {
  return { loggedIn: isLoggedIn() }
})

// Log in
export const login = createServerFn({ method: 'POST' })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (data.password !== PASSWORD) throw new Error('Wrong password')
    startSession()
    console.log('✅ Logged in')
  })

// Log out
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  endSession()
  console.log('👋 Logged out')
})
