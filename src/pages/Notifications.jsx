import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconProfile,
  IconSettings, IconLogout, IconChevronDown, IconCheck,
} from '../components/DashboardIcons';
import NotificationsPanel from '../components/NotificationsPanel';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';
import './Dashboard.css';
import './Notifications.css';

const ALL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'payment',
    title: 'Paiement reçu',
    desc: 'Le paiement pour "iphone" a été confirmé et séquestré. Vous pouvez maintenant préparer l\'expédition.',
    time: 'Il y a 12 min',
    unread: true,
  },
  {
    id: 2,
    type: 'dispute',
    title: 'Litige ouvert',
    desc: "Un acheteur a signalé un problème sur la transaction TRX-000001. Consultez les détails et répondez rapidement.",
    time: 'Il y a 1h',
    unread: true,
  },
  {
    id: 3,
    type: 'transaction',
    title: 'Nouvelle transaction créée',
    desc: 'Votre transaction "AirPods Pro" a bien été créée et le lien de paiement a été généré.',
    time: 'Hier',
    unread: false,
  },
  {
    id: 4,
    type: 'transaction',
    title: 'Transaction confirmée',
    desc: 'L\'acheteur a confirmé la réception de "PS5 Console". Le paiement a été libéré.',
    time: 'Il y a 2 jours',
    unread: false,
  },
];

const NOTIF_ICON = { payment: IconWallet, dispute: IconDispute, transaction: IconBox };
const NOTIF_COLOR = {
  payment: { bg: '#062826', color: '#4AE888' },
  dispute: { bg: '#3A1414', color: '#E0403F' },
  transaction: { bg: '#04275A', color: '#4DC3FF' },
};

function Notifications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isVendor = user?.role === 'vendor';
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const NAV_ITEMS = [
    { Icon: IconHome, label: 'Dashboard', path: isVendor ? '/dashboard/vendor' : '/dashboard/buyer' },
    { Icon: IconWallet, label: 'Finance', path: null },
    { Icon: IconDispute, label: 'Litiges', path: isVendor ? '/disputes' : null },
  ];

  const firstName = user?.name?.split(' ')[0] || 'Utilisateur';
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((current) => current.map((n) => ({ ...n, unread: false })));
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
            onClick={() => navigate(isVendor ? '/dashboard/vendor' : '/dashboard/buyer')}
          >
            <IconHome /> <span>Dashboard</span>
          </button>
          {isVendor && <SidebarTransactionsMenu delay={0.13} />}
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
            <h1>Bonjour, {firstName} 👋</h1>
          </div>
          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button"><IconSettings /></button>
          </div>
        </div>

        <div className="ud-body-full">
          <div className="ud-greeting ud-entrance-fade nt-header">
            <div>
              <h1>Notifications</h1>
              <p>Retrouvez toutes vos notifications récentes.</p>
            </div>
            {unreadCount > 0 && (
              <button className="nt-mark-all-btn" type="button" onClick={markAllRead}>
                <IconCheck />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="nt-empty-card">
              <span className="nt-empty-icon"><IconCheck /></span>
              <strong>Aucune notification</strong>
              <p>Vous êtes à jour, rien de nouveau pour le moment.</p>
            </div>
          ) : (
            <div className="nt-list">
              {notifications.map((n, i) => {
                const Icon = NOTIF_ICON[n.type];
                const colors = NOTIF_COLOR[n.type];
                return (
                  <div key={n.id} className={`nt-card ${n.unread ? 'nt-card--unread' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className="nt-card-icon" style={{ background: colors.bg, color: colors.color }}>
                      <Icon />
                    </span>
                    <div className="nt-card-content">
                      <div className="nt-card-top">
                        <strong>{n.title}</strong>
                        {n.unread && <span className="nt-dot" />}
                      </div>
                      <p>{n.desc}</p>
                      <span className="nt-card-time">{n.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;