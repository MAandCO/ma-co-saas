import { supabaseAdmin } from '../services/supabaseClient.js'
import { generateComplianceTasks } from '../services/aiService.js'

const mapTask = record => ({
  id: record.id,
  title: record.title,
  description: record.description,
  dueDate: record.due_date,
  clientId: record.client_id,
  assigneeId: record.assignee_id,
  category: record.category,
  status: record.status,
  suggestedAssigneeRole: record.suggested_assignee_role,
  createdAt: record.created_at
})

export async function getTasks (req, res) {
  try {
    const { ownerId } = req
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data.map(mapTask))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createTask (req, res) {
  const { ownerId } = req
  const { title, description, dueDate, clientId, assigneeId, category } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' })
  }
  try {
    const payload = {
      owner_id: ownerId,
      title,
      description: description || null,
      due_date: dueDate || null,
      client_id: clientId || null,
      assignee_id: assigneeId || null,
      category: category || 'General',
      status: 'Pending'
    }
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    res.status(201).json(mapTask(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateTask (req, res) {
  const { ownerId } = req
  const { id } = req.params
  const updates = req.body
  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single()
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' })
    }
    const updatePayload = {
      title: updates.title ?? existing.title,
      description: updates.description ?? existing.description,
      due_date: updates.dueDate ?? existing.due_date,
      client_id: updates.clientId ?? existing.client_id,
      assignee_id: updates.assigneeId ?? existing.assignee_id,
      category: updates.category ?? existing.category,
      status: updates.status ?? existing.status,
      suggested_assignee_role: updates.suggestedAssigneeRole ?? existing.suggested_assignee_role
    }
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select('*')
      .single()
    if (error) throw error
    res.json(mapTask(data))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteTask (req, res) {
  const { ownerId } = req
  const { id } = req.params
  try {
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId)
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function generateTasks (req, res) {
  const { ownerId } = req
  const { clientId } = req.body
  if (!clientId) {
    return res.status(400).json({ error: 'clientId is required to generate tasks.' })
  }
  try {
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('owner_id', ownerId)
      .single()
    if (clientError && clientError.code !== 'PGRST116') throw clientError
    if (!client) {
      return res.status(404).json({ error: 'Client not found.' })
    }
    const suggestions = await generateComplianceTasks({
      name: client.name,
      utr: client.utr,
      vatNumber: client.vat_number,
      payeReference: client.paye_reference,
      companiesHouseNumber: client.companies_house_number,
      category: client.category
    })
    if (!suggestions || suggestions.length === 0) {
      return res.json([])
    }
    const payload = suggestions.map(suggestion => ({
      owner_id: ownerId,
      client_id: clientId,
      title: suggestion.title,
      description: suggestion.description || null,
      due_date: suggestion.dueDate || null,
      category: suggestion.category || 'Compliance',
      status: 'Pending',
      suggested_assignee_role: suggestion.suggestedAssigneeRole || null
    }))
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(payload)
      .select('*')
    if (error) throw error
    res.json(data.map(mapTask))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
