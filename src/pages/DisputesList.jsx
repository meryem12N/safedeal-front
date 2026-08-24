import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconProfile,
  IconSettings, IconLogout, IconBell, IconChevronDown,
} from '../components/DashboardIcons';
import ProductIcon from '../components/ProductIcon';
import { getTransactions } from '../services/transactionService';
import './Dashboard.css';
import './TransactionsList.css';
import './DisputesList.css';
import NotificationsPanel from '../components/NotificationsPanel';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconDispute, active: true, label: 'Litiges', path: '/disputes' },
];

function resolveProductCategory(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('iphone') || lower.includes('phone')) return 'phone';
  if (lower.includes('ps5') || lower.includes('console') || lower.includes('game')) return 'game';
  if (lower.includes('sac') || lower.includes('bag') || lower.includes('zara')) return 'bag';
  return 'laptop';
}

function formatTransactionAmount(amount, currency = 'MAD') {
  const normalized = typeof amount === 'string' ? amount.replace(',', '.') : amount;
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(normalized || 0));
}

function DisputesList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'Vendeur';

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
            onClick={() => navigate('/dashboard/vendor')}
          >
            <IconHome /> <span>Dashboard</span>
          </button>
          <SidebarTransactionsMenu delay={0.13} />
          {NAV_ITEMS.slice(1).map((item, index) => (
            <button
              key={item.label}
              className={`ud-nav-item-full ${item.active ? 'active' : ''} ${!item.path ? 'ud-nav-disabled' : ''}`}
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
            <h1>Litiges en cours ⚖️</h1>
          </div>
          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button" onClick={() => navigate('/settings')}><IconSettings /></button>
            <span className="ud-topbar-divider" />
            <Link to="/transactions/new" className="ud-new-btn-full">
              + Nouvelle transaction
              <IconChevronDown />
            </Link>
          </div>
        </div>

        <div className="ud-body-full">
          

          {loading ? (
            <div className="ud-table-card">
              <div style={{ padding: '20px 0' }}>
                <div className="ud-skeleton" style={{ height: 44, borderRadius: 12 }} />
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="dl-empty-card">
              <span className="dl-empty-icon"><IconDispute /></span>
              <strong>Aucun litige en cours</strong>
              <p>Toutes vos transactions se déroulent normalement. Vous serez notifié ici si un acheteur signale un problème.</p>
            </div>
          ) : (
            <div className="tl-cards">
              {transactions.map((t, i) => (
                <div key={t.id} className="dl-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="dl-card-left">
                    <ProductIcon category={resolveProductCategory(t.title)} color="#E0403F" />
                    <div>
                      <strong>{t.title}</strong>
                      <span className="dl-card-id">ID: TRX-{String(t.id).padStart(6, '0')}</span>
                    </div>
                  </div>
                  <div className="dl-card-amount">{formatTransactionAmount(t.amount, t.currency)}</div>
                  <span className="dl-card-badge">Litige ouvert</span>
                  <Link to={`/disputes/${t.token || t.id}`} className="dl-card-btn">
                    Répondre
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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

export default DisputesList;