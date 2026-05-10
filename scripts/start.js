// Startup script: run DB migration then start Next.js
/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync, spawn } = require('child_process')
const path = require('path')
/* eslint-enable @typescript-eslint/no-require-imports */

const isWindows = process.platform === 'win32'
const npxCmd = isWindows ? 'npx.cmd' : 'npx'

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

try {
  console.log('[startup] Running prisma db push...')
  execSync(npxCmd + ' prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl },
    cwd: path.resolve(__dirname, '..'),
  })
  console.log('[startup] Database migration complete.')
} catch (err) {
  console.error('[startup] Database migration failed, continuing anyway:', err.message)
}

console.log('[startup] Starting Next.js on port', process.env.PORT || 3000)

const child = isWindows
  ? spawn('cmd', ['/c', npxCmd, 'next', 'start'], {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
      cwd: path.resolve(__dirname, '..'),
    })
  : spawn(npxCmd, ['next', 'start'], {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
      cwd: path.resolve(__dirname, '..'),
    })

child.on('exit', (code) => {
  console.log('[startup] Next.js exited with code', code)
  process.exit(code || 1)
})
