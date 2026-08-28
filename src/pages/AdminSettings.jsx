import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserMenu from '../components/UserMenu';
import { IconSettings, IconCheck, IconShield } from '../components/DashboardIcons';
import './AdminPages.css';
import './Profile.css';

function IconGrid(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 13.5c2.8.4 5 2.8 5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconTransactions(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function IconShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  { Icon: IconGrid, label: "Vue d'ensemble", path: '/admin/dashboard' },
  { Icon: IconTransactions, label: 'Transactions', path: '/admin/transactions' },
  { Icon: IconUsers, label: 'Utilisateurs', path: '/admin/users' },
  { Icon: IconShieldCheck, label: 'Vérifications', path: '/admin/identities' },
  { Icon: IconDispute, label: 'Litiges', path: '/admin/disputes' },
];

function AdminSettings() {
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
    <div className="adm-page">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <span className="adm-brand-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span>SafeDeal</span>
            <small>Admin</small>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`adm-nav-item ${!item.path ? 'adm-nav-item--disabled' : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              disabled={!item.path}
            >
              <item.Icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <UserMenu theme="admin" roleOverride="Administrateur" />
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-title">
            <h1>Paramètres ⚙️</h1>
            <p>Gérez la sécurité de votre compte administrateur.</p>
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-icon-btn" type="button" onClick={() => navigate('/admin/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-table-card" style={{ maxWidth: 640 }}>
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
                <label className="ud-field-label" htmlFor="adm-pf-current">Mot de passe actuel</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="adm-pf-current"
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
                <label className="ud-field-label" htmlFor="adm-pf-new">Nouveau mot de passe</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="adm-pf-new"
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
                <label className="ud-field-label" htmlFor="adm-pf-confirm">Confirmer le nouveau mot de passe</label>
                <div className="ud-input-shell pf-input-shell">
                  <span className="pf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <input
                    id="adm-pf-confirm"
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

export default AdminSettings;