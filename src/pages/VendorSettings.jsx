import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  IconHome, IconDispute,
  IconSettings, IconCheck, IconShield,
} from '../components/DashboardIcons';
import './Dashboard.css';
import './Profile.css';
import NotificationsPanel from '../components/NotificationsPanel';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.5 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconDispute, label: 'Litiges', path: '/disputes' },
];

function VendorSettings() {
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
      await api.post('/me/change-password', {
        currentPassword,
        newPassword,
      });
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
    <div className="ud-page">
      <div className="ud-glow ud-glow-1" />
      <div className="ud-glow ud-glow-2" />
      <div className="ud-glow ud-glow-3" />

      <aside className="ud-sidebar-full ud-entrance-left">
        <div className="ud-sidebar-brand-full">
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0" />
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF" />
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>SafeDeal</span>
        </div>

        <nav className="ud-nav-full">
          <button
            className="ud-nav-item-full"
            style={{ animationDelay: '0.1s' }}
            type="button"
            onClick={() => navigate('/dashboard/vendor')}
          >
            <IconHome /> <span>Dashboard</span>
          </button>
          <SidebarTransactionsMenu delay={0.13} />
          {NAV_ITEMS.slice(1).map((item, index) => (
            <button
              key={item.label}
              className={`ud-nav-item-full ${!item.path ? 'ud-nav-disabled' : ''}`}
              style={{ animationDelay: (0.16 + index * 0.03) + 's' }}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              disabled={!item.path}
            >
              <item.Icon /> <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <UserMenu />
      </aside>

      <main className="ud-main-full">
        <div className="ud-topbar-full ud-entrance-top">
          <div className="ud-topbar-greeting">
            <h1>Paramètres ⚙️</h1>
          </div>
          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button"><IconSettings /></button>
          </div>
        </div>

        <div className="ud-body-full">

          <div className="ud-table-card" style={{ maxWidth: 640 }}>
            <div className="pf-card-head">
              <span className="pf-card-head-icon pf-card-head-icon--green">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </span>
              <div>
                <h3>Sécurité</h3>
                <p className="pf-card-sub">Protégez votre compte</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="pf-form">
              <div className="ud-field-group">
                <label className="ud-field-label" htmlFor="pf-current">Mot de passe actuel</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="pf-current"
                    type={showCurrent ? 'text' : 'password'}
                    className="ud-form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="pf-eye-btn" onClick={() => setShowCurrent((v) => !v)}>
                    <EyeIcon visible={showCurrent} />
                  </button>
                </div>
              </div>

              <div className="ud-field-group">
                <label className="ud-field-label" htmlFor="pf-new">Nouveau mot de passe</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="pf-new"
                    type={showNew ? 'text' : 'password'}
                    className="ud-form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="pf-eye-btn" onClick={() => setShowNew((v) => !v)}>
                    <EyeIcon visible={showNew} />
                  </button>
                </div>
              </div>

              <div className="ud-field-group">
                <label className="ud-field-label" htmlFor="pf-confirm">Confirmer le nouveau mot de passe</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="pf-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="ud-form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={savingPassword}
                  />
                  <button type="button" className="pf-eye-btn" onClick={() => setShowConfirm((v) => !v)}>
                    <EyeIcon visible={showConfirm} />
                  </button>
                </div>
              </div>

              {passwordError && <div className="ud-form-error">{passwordError}</div>}

              <div className="pf-form-actions">
                {passwordSuccess && (
                  <span className="pf-success-tag"><IconCheck /> Mot de passe mis à jour</span>
                )}
                <button className="ud-new-btn-full ud-form-submit pf-submit-btn" type="submit" disabled={savingPassword}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  {savingPassword ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>
          </div>

          <div className="pf-footer-note">
            <IconShield />
            <span>Vos informations sont sécurisées et confidentielles.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendorSettings;