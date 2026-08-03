import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RequireVerifiedIdentity from './components/RequireVerifiedIdentity';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyIdentity from './pages/VerifyIdentity';
import VerifyEmail from './pages/VerifyEmail';
import VendorDashboard from './pages/VendorDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import NewTransaction from './pages/NewTransaction';
import PaymentPage from './pages/PaymentPage';
import TransactionsList from './pages/TransactionsList';
import DisputeForm from './pages/DisputeForm';
import DisputesList from './pages/DisputesList';
import DisputeResponse from './pages/DisputeResponse';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

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

        <Route
          path="/verify-identity"
          element={
            <ProtectedRoute>
              <VerifyIdentity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute>
              <RequireVerifiedIdentity>
                <NewTransaction />
              </RequireVerifiedIdentity>
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />

        {/* Page publique — accessible sans connexion, via le lien secure_link */}
        <Route path="/pay/:transactionId" element={<PaymentPage />} />
        <Route path="/dispute/:transactionId" element={<DisputeForm />} />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <DisputesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes/:transactionId"
          element={
            <ProtectedRoute>
              <DisputeResponse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;