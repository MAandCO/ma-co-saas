import { supabaseAdmin } from '../services/supabaseClient.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase () {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured')
    return
  }

  console.log('Checking if tables exist...')

  try {
    // Test if we can query the clients table
    const { error } = await supabaseAdmin.from('clients').select('count').limit(1)

    if (!error) {
      console.log('Tables already exist! Database is ready.')
      return
    }

    console.log('Tables do not exist. Creating schema...')

    // Read schema file
    const schemaPath = path.join(__dirname, '..', '..', '..', 'supabase', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')

    // Split into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`Executing ${statements.length} schema statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`Executing statement ${i + 1}/${statements.length}`)

      try {
        const { error } = await supabaseAdmin.rpc('query_sql', { query: statement })
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error)
        }
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err.message)
      }
    }

    // Apply RLS policies
    console.log('Applying RLS policies...')
    const rlsPath = path.join(__dirname, '..', '..', '..', 'supabase', 'rls.sql')
    const rlsSQL = fs.readFileSync(rlsPath, 'utf8')

    const rlsStatements = rlsSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    for (let i = 0; i < rlsStatements.length; i++) {
      const statement = rlsStatements[i] + ';'
      console.log(`Executing RLS statement ${i + 1}/${rlsStatements.length}`)

      try {
        const { error } = await supabaseAdmin.rpc('query_sql', { query: statement })
        if (error) {
          console.error(`Error in RLS statement ${i + 1}:`, error)
        }
      } catch (err) {
        console.error(`Error executing RLS statement ${i + 1}:`, err.message)
      }
    }

    console.log('Database setup complete!')
  } catch (err) {
    console.error('Error during database setup:', err.message)
  }
}

setupDatabase()
