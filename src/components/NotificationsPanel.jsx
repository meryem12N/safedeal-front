import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { IconBell, IconBox, IconCheck } from './DashboardIcons';
import { getNotifications, markAllRead as markAllReadApi } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import './NotificationsPanel.css';

function formatNotifTime(iso) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Hier' : `Il y a ${days} jours`;
}

function NotificationsPanel({ theme = 'dark' }) {
  const { user } = useAuth();
  const isLight = theme === 'light';
  const lightClass = isLight ? ' np-light' : '';
  const seeAllPath = user?.role === 'buyer' ? '/buyer/notifications' : '/notifications';

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current && !panelRef.current.contains(event.target) &&
        btnRef.current && !btnRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await markAllReadApi();
      setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silencieux
    }
  };

  return (
    <div className="np-wrap">
      <button className={`np-bell-btn${lightClass}`} type="button" onClick={toggleOpen} ref={btnRef}>
        <IconBell />
        {unreadCount > 0 && <span className="np-badge">{unreadCount}</span>}
      </button>

      {open && createPortal(
        <div className={`np-panel${lightClass}`} style={{ top: coords.top, right: coords.right }} ref={panelRef}>
          <div className="np-panel-head">
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button className="np-mark-read" type="button" onClick={markAllRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="np-list">
            {notifications.length === 0 ? (
              <p className="np-empty">Aucune notification pour le moment.</p>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <div key={n.id} className={`np-item ${!n.isRead ? 'np-item--unread' : ''}`}>
                  <span className="np-item-icon" style={{ background: '#04275A', color: '#4DC3FF' }}>
                    <IconBox />
                  </span>
                  <div className="np-item-content">
                    <p>{n.message}</p>
                    <span className="np-item-time">{formatNotifTime(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <span className="np-dot" />}
                </div>
              ))
            )}
          </div>

          <Link to={seeAllPath} className="np-see-all" onClick={() => setOpen(false)}>
            Voir toutes les notifications
          </Link>
        </div>,
        document.body
      )}
    </div>
  );
}

export default NotificationsPanel;