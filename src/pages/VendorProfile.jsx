import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getAvatarUrl } from '../services/api';
import {
  IconHome, IconWallet, IconDispute,
  IconSettings, IconCheck, IconShield,
} from '../components/DashboardIcons';
import './Dashboard.css';
import './Profile.css';
import NotificationsPanel from '../components/NotificationsPanel';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconActivity(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 12h4l2.5 8 5-16 2.5 8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDoc(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...props}>
      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconVerify(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconDispute, label: 'Litiges', path: '/disputes' },
];

function VendorProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(user?.avatarPath));
  const [avatarError, setAvatarError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setAvatarError('Veuillez choisir une image JPG ou PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setAvatarError('');
    setUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const path = data?.path || data?.data?.path;
      if (setUser) setUser((current) => ({ ...current, avatarPath: path }));
    } catch (err) {
      const message = err?.response?.data?.message;
      setAvatarError(message || "Impossible d'envoyer la photo pour le moment.");
    } finally {
      setUploadingAvatar(false);
    }
  };

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
      await api.patch('/me', { name, phone });
      if (setUser) setUser((current) => ({ ...current, name, phone }));
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 2500);
    } catch (err) {
      const message = err?.response?.data?.message;
      setInfoError(message || 'Impossible de mettre à jour vos informations.');
    } finally {
      setSavingInfo(false);
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
            <h1>Mon profil 👤</h1>
          </div>
          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button" onClick={() => navigate('/settings')}><IconSettings /></button>
          </div>
        </div>

        <div className="ud-body-full">

          <div className="pf-header-card">
            <div className="pf-avatar-wrap">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Photo de profil" className="pf-avatar-img" />
              ) : (
                <span className="pf-avatar">{initials}</span>
              )}
              <button
                type="button"
                className="pf-avatar-edit"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Changer la photo de profil"
                disabled={uploadingAvatar}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
            <div className="pf-header-info">
              {avatarError && <span className="pf-avatar-error">{avatarError}</span>}
              <strong>{(user?.name || '').toUpperCase()}</strong>
              <span className="pf-role-badge">Vendeur</span>
            </div>

            <div className="pf-stats-row">
              <div className="pf-stat">
                <span className="pf-stat-icon pf-stat-icon--blue">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M12 3l2.5 5.5 6 .8-4.4 4.1 1.1 6-5.2-2.9-5.2 2.9 1.1-6-4.4-4.1 6-.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <span className="pf-stat-label">Réputation</span>
                  <strong className="pf-stat-value">{Number(user?.reputationScore ?? 0).toFixed(2)}</strong>
                </div>
              </div>
              <div className="pf-stat">
                <span className="pf-stat-icon pf-stat-icon--green"><IconShield /></span>
                <div>
                  <span className="pf-stat-label">Identité</span>
                  <strong className={`pf-stat-value ${user?.identityStatus === 'approved' ? 'pf-stat-value--ok' : 'pf-stat-value--warning'}`}>
                    {user?.identityStatus === 'approved' ? 'Vérifiée' : 'À vérifier'}
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

              <div className="pf-form-actions">
                {infoSuccess && (
                  <span className="pf-success-tag"><IconCheck /> Enregistré</span>
                )}
                <button className="ud-new-btn-full ud-form-submit pf-submit-btn" type="submit" disabled={savingInfo}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M8 4v5h8V4M8 14h8v6H8v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                  {savingInfo ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>

          <div className="pf-side-col">
            <div className="ud-table-card">
              <div className="pf-card-head">
                <span className="pf-card-head-icon pf-card-head-icon--blue">
                  <IconActivity />
                </span>
                <div>
                  <h3>Activité du compte</h3>
                  <p className="pf-card-sub">Résumé de l'activité récente</p>
                </div>
              </div>

              <div className="pf-activity-list">
                <div className="pf-activity-row">
                  <span className="pf-activity-icon pf-activity-icon--green"><IconCheck /></span>
                  <span className="pf-activity-label">Dernière connexion</span>
                  <span className="pf-activity-value">Aujourd'hui</span>
                </div>
                <div className="pf-activity-row">
                  <span className="pf-activity-icon pf-activity-icon--blue"><IconDoc /></span>
                  <span className="pf-activity-label">Documents soumis</span>
                  <span className="pf-activity-value">0 document</span>
                </div>
                <div className="pf-activity-row">
                  <span className="pf-activity-icon pf-activity-icon--purple"><IconDispute /></span>
                  <span className="pf-activity-label">Litiges ouverts</span>
                  <span className="pf-activity-value">0</span>
                </div>
                <div className="pf-activity-row">
                  <span className="pf-activity-icon pf-activity-icon--gold"><IconVerify /></span>
                  <span className="pf-activity-label">Vérifications en cours</span>
                  <span className="pf-activity-value">{user?.identityStatus === 'approved' ? '0' : '1'}</span>
                </div>
              </div>
            </div>

            <button type="button" className="ud-table-card pf-security-teaser" onClick={() => navigate('/settings')}>
              <div className="pf-card-head">
                <span className="pf-card-head-icon pf-card-head-icon--green"><IconShield /></span>
                <div>
                  <h3>Sécurité du compte</h3>
                  <p className="pf-card-sub">Protégez votre compte</p>
                </div>
              </div>

              <div className="pf-security-teaser-row">
                <span className="pf-security-teaser-icon"><IconCheck /></span>
                <div className="pf-security-teaser-text">
                  <strong>Vos informations sont sécurisées</strong>
                  <p>Nous utilisons un chiffrement de pointe pour protéger vos données.</p>
                </div>
                <IconChevronRight className="pf-security-teaser-arrow" />
              </div>
            </button>
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

export default VendorProfile;