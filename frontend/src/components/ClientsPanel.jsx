import { useState } from 'react'
import PropTypes from 'prop-types'

const initialForm = {
  name: '',
  utr: '',
  vatNumber: '',
  payeReference: '',
  companiesHouseNumber: '',
  email: '',
  phone: ''
}

function ClientsPanel ({ clients, onCreate, onUpdate }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!form.name) {
      return
    }
    if (editingId) {
      await onUpdate(editingId, form)
    } else {
      await onCreate(form)
    }
    setForm(initialForm)
    setEditingId(null)
  }

  const handleEdit = client => {
    setEditingId(client.id)
    setForm({
      name: client.name || '',
      utr: client.utr || '',
      vatNumber: client.vatNumber || '',
      payeReference: client.payeReference || '',
      companiesHouseNumber: client.companiesHouseNumber || '',
      email: client.email || '',
      phone: client.phone || ''
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <h2>Client directory</h2>
          <p>Manage UTR, VAT, PAYE, Companies House identifiers and contact details.</p>
        </div>
        {editingId && (
          <button type="button" className="primary-button" onClick={handleCancel}>
            Cancel edit
          </button>
        )}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Client name
          <input name="name" value={form.name} onChange={handleChange} placeholder="Acme Contractors Ltd" required />
        </label>
        <label>
          UTR
          <input name="utr" value={form.utr} onChange={handleChange} placeholder="12345 67890" />
        </label>
        <label>
          VAT number
          <input name="vatNumber" value={form.vatNumber} onChange={handleChange} placeholder="GB123456789" />
        </label>
        <label>
          PAYE reference
          <input name="payeReference" value={form.payeReference} onChange={handleChange} placeholder="123/AB4567" />
        </label>
        <label>
          Companies House number
          <input name="companiesHouseNumber" value={form.companiesHouseNumber} onChange={handleChange} placeholder="12345678" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="finance@client.co.uk" />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="0207 123 4567" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="primary-button" type="submit">
            {editingId ? 'Update client' : 'Add client'}
          </button>
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>UTR</th>
              <th>VAT</th>
              <th>PAYE</th>
              <th>Companies House</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">Add your first client to begin orchestrating compliance workflows.</div>
                </td>
              </tr>
            )}
            {clients.map(client => (
              <tr key={client.id}>
                <td>
                  <strong>{client.name}</strong>
                </td>
                <td>{client.utr || '—'}</td>
                <td>{client.vatNumber || '—'}</td>
                <td>{client.payeReference || '—'}</td>
                <td>{client.companiesHouseNumber || '—'}</td>
                <td>
                  <div>{client.email || '—'}</div>
                  <div>{client.phone || '—'}</div>
                </td>
                <td>
                  <button type="button" className="primary-button" onClick={() => handleEdit(client)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

ClientsPanel.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default ClientsPanel
