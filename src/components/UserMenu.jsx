import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../services/api';
import { IconProfile, IconSettings, IconLogout } from './DashboardIcons';
import './UserMenu.css';

function UserMenu({ theme = 'dark', roleOverride = null }) {
  const { user, logout } = useAuth();
  const themeClass = theme === 'light' ? ' um-light' : theme === 'admin' ? ' um-admin' : '';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ bottom: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        btnRef.current && !btnRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="um-wrap">
      <button className={`ud-nav-item-full um-trigger${themeClass}`} type="button" onClick={toggleOpen} ref={btnRef}>
        {user?.avatarPath ? (
          <img src={getAvatarUrl(user.avatarPath)} alt="Avatar" className="um-avatar-img" />
        ) : (
          <span className="um-avatar">{initials}</span>
        )}
        <span className="um-info">
          <strong>{user?.name || 'Utilisateur'}</strong>
          <small>{roleOverride || (user?.role === 'vendor' ? 'Vendeur' : 'Acheteur')}</small>
        </span>
        <svg className="um-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && createPortal(
        <div
          className={`um-menu${themeClass}`}
          style={{ bottom: coords.bottom, left: coords.left, width: coords.width }}
          ref={menuRef}
        >
          <button
            type="button"
            className="um-menu-item"
            onClick={() => { setOpen(false); navigate('/profile'); }}
          >
            <IconProfile />
            <span>Profil</span>
          </button>
          <button
            type="button"
            className="um-menu-item"
            onClick={() => { setOpen(false); navigate('/settings'); }}
          >
            <IconSettings />
            <span>Paramètres</span>
          </button>
          <div className="um-menu-divider" />
          <button
            type="button"
            className="um-menu-item um-menu-item--danger"
            onClick={() => { setOpen(false); logout(); }}
          >
            <IconLogout />
            <span>Déconnexion</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}



export default UserMenu;