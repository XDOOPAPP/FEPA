import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()

  // Wait for auth to load
  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // All authenticated users can access admin panel (no role check)
  return <>{children}</>
}

export default AdminRoute
