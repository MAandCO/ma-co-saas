import { supabaseAdmin } from '../services/supabaseClient.js'

export async function requireAuth (req, res, next) {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase is not configured on the server.' })
    }
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header.' })
    }
    const token = authHeader.slice('Bearer '.length)
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired access token.' })
    }
    req.user = data.user
    req.ownerId = data.user.id
    next()
  } catch (error) {
    next(error)
  }
}
