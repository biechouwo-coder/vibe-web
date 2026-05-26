// Startup script: run DB migration then start Next.js
// Railway deployment: prisma db push → next start
/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync, spawn } = require('child_process')
const path = require('path')
/* eslint-enable @typescript-eslint/no-require-imports */

const isWindows = process.platform === 'win32'
const npxCmd = isWindows ? 'npx.cmd' : 'npx'
const url = process.env.DATABASE_URL || ''
const isPostgres = url.startsWith('postgresql://')
const schemaFlag = isPostgres ? '--schema=prisma/schema.postgres.prisma' : ''
const dbLabel = isPostgres ? 'PostgreSQL' : 'SQLite'
const rootDir = path.resolve(__dirname, '..')

console.log(`[startup] Detected ${dbLabel}`)

try {
  console.log('[startup] Running prisma db push...')
  execSync(`${npxCmd} prisma db push --accept-data-loss ${schemaFlag}`.trim(), {
    stdio: 'inherit',
    env: process.env,
    cwd: rootDir,
  })
  console.log('[startup] Database migration complete.')
} catch (err) {
  console.error('[startup] Database migration failed, continuing anyway:', err.message)
}

console.log('[startup] Starting Next.js on port', process.env.PORT || 3000)

const child = isWindows
  ? spawn('cmd', ['/c', npxCmd, 'next', 'start'], {
      stdio: 'inherit',
      env: process.env,
      cwd: rootDir,
    })
  : spawn(npxCmd, ['next', 'start'], {
      stdio: 'inherit',
      env: process.env,
      cwd: rootDir,
    })

child.on('exit', (code) => {
  console.log('[startup] Next.js exited with code', code)
  process.exit(code || 1)
})
