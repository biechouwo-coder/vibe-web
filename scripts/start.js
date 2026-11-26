/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('node:child_process')
const { databaseSettings, runPrisma } = require('./database')

const settings = databaseSettings()
console.log(`[startup] Using ${settings.label}`)
try {
  // Refuse destructive schema changes instead of silently accepting data loss.
  runPrisma(['db', 'push'], settings)
} catch {
  console.error('[startup] Database sync failed. Review the schema and database backup before restarting.')
  process.exit(1)
}

console.log('[startup] Starting Next.js on port', process.env.PORT || 3000)
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start'], {
  cwd: settings.rootDir,
  env: settings.env,
  stdio: 'inherit',
})
child.on('error', () => {
  console.error('[startup] Could not start Next.js.')
  process.exit(1)
})
child.on('exit', (code) => process.exit(code ?? 1))
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => child.kill(signal))
}
