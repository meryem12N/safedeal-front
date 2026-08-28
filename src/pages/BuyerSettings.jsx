import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/profileService';
import { IconBell, IconSettings, IconCheck, IconShield } from '../components/DashboardIcons';
import UserMenu from '../components/UserMenu';
import NotificationsPanel from '../components/NotificationsPanel';
import './BuyerDashboard.css';
import './BuyerProfile.css';

function IconHomeSimple(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPackage(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconDispute(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.3 4.5 2.9 17.3c-.6 1 .1 2.2 1.3 2.2h15.6c1.2 0 1.9-1.2 1.3-2.2L13.7 4.5c-.6-1-2-1-2.6 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettingsNav(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.5 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconHomeSimple, label: 'Tableau de bord', path: '/dashboard/buyer' },
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions' },
  { Icon: IconDispute, label: 'Litiges', path: '/buyer/disputes' },
  
];

function BuyerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch (err) {
      const message = err?.response?.data?.message;
      setPasswordError(message || 'Impossible de mettre à jour le mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="bd-page">
      <aside className="bd-sidebar">
        <div className="bd-brand">
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#054BF9" />
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3D6BFF" />
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>SafeDeal</span>
        </div>

        <nav className="bd-nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`bd-nav-item ${item.active ? 'bd-nav-item--active' : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              onClick={() => navigate(item.path)}
              type="button"
            >
              <item.Icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="bd-sidebar-footer">
          <UserMenu theme="light" />
        </div>
      </aside>

      <main className="bd-main">
        <div className="bd-topbar">
          <div className="bd-topbar-greeting">
            <h1>Paramètres</h1>
            <p>Gérez la sécurité de votre compte.</p>
          </div>
          <div className="bd-topbar-actions">
            <NotificationsPanel theme="light" />
            <button className="bd-icon-btn" aria-label="Paramètres">
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="bd-body">
          <div className="bpf-card bpf-card--single">
            <div className="bpf-card-head">
              <span className="bpf-card-head-icon bpf-card-head-icon--green">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <div>
                <h3>Sécurité</h3>
                <p className="bpf-card-sub">Protégez votre compte</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="bpf-form">
              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-current">Mot de passe actuel</label>
                <div className="bpf-input-shell">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    id="bpf-current"
                    type={showCurrent ? 'text' : 'password'}
                    className="bpf-form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="bpf-eye-btn" onClick={() => setShowCurrent((v) => !v)}>
                    <EyeIcon visible={showCurrent} />
                  </button>
                </div>
              </div>

              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-new">Nouveau mot de passe</label>
                <div className="bpf-input-shell">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    id="bpf-new"
                    type={showNew ? 'text' : 'password'}
                    className="bpf-form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="bpf-eye-btn" onClick={() => setShowNew((v) => !v)}>
                    <EyeIcon visible={showNew} />
                  </button>
                </div>
              </div>

              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-confirm">Confirmer le nouveau mot de passe</label>
                <div className="bpf-input-shell">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    id="bpf-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="bpf-form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="bpf-eye-btn" onClick={() => setShowConfirm((v) => !v)}>
                    <EyeIcon visible={showConfirm} />
                  </button>
                </div>
              </div>

              {passwordError && <div className="bpf-form-error">{passwordError}</div>}

              <div className="bpf-form-actions">
                {passwordSuccess && (
                  <span className="bpf-success-tag"><IconCheck /> Mot de passe mis à jour</span>
                )}
                <button className="bpf-submit-btn" type="submit" disabled={savingPassword}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {savingPassword ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>
          </div>

          <div className="bpf-footer-note">
            <IconShield />
            <span>Vos informations sont sécurisées et confidentielles.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BuyerSettings;