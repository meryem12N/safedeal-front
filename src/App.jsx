import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyIdentity from './pages/VerifyIdentity';
import VerifyEmail from './pages/VerifyEmail';
import VendorDashboard from './pages/VendorDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import NewTransaction from './pages/NewTransaction';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
        <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* TEMPORAIRE : sans protection, le temps de voir le rendu visuel */}
        <Route path="/verify-identity" element={<VerifyIdentity />} />
        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute>
              <NewTransaction />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;