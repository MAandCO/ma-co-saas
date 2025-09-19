import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './LandingPage.css'

function AuthPage () {
  const { signIn, signUp, error, clearError, authEnabled, authDisabledMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async event => {
    event.preventDefault()
    if (!authEnabled) {
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password })
      } else {
        await signUp({ email: form.email, password: form.password })
      }
      navigate(from, { replace: true })
    } catch (err) {
      // handled by context error state
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = nextMode => {
    setMode(nextMode)
    clearError()
  }

  return (
    <div className="landing-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div className="automation-card" style={{ maxWidth: 420, width: '100%' }}>
        <h1 style={{ marginBottom: 12 }}>{mode === 'login' ? 'Welcome back, Ma & Co' : 'Create your Ma & Co cockpit'}</h1>
        <p style={{ marginBottom: 24, color: 'rgba(245,245,255,0.8)' }}>
          {mode === 'login'
            ? 'Sign in with the credentials provided for your Supabase-authenticated workspace.'
            : 'Register with an email and password to spin up a new Supabase-authenticated workspace.'}
        </p>
        {!authEnabled && (
          <div className="section-card" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#fff' }}>
            <strong>Authentication disabled</strong>
            <div>{authDisabledMessage}</div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="form-grid" style={{ gap: 18 }}>
          <label>
            Email address
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
              disabled={!authEnabled}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
              disabled={!authEnabled}
            />
          </label>
          {error && (
            <div className="section-card" style={{ background: 'rgba(255,99,71,0.12)', color: '#fff' }}>
              <strong>Auth error</strong>
              <div>{error}</div>
            </div>
          )}
          <button className="hero-primary" type="submit" disabled={submitting || !authEnabled}>
            {authEnabled ? (submitting ? 'Working…' : mode === 'login' ? 'Sign in' : 'Sign up') : 'Unavailable'}
          </button>
        </form>
        <div style={{ marginTop: 24, color: 'rgba(245,245,255,0.8)' }}>
          {authEnabled && (mode === 'login'
            ? (<span>Need an account? <button type="button" className="nav-cta" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => switchMode('signup')}>Create one</button></span>)
            : (<span>Already onboarded? <button type="button" className="nav-cta" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => switchMode('login')}>Sign in</button></span>))}
        </div>
        <div style={{ marginTop: 18 }}>
          <Link to="/" className="hero-secondary">Back to site</Link>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
