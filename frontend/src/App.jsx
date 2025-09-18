import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PaymentStatus from './pages/PaymentStatus.jsx'

function App () {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/payments/:state" element={<PaymentStatus />} />
    </Routes>
  )
}

export default App
