import { Link, useParams } from 'react-router-dom'

function PaymentStatus () {
  const { state } = useParams()
  const isSuccess = state === 'success'

  return (
    <div className="landing-wrapper" style={{ padding: '120px 32px', textAlign: 'center', minHeight: '100vh' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', background: 'rgba(255,255,255,0.08)', padding: '48px', borderRadius: '32px' }}>
        <h1>{isSuccess ? 'Payment captured' : 'Payment cancelled'}</h1>
        <p style={{ lineHeight: 1.7 }}>
          {isSuccess
            ? 'Thanks! Stripe has confirmed the payment. You can close this tab or return to the dashboard to see the updated status.'
            : 'No problem — the payment flow was cancelled. You can re-open the Stripe checkout session when ready.'}
        </p>
        <Link to="/dashboard" className="hero-primary">Back to dashboard</Link>
      </div>
    </div>
  )
}

export default PaymentStatus
