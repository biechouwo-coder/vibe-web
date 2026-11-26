const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')

function loadSettings({ notion = null, ai = null, env = {} } = {}) {
  let savedAi
  const prisma = {
    notionConfig: { findFirst: async () => notion },
    aiConfig: {
      findFirst: async () => ai,
      upsert: async (value) => { savedAi = value },
    },
  }
  const source = fs.readFileSync(path.join(__dirname, '../src/actions/learn.ts'), 'utf8')
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    process: { env },
    require(id) {
      if (id === '@/lib/prisma') return { prisma }
      if (id === 'next/cache') return { revalidatePath() {} }
      if (id === '@/lib/notion') return { getNotionConfig: async () => notion }
      return {}
    },
  })
  return { actions: exports, savedAi: () => savedAi }
}

test('Notion settings never return a stored or environment token', async () => {
  for (const notion of [
    { token: 'private-db-token', dbEnglish: 'english', dbPlans: null, enabled: true, hasToken: true },
    { token: 'private-env-token', dbEnglish: 'english', dbPlans: 'plans', enabled: true, hasToken: true },
  ]) {
    const { actions } = loadSettings({ notion })
    const result = await actions.getNotionConfig()
    assert.equal(result.hasToken, true)
    assert.equal(result.dbEnglish, 'english')
    assert.equal('token' in result, false)
    assert.equal(JSON.stringify(result).includes('private-'), false)
  }
})

test('AI settings only expose whether a key exists', async () => {
  for (const options of [
    { ai: { id: 'default', apiKey: 'private-db-key', enabled: true } },
    { env: { DEEPSEEK_API_KEY: 'private-env-key' } },
  ]) {
    const { actions } = loadSettings(options)
    const result = await actions.getAiConfig()
    assert.equal(result.hasApiKey, true)
    assert.equal('apiKey' in result, false)
    assert.equal(JSON.stringify(result).includes('private-'), false)
  }
})

test('saving a blank AI key preserves it; explicit clear removes it', async () => {
  const { actions, savedAi } = loadSettings({ ai: { apiKey: 'existing-key', enabled: true } })
  const form = new FormData()
  form.set('apiKey', '   ')
  form.set('enabled', 'on')
  await actions.saveAiConfig(form)
  assert.equal(savedAi().update.apiKey, 'existing-key')
  form.set('apiKey', 'replacement')
  await actions.saveAiConfig(form)
  assert.equal(savedAi().update.apiKey, 'replacement')
  form.set('clearKey', 'on')
  await actions.saveAiConfig(form)
  assert.equal(savedAi().update.apiKey, null)
})
