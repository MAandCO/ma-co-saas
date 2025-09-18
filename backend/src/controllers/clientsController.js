import { supabaseAdmin } from '../services/supabaseClient.js'

const mapClient = record => ({
  id: record.id,
  name: record.name,
  utr: record.utr,
  vatNumber: record.vat_number,
  payeReference: record.paye_reference,
  companiesHouseNumber: record.companies_house_number,
  email: record.email,
  phone: record.phone,
  createdAt: record.created_at
})

export async function getClients (req, res) {
  try {
    const { ownerId } = req
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data.map(mapClient))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createClient (req, res) {
  const { ownerId } = req
  const { name, utr, vatNumber, payeReference, companiesHouseNumber, email, phone } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Client name is required.' })
  }
  try {
    const payload = {
      owner_id: ownerId,
      name,
      utr: utr || null,
      vat_number: vatNumber || null,
      paye_reference: payeReference || null,
      companies_house_number: companiesHouseNumber || null,
      email: email || null,
      phone: phone || null
    }
    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    res.status(201).json(mapClient(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateClient (req, res) {
  const { ownerId } = req
  const { id } = req.params
  const { name, utr, vatNumber, payeReference, companiesHouseNumber, email, phone } = req.body
  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
    if (!existing) {
      return res.status(404).json({ error: 'Client not found.' })
    }
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({
        name: name ?? existing.name,
        utr: utr ?? existing.utr,
        vat_number: vatNumber ?? existing.vat_number,
        paye_reference: payeReference ?? existing.paye_reference,
        companies_house_number: companiesHouseNumber ?? existing.companies_house_number,
        email: email ?? existing.email,
        phone: phone ?? existing.phone
      })
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select('*')
      .single()
    if (error) throw error
    res.json(mapClient(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteClient (req, res) {
  const { ownerId } = req
  const { id } = req.params
  try {
    const { error } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
