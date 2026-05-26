// Build script: detect database type and run Prisma generate + Next build
const { execSync } = require('child_process')
const path = require('path')

const url = process.env.DATABASE_URL || ''
const isPostgres = url.startsWith('postgresql://')
const schemaFlag = isPostgres ? '--schema=prisma/schema.postgres.prisma' : ''
const dbLabel = isPostgres ? 'PostgreSQL' : 'SQLite'

console.log(`[build] Detected ${dbLabel} (DATABASE_URL=${url ? url.slice(0, 30) + '...' : '(unset)'})`)

execSync(`npx prisma generate ${schemaFlag}`.trim(), {
  stdio: 'inherit',
  env: process.env,
  cwd: path.resolve(__dirname, '..'),
})
execSync('npx next build', {
  stdio: 'inherit',
  env: process.env,
  cwd: path.resolve(__dirname, '..'),
})
