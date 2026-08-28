import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import NotificationsPanel from '../components/NotificationsPanel';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard } from '../services/dashboardService';
import './AdminPages.css';

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
function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M20.5 14.5a8.5 8.5 0 1 1-9-11 6.8 6.8 0 0 0 9 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconWallet(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconCoins(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <ellipse cx="9" cy="7" rx="6" ry="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 9c3 .2 6 1.4 6 3.5v4c0 1.7-2.7 3-6 3-1 0-2-.1-2.8-.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconTarget(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconCart(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" />
      <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
const NAV_ITEMS = [
  { Icon: IconGrid, label: "Vue d'ensemble", path: '/admin/dashboard', active: true },
  { Icon: IconTransactions, label: 'Transactions', path: '/admin/transactions' },
  { Icon: IconUsers, label: 'Utilisateurs', path: '/admin/users' },
  { Icon: IconShieldCheck, label: 'Vérifications', path: '/admin/identities' },
  { Icon: IconDispute, label: 'Litiges', path: '/admin/disputes' },
];


function formatAmount(amount) {
  const normalized = typeof amount === 'string' ? amount.replace(',', '.') : amount;
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 2 }).format(Number(normalized || 0));
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

const STATUS_LABEL = {
  pending_payment: 'En attente',
  payment_received: 'Paiement reçu',
  in_shipping: 'En livraison',
  delivered: 'Livré',
  closed: 'Terminé',
  dispute: 'Litige',
  cancelled: 'Annulé',
};
const STATUS_VARIANT = {
  pending_payment: 'muted',
  payment_received: 'info',
  in_shipping: 'info',
  delivered: 'success',
  closed: 'success',
  dispute: 'dispute',
  cancelled: 'muted',
};

const EMPTY_TEXT_STYLE = { textAlign: 'center', color: 'var(--adm-text-muted)', padding: '24px 0', fontSize: 13 };

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    let isMounted = true;
    getAdminDashboard(period)
      .then((data) => { if (isMounted) setDashboard(data); })
      .catch(() => { if (isMounted) setDashboard(null); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [period]);

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const changePeriod = (p) => {
    setLoading(true);
    setPeriod(p);
  };

  const stats = [
    { key: 'transactions', label: 'Transactions', value: dashboard?.totalTransactions ?? 0, Icon: IconTransactions, color: 'blue' },
    { key: 'escrow', label: 'Montant sous séquestre', value: formatAmount(dashboard?.escrowAmount), Icon: IconLock, color: 'green' },
    { key: 'revenue', label: 'CA total', value: formatAmount(dashboard?.totalVolume), Icon: IconWallet, color: 'purple' },
    { key: 'commission', label: 'Commission gagnée', value: formatAmount(dashboard?.commission), Icon: IconCoins, color: 'gold' },
    { key: 'success', label: 'Taux de réussite', value: `${dashboard?.successRate ?? 0}%`, Icon: IconTarget, color: 'blue' },
    { key: 'today', label: "Transactions aujourd'hui", value: dashboard?.transactionsToday ?? 0, Icon: IconCart, color: 'green' },
  ];

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
              className={`adm-nav-item ${item.active ? 'adm-nav-item--active' : ''} ${!item.path ? 'adm-nav-item--disabled' : ''}`}
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
            <h1>Bonjour, {firstName} 👋</h1>
            <p>Voici l'activité de la plateforme SafeDeal aujourd'hui.</p>
          </div>
          <div className="adm-topbar-actions">
            <div className="adm-search-box">
              <IconSearch />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <NotificationsPanel theme="admin" />
            <button className="adm-icon-btn adm-icon-btn--blue" type="button" onClick={() => navigate('/admin/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-stats-grid adm-stats-grid--6">
            {stats.map((s) => (
              <div key={s.key} className="adm-stat-card2">
                <div className="adm-stat-card2-head">
                  <span className={`adm-stat-icon adm-stat-icon--${s.color}`}><s.Icon /></span>
                  <div className="adm-stat-card2-text">
                    <span className="adm-stat-label">{s.label}</span>
                    <strong className="adm-stat-value">{loading ? '…' : s.value}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="adm-main-grid">
            <div className="adm-chart-card">
              <div className="adm-chart-head">
                <h3>Volume de transactions</h3>
                <div className="adm-period-toggle">
                  <button
                    type="button"
                    className={`adm-period-btn ${period === '7d' ? 'adm-period-btn--active' : ''}`}
                    onClick={() => changePeriod('7d')}
                  >
                    7 jours
                  </button>
                  <button
                    type="button"
                    className={`adm-period-btn ${period === '30d' ? 'adm-period-btn--active' : ''}`}
                    onClick={() => changePeriod('30d')}
                  >
                    30 jours
                  </button>
                  <button
                    type="button"
                    className={`adm-period-btn ${period === '12m' ? 'adm-period-btn--active' : ''}`}
                    onClick={() => changePeriod('12m')}
                  >
                    12 mois
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dashboard?.volumeSeries || []}>
                  <defs>
                    <linearGradient id="admVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B8DEF" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#5B8DEF" stopOpacity={0} />
                    </linearGradient>
                    <filter id="admDotGlow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#5B6272' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5B6272' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#14171F', border: '1px solid rgba(91,141,239,0.3)', borderRadius: 12, fontSize: 12.5, color: '#F5F6FA' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#5B8DEF"
                    strokeWidth={2.5}
                    fill="url(#admVolumeGrad)"
                    isAnimationActive
                    animationDuration={1200}
                    dot={{ r: 4.5, fill: '#5B8DEF', stroke: '#fff', strokeWidth: 1.5, filter: 'url(#admDotGlow)' }}
                    activeDot={{ r: 6, fill: '#5B8DEF', stroke: '#fff', strokeWidth: 2, filter: 'url(#admDotGlow)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="adm-revenue-card">
              <div className="adm-chart-head">
                <h3>Revenus aujourd'hui</h3>
              </div>
              <p style={EMPTY_TEXT_STYLE}>Aucune donnée disponible.</p>
            </div>
          </div>

          <div className="adm-bottom-grid">
            <div className="adm-activity-card">
              <div className="adm-chart-head">
                <h3>Activité récente</h3>
                <button type="button" className="adm-link-btn">Voir tout</button>
              </div>
              {!loading && (dashboard?.activity || []).length === 0 ? (
                <p style={EMPTY_TEXT_STYLE}>Aucune donnée disponible.</p>
              ) : (
                (dashboard?.activity || []).slice(0, 5).map((a) => (
                  <div key={`${a.transactionId}-${a.createdAt}`} className="adm-activity-row">
                    <span className="adm-activity-icon adm-stat-icon--blue"><IconTransactions /></span>
                    <div className="adm-activity-info">
                      <strong>{a.title}</strong>
                      <span>{a.detail}</span>
                    </div>
                    <span className="adm-activity-time">{formatDate(a.createdAt)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="adm-tx-card">
              <div className="adm-chart-head">
                <h3>Dernières transactions</h3>
                <button type="button" className="adm-link-btn" onClick={() => navigate('/admin/transactions')}>Voir toutes</button>
              </div>
              {!loading && (dashboard?.latestTransactions || []).length === 0 ? (
                <p style={EMPTY_TEXT_STYLE}>Aucune donnée disponible.</p>
              ) : (
                <table className="adm-table adm-table--compact">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.latestTransactions || []).slice(0, 5).map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="adm-tx-title-cell">
                            <span className="adm-tx-thumb" />
                            <div>
                              <strong>{t.title}</strong>
                              <span className="adm-tx-ref">#SD-{String(t.id).padStart(6, '0')}</span>
                            </div>
                          </div>
                        </td>
                        <td>{formatAmount(t.amount)}</td>
                        <td><span className={`adm-badge adm-badge--${STATUS_VARIANT[t.status] || 'muted'}`}>{STATUS_LABEL[t.status] || t.status}</span></td>
                        <td>{formatDate(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="adm-users-card">
              <div className="adm-chart-head">
                <h3>Nouveaux utilisateurs</h3>
                <button type="button" className="adm-link-btn" onClick={() => navigate('/admin/users')}>Voir tout</button>
              </div>
              {!loading && (dashboard?.newUsers || []).length === 0 ? (
                <p style={EMPTY_TEXT_STYLE}>Aucune donnée disponible.</p>
              ) : (
                <>
                  {(dashboard?.newUsers || []).slice(0, 5).map((u) => (
                    <div key={u.id} className="adm-newuser-row">
                      <span className="adm-table-avatar">{initials(u.name)}</span>
                      <div className="adm-newuser-info">
                        <strong>{u.name}</strong>
                        <span className="adm-card-sub">{u.role}</span>
                      </div>
                      <span className="adm-activity-time">{formatDate(u.createdAt)}</span>
                    </div>
                  ))}
                  <div className="adm-newuser-total">
                    <span>Total nouveaux</span>
                    <strong>{(dashboard?.newUsers || []).length}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;