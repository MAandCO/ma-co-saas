import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storePath = path.join(__dirname, '../data/store.json')

let cache = null

async function loadStore () {
  if (cache) return cache
  try {
    const content = await readFile(storePath, 'utf-8')
    cache = JSON.parse(content)
  } catch (error) {
    cache = { clients: [], workers: [], tasks: [], documents: [], payments: [] }
    await saveStore()
  }
  return cache
}

async function saveStore () {
  if (!cache) return
  await writeFile(storePath, JSON.stringify(cache, null, 2))
}

export async function getStore () {
  return loadStore()
}

export async function upsertItem (section, item, matcher) {
  const store = await loadStore()
  const items = store[section] || []
  const index = items.findIndex(matcher)
  if (index === -1) {
    items.push(item)
  } else {
    items[index] = { ...items[index], ...item }
  }
  store[section] = items
  await saveStore()
  return item
}

export async function removeItem (section, matcher) {
  const store = await loadStore()
  const items = store[section] || []
  const filtered = items.filter(item => !matcher(item))
  store[section] = filtered
  await saveStore()
  return filtered
}

export async function listItems (section) {
  const store = await loadStore()
  return store[section] || []
}

export async function replaceItems (section, items) {
  const store = await loadStore()
  store[section] = items
  await saveStore()
  return items
}
