import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth'

export default function GuestRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
