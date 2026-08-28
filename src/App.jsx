import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RequireVerifiedIdentity from './components/RequireVerifiedIdentity';
import RequireAdmin from './components/RequireAdmin';
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
import PaymentRedirect from './pages/PaymentRedirect';
import TransactionsList from './pages/TransactionsList';
import BuyerTransactionsList from './pages/BuyerTransactionsList';
import BuyerDisputesList from './pages/BuyerDisputesList';
import BuyerDisputeStatus from './pages/BuyerDisputeStatus';
import DisputeForm from './pages/DisputeForm';
import DisputesList from './pages/DisputesList';
import DisputeResponse from './pages/DisputeResponse';
import Profile from './pages/Profile';
import ProfileRoute from './pages/ProfileRoute';
import SettingsRoute from './pages/SettingsRoute';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTransactions from './pages/AdminTransactions';
import AdminIdentities from './pages/AdminIdentities';
import AdminDisputes from './pages/AdminDisputes';
import BuyerNotifications from './pages/BuyerNotifications';

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
        <Route
          path="/dashboard/vendor"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/buyer"
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/transactions"
          element={
            <ProtectedRoute>
              <BuyerTransactionsList />
            </ProtectedRoute>
          }
        />

        {/* Page publique — accessible sans connexion, via le lien secure_link */}
        <Route path="/pay/:transactionId" element={<PaymentPage />} />
        {/* Alias : le backend redirige ici après Stripe (successUrl/cancelUrl) */}
        <Route path="/transactions/:transactionId" element={<PaymentPage />} />
        {/* Redirections de secours après paiement Stripe, en attendant la config successUrl/cancelUrl côté backend */}
        <Route path="/payment/success" element={<PaymentRedirect />} />
        <Route path="/payment/cancel" element={<Navigate to="/transactions" replace />} />
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
          path="/buyer/disputes"
          element={
            <ProtectedRoute>
              <BuyerDisputesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/disputes/:transactionId"
          element={
            <ProtectedRoute>
              <BuyerDisputeStatus />
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
              <ProfileRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsRoute />
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
        <Route
          path="/buyer/notifications"
          element={
            <ProtectedRoute>
              <BuyerNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminUsers />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminTransactions />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/identities"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminIdentities />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/disputes"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminDisputes />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;