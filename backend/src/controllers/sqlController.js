import { supabaseAdmin } from '../services/supabaseClient.js'

const SELECT_PATTERN = /^select\s+\*\s+from\s+(\w+)(?:\s+limit\s+(\d+))?\s*;?$/i
const allowedTables = new Set(['clients', 'workers', 'tasks', 'documents', 'payments'])

export async function executeSql (req, res) {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase is not configured on the server.' })
    }

    const { query } = req.body || {}
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'A SQL query string is required.' })
    }

    const trimmed = query.trim()
    const match = SELECT_PATTERN.exec(trimmed)
    if (!match) {
      return res.status(400).json({ error: 'Only simple SELECT * FROM <table> [LIMIT <n>] statements are supported.' })
    }

    const table = match[1].toLowerCase()
    const limitValue = match[2] ? Number.parseInt(match[2], 10) : null

    if (!allowedTables.has(table)) {
      return res.status(400).json({ error: `Table "${table}" is not accessible via the SQL editor.` })
    }

    if (limitValue !== null && (Number.isNaN(limitValue) || limitValue <= 0)) {
      return res.status(400).json({ error: 'LIMIT must be a positive integer.' })
    }

    const { ownerId } = req
    let queryBuilder = supabaseAdmin.from(table).select('*')

    if (ownerId) {
      queryBuilder = queryBuilder.eq('owner_id', ownerId)
    }

    if (limitValue !== null) {
      queryBuilder = queryBuilder.limit(limitValue)
    } else {
      queryBuilder = queryBuilder.limit(100)
    }

    const { data, error } = await queryBuilder
    if (error) {
      throw error
    }

    return res.json({ rows: data, table, limit: limitValue })
  } catch (error) {
    console.error('SQL execution failed', error)
    return res.status(500).json({ error: error.message })
  }
}
