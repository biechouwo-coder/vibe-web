// Shared environment/schema selection for install, build, and startup.
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path')
const fs = require('node:fs')
const { execFileSync } = require('node:child_process')
const { loadEnvConfig } = require('@next/env')

function databaseSettings(development = false) {
  const rootDir = path.resolve(__dirname, '..')
  loadEnvConfig(rootDir, development)
  const url = process.env.DATABASE_URL || ''
  const postgres = url.startsWith('postgresql://') || url.startsWith('postgres://')
  if (url && !postgres && !url.startsWith('file:')) {
    throw new Error('DATABASE_URL must use file:, postgres://, or postgresql://')
  }
  return {
    rootDir,
    env: process.env,
    label: postgres ? 'PostgreSQL' : 'SQLite',
    schema: postgres ? 'prisma/schema.postgres.prisma' : 'prisma/schema.prisma',
  }
}

function runPrisma(args, settings) {
  const url = settings.env.DATABASE_URL || ''
  if (args[0] === 'db' && args[1] === 'push' && url.startsWith('file:') && url !== 'file::memory:') {
    // Prisma 6's schema engine can fail on a missing SQLite file. Create it
    // exclusively, preserving every existing database (including on a race).
    const filename = decodeURIComponent(url.slice(5).split('?')[0])
    const dbPath = path.resolve(settings.rootDir, path.dirname(settings.schema), filename)
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    try {
      fs.closeSync(fs.openSync(dbPath, 'ax', 0o600))
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }
  execFileSync(process.execPath, [require.resolve('prisma/build/index.js'), ...args, '--schema', settings.schema], {
    cwd: settings.rootDir,
    env: settings.env,
    stdio: 'inherit',
  })
}

if (require.main === module) {
  const command = process.argv[2]
  if (!['generate', 'push'].includes(command)) throw new Error('Usage: node scripts/database.js generate|push')
  const settings = databaseSettings(process.env.NODE_ENV !== 'production')
  console.log(`[database] Using ${settings.label}`)
  runPrisma(command === 'push' ? ['db', 'push'] : ['generate'], settings)
}

module.exports = { databaseSettings, runPrisma }
