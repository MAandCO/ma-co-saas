import { useState } from 'react'
import PropTypes from 'prop-types'

function DocumentsPanel ({ documents, clients, onUpload }) {
  const [metadata, setMetadata] = useState({ clientId: '', description: '', category: 'General' })
  const [file, setFile] = useState(null)

  const handleChange = event => {
    const { name, value } = event.target
    setMetadata(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!file) return
    const payload = { ...metadata, file }
    await onUpload(payload)
    setMetadata({ clientId: '', description: '', category: 'General' })
    setFile(null)
    event.target.reset()
  }

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <h2>Document vault</h2>
          <p>Upload and retrieve letters of engagement, payroll files, VAT submissions, and more.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          File
          <input type="file" name="file" onChange={event => setFile(event.target.files[0] || null)} required />
        </label>
        <label>
          Client
          <select name="clientId" value={metadata.clientId} onChange={handleChange}>
            <option value="">General</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select name="category" value={metadata.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Engagement">Letter of Engagement</option>
            <option value="Payroll">Payroll</option>
            <option value="VAT">VAT</option>
            <option value="Tax">Tax</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Description
          <input name="description" value={metadata.description} onChange={handleChange} placeholder="Eg. VAT submission Q2 2024" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="primary-button" type="submit">Upload document</button>
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Client</th>
              <th>Category</th>
              <th>Description</th>
              <th>Uploaded</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr>
                <td colSpan="6"><div className="empty-state">No documents uploaded yet.</div></td>
              </tr>
            )}
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.originalName}</td>
                <td>{doc.clientId ? (clients.find(client => client.id === doc.clientId)?.name || 'Unknown') : 'General'}</td>
                <td>{doc.category}</td>
                <td>{doc.description}</td>
                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                <td><a className="primary-button" href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">Download</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

DocumentsPanel.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpload: PropTypes.func.isRequired
}

export default DocumentsPanel
