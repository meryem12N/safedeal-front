import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconSettings,
  IconSearch, IconBell, IconDollar, IconBag,
  IconChevronDown, IconMore, IconArrowTrendUp, IconTruck,
} from '../components/DashboardIcons';
import ProductIcon from '../components/ProductIcon';
import RatingStars from '../components/RatingStars';
import { revenueSpark, ordersSpark, profitSpark } from '../mocks/mockDashboard';
import { getTransactions } from '../services/transactionService';
import { getVendorDashboard } from '../services/dashboardService';
import './Dashboard.css';
import MiniCalendar from '../components/MiniCalendar';
import { useNavigate } from 'react-router-dom';



function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SkeletonBlock({ height = 20, width = '100%', radius = 8 }) {
  return <div className="ud-skeleton" style={{ height, width, borderRadius: radius }} />;
}

function GlowDot({ cx, cy }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r="9" fill="#3D6BFF" opacity="0.25" filter="blur(4px)" />
      <circle cx={cx} cy={cy} r="5.5" fill="#3D6BFF" opacity="0.5" filter="blur(2px)" />
      <circle cx={cx} cy={cy} r="3.5" fill="#3D6BFF" />
      <circle cx={cx} cy={cy} r="1.6" fill="#FFFFFF" />
    </g>
  );
}

function StatCard({ icon: Icon, label, value, trend, spark, sparkColor, iconVariant, delay }) {
  return (
    <div className={`ud-topstat-card ud-topstat-card--${iconVariant}`} style={{ animationDelay: `${delay}s` }}>
      <button className="ud-topstat-more">•••</button>
      <div className={`ud-topstat-icon ud-topstat-icon--${iconVariant}`}>
  <span className="ud-topstat-icon-ring" />
  <Icon />
  <span className="ud-topstat-icon-sweep" />
</div>
      <div className="ud-topstat-content">
        <span className="ud-topstat-label">{label}</span>
        <div className="ud-topstat-value">{value}</div>
        <div className="ud-topstat-trend"><IconArrowTrendUp /> {trend}</div>
        <div className="ud-topstat-spark"><Sparkline data={spark} color={sparkColor} /></div>
      </div>
    </div>
  );
}

function FullGauge({ value, label, trendText }) {
  const circumference = 2 * Math.PI * 130;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="ud-fullgauge-wrap">
      <div className="ud-fullgauge-glow" />
      <svg viewBox="0 0 300 300" className="ud-fullgauge-svg">
        <circle cx="150" cy="150" r="130" className="ud-fullgauge-track" />
        <circle cx="150" cy="150" r="130" className="ud-fullgauge-fill" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="ud-fullgauge-center">
        <span className="ud-fullgauge-value">{value}%</span>
        <span className="ud-fullgauge-inner-label">{label}</span>
        <span className="ud-fullgauge-inner-trend"><IconArrowTrendUp /> {trendText}</span>
      </div>
    </div>
  );
}
const NAV_ITEMS = [
  { Icon: IconHome, active: true, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconDispute, label: 'Litiges', path: '/disputes' },
];

const PERIOD_OPTIONS = [
  { label: 'Jour', value: '1d' },
  { label: 'Semaine', value: '7d' },
  { label: 'Mois', value: '30d' },
  { label: 'Année', value: '12m' },
];

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

