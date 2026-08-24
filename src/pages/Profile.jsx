import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconProfile,
  IconSettings, IconLogout, IconBell, IconCheck, IconShield,
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

function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const isVendor = user?.role === 'vendor';

  const NAV_ITEMS = [
    { Icon: IconHome, label: 'Dashboard', path: isVendor ? '/dashboard/vendor' : '/dashboard/buyer' },
    { Icon: IconDispute, label: 'Litiges', path: isVendor ? '/disputes' : null },
  ];

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Utilisateur';
  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
    : '—';

  const handleSaveInfo = async (event) => {
    event.preventDefault();
    setInfoError('');
    setInfoSuccess(false);
    setSavingInfo(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (setUser) setUser((current) => ({ ...current, name, phone }));
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 2500);
    } catch {
      setInfoError('Impossible de mettre à jour vos informations.');
    } finally {
      setSavingInfo(false);
    }
  };

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
      await new Promise((resolve) => setTimeout(resolve, 700));
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch {
      setPasswordError('Impossible de mettre à jour le mot de passe.');
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
            onClick={() => navigate(NAV_ITEMS[0].path)}
          >
            <IconHome /> <span>Dashboard</span>
          </button>
          {isVendor && <SidebarTransactionsMenu delay={0.13} />}
          {NAV_ITEMS.slice(1).map((item, index) => (
            <button
              key={item.label}
              className={`ud-nav-item-full ${item.active ? 'active' : ''} ${!item.path ? 'ud-nav-disabled' : ''}`}
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
            <h1>Mon profil 👤</h1>
          </div>
          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button" onClick={() => navigate('/settings')}><IconSettings /></button>
          </div>
        </div>

        <div className="ud-body-full">
          

          <div className="pf-header-card">
            <span className="pf-avatar">{initials}</span>
            <div className="pf-header-info">
              <strong>{(user?.name || '').toUpperCase()}</strong>
              <span className="pf-role-badge">{isVendor ? 'Vendeur' : 'Acheteur'}</span>
            </div>

            {isVendor && (
              <div className="pf-stats-row">
                <div className="pf-stat">
                  <span className="pf-stat-icon pf-stat-icon--blue">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path d="M12 3l2.5 5.5 6 .8-4.4 4.1 1.1 6-5.2-2.9-5.2 2.9 1.1-6-4.4-4.1 6-.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <span className="pf-stat-label">Réputation</span>
                    <strong className="pf-stat-value">{Number(user?.reputation_score ?? 0).toFixed(2)}</strong>
                  </div>
                </div>
                <div className="pf-stat">
                  <span className="pf-stat-icon pf-stat-icon--green"><IconShield /></span>
                  <div>
                    <span className="pf-stat-label">Identité</span>
                    <strong className={`pf-stat-value ${user?.identity_status === 'approved' ? 'pf-stat-value--ok' : 'pf-stat-value--warning'}`}>
                      {user?.identity_status === 'approved' ? 'Vérifiée' : 'À vérifier'}
                    </strong>
                  </div>
                </div>
                <div className="pf-stat">
                  <span className="pf-stat-icon pf-stat-icon--blue2">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <span className="pf-stat-label">Membre depuis</span>
                    <strong className="pf-stat-value">{memberSince}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pf-grid">
            <div className="ud-table-card">
              <div className="pf-card-head">
                <span className="pf-card-head-icon pf-card-head-icon--blue">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                    <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </span>
                <div>
                  <h3>Informations personnelles</h3>
                  <p className="pf-card-sub">Vos informations de base</p>
                </div>
              </div>

              <form onSubmit={handleSaveInfo} className="pf-form">
                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="pf-name">Nom complet</label>
                  <div className="ud-input-shell pf-input-shell">
                    <span className="pf-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                        <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                    </span>
                    <input
                      id="pf-name"
                      className="ud-form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={savingInfo}
                    />
                  </div>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="pf-email">Email</label>
                  <div className="ud-input-shell pf-input-shell pf-input-disabled">
                    <span className="pf-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input id="pf-email" className="ud-form-input" value={user?.email || ''} disabled />
                  </div>
                  <span className="pf-hint">L'email ne peut pas être modifié pour l'instant.</span>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="pf-phone">Téléphone</label>
                  <div className="ud-input-shell pf-input-shell">
                    <span className="pf-input-icon">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                        <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 6a2 2 0 0 1 1-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input
                      id="pf-phone"
                      className="ud-form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={savingInfo}
                    />
                  </div>
                </div>

                {infoError && <div className="ud-form-error">{infoError}</div>}

                <div className="ud-form-error" style={{ background: 'rgba(232,162,61,0.12)', color: '#E8A23D', border: '1px solid rgba(232,162,61,0.25)' }}>
                  Cette fonctionnalité arrive bientôt.
                </div>

                <div className="pf-form-actions">
                  {infoSuccess && (
                    <span className="pf-success-tag"><IconCheck /> Enregistré</span>
                  )}
                  <button className="ud-new-btn-full ud-form-submit pf-submit-btn" type="submit" disabled={true}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M8 4v5h8V4M8 14h8v6H8v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    </svg>
                    {savingInfo ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </div>

            <div className="ud-table-card">
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

                <div className="ud-form-error" style={{ background: 'rgba(232,162,61,0.12)', color: '#E8A23D', border: '1px solid rgba(232,162,61,0.25)' }}>
                  Cette fonctionnalité arrive bientôt.
                </div>

                <div className="pf-form-actions">
                  {passwordSuccess && (
                    <span className="pf-success-tag"><IconCheck /> Mot de passe mis à jour</span>
                  )}
                  <button className="ud-new-btn-full ud-form-submit pf-submit-btn" type="submit" disabled={true}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                    {savingPassword ? 'Mise à jour...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
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

export default Profile;