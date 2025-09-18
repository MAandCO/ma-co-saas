import { v4 as uuid } from 'uuid'
import { listItems, upsertItem, removeItem } from '../utils/dataStore.js'

export async function getDocuments (req, res) {
  const documents = await listItems('documents')
  res.json(documents)
}

export async function uploadDocument (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required.' })
  }
  const { clientId, description, category } = req.body
  const stored = {
    id: uuid(),
    clientId: clientId || null,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    description: description || '',
    category: category || 'General',
    uploadedAt: new Date().toISOString()
  }
  await upsertItem('documents', stored, () => false)
  res.status(201).json(stored)
}

export async function downloadDocument (req, res) {
  const { id } = req.params
  const documents = await listItems('documents')
  const doc = documents.find(item => item.id === id)
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' })
  }
  res.download(doc.path, doc.originalName)
}

export async function deleteDocument (req, res) {
  const { id } = req.params
  await removeItem('documents', doc => doc.id === id)
  res.json({ success: true })
}
