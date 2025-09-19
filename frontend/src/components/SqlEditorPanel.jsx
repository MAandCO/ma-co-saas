import { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

function ResultsTable ({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="section-card">
        <strong>No rows returned.</strong>
        <span>Try adjusting your query or removing the LIMIT clause.</span>
      </div>
    )
  }

  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))]

  return (
    <div className="section-card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column}>{formatCellValue(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ResultsTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
}

function formatCellValue (value) {
  if (value === null || value === undefined) {
    return '—'
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function SqlEditorPanel () {
  const [query, setQuery] = useState('SELECT * FROM clients LIMIT 10')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [executedQuery, setExecutedQuery] = useState('')

  const runQuery = async event => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/sql', { query })
      const rows = response.data?.rows ?? []
      setResults(rows)
      setExecutedQuery(query)
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Unexpected error'
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-sql" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="section-card" style={{ gap: 16 }}>
        <div>
          <h2>Run a SQL query</h2>
          <p style={{ margin: 0, color: 'rgba(31, 42, 68, 0.7)' }}>
            Only `SELECT * FROM &lt;table&gt; [LIMIT n]` statements are supported. Available tables: clients, workers, tasks, documents, payments.
          </p>
        </div>
        <form onSubmit={runQuery} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea
            value={query}
            onChange={event => setQuery(event.target.value)}
            rows={4}
            style={{
              fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.95rem',
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(11, 31, 58, 0.14)'
            }}
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Running…' : 'Run query'}
            </button>
            {executedQuery && !loading && (
              <span style={{ color: 'rgba(31, 42, 68, 0.7)', fontSize: '0.9rem' }}>
                Showing results for: <code>{executedQuery}</code>
              </span>
            )}
          </div>
        </form>
        {error && (
          <div className="section-card" style={{ background: 'rgba(255, 99, 71, 0.12)' }}>
            <strong>Query error</strong>
            <span>{error}</span>
          </div>
        )}
      </div>
      <ResultsTable rows={results} />
    </div>
  )
}

export default SqlEditorPanel

