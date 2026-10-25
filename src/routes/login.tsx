import { useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Log in | My Notes' }] }),
  component: LoginPage,
})

const input =
  'w-full rounded-lg border border-(--line) bg-(--paper) px-3.5 py-2.5 text-sm outline-none transition placeholder:text-(--faint) focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)'

function LoginPage() {
  const router = useRouter()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // 📖 Better Auth: sign in → it checks the password and sets the cookie
    const result = await authClient.signIn.email({ email, password })
    if (result.error) {
      setError(result.error.message ?? 'Something went wrong')
      return
    }
    await router.invalidate() // the user changed → reload data
    await navigate({ to: '/notes' })
  }

  return (
    <main className="mx-auto max-w-sm px-6 pt-16 sm:pt-24">
      <form
        onSubmit={handleSubmit}
        className="animate-rise space-y-3 rounded-xl border border-(--line) bg-(--card) p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto flex size-9 items-center justify-center rounded-lg bg-(--accent) text-sm font-bold text-(--accent-ink)">
            N
          </span>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight">
            Log in
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            Welcome back. Your notes are waiting.
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={input}
        />

        {error && (
          <p className="rounded-lg bg-(--accent-soft) px-3.5 py-2.5 text-sm text-(--accent)">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-(--accent-ink) transition hover:opacity-90 active:scale-[0.98]"
        >
          Log in
        </button>

        <p className="pt-2 text-center text-sm text-(--muted)">
          No account?{' '}
          <Link
            to="/register"
            className="font-medium text-(--accent) hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </main>
  )
}
