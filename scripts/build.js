// Build script: ensure DATABASE_URL is valid for SQLite
const { execSync } = require('child_process')

const url = process.env.DATABASE_URL

// If DATABASE_URL is missing or not a file: URL (e.g. leftover PostgreSQL URL), force SQLite
if (!url || !url.startsWith('file:')) {
  process.env.DATABASE_URL = 'file:./dev.db'
  console.log('[build] DATABASE_URL=' + process.env.DATABASE_URL + ' (was: ' + (url || '(unset)') + ')')
}

execSync('npx prisma generate', { stdio: 'inherit', env: process.env })
execSync('npx next build', { stdio: 'inherit', env: process.env })
