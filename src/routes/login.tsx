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
  'w-full rounded-xl border border-zinc-900/10 bg-transparent px-4 py-2 dark:border-white/10'

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
    <main className="mx-auto max-w-md px-6 pt-16 sm:pt-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-zinc-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900/50"
      >
        <h1 className="text-3xl font-semibold tracking-tighter">Log in</h1>

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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900"
        >
          Log in
        </button>

        <p className="text-sm text-zinc-500">
          No account?{' '}
          <Link to="/register" className="underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  )
}
