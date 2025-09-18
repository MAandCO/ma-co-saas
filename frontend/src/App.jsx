import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PaymentStatus from './pages/PaymentStatus.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App () {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/payments/:state"
        element={(
          <ProtectedRoute>
            <PaymentStatus />
          </ProtectedRoute>
        )}
      />
    </Routes>
  )
}

export default App
