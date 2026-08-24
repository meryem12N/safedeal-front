import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconProfile,
  IconSettings, IconLogout, IconSearch, IconBell, IconChevronDown,
} from '../components/DashboardIcons';
import ProductIcon from '../components/ProductIcon';
import RatingStars from '../components/RatingStars';
import { getTransactions } from '../services/transactionService';
import iphoneImg from '../assets/products/iphone16.jpg';
import sacImg from '../assets/products/sac-zara.jpg';
import ps5Img from '../assets/products/ps5.jpg';
import trustPadlockIllustration from '../assets/trust-padlock-illustration.png';
import './Dashboard.css';
import './TransactionsList.css';
import NotificationsPanel from '../components/NotificationsPanel';

const TX_IMAGES = {
  phone: iphoneImg,
  bag: sacImg,
  game: ps5Img,
};

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconDispute, label: 'Litiges', path: '/disputes' },
];

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

const CARD_TIMELINE_ICONS = {
  pending_payment: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  payment_received: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  in_shipping: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="7" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="17.5" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  delivered: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M12 2 20 6.5 V15 C20 20 16.5 23.5 12 25 C7.5 23.5 4 20 4 15 V6.5 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" transform="scale(0.9) translate(1,-1)"/>
      <path d="M3 7l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 12v9M3 7v10l9 5 9-5V7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  closed: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function getCardTimelineIndex(status) {
  if (status === 'closed') return CARD_TIMELINE_STEPS.length;
  const index = CARD_TIMELINE_STEPS.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
}

const TRANSACTION_STATUS_CLASS = {
  pending_payment: 'ud-status-pending',
  payment_received: 'ud-status-pending',
  in_shipping: 'ud-status-in_shipping',
  delivered: 'ud-status-success',
  closed: 'ud-status-success',
  cancelled: 'ud-status-cancelled',
  dispute: 'ud-status-dispute',
  resolved: 'ud-status-success',
  refunded: 'ud-status-cancelled',
};
const TRANSACTION_STATUS_LABEL = {
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

function formatTransactionAmount(amount, currency = 'MAD') {
  const normalized = typeof amount === 'string' ? amount.replace(',', '.') : amount;
  const numericAmount = Number(normalized || 0);
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function formatTransactionDate(createdAt) {
  if (!createdAt) return '—';
  const date = new Date(createdAt);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function TransactionsList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCopyLink = async (t) => {
    const token = t.token || t.id;
    const link = `${window.location.origin}/pay/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Vendeur';

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
              style={{ animationDelay: `${0.16 + index * 0.03}s` }}
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
            <h1>Toutes les transactions 📜</h1>
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
          

          <div className="tl-filters-row">
            <div className="tl-search-shell">
              <IconSearch />
              <input
                type="text"
                placeholder="Rechercher un produit, une transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="tl-pills-card">
              <div className="tl-pills">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`tl-pill tl-pill--${f.variant} ${statusFilter === f.value ? 'tl-pill--active' : ''}`}
                    onClick={() => setStatusFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="ud-table-card">
              <div style={{ padding: '20px 0' }}>
                <div className="ud-skeleton" style={{ height: 44, borderRadius: 12 }} />
                <div style={{ height: 12 }} />
                <div className="ud-skeleton" style={{ height: 44, borderRadius: 12 }} />
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="ud-table-card">
              <p className="tl-empty">Aucune transaction ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="tl-cards">
              {filteredTransactions.map((t, i) => {
                const timelineIndex = getCardTimelineIndex(t.status);
                const isSpecial = ['dispute', 'refunded', 'cancelled'].includes(t.status);
                return (
                  <div key={t.id} className="tl-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="tl-card-top">
                      <div className="tl-card-product">
                        {TX_IMAGES[resolveProductCategory(t.title)] ? (
                          <img
                            src={TX_IMAGES[resolveProductCategory(t.title)]}
                            alt={t.title}
                            className="tl-card-thumb"
                          />
                        ) : (
                          <ProductIcon category={resolveProductCategory(t.title)} color="#7C93FF" />
                        )}
                        <div>
                          <strong>{t.title}</strong>
                          <span className="tl-card-id">ID: TRX-{String(t.id).padStart(6, '0')}</span>
                        </div>
                      </div>

                      <div className="tl-card-amount">
                        <strong>{formatTransactionAmount(t.amount, t.currency)}</strong>
                        <span>Paiement sécurisé</span>
                      </div>

                      <div className="tl-card-status">
                        <span className="tl-card-status-label">Statut</span>
                        <span className={`ud-status-pill ${TRANSACTION_STATUS_CLASS[t.status] || 'ud-status-pending'}`}>
                          {TRANSACTION_STATUS_LABEL[t.status] || t.status}
                        </span>
                      </div>

                      <div className="tl-card-date">
                        <span className="tl-card-status-label">Date</span>
                        <strong>{formatTransactionDate(t.createdAt)}</strong>
                      </div>

                      <button
                        type="button"
                        className="tl-copy-link-btn"
                        onClick={() => handleCopyLink(t)}
                      >
                        {copiedId === t.id ? (
                          <>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Copié !
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                              <rect x="9" y="9" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                              <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                            Copier le lien
                          </>
                        )}
                      </button>
                    </div>

                    {!isSpecial && (
                      <div className="tl-card-timeline">
                        {CARD_TIMELINE_STEPS.map((step, index) => (
                          <div className="tl-timeline-step-wrap" key={step.key}>
                            <div className={`tl-timeline-step ${index < timelineIndex ? 'tl-timeline-step--done' : ''} ${index === timelineIndex ? 'tl-timeline-step--current' : ''}`}>
                              <span className="tl-timeline-dot">
                                {index < timelineIndex ? (
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  CARD_TIMELINE_ICONS[step.key]
                                )}
                              </span>
                              <span className="tl-timeline-label">
                                {step.label}
                                {index === timelineIndex && <small className="tl-timeline-sublabel">En cours</small>}
                                {index > timelineIndex && <small className="tl-timeline-sublabel tl-timeline-sublabel--pending">À venir</small>}
                              </span>
                            </div>
                            {index < CARD_TIMELINE_STEPS.length - 1 && (
                              <span className={`tl-timeline-line ${index < timelineIndex ? 'tl-timeline-line--done' : ''}`} />
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

export default TransactionsList;