import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';

import { IconBell, IconSettings, IconChevronRight } from '../components/DashboardIcons';
import NotificationsPanel from '../components/NotificationsPanel';
import { getTransactions } from '../services/transactionService';
import './BuyerDashboard.css';
import './BuyerDisputesList.css';

/* ---------- Icônes locales (mêmes que BuyerDashboard) ---------- */

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

const NAV_ITEMS = [
  { Icon: IconHomeSimple, label: 'Tableau de bord', path: '/dashboard/buyer' },
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions' },
  { Icon: IconDispute, label: 'Litiges', path: '/buyer/disputes', active: true },
  
];

function formatAmount(amount, currency = 'MAD') {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(amount || 0));
}

function BuyerDisputesList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions({ page: 1 });
        if (isMounted) {
          const all = Array.isArray(response?.data) ? response.data : [];
          setTransactions(all.filter((t) => t.status === 'dispute'));
        }
      } catch {
        if (isMounted) setTransactions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

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
            <h1>Litiges</h1>
            <p>Consultez et suivez vos litiges ouverts.</p>
          </div>
          <div className="bd-topbar-actions">
            <NotificationsPanel theme="light" />
            <button className="bd-icon-btn" aria-label="Paramètres" onClick={() => navigate('/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="bd-body">
          {loading ? (
            <div className="bdl-card">
              <div className="bd-skeleton" style={{ height: 44, borderRadius: 12 }} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="bdl-empty-card">
              <span className="bdl-empty-icon"><IconDispute /></span>
              <strong>Aucun litige en cours</strong>
              <p>Toutes vos commandes se déroulent normalement. Vous serez notifiée ici en cas de problème signalé.</p>
            </div>
          ) : (
            <div className="bdl-cards">
              {transactions.map((t, i) => (
                <div key={t.id} className="bdl-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="bdl-card-left">
                    <div className="bd-product-badge bdl-badge-red">
                      <IconDispute />
                    </div>
                    <div>
                      <strong>{t.title}</strong>
                      <span className="bdl-card-id">ID: TRX-{String(t.id).padStart(6, '0')}</span>
                    </div>
                  </div>
                  <div className="bdl-card-amount">{formatAmount(t.amount, t.currency)}</div>
                  <span className="bdl-card-badge">Litige ouvert</span>
                  <Link to={`/buyer/disputes/${t.secure_link ? t.secure_link.split('/').pop() : t.id}`} className="bdl-card-btn">
                    Voir le litige
                    <IconChevronRight />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default BuyerDisputesList;