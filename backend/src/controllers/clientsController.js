import { v4 as uuid } from 'uuid'
import { getStore, upsertItem, listItems, removeItem } from '../utils/dataStore.js'

export async function getClients (req, res) {
  const clients = await listItems('clients')
  res.json(clients)
}

export async function createClient (req, res) {
  const { name, utr, vatNumber, payeReference, companiesHouseNumber, email, phone } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Client name is required.' })
  }
  const client = {
    id: uuid(),
    name,
    utr: utr || '',
    vatNumber: vatNumber || '',
    payeReference: payeReference || '',
    companiesHouseNumber: companiesHouseNumber || '',
    email: email || '',
    phone: phone || '',
    createdAt: new Date().toISOString()
  }
  await upsertItem('clients', client, () => false)
  res.status(201).json(client)
}

export async function updateClient (req, res) {
  const { id } = req.params
  const updates = req.body
  const store = await getStore()
  const existing = (store.clients || []).find(client => client.id === id)
  if (!existing) {
    return res.status(404).json({ error: 'Client not found.' })
  }
  const updated = { ...existing, ...updates, id }
  await upsertItem('clients', updated, client => client.id === id)
  res.json(updated)
}

export async function deleteClient (req, res) {
  const { id } = req.params
  const remaining = await removeItem('clients', client => client.id === id)
  res.json({ success: true, remaining })
}
