import { useState } from 'react'
import PropTypes from 'prop-types'

const initialForm = {
  clientId: '',
  customerEmail: '',
  amount: '',
  currency: 'gbp',
  description: 'Monthly compliance retainer'
}

function PaymentsPanel ({ payments, clients, onCreateSession }) {
  const [form, setForm] = useState(initialForm)
  const [generatedUrl, setGeneratedUrl] = useState(null)

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!form.clientId || !form.amount) return
    const payload = {
      clientId: form.clientId,
      amount: Number(form.amount),
      currency: form.currency,
      description: form.description,
      customerEmail: form.customerEmail,
      successUrl: window.location.origin + '/payments/success',
      cancelUrl: window.location.origin + '/payments/cancel'
    }
    const result = await onCreateSession(payload)
    if (result?.checkoutUrl) {
      setGeneratedUrl(result.checkoutUrl)
      window.open(result.checkoutUrl, '_blank')
    }
    setForm(initialForm)
  }

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <h2>Stripe payments</h2>
          <p>Issue invoices, handle standing orders, and monitor payment status.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Client
          <select name="clientId" value={form.clientId} onChange={handleChange} required>
            <option value="">Select client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </label>
        <label>
          Client email
          <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="client@company.co.uk" />
        </label>
        <label>
          Amount
          <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="350" required />
        </label>
        <label>
          Currency
          <select name="currency" value={form.currency} onChange={handleChange}>
            <option value="gbp">GBP</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Description
          <input name="description" value={form.description} onChange={handleChange} placeholder="Monthly compliance retainer" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="primary-button" type="submit">Create checkout link</button>
        </div>
      </form>

      {generatedUrl && (
        <div className="section-card" style={{ background: 'rgba(11, 31, 58, 0.05)' }}>
          <strong>Checkout link ready:</strong>
          <a href={generatedUrl} target="_blank" rel="noopener noreferrer">Open Stripe payment link</a>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th>Checkout</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan="5"><div className="empty-state">No payments yet. Generate a Stripe checkout session to begin tracking.</div></td>
              </tr>
            )}
            {payments.map(payment => (
              <tr key={payment.id || payment.stripeSessionId}>
                <td>{payment.clientId ? (clients.find(client => client.id === payment.clientId)?.name || 'Unknown') : '—'}</td>
                <td>{payment.amount ? `£${Number(payment.amount).toFixed(2)}` : '—'}</td>
                <td>
                  <span className={payment.status === 'complete' ? 'status-pill done' : 'status-pill'}>
                    {payment.status || 'pending'}
                  </span>
                </td>
                <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '—'}</td>
                <td>
                  {payment.url && <a className="primary-button" href={payment.url} target="_blank" rel="noopener noreferrer">Open link</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

PaymentsPanel.propTypes = {
  payments: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreateSession: PropTypes.func.isRequired
}

export default PaymentsPanel
