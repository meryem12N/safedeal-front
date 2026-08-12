import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import api from '../services/api';
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

function IconWallet(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconShieldX(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconCalendarSmall(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconCheckSmall(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClockSmall(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconGrid, label: "Vue d'ensemble", path: '/admin/dashboard' },
  { Icon: IconTransactions, label: 'Transactions', path: '/admin/transactions' },
  { Icon: IconUsers, label: 'Utilisateurs', path: '/admin/users', active: true },
  { Icon: IconShieldCheck, label: 'Vérifications', path: '/admin/identities' },
  { Icon: IconDispute, label: 'Litiges', path: '/admin/disputes' },
];

const ROLE_LABEL = { vendor: 'Vendeur', buyer: 'Acheteur', admin: 'Admin' };
const IDENTITY_LABEL = { approved: 'Vérifiée', pending: 'En attente', rejected: 'Rejetée', notsubmitted: 'Non soumise' };

function formatDate(iso) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data?.data || res.data || []))
      .catch(() => setLoadError("Impossible de charger la liste des utilisateurs."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
            <h1>Utilisateurs</h1>
            <p>{users.length} comptes enregistrés sur la plateforme.</p>
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-icon-btn" type="button"><IconSettings /></button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-tx-summary-row">
            <div className="adm-tx-summary-card adm-tx-summary-card--blue">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--blue adm-tx-summary-icon--round"><IconUsers /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Total utilisateurs</span>
                <strong>{users.length}</strong>
                <small>Comptes enregistrés</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--green">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--green adm-tx-summary-icon--round"><IconShieldCheck /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Utilisateurs vérifiés</span>
                <strong>{users.filter((u) => u.identityStatus === 'approved').length}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--green">
                  {users.length ? Math.round((users.filter((u) => u.identityStatus === 'approved').length / users.length) * 100) : 0}% du total
                </small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--gold">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--gold adm-tx-summary-icon--round"><IconClock /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">En attente</span>
                <strong>{users.filter((u) => u.identityStatus === 'pending').length}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--gold">
                  {users.length ? Math.round((users.filter((u) => u.identityStatus === 'pending').length / users.length) * 100) : 0}% du total
                </small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--red">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--red adm-tx-summary-icon--round"><IconShieldX /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Rejetés</span>
                <strong>{users.filter((u) => u.identityStatus === 'rejected').length}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--red">
                  {users.length ? Math.round((users.filter((u) => u.identityStatus === 'rejected').length / users.length) * 100) : 0}% du total
                </small>
              </div>
            </div>
          </div>

          <div className="adm-filters-row">
            <div className="adm-search-shell">
              <IconSearch />
              <input
                type="text"
                placeholder="Rechercher un nom ou un email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="adm-filter-pills">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'vendor', label: 'Vendeurs' },
                { value: 'buyer', label: 'Acheteurs' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`adm-filter-pill ${roleFilter === f.value ? 'adm-filter-pill--active' : ''}`}
                  onClick={() => setRoleFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Identité</th>
                  <th>Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="adm-table-name">
                        <span className={`adm-table-avatar ${u.role === 'vendor' ? 'adm-table-avatar--alt' : ''}`}>{(u.name || '?')[0].toUpperCase()}</span>
                        <div className="adm-table-name-text">
                          <strong>{u.name}</strong>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge adm-badge--${u.role}`}>{ROLE_LABEL[u.role]}</span>
                    </td>
                    <td>
                      <span className={`adm-badge adm-badge--${u.identityStatus}`}>{IDENTITY_LABEL[u.identityStatus]}</span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--adm-text-muted)', padding: '30px 0', fontSize: 13 }}>
              Aucun utilisateur ne correspond à votre recherche.
            </p>
          )}

          
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;