function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState('7d');
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [shippingModalTx, setShippingModalTx] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [shippingSubmitting, setShippingSubmitting] = useState(false);
  const [shippingError, setShippingError] = useState('');

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900);
    const t2 = setTimeout(() => setMounted(true), 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    getVendorDashboard(period, { signal: controller.signal })
      .then((data) => { if (isMounted) setDashboard(data); })
      .catch(() => { if (isMounted) setDashboard(null); })
      .finally(() => { if (isMounted) setDashboardLoading(false); });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [period]);

  const changePeriod = (p) => {
    setDashboardLoading(true);
    setPeriod(p);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      setTransactionsLoading(true);

      try {
        const response = await getTransactions({ page: 1 });
        if (isMounted) {
          setTransactions(Array.isArray(response?.data) ? response.data : []);
        }
      } catch {
        if (isMounted) {
          setTransactions([]);
        }
      } finally {
        if (isMounted) {
          setTransactionsLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Vendeur';

  const closeShippingModal = () => {
    setShippingModalTx(null);
  };

  const handleConfirmShipping = async (event) => {
    event.preventDefault();
    setShippingError('');

    if (!trackingNumber.trim()) {
      setShippingError('Veuillez renseigner un numéro de suivi.');
      return;
    }

    setShippingSubmitting(true);

    try {
      const { data } = await api.post(`/transactions/${shippingModalTx.id}/ship`, {
        trackingNumber: trackingNumber,
        carrier,
      });

      setTransactions((current) =>
        current.map((t) =>
          t.id === shippingModalTx.id ? { ...t, status: data?.data?.status || 'in_shipping' } : t
        )
      );
      closeShippingModal();
    } catch (err) {
      const message = err?.response?.data?.message;
      setShippingError(message || "Impossible de marquer la transaction comme expédiée pour le moment.");
    } finally {
      setShippingSubmitting(false);
    }
  };

  return (
    <div className={`ud-page ${mounted ? 'ud-mounted' : ''}`}>
      <div className="ud-glow ud-glow-1" />
      <div className="ud-glow ud-glow-2" />
      <div className="ud-glow ud-glow-3" />

      <aside className="ud-sidebar-full ud-entrance-left">
        <div className="ud-sidebar-brand-full">
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SafeDeal</span>
        </div>

        <nav className="ud-nav-full">
          <button
            className="ud-nav-item-full active"
            style={{ animationDelay: '0.1s' }}
            onClick={() => navigate('/dashboard/vendor')}
          >
            <IconHome /> <span>Dashboard</span>
          </button>
          <SidebarTransactionsMenu delay={0.13} />
          {NAV_ITEMS.slice(1).map((item, i) => (
            <button
              key={item.label}
              className={`ud-nav-item-full ${item.active ? 'active' : ''} ${!item.path ? 'ud-nav-disabled' : ''}`}
              style={{ animationDelay: `${0.16 + i * 0.03}s` }}
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
  <div className="ud-search-full">
    <IconSearch />
    <input type="text" placeholder="Rechercher une transaction, un produit..." />
    <span className="ud-kbd">⌘K</span>
  </div>
  <div className="ud-topbar-right">
    <button className="ud-icon-btn" onClick={() => navigate('/notifications')}><IconBell /></button>
    <button className="ud-icon-btn" onClick={() => navigate('/settings')}><IconSettings /></button>
    <span className="ud-topbar-divider" />
    <Link to="/transactions/new" className="ud-new-btn-full">
        + Nouvelle transaction
        <IconChevronDown />
    </Link>
    </div>
</div>

        <div className="ud-body-full">
          <div className="ud-greeting ud-entrance-fade">
            <p className="ud-greeting-sub">Voici un aperçu de votre activité aujourd'hui.</p>
          </div>

          {loading ? (
            <>
              <div className="ud-topstats-row">
                {[0, 1, 2].map((i) => <div key={i} className="ud-topstat-card"><SkeletonBlock height={110} radius={14} /></div>)}
              </div>
              <div className="ud-main-grid">
                <div className="ud-chart-card"><SkeletonBlock height={340} radius={14} /></div>
                <div className="ud-side-col"><SkeletonBlock height={340} radius={14} /></div>
              </div>
            </>
          ) : (
            <>
        <div className="ud-topstats-row">
  <StatCard icon={IconDollar} label="Revenus totaux" value={dashboardLoading ? '…' : formatTransactionAmount(dashboard?.releasedRevenue, dashboard?.currency)} trend={`${dashboard?.inTransit ?? 0} en transit`} spark={revenueSpark} sparkColor="#3D6BFF" iconVariant="blue" delay={0} />
  <StatCard icon={IconWallet} label="Bénéfices nets" value={dashboardLoading ? '…' : formatTransactionAmount(dashboard?.netRevenue, dashboard?.currency)} trend={`Commission: ${formatTransactionAmount(dashboard?.commissionPaid, dashboard?.currency)}`} spark={profitSpark} sparkColor="#A78BFA" iconVariant="purple" delay={0.08} />
  <StatCard icon={IconBag} label="Commandes" value={dashboardLoading ? '…' : (dashboard?.totalOrders ?? 0)} trend={`${dashboard?.awaitingShipment ?? 0} à expédier`} spark={ordersSpark} sparkColor="#E8C572" iconVariant="gold" delay={0.16} />
</div>

<div className="ud-main-grid ud-entrance-fade" style={{ animationDelay: '0.3s' }}>
  <div className="ud-main-col-left">
    <div className="ud-chart-card ud-big-chart">
      <div className="ud-chart-head">
        <h3>Aperçu des ventes</h3>
        <div className="ud-period-group">
          <span className="ud-filter-pill">Cette année <IconChevronDown /></span>
          <div className="ud-period-toggle">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={period === opt.value ? 'active' : ''}
                onClick={() => changePeriod(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={dashboard?.salesSeries || []}>
          <defs>
            <linearGradient id="ventesGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D6BFF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#3D6BFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12.5, fill: '#6677A8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12.5, fill: '#6677A8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#162448', border: '1px solid rgba(61,107,255,0.3)', borderRadius: 12, fontSize: 13, color: 'white' }} />
          <Area type="monotone" dataKey="value" stroke="#3D6BFF" strokeWidth={3} fill="url(#ventesGradFull)" isAnimationActive animationDuration={1500} animationEasing="ease-out" dot={<GlowDot />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="ud-table-card">
      <div className="ud-table-head-bar">
        <h3>Commandes à traiter</h3>
        <Link to="/transactions?status=payment_received" className="ud-see-all-text">Voir tout</Link>
      </div>
      <div className="ud-tracking-list">
        {(dashboard?.ordersToProcess || []).length === 0 ? (
          <p className="ud-empty">Aucune commande à traiter pour le moment.</p>
        ) : (
          dashboard.ordersToProcess.slice(0, 4).map((o, i) => (
            <div key={o.id} className="ud-tracking-row" style={{ animationDelay: `${0.4 + i * 0.08}s`, cursor: 'pointer' }} onClick={() => navigate(`/pay/${o.token}`)}>
              <ProductIcon category={resolveProductCategory(o.title)} color="#7C93FF" />
              <div className="ud-tracking-info">
                <span className="ud-tracking-name">{o.title}</span>
                <span className="ud-tracking-order">Acheteur : {o.buyerName}</span>
              </div>
              <span className={`ud-tracking-status ${TRANSACTION_STATUS_CLASS[o.status] || 'ud-status-pending'}`}>
                {TRANSACTION_STATUS_LABEL[o.status] || o.status}
              </span>
              <strong className="ud-td-total">{formatTransactionAmount(o.amount, o.currency)}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  </div>

  <div className="ud-side-col">
    <div className="ud-perf-card">
      <span className="ud-perf-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
      <span className="ud-perf-particle" style={{ top: '65%', left: '82%', animationDelay: '1.2s' }} />
      <span className="ud-perf-particle" style={{ top: '35%', left: '88%', animationDelay: '2.4s' }} />
      <span className="ud-perf-particle" style={{ top: '80%', left: '20%', animationDelay: '0.8s' }} />
      <span className="ud-perf-particle" style={{ top: '15%', left: '70%', animationDelay: '3s' }} />
      <div className="ud-perf-head">
        <h3>Performance</h3>
        <span className="ud-see-all"><IconMore /></span>
      </div>
      <FullGauge value={dashboard?.successRate ?? 0} label="Taux de réussite" trendText={`${dashboard?.finishedOrders ?? 0} commandes terminées`} />
    </div>

    <div className="ud-solde-wrap">
      <div className="ud-solde-card">
        <div className="ud-solde-glow-1" />
        <div className="ud-solde-glow-2" />
        <div className="ud-solde-head">
          <div className="ud-solde-head-left">
            <div className="ud-solde-icon">
              <span className="ud-solde-icon-ring" />
              <IconWallet />
              <span className="ud-solde-icon-sweep" />
            </div>
            <div className="ud-solde-text">
              <span className="ud-solde-label">Solde total</span>
              <div className="ud-solde-value">{formatTransactionAmount(dashboard?.releasedRevenue, dashboard?.currency)}</div>
            </div>
          </div>
          <svg className="ud-solde-chip" viewBox="0 0 40 30" width="42" height="32">
            <defs>
              <linearGradient id="chipGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE9B0" />
                <stop offset="45%" stopColor="#E8C572" />
                <stop offset="100%" stopColor="#B8863A" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="38" height="28" rx="5" fill="url(#chipGold)" stroke="#7A5A22" strokeWidth="0.6" />
            <rect x="1" y="1" width="38" height="28" rx="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            <line x1="14" y1="1" x2="14" y2="29" stroke="#7A5A22" strokeWidth="0.5" opacity="0.6" />
            <line x1="26" y1="1" x2="26" y2="29" stroke="#7A5A22" strokeWidth="0.5" opacity="0.6" />
            <line x1="1" y1="10" x2="39" y2="10" stroke="#7A5A22" strokeWidth="0.5" opacity="0.6" />
            <line x1="1" y1="20" x2="39" y2="20" stroke="#7A5A22" strokeWidth="0.5" opacity="0.6" />
            <rect x="14" y="10" width="12" height="10" rx="2.5" fill="none" stroke="#7A5A22" strokeWidth="0.6" opacity="0.7" />
          </svg>
        </div>
        <span className="ud-solde-tag">● Disponible</span>

        <div className="ud-solde-breakdown">
          <div className="ud-solde-breakdown-item">
            <span className="ud-solde-breakdown-label">En séquestre</span>
            <span className="ud-solde-breakdown-value ud-solde-breakdown-value--gold">{formatTransactionAmount(dashboard?.inEscrow, dashboard?.currency)}</span>
          </div>
          <div className="ud-solde-breakdown-item">
            <span className="ud-solde-breakdown-label">Total remboursé</span>
            <span className="ud-solde-breakdown-value ud-solde-breakdown-value--blue">{formatTransactionAmount(dashboard?.refundedTotal, dashboard?.currency)}</span>
          </div>
        </div>
      </div>
      <button className="ud-solde-footer">
        Voir les détails du solde
        <IconChevronDown />
      </button>
    </div>
  </div>
</div>
              <div className="ud-secondary-grid ud-entrance-fade" style={{ animationDelay: '0.45s' }}>
                <div className="ud-table-card">
                  <div className="ud-table-head-bar">
                    <h3>Transactions récentes</h3>
                    <Link to="/transactions" className="ud-see-all-text">Voir tout</Link>
                  </div>
                  {transactionsLoading ? (
                    <div style={{ padding: '20px 0' }}>
                      <SkeletonBlock height={44} radius={12} />
                      <div style={{ height: 12 }} />
                      <SkeletonBlock height={44} radius={12} />
                      <div style={{ height: 12 }} />
                      <SkeletonBlock height={44} radius={12} />
                    </div>
                  ) : (
                    <table className="ud-table">
                      <thead>
                        <tr><th>Produit</th><th>Note</th><th>Montant</th><th style={{ textAlign: 'center' }}>Statut</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 3).map((t, i) => (
                          <tr key={t.id} style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
                            <td className="ud-td-product">
                              <ProductIcon category={resolveProductCategory(t.title)} color="#7C93FF" />
                              <span className="ud-td-name">{t.title}</span>
                            </td>
                            <td><RatingStars value={5} /></td>
                            <td className="ud-td-total">{formatTransactionAmount(t.amount, t.currency)}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`ud-status-pill ${TRANSACTION_STATUS_CLASS[t.status] || 'ud-status-pending'}`}>
                                {TRANSACTION_STATUS_LABEL[t.status] || t.status}
                              </span>
                            </td>
                            <td className="ud-td-date">{formatTransactionDate(t.createdAt)}</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

               
              </div>

              <div className="ud-bottom-grid ud-entrance-fade" style={{ animationDelay: '0.6s' }}>
                <div className="ud-activity-card">
                  <div className="ud-table-head-bar">
                    <h3>Activité en temps réel</h3>
                    <Link to="/transactions" className="ud-see-all-text">Voir tout</Link>
                  </div>
                  <div className="ud-activity-feed">
                    {(dashboard?.activity || []).length === 0 ? (
                      <p className="ud-empty">Aucune activité récente.</p>
                    ) : (
                      dashboard.activity.slice(0, 4).map((a, i) => (
                        <div key={`${a.transactionId}-${a.createdAt}`} className="ud-activity-feed-row" style={{ animationDelay: `${0.65 + i * 0.07}s` }}>
                          <span className="ud-activity-feed-icon" style={{ background: '#3D6BFF18', color: '#3D6BFF' }}><IconBox /></span>
                          <div className="ud-activity-feed-info">
                            <span className="ud-activity-feed-title">{a.title}</span>
                            <span className="ud-activity-feed-desc">{a.detail}</span>
                          </div>
                          <span className="ud-activity-feed-time">{formatTransactionDate(a.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                  <MiniCalendar />
              </div>
            </>
          )}
        </div>
      </main>

      {shippingModalTx && (
        <div className="ud-modal-overlay" onClick={closeShippingModal}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-head">
              <span className="ud-modal-icon"><IconTruck /></span>
              <div>
                <h3>Marquer comme expédié</h3>
                <p>{shippingModalTx.title}</p>
              </div>
              <button className="ud-modal-close" type="button" onClick={closeShippingModal}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleConfirmShipping} className="ud-modal-form">
              <div className="ud-field-group">
                <label className="ud-field-label" htmlFor="tracking">Numéro de suivi</label>
                <div className="ud-input-shell">
                  <input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="ud-form-input"
                    placeholder="Ex. AMZ-98231-MA"
                    disabled={shippingSubmitting}
                  />
                </div>
              </div>

              <div className="ud-field-group">
                <label className="ud-field-label" htmlFor="carrier">Transporteur (optionnel)</label>
                <div className="ud-input-shell">
                  <input
                    id="carrier"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="ud-form-input"
                    placeholder="Ex. Amana, CTM, Sud Express..."
                    disabled={shippingSubmitting}
                  />
                </div>
              </div>

              {shippingError && <div className="ud-form-error">{shippingError}</div>}

              <div className="ud-modal-actions">
                <button type="button" className="ud-modal-cancel" onClick={closeShippingModal} disabled={shippingSubmitting}>
                  Annuler
                </button>
                <button type="submit" className="ud-new-btn-full ud-form-submit" disabled={shippingSubmitting}>
                  {shippingSubmitting ? 'Envoi...' : 'Confirmer l\'expédition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;