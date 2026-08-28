import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../services/api';
import { updateProfile, uploadAvatar } from '../services/profileService';
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

function IconCamera(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconHomeSimple, label: 'Tableau de bord', path: '/dashboard/buyer' },
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions' },
  { Icon: IconDispute, label: 'Litiges', path: '/buyer/disputes' },
  
];

function BuyerProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState('');


  const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(user?.avatarPath));
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError("Veuillez choisir un fichier image.");
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

    try {
      const data = await uploadAvatar(file);
      const path = data?.path || data?.data?.path;
      if (setUser) setUser((current) => ({ ...current, avatarPath: path }));
    } catch (err) {
      const message = err?.response?.data?.message;
      setAvatarError(message || "Impossible d'envoyer la photo pour le moment.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveInfo = async (event) => {
    event.preventDefault();
    setInfoError('');
    setInfoSuccess(false);
    setSavingInfo(true);
    try {
      await updateProfile({ name, phone });
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
            <h1>Mon profil</h1>
            <p>Gérez vos informations personnelles.</p>
          </div>
          <div className="bd-topbar-actions">
            <NotificationsPanel theme="light" />
            <button className="bd-icon-btn" aria-label="Paramètres" onClick={() => navigate('/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="bd-body">
          <div className="bpf-header-card">
            <div className="bpf-avatar-wrap">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Photo de profil" className="bpf-avatar-img" />
              ) : (
                <span className="bpf-avatar">{initials}</span>
              )}
              <button
                type="button"
                className="bpf-avatar-edit"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Changer la photo de profil"
              >
                <IconCamera />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
            <div className="bpf-header-info">
              <strong>{(user?.name || '').toUpperCase()}</strong>
              <span className="bpf-role-badge">Acheteur</span>
              {avatarError && <span className="bpf-avatar-error">{avatarError}</span>}
            </div>
          </div>

          <div className="bpf-card bpf-card--single">
            <div className="bpf-card-head">
              <span className="bpf-card-head-icon bpf-card-head-icon--blue">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                  <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <div>
                <h3>Informations personnelles</h3>
                <p className="bpf-card-sub">Vos informations de base</p>
              </div>
            </div>

            <form onSubmit={handleSaveInfo} className="bpf-form">
              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-name">Nom complet</label>
                <div className="bpf-input-shell">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <input
                    id="bpf-name"
                    className="bpf-form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={savingInfo}
                  />
                </div>
              </div>

              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-email">Email</label>
                <div className="bpf-input-shell bpf-input-disabled">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input id="bpf-email" className="bpf-form-input" value={user?.email || ''} disabled />
                </div>
                <span className="bpf-hint">L'email ne peut pas être modifié pour l'instant.</span>
              </div>

              <div className="bpf-field-group">
                <label className="bpf-field-label" htmlFor="bpf-phone">Téléphone</label>
                <div className="bpf-input-shell">
                  <span className="bpf-input-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 6a2 2 0 0 1 1-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    id="bpf-phone"
                    className="bpf-form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={savingInfo}
                  />
                </div>
              </div>

              {infoError && <div className="bpf-form-error">{infoError}</div>}

              <div className="bpf-form-actions">
                {infoSuccess && (
                  <span className="bpf-success-tag"><IconCheck /> Enregistré</span>
                )}
                <button className="bpf-submit-btn" type="submit" disabled={savingInfo}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <path d="M5 4h11l3 3v13H5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M8 4v5h8V4M8 14h8v6H8v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                  {savingInfo ? 'Enregistrement...' : 'Enregistrer'}
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

export default BuyerProfile;