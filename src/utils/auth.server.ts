// ".server.ts" = this file can ONLY be used on the server.
// If browser code tries to import it, the build fails.
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'

import { serverEnv } from './env.server'

// 🧪 LEARNING ONLY: one password from .env, no real users.
// A real app stores users in a database with hashed passwords (Lesson 13).
export function checkPassword(password: string) {
  return password === serverEnv().APP_PASSWORD // 🔒 read the secret HERE, per request
}

// Logged-in sessions, kept in server memory.
// (They are forgotten when the dev server restarts.)
const sessions = new Set<string>()

const COOKIE = 'session'

export function startSession() {
  const token = crypto.randomUUID() // random, impossible to guess
  sessions.add(token)
  setCookie(COOKIE, token, {
    httpOnly: true, // browser JavaScript can't read it (stops theft)
    sameSite: 'lax', // other websites can't send it (stops CSRF)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export function endSession() {
  const token = getCookie(COOKIE)
  if (token) sessions.delete(token)
  deleteCookie(COOKIE, { path: '/' })
}

export function isLoggedIn() {
  const token = getCookie(COOKIE)
  return token !== undefined && sessions.has(token)
}
