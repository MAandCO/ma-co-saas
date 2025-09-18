import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const statusColumns = ['Pending', 'In Progress', 'Done']

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  clientId: '',
  assigneeId: '',
  category: 'Compliance'
}

function TasksPanel ({ tasks, clients, workers, onCreate, onUpdate, onGenerate }) {
  const [form, setForm] = useState(initialForm)
  const [selectedClientForAI, setSelectedClientForAI] = useState('')

  const boardData = useMemo(() => {
    return statusColumns.map(status => ({
      status,
      items: tasks.filter(task => task.status === status)
    }))
  }, [tasks])

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!form.title) return
    await onCreate({ ...form })
    setForm(initialForm)
  }

  const handleStatusChange = async (taskId, status) => {
    await onUpdate(taskId, { status })
  }

  const handleAssigneeChange = async (taskId, assigneeId) => {
    await onUpdate(taskId, { assigneeId })
  }

  const triggerGeneration = async () => {
    if (!selectedClientForAI) return
    await onGenerate(selectedClientForAI)
    setSelectedClientForAI('')
  }

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <h2>Compliance runway</h2>
          <p>Visualise AI-generated tasks for CIS, VAT, payroll, and statutory filings.</p>
        </div>
        <div className="section-actions">
          <select value={selectedClientForAI} onChange={event => setSelectedClientForAI(event.target.value)}>
            <option value="">Select client for AI planning</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <button type="button" className="primary-button" onClick={triggerGeneration}>
            Generate with AI
          </button>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Task title
          <input name="title" value={form.title} onChange={handleChange} placeholder="Submit VAT return" required />
        </label>
        <label>
          Due date
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </label>
        <label>
          Client
          <select name="clientId" value={form.clientId} onChange={handleChange}>
            <option value="">Unassigned</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </label>
        <label>
          Assign to
          <select name="assigneeId" value={form.assigneeId} onChange={handleChange}>
            <option value="">Not assigned</option>
            {workers.map(worker => (
              <option key={worker.id} value={worker.id}>{worker.name}</option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Compliance">Compliance</option>
            <option value="Advisory">Advisory</option>
            <option value="Payroll">Payroll</option>
            <option value="Tax">Tax</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Description
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Upload payroll summary, reconcile with HMRC submission" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" className="primary-button">Add task</button>
        </div>
      </form>

      <div className="board-grid">
        {boardData.map(column => (
          <div key={column.status} className="board-column">
            <h3>{column.status}</h3>
            {column.items.length === 0 && <div className="empty-state">No tasks in this column yet.</div>}
            {column.items.map(task => (
              <div key={task.id} className="board-card">
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ color: 'rgba(31, 42, 68, 0.6)', marginTop: 4 }}>{task.description}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {task.dueDate && <span className="tag warning">Due {task.dueDate}</span>}
                  <span className="tag">{task.category}</span>
                  {task.suggestedAssigneeRole && <span className="tag">Suggested: {task.suggestedAssigneeRole}</span>}
                </div>
                <div>
                  <label>
                    Status
                    <select value={task.status} onChange={event => handleStatusChange(task.id, event.target.value)}>
                      {statusColumns.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Assign to
                    <select value={task.assigneeId || ''} onChange={event => handleAssigneeChange(task.id, event.target.value || null)}>
                      <option value="">Unassigned</option>
                      {workers.map(worker => (
                        <option key={worker.id} value={worker.id}>{worker.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(31, 42, 68, 0.6)' }}>
                  Client: {task.clientId ? (clients.find(client => client.id === task.clientId)?.name || 'Unknown') : '—'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

TasksPanel.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  workers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired
}

export default TasksPanel
