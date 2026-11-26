const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const os = require('node:os')

test('SQLite initialization creates a private file and preserves existing contents', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-db-test-'))
  try {
    const loaded = { exports: {} }
    const requireMock = (id) => {
      if (id === 'node:path') return path
      if (id === 'node:fs') return fs
      if (id === '@next/env') return { loadEnvConfig() {} }
      if (id === 'node:child_process') return { execFileSync() {} }
      throw new Error(id)
    }
    requireMock.resolve = (id) => id
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/database.js'), 'utf8'), {
      module: loaded, require: requireMock, __dirname: root, process: { execPath: '/node' },
    })
    const settings = { rootDir: root, schema: 'prisma/schema.prisma', env: { DATABASE_URL: 'file:./test.db' } }
    loaded.exports.runPrisma(['db', 'push'], settings)
    const dbPath = path.join(root, 'prisma/test.db')
    assert.equal(fs.existsSync(dbPath), true)
    if (process.platform !== 'win32') assert.equal(fs.statSync(dbPath).mode & 0o777, 0o600)
    fs.writeFileSync(dbPath, 'existing database bytes')
    loaded.exports.runPrisma(['db', 'push'], settings)
    assert.equal(fs.readFileSync(dbPath, 'utf8'), 'existing database bytes')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('database selection loads env files before selecting both PostgreSQL URL forms', () => {
  for (const url of ['postgres://user:secret@host/db', 'postgresql://user:secret@host/db', 'file:./dev.db']) {
    const env = {}
    const loaded = { exports: {} }
    const commands = []
    const requireMock = (id) => {
      if (id === 'node:path') return path
      if (id === 'node:fs') return { mkdirSync() {}, openSync: () => 1, closeSync() {} }
      if (id === '@next/env') return { loadEnvConfig: () => { env.DATABASE_URL = url } }
      if (id === 'node:child_process') return { execFileSync: (...args) => commands.push(args) }
      throw new Error(id)
    }
    requireMock.resolve = (id) => id
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/database.js'), 'utf8'), {
      module: loaded, require: requireMock, __dirname: path.join(__dirname, '../scripts'), process: { env, execPath: '/node' },
    })
    const settings = loaded.exports.databaseSettings()
    assert.equal(settings.label, url.startsWith('file:') ? 'SQLite' : 'PostgreSQL')
    loaded.exports.runPrisma(['db', 'push'], settings)
    assert.equal(commands[0][0], '/node')
    assert.equal(commands[0][1].includes('--accept-data-loss'), false)
    assert.equal(commands[0][1].at(-1), settings.schema)
  }
})

test('startup refuses to launch the app after failed database sync', () => {
  let started = false
  const exits = []
  const requireMock = (id) => {
    if (id === 'node:child_process') return { spawn: () => { started = true } }
    if (id === './database') return { databaseSettings: () => ({ label: 'SQLite' }), runPrisma: () => { throw new Error('sync failed') } }
    throw new Error(id)
  }
  requireMock.resolve = (id) => id
  assert.throws(() => vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/start.js'), 'utf8'), {
    require: requireMock,
    console: { log() {}, error() {} },
    process: { env: {}, exit: (code) => { exits.push(code); throw new Error('exit') } },
  }), /exit/)
  assert.deepEqual(exits, [1])
  assert.equal(started, false)
})
