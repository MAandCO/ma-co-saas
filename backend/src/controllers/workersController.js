import { v4 as uuid } from 'uuid'
import { getStore, upsertItem, listItems, removeItem } from '../utils/dataStore.js'

export async function getWorkers (req, res) {
  const workers = await listItems('workers')
  res.json(workers)
}

export async function createWorker (req, res) {
  const { name, email, specialties } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Worker name is required.' })
  }
  const worker = {
    id: uuid(),
    name,
    email: email || '',
    specialties: specialties || [],
    createdAt: new Date().toISOString()
  }
  await upsertItem('workers', worker, () => false)
  res.status(201).json(worker)
}

export async function updateWorker (req, res) {
  const { id } = req.params
  const updates = req.body
  const store = await getStore()
  const existing = (store.workers || []).find(worker => worker.id === id)
  if (!existing) {
    return res.status(404).json({ error: 'Worker not found.' })
  }
  const updated = { ...existing, ...updates, id }
  await upsertItem('workers', updated, worker => worker.id === id)
  res.json(updated)
}

export async function deleteWorker (req, res) {
  const { id } = req.params
  const remaining = await removeItem('workers', worker => worker.id === id)
  res.json({ success: true, remaining })
}
