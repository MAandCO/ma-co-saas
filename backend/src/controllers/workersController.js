import { supabaseAdmin } from '../services/supabaseClient.js'

const mapWorker = record => ({
  id: record.id,
  name: record.name,
  email: record.email,
  specialties: record.specialties || [],
  createdAt: record.created_at
})

export async function getWorkers (req, res) {
  try {
    const { ownerId } = req
    const { data, error } = await supabaseAdmin
      .from('workers')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data.map(mapWorker))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createWorker (req, res) {
  const { ownerId } = req
  const { name, email, specialties } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Worker name is required.' })
  }
  try {
    const payload = {
      owner_id: ownerId,
      name,
      email: email || null,
      specialties: Array.isArray(specialties) ? specialties : [],
      created_at: new Date().toISOString()
    }
    const { data, error } = await supabaseAdmin
      .from('workers')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    res.status(201).json(mapWorker(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateWorker (req, res) {
  const { ownerId } = req
  const { id } = req.params
  const { name, email, specialties } = req.body
  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('workers')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
    if (!existing) {
      return res.status(404).json({ error: 'Worker not found.' })
    }
    const { data, error } = await supabaseAdmin
      .from('workers')
      .update({
        name: name ?? existing.name,
        email: email ?? existing.email,
        specialties: specialties ?? existing.specialties
      })
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select('*')
      .single()
    if (error) throw error
    res.json(mapWorker(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteWorker (req, res) {
  const { ownerId } = req
  const { id } = req.params
  try {
    const { error } = await supabaseAdmin
      .from('workers')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
