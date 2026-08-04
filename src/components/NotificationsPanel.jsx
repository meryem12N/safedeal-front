import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { IconBell, IconBox, IconWallet, IconDispute, IconCheck } from './DashboardIcons';
import './NotificationsPanel.css';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'payment',
    title: 'Paiement reçu',
    desc: 'Le paiement pour "iphone" a été confirmé et séquestré.',
    time: 'Il y a 12 min',
    unread: true,
  },
  {
    id: 2,
    type: 'dispute',
    title: 'Litige ouvert',
    desc: "Un acheteur a signalé un problème sur la transaction TRX-000001.",
    time: 'Il y a 1h',
    unread: true,
  },
  {
    id: 3,
    type: 'transaction',
    title: 'Nouvelle transaction créée',
    desc: 'Votre transaction "AirPods Pro" a bien été créée.',
    time: 'Hier',
    unread: false,
  },
];

const NOTIF_ICON = { payment: IconWallet, dispute: IconDispute, transaction: IconBox };

const NOTIF_COLOR_DARK = {
  payment: { bg: '#062826', color: '#4AE888' },
  dispute: { bg: '#3A1414', color: '#E0403F' },
  transaction: { bg: '#04275A', color: '#4DC3FF' },
};

const NOTIF_COLOR_LIGHT = {
  payment: { bg: 'rgba(22, 179, 104, 0.10)', color: '#16B368' },
  dispute: { bg: 'rgba(224, 64, 63, 0.10)', color: '#E0403F' },
  transaction: { bg: 'rgba(61, 107, 255, 0.10)', color: '#3D6BFF' },
};

function NotificationsPanel({ theme = 'dark' }) {
  const isLight = theme === 'light';
  const lightClass = isLight ? ' np-light' : '';
  const NOTIF_COLOR = isLight ? NOTIF_COLOR_LIGHT : NOTIF_COLOR_DARK;
  const seeAllPath = isLight ? '/buyer/notifications' : '/notifications';

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const markAllRead = () => {
    setNotifications((current) => current.map((n) => ({ ...n, unread: false })));
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
              notifications.slice(0, 4).map((n) => {
                const Icon = NOTIF_ICON[n.type];
                const colors = NOTIF_COLOR[n.type];
                return (
                  <div key={n.id} className={`np-item ${n.unread ? 'np-item--unread' : ''}`}>
                    <span className="np-item-icon" style={{ background: colors.bg, color: colors.color }}>
                      <Icon />
                    </span>
                    <div className="np-item-content">
                      <strong>{n.title}</strong>
                      <p>{n.desc}</p>
                      <span className="np-item-time">{n.time}</span>
                    </div>
                    {n.unread && <span className="np-dot" />}
                  </div>
                );
              })
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