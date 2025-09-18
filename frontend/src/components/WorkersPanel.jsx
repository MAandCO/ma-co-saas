import { useState } from 'react'
import PropTypes from 'prop-types'

const initialForm = {
  name: '',
  email: '',
  specialties: ''
}

function WorkersPanel ({ workers, onCreate }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!form.name) return
    const payload = {
      name: form.name,
      email: form.email,
      specialties: form.specialties ? form.specialties.split(',').map(item => item.trim()).filter(Boolean) : []
    }
    await onCreate(payload)
    setForm(initialForm)
  }

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <h2>Team availability</h2>
          <p>Assign accountants, payroll specialists, and bookkeepers to the right portfolios.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Team member name
          <input name="name" value={form.name} onChange={handleChange} placeholder="Hannah Mason" required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="hannah@maaccountants.co.uk" />
        </label>
        <label>
          Specialties
          <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="CIS, Payroll, CT600" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="primary-button" type="submit">
            Add team member
          </button>
        </div>
      </form>

      <div className="board-grid">
        {workers.map(worker => (
          <div key={worker.id} className="board-card">
            <div>
              <strong>{worker.name}</strong>
              <div style={{ color: 'rgba(31, 42, 68, 0.6)', marginTop: 4 }}>{worker.email || '—'}</div>
            </div>
            <div>
              <span className="tag">Specialties</span>
              <div style={{ marginTop: 8 }}>
                {(worker.specialties || []).length > 0 ? worker.specialties.join(', ') : 'General practice'}
              </div>
            </div>
          </div>
        ))}
        {workers.length === 0 && <div className="empty-state">Invite your first team member to begin allocating tasks.</div>}
      </div>
    </div>
  )
}

WorkersPanel.propTypes = {
  workers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreate: PropTypes.func.isRequired
}

export default WorkersPanel
