import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';

import NotificationsPanel from '../components/NotificationsPanel';
import {
  IconBell, IconSettings, IconSearch, IconCheck, IconChevronRight,
} from '../components/DashboardIcons';
import { getTransactions } from '../services/transactionService';
import iphoneImg from '../assets/products/iphone16.jpg';
import sacImg from '../assets/products/sac-zara.jpg';
import ps5Img from '../assets/products/ps5.jpg';
import trustPadlockIllustration from '../assets/trust-padlock-illustration.png';
import './BuyerDashboard.css';
import './BuyerTransactionsList.css';

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
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions', active: true },
  { Icon: IconDispute, label: 'Litiges', path: '/buyer/disputes' },
  
];

const TX_IMAGES = { phone: iphoneImg, bag: sacImg, game: ps5Img };

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous', variant: 'blue' },
  { value: 'active', label: 'En cours', variant: 'gold' },
  { value: 'in_shipping', label: 'Expédiées', variant: 'purple' },
  { value: 'delivered', label: 'Livrées', variant: 'green' },
  { value: 'dispute', label: 'Litiges', variant: 'red' },
];

const CARD_TIMELINE_STEPS = [
  { key: 'pending_payment', label: 'Paiement' },
  { key: 'payment_received', label: 'Séquestré' },
  { key: 'in_shipping', label: 'Expédition' },
  { key: 'delivered', label: 'Livraison' },
  { key: 'closed', label: 'Confirmation' },
];

function getCardTimelineIndex(status) {
  if (status === 'closed') return CARD_TIMELINE_STEPS.length;
  const index = CARD_TIMELINE_STEPS.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
}

const STATUS_CLASS = {
  pending_payment: 'btl-status-pending',
  payment_received: 'btl-status-pending',
  in_shipping: 'btl-status-shipping',
  delivered: 'btl-status-success',
  closed: 'btl-status-success',
  cancelled: 'btl-status-muted',
  dispute: 'btl-status-dispute',
  resolved: 'btl-status-success',
  refunded: 'btl-status-muted',
};
const STATUS_LABEL = {
  pending_payment: 'En attente de paiement',
  payment_received: 'Paiement reçu',
  in_shipping: 'En livraison',
  delivered: 'Livré',
  closed: 'Fermé',
  cancelled: 'Annulé',
  dispute: 'Litige',
  resolved: 'Résolu',
  refunded: 'Remboursé',
};

function resolveProductCategory(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('iphone') || lower.includes('phone')) return 'phone';
  if (lower.includes('ps5') || lower.includes('console') || lower.includes('game')) return 'game';
  if (lower.includes('sac') || lower.includes('bag') || lower.includes('zara')) return 'bag';
  return 'laptop';
}

function formatAmount(amount, currency = 'MAD') {
  const normalized = typeof amount === 'string' ? amount.replace(',', '.') : amount;
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(normalized || 0));
}

function formatDate(createdAt) {
  if (!createdAt) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(createdAt));
}

function BuyerTransactionsList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const firstName = user?.name?.split(' ')[0] || 'Acheteur';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions({ page });
        if (isMounted) {
          setTransactions(Array.isArray(response?.data) ? response.data : []);
          setTotalPages(response?.meta?.last_page || 1);
        }
      } catch {
        if (isMounted) setTransactions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTransactions();
    return () => { isMounted = false; };
  }, [page]);

  const ACTIVE_STATUSES = ['pending_payment', 'payment_received', 'in_shipping'];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = ACTIVE_STATUSES.includes(t.status);
    else if (statusFilter !== 'all') matchesStatus = t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1>Mes achats</h1>
            <p>Retrouvez l'historique complet de vos commandes.</p>
          </div>
          <div className="bd-topbar-actions">
            <NotificationsPanel theme="light" />
            <button className="bd-icon-btn" aria-label="Paramètres" onClick={() => navigate('/settings')}>
              <IconSettings />
            </button>
          </div>
        </div>

        <div className="bd-body">
          <div className="btl-filters-row">
            <div className="btl-search-shell">
              <IconSearch />
              <input
                type="text"
                placeholder="Rechercher un produit, une transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="btl-pills">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`btl-pill btl-pill--${f.variant} ${statusFilter === f.value ? 'btl-pill--active' : ''}`}
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="btl-card">
              <div className="bd-skeleton" style={{ height: 44, borderRadius: 12 }} />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="btl-card">
              <p className="bd-empty">Aucune commande ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="btl-cards">
              {filteredTransactions.map((t, i) => {
                const timelineIndex = getCardTimelineIndex(t.status);
                const isSpecial = ['dispute', 'refunded', 'cancelled'].includes(t.status);
                const token = t.token || t.id;
                return (
                  <div
                    key={t.id}
                    className="btl-card"
                    style={{ animationDelay: `${i * 0.06}s`, cursor: 'pointer' }}
                    onClick={() => navigate(`/pay/${token}`)}
                  >
                    <div className="btl-card-top">
                      <div className="btl-card-product">
                        {TX_IMAGES[resolveProductCategory(t.title)] ? (
                          <img src={TX_IMAGES[resolveProductCategory(t.title)]} alt={t.title} className="btl-card-thumb" />
                        ) : (
                          <div className="bd-product-badge bd-badge-blue">
                            <IconPackage />
                          </div>
                        )}
                        <div>
                          <strong>{t.title}</strong>
                          <span className="btl-card-id">ID: TRX-{String(t.id).padStart(6, '0')}</span>
                        </div>
                      </div>

                      <div className="btl-card-amount">
                        <strong>{formatAmount(t.amount, t.currency)}</strong>
                        <span>Paiement sécurisé</span>
                      </div>

                      <div className="btl-card-status">
                        <span className="btl-card-label">Statut</span>
                        <span className={`btl-status-pill ${STATUS_CLASS[t.status] || 'btl-status-pending'}`}>
                          {STATUS_LABEL[t.status] || t.status}
                        </span>
                      </div>

                      <div className="btl-card-date">
                        <span className="btl-card-label">Date</span>
                        <strong>{formatDate(t.createdAt)}</strong>
                      </div>

                      <IconChevronRight className="btl-card-arrow" />
                    </div>

                    {!isSpecial && (
                      <div className="btl-timeline">
                        {CARD_TIMELINE_STEPS.map((step, index) => (
                          <div className="btl-timeline-step-wrap" key={step.key}>
                            <div className={`btl-timeline-step ${index < timelineIndex ? 'btl-timeline-step--done' : ''} ${index === timelineIndex ? 'btl-timeline-step--current' : ''}`}>
                              <span className="btl-timeline-dot">
                                {index < timelineIndex && <IconCheck />}
                              </span>
                              <span className="btl-timeline-label">
                                {step.label}
                                {index === timelineIndex && <small>En cours</small>}
                                {index > timelineIndex && <small className="btl-timeline-sub--pending">À venir</small>}
                              </span>
                            </div>
                            {index < CARD_TIMELINE_STEPS.length - 1 && (
                              <span className={`btl-timeline-line ${index < timelineIndex ? 'btl-timeline-line--done' : ''}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="tl-pagination-pro">
              <button
                type="button"
                className="tl-page-nav-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Page précédente"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`tl-page-num ${p === page ? 'tl-page-num--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                className="tl-page-nav-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Page suivante"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          
        </div>
      </main>
    </div>
  );
}

export default BuyerTransactionsList;