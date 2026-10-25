import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { login } from '../utils/auth.functions'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Log in | My Notes' }] }),
  component: LoginPage,
})

function LoginPage() {
  const loginFn = useServerFn(login)
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await loginFn({ data: { password } }) // server checks password, sets cookie
      await navigate({ to: '/notes' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 pt-16 sm:pt-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-zinc-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900/50"
      >
        <h1 className="text-3xl font-semibold tracking-tighter">Log in</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          🧪 Learning demo — the password is <code>APP_PASSWORD</code> in your{' '}
          <code>.env</code> file
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-zinc-900/10 bg-transparent px-4 py-2 dark:border-white/10"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900"
        >
          Log in
        </button>
      </form>
    </main>
  )
}
