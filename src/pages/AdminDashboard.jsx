import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
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
function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12.3l2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTrendUp(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 16l6-6 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUserPlus(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8v6M15 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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


const MOCK_STATS = [
  { key: 'transactions', label: 'Transactions', value: '340', trend: '+8%', Icon: IconTransactions, color: 'blue', spark: [8,10,9,12,11,13,15,14,16] },
  { key: 'escrow', label: 'Montant sous séquestre', value: '89 000 MAD', trend: '+15%', Icon: IconLock, color: 'green', spark: [5,7,6,9,8,11,10,13,14] },
  { key: 'revenue', label: 'CA total', value: '235 000 MAD', trend: '+12%', Icon: IconWallet, color: 'purple', spark: [10,9,12,11,14,13,16,15,18] },
  { key: 'commission', label: 'Commission gagnée', value: '7 430 MAD', trend: '+10%', Icon: IconCoins, color: 'gold', spark: [4,5,5,6,7,7,8,9,9] },
  { key: 'success', label: 'Taux de réussite', value: '98.8%', trend: '+2.4%', Icon: IconTarget, color: 'blue', spark: [95,96,96,97,97,98,98,99,99] },
  { key: 'today', label: "Transactions aujourd'hui", value: '18', trend: '+5', Icon: IconCart, color: 'green', spark: [2,3,3,4,3,5,4,6,6] },
];

const CHART_DATA = [
  { day: 'Lun', volume: 8200 },
  { day: 'Mar', volume: 11400 },
  { day: 'Mer', volume: 9800 },
  { day: 'Jeu', volume: 15600 },
  { day: 'Ven', volume: 19850 },
  { day: 'Sam', volume: 17200 },
  { day: 'Dim', volume: 22100 },
];

const REVENUE_TODAY = [
  { h: '00h', v: 200 }, { h: '02h', v: 350 }, { h: '04h', v: 180 }, { h: '06h', v: 420 },
  { h: '08h', v: 900 }, { h: '10h', v: 1400 }, { h: '12h', v: 1800 }, { h: '14h', v: 1200 },
  { h: '16h', v: 2100 }, { h: '18h', v: 1600 }, { h: '20h', v: 2400 }, { h: '22h', v: 1900 },
];

const MOCK_ACTIVITY = [
  { id: 1, type: 'transaction', title: 'Nouvelle transaction #SD-000342', desc: 'Nike Air Max · 1 400 MAD', time: 'Il y a 2 min' },
  { id: 2, type: 'identity', title: 'Nouvelle demande de vérification', desc: 'Yassine Tazi', time: 'Il y a 8 min' },
  { id: 3, type: 'dispute', title: 'Litige ouvert sur la transaction #SD-000341', desc: 'iPhone 15 Pro Max', time: 'Il y a 42 min' },
  { id: 4, type: 'user', title: 'Nouvel utilisateur inscrit', desc: 'Ahmed El Mansouri', time: 'Il y a 1h' },
  { id: 5, type: 'resolved', title: 'Litige résolu #LT-00021', desc: 'Remboursement effectué', time: 'Il y a 2h' },
];

const ACTIVITY_ICON = { transaction: IconTransactions, identity: IconShieldCheck, dispute: IconDispute, user: IconUserPlus, resolved: IconCheck };
const ACTIVITY_COLOR = { transaction: 'green', identity: 'gold', dispute: 'red', user: 'blue', resolved: 'green' };

const MOCK_LATEST_TX = [
  { ref: 'SD-000342', buyer: 'Meryem B.', vendor: 'Ahmed K.', amount: '1 400 MAD', status: 'Complétée', date: '04/08/2026 22:10' },
  { ref: 'SD-000341', buyer: 'Yassine T.', vendor: 'Karim E.', amount: '2 850 MAD', status: 'En cours', date: '04/08/2026 20:45' },
  { ref: 'SD-000340', buyer: 'Fatima Z.', vendor: 'Reda H.', amount: '950 MAD', status: 'Séquestrée', date: '04/08/2026 18:33' },
  { ref: 'SD-000339', buyer: 'Omar A.', vendor: 'Youssef M.', amount: '1 950 MAD', status: 'Complétée', date: '04/08/2026 16:22' },
  { ref: 'SD-000338', buyer: 'Salma R.', vendor: 'Anas B.', amount: '3 200 MAD', status: 'Complétée', date: '04/08/2026 14:05' },
];

const TX_STATUS_CLASS = {
  'Complétée': 'success',
  'En cours': 'pending',
  'Séquestrée': 'pending',
};

const MOCK_NEW_USERS = [
  { name: 'Ahmed El Mansouri', status: 'approved', when: "aujourd'hui" },
  { name: 'Salma Benali', status: 'pending', when: "aujourd'hui" },
  { name: 'Youssef Amine', status: 'approved', when: "aujourd'hui" },
  { name: 'Kenza Lahlou', status: 'pending', when: 'hier' },
  { name: 'Rachid Essalhi', status: 'approved', when: 'hier' },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function Sparkline({ data, color, gradientId }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={points}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.85} />
            <stop offset="55%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} isAnimationActive animationDuration={900} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const SPARK_COLOR = { blue: '#3D8BFF', green: '#00F5A0', purple: '#B265FF', gold: '#FFB627' };

function AdminDashboard() {
  const navigate = useNavigate();

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
            <h1>Bonjour, Meryem 👋</h1>
            <p>Voici l'activité de la plateforme SafeDeal aujourd'hui.</p>
          </div>
          <div className="adm-topbar-actions">
            <div className="adm-search-box">
              <IconSearch />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button className="adm-icon-btn adm-icon-btn--bell" type="button">
              <IconBell />
              <span className="adm-notif-badge">3</span>
            </button>
            <button className="adm-icon-btn" type="button"><IconSettings /></button>
            <button className="adm-icon-btn" type="button"><IconMoon /></button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-stats-grid adm-stats-grid--6">
            {MOCK_STATS.map((s) => (
              <div key={s.key} className="adm-stat-card2">
                <div className="adm-stat-card2-head">
                  <span className={`adm-stat-icon adm-stat-icon--${s.color}`}><s.Icon /></span>
                  <div className="adm-stat-card2-text">
                    <span className="adm-stat-label">{s.label}</span>
                    <strong className="adm-stat-value">{s.value}</strong>
                  </div>
                </div>
                <span className="adm-stat-trend adm-stat-trend--up">↗ {s.trend} <small>vs mois dernier</small></span>
                <div className="adm-stat-spark"><Sparkline data={s.spark} color={SPARK_COLOR[s.color]} gradientId={`spark-${s.key}`} /></div>
              </div>
            ))}
          </div>

          <div className="adm-main-grid">
            <div className="adm-chart-card">
              <div className="adm-chart-head">
                <h3>Volume de transactions</h3>
                <div className="adm-period-toggle">
                  <button type="button" className="adm-period-btn adm-period-btn--active">7 jours</button>
                  <button type="button" className="adm-period-btn">30 jours</button>
                  <button type="button" className="adm-period-btn">12 mois</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={CHART_DATA}>
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
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5B6272' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5B6272' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#14171F', border: '1px solid rgba(91,141,239,0.3)', borderRadius: 12, fontSize: 12.5, color: '#F5F6FA' }} />
                  <Area
                    type="monotone"
                    dataKey="volume"
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
                <button type="button" className="adm-link-btn">Voir le rapport</button>
              </div>
              <div className="adm-revenue-value-row">
                <strong className="adm-revenue-value">15 600 MAD</strong>
                <span className="adm-trend-badge">↗ +12% <small>vs hier</small></span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={REVENUE_TODAY}>
                  <Bar dataKey="v" fill="#18D26E" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="adm-revenue-footer">
                <div className="adm-revenue-footer-item">
                  <div>
                    <span className="adm-card-sub">Transactions réussies</span>
                    <strong className="adm-revenue-footer-value">16</strong>
                  </div>
                  <span className="adm-revenue-footer-icon adm-revenue-footer-icon--green"><IconCheckCircle /></span>
                </div>
                <div className="adm-revenue-footer-item">
                  <div>
                    <span className="adm-card-sub">Montant moyen</span>
                    <strong className="adm-revenue-footer-value">867 MAD</strong>
                  </div>
                  <span className="adm-revenue-footer-icon adm-revenue-footer-icon--purple"><IconTrendUp /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="adm-bottom-grid">
            <div className="adm-activity-card">
              <div className="adm-chart-head">
                <h3>Activité récente</h3>
                <button type="button" className="adm-link-btn">Voir tout</button>
              </div>
              {MOCK_ACTIVITY.map((a) => {
                const Icon = ACTIVITY_ICON[a.type];
                const color = ACTIVITY_COLOR[a.type];
                return (
                  <div key={a.id} className="adm-activity-row">
                    <span className={`adm-activity-icon adm-stat-icon--${color}`}><Icon /></span>
                    <div className="adm-activity-info">
                      <strong>{a.title}</strong>
                      <span>{a.desc}</span>
                    </div>
                    <span className="adm-activity-time">{a.time}</span>
                  </div>
                );
              })}
            </div>

            <div className="adm-tx-card">
              <div className="adm-chart-head">
                <h3>Dernières transactions</h3>
                <button type="button" className="adm-link-btn" onClick={() => navigate('/admin/transactions')}>Voir toutes</button>
              </div>
              <table className="adm-table adm-table--compact">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Acheteur</th>
                    <th>Vendeur</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LATEST_TX.map((t) => (
                    <tr key={t.ref}>
                      <td style={{ fontWeight: 600 }}>{t.ref}</td>
                      <td>
                        <div className="adm-table-name">
                          <span className="adm-table-avatar adm-table-avatar--sm">{initials(t.buyer)}</span>
                          {t.buyer}
                        </div>
                      </td>
                      <td>
                        <div className="adm-table-name">
                          <span className="adm-table-avatar adm-table-avatar--sm adm-table-avatar--alt">{initials(t.vendor)}</span>
                          {t.vendor}
                        </div>
                      </td>
                      <td>{t.amount}</td>
                      <td><span className={`adm-badge adm-badge--${TX_STATUS_CLASS[t.status]}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="adm-users-card">
              <div className="adm-chart-head">
                <h3>Nouveaux utilisateurs</h3>
                <button type="button" className="adm-link-btn" onClick={() => navigate('/admin/users')}>Voir tout</button>
              </div>
              {MOCK_NEW_USERS.map((u, i) => (
                <div key={i} className="adm-newuser-row">
                  <span className="adm-table-avatar">{initials(u.name)}</span>
                  <div className="adm-newuser-info">
                    <strong>{u.name}</strong>
                    <span className={`adm-badge adm-badge--${u.status === 'approved' ? 'approved' : 'pending'}`}>
                      {u.status === 'approved' ? 'Vérifié' : 'En attente'}
                    </span>
                  </div>
                  <span className="adm-activity-time">{u.when}</span>
                </div>
              ))}
              <div className="adm-newuser-total">
                <span>Total nouveaux</span>
                <strong>24</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;