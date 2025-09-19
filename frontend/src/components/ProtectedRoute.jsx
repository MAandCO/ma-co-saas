import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute ({ children }) {
  const { user, loading, authEnabled } = useAuth()
  const location = useLocation()

  if (!authEnabled) {
    return children
  }

  if (loading) {
    return (
      <div className="landing-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="section-card" style={{ maxWidth: 360 }}>
          <h2>Loading workspace…</h2>
          <p style={{ color: 'rgba(31, 42, 68, 0.7)' }}>Authenticating your session.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node
}

export default ProtectedRoute
