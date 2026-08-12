import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>;
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';

  if (!isAdmin) {
    const fallback = user?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/buyer';
    return <Navigate to={fallback} replace />;
  }

  return children;
}