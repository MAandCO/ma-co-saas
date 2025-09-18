import { promises as fs } from 'fs'
import path from 'path'
import { supabaseAdmin } from '../services/supabaseClient.js'

const mapDocument = record => ({
  id: record.id,
  clientId: record.client_id,
  filename: record.filename,
  originalName: record.original_name,
  path: record.storage_path,
  description: record.description,
  category: record.category,
  uploadedAt: record.uploaded_at
})

export async function getDocuments (req, res) {
  try {
    const { ownerId } = req
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('owner_id', ownerId)
      .order('uploaded_at', { ascending: false })
    if (error) throw error
    res.json(data.map(mapDocument))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function uploadDocument (req, res) {
  const { ownerId } = req
  if (!req.file) {
    return res.status(400).json({ error: 'File is required.' })
  }
  const { clientId, description, category } = req.body
  try {
    const payload = {
      owner_id: ownerId,
      client_id: clientId || null,
      filename: req.file.filename,
      original_name: req.file.originalname,
      storage_path: req.file.path,
      description: description || null,
      category: category || 'General',
      uploaded_at: new Date().toISOString()
    }
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    res.status(201).json(mapDocument(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function downloadDocument (req, res) {
  const { ownerId } = req
  const { id } = req.params
  try {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (!data) {
      return res.status(404).json({ error: 'Document not found.' })
    }
    const absolutePath = path.resolve(data.storage_path)
    res.download(absolutePath, data.original_name)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteDocument (req, res) {
  const { ownerId } = req
  const { id } = req.params
  try {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (!data) {
      return res.status(404).json({ error: 'Document not found.' })
    }
    const { error: deleteError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    if (deleteError) throw deleteError
    if (data.storage_path) {
      try {
        await fs.unlink(path.resolve(data.storage_path))
      } catch (fsError) {
        if (fsError.code !== 'ENOENT') {
          console.warn(`Failed to remove file ${data.storage_path}:`, fsError.message)
        }
      }
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
