import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RootRedirect: React.FC = () => {
  const { loading, isAuthenticated } = useAuth()

  // Wait for auth to load
  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Always redirect to admin dashboard when authenticated
  return <Navigate to="/admin/dashboard" replace />
}

export default RootRedirect
