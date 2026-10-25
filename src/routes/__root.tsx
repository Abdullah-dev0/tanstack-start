import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // 🔎 SEO defaults for EVERY page (a page's own head() can override them)
      // 📖 https://tanstack.com/start/latest/docs/framework/react/guide/seo
      { title: 'My Notes' },
      {
        name: 'description',
        content: 'A simple, private notes app built with TanStack Start.',
      },
      // Open Graph — how links look when shared (WhatsApp, Slack, LinkedIn...)
      { property: 'og:site_name', content: 'My Notes' },
      { property: 'og:type', content: 'website' },
      // Twitter / X card
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  // 🔍 Shown for any URL that matches no route (e.g. /abc)
  notFoundComponent: PageNotFound,
})

function PageNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-(--accent)">404</p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">
        This page wandered off.
      </h1>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-(--accent-ink) transition hover:opacity-90"
      >
        ← Go home
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-(--paper) font-sans text-(--ink) antialiased wrap-anywhere selection:bg-(--accent-soft) selection:text-(--ink)">
        <div className="flex min-h-dvh flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
