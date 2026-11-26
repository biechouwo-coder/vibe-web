/* eslint-disable @typescript-eslint/no-require-imports */
const { execFileSync } = require('node:child_process')
const { databaseSettings, runPrisma } = require('./database')

const settings = databaseSettings()
console.log(`[build] Using ${settings.label}`)
runPrisma(['generate'], settings)
execFileSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build'], {
  cwd: settings.rootDir,
  env: settings.env,
  stdio: 'inherit',
})
