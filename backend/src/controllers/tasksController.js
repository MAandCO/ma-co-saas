import { v4 as uuid } from 'uuid'
import { getStore, upsertItem, listItems, removeItem } from '../utils/dataStore.js'
import { generateComplianceTasks } from '../services/aiService.js'

export async function getTasks (req, res) {
  const tasks = await listItems('tasks')
  res.json(tasks)
}

export async function createTask (req, res) {
  const { title, description, dueDate, clientId, assigneeId, category } = req.body
  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' })
  }
  const task = {
    id: uuid(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    clientId: clientId || null,
    assigneeId: assigneeId || null,
    category: category || 'General',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
  await upsertItem('tasks', task, () => false)
  res.status(201).json(task)
}

export async function updateTask (req, res) {
  const { id } = req.params
  const updates = req.body
  const store = await getStore()
  const existing = (store.tasks || []).find(task => task.id === id)
  if (!existing) {
    return res.status(404).json({ error: 'Task not found.' })
  }
  const updated = { ...existing, ...updates, id }
  await upsertItem('tasks', updated, task => task.id === id)
  res.json(updated)
}

export async function deleteTask (req, res) {
  const { id } = req.params
  const remaining = await removeItem('tasks', task => task.id === id)
  res.json({ success: true, remaining })
}

export async function generateTasks (req, res) {
  const { clientId } = req.body
  if (!clientId) {
    return res.status(400).json({ error: 'clientId is required to generate tasks.' })
  }
  const store = await getStore()
  const client = (store.clients || []).find(item => item.id === clientId)
  if (!client) {
    return res.status(404).json({ error: 'Client not found.' })
  }
  try {
    const suggestions = await generateComplianceTasks(client)
    const tasks = []
    for (const suggestion of suggestions) {
      const task = {
        id: uuid(),
        title: suggestion.title,
        description: suggestion.description,
        dueDate: suggestion.dueDate,
        clientId: client.id,
        assigneeId: null,
        category: suggestion.category || 'Compliance',
        status: 'Pending',
        suggestedAssigneeRole: suggestion.suggestedAssigneeRole || null,
        createdAt: new Date().toISOString()
      }
      await upsertItem('tasks', task, () => false)
      tasks.push(task)
    }
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
