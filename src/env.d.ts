/// <reference types="vite/client" />

// 🏷️ Types for our env vars, so TypeScript knows they exist.
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string // 🌍 public (browser)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
