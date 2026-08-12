import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireVerifiedIdentity({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>;
  }

  // Seuls les vendeurs doivent avoir une identité vérifiée pour créer une transaction.
  if (user?.role === 'vendor' && user?.identityStatus !== 'approved') {
    return <Navigate to="/verify-identity" replace />;
  }

  return children;
}