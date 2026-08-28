import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconBox, IconCheck, IconSettings } from '../components/DashboardIcons';
import UserMenu from '../components/UserMenu';
import NotificationsPanel from '../components/NotificationsPanel';
import { getNotifications, markAllRead as markAllReadApi } from '../services/notificationService';
import './BuyerDashboard.css';
import './BuyerNotifications.css';

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

function IconDisputeNav(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.3 4.5 2.9 17.3c-.6 1 .1 2.2 1.3 2.2h15.6c1.2 0 1.9-1.2 1.3-2.2L13.7 4.5c-.6-1-2-1-2.6 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconHomeSimple, label: 'Tableau de bord', path: '/dashboard/buyer' },
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions' },
  { Icon: IconDisputeNav, label: 'Litiges', path: '/buyer/disputes' },
];

function formatNotifTime(iso) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Hier' : `Il y a ${days} jours`;
}

function BuyerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await markAllReadApi();
      setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silencieux
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
              className="bd-nav-item"
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
            <h1>Notifications</h1>
            <p>Retrouvez toutes vos notifications récentes.</p>
          </div>
          <div className="bd-topbar-actions">
            <NotificationsPanel theme="light" />
            <button className="bd-icon-btn" aria-label="Paramètres" onClick={() => navigate('/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="bd-body">
          <div className="bnt-header">
            {unreadCount > 0 && (
              <button className="bnt-mark-all-btn" type="button" onClick={markAllRead}>
                <IconCheck />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bnt-empty-card">
              <span className="bnt-empty-icon"><IconCheck /></span>
              <strong>Aucune notification</strong>
              <p>Vous êtes à jour, rien de nouveau pour le moment.</p>
            </div>
          ) : (
            <div className="bnt-list">
              {notifications.map((n, i) => (
                <div key={n.id} className={`bnt-card ${!n.isRead ? 'bnt-card--unread' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="bnt-card-icon" style={{ background: 'rgba(61, 107, 255, 0.10)', color: '#3D6BFF' }}>
                    <IconBox />
                  </span>
                  <div className="bnt-card-content">
                    <div className="bnt-card-top">
                      {!n.isRead && <span className="bnt-dot" />}
                    </div>
                    <p>{n.message}</p>
                    <span className="bnt-card-time">{formatNotifTime(n.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default BuyerNotifications;