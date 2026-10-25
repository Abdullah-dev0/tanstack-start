// ⚙️ Settings for drizzle-kit (the tool that creates/updates tables).
import { defineConfig } from 'drizzle-kit'

process.loadEnvFile('.env') // read DATABASE_URL from .env (built into Node)

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts', // where our tables are described
  out: './drizzle', // where migration files are saved
  dbCredentials: {
    url: process.env.DATABASE_URL!, // from .env
  },
})
