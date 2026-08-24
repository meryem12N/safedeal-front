import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  IconSettings, IconChevronRight,
  IconCheck, IconLock,
} from '../components/DashboardIcons';
import UserMenu from '../components/UserMenu';
import NotificationsPanel from '../components/NotificationsPanel';
import { getTransactions } from '../services/transactionService';
import './BuyerDashboard.css';

/* ---------- Icônes locales (pas dans DashboardIcons.js) ---------- */

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

function IconTruck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v3h-7v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
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

function IconLaptop(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 19h20l-2-3H4l-2 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconShoe(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 15c0-2 1.5-3 3-4l4-3 3 2h4c2 0 4 1.5 4 4v1c0 1.5-1 2-2.5 2H4c-1 0-1.5-.5-1.5-1.5v-.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Config navigation (simplifiée à 3 items) ---------- */

const NAV_ITEMS = [
  { Icon: IconHomeSimple, label: 'Tableau de bord', path: '/dashboard/buyer', active: true },
  { Icon: IconPackage, label: 'Mes achats', path: '/buyer/transactions' },
  { Icon: IconDispute, label: 'Litiges', path: '/buyer/disputes' },
];

const STEPS = [
  { key: 'paid', label: 'Payé', Icon: IconCheck },
  { key: 'shipped', label: 'Expédié', Icon: IconTruck },
  { key: 'delivered', label: 'Livré', Icon: IconPackage },
  { key: 'confirmed', label: 'Confirmé', Icon: IconShieldCheck },
];

const STATUS_TO_STEP = {
  pending_payment: 0,
  payment_received: 0,
  in_shipping: 1,
  delivered: 2,
  closed: 3,
};

const TX_STATUS_LABEL = {
  pending_payment: 'En attente',
  payment_received: 'Paiement reçu',
  in_shipping: 'En livraison',
  delivered: 'Livré',
  closed: 'Terminé',
  cancelled: 'Annulé',
  dispute: 'Litige',
  resolved: 'Résolu',
  refunded: 'Remboursé',
};
const TX_STATUS_VARIANT = {
  pending_payment: 'pending',
  payment_received: 'pending',
  in_shipping: 'pending',
  delivered: 'success',
  closed: 'success',
  cancelled: 'muted',
  dispute: 'muted',
  resolved: 'success',
  refunded: 'muted',
};

function resolveProductCategory(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('iphone') || lower.includes('phone')) return 'phone';
  if (lower.includes('ps5') || lower.includes('console') || lower.includes('game')) return 'game';
  if (lower.includes('sac') || lower.includes('bag') || lower.includes('zara')) return 'bag';
  return 'laptop';
}

const CATEGORY_VISUALS = {
  phone: { Icon: IconLaptop, gradient: 'bd-badge-blue' },
  bag: { Icon: IconShoe, gradient: 'bd-badge-purple' },
  game: { Icon: IconPackage, gradient: 'bd-badge-gold' },
  laptop: { Icon: IconLaptop, gradient: 'bd-badge-blue' },
};

function getCategoryVisual(title) {
  const category = resolveProductCategory(title);
  return CATEGORY_VISUALS[category] || CATEGORY_VISUALS.laptop;
}

function formatAmount(amount, currency = 'MAD') {
  const normalized = typeof amount === 'string' ? amount.replace(',', '.') : amount;
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(normalized || 0));
}

function formatDate(createdAt) {
  if (!createdAt) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(createdAt));
}

function SkeletonBlock({ height = 20, radius = 12 }) {
  return <div className="bd-skeleton" style={{ height, borderRadius: radius }} />;
}

function TrackingSteps({ currentStep }) {
  const fillPercent = (currentStep / (STEPS.length - 1)) * 100;
  return (
    <div className="bd-steps">
      <div className="bd-steps-track" />
      <div className="bd-steps-fill" style={{ width: `${fillPercent}%` }} />
      {STEPS.map((step, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'current' : 'pending';
        return (
          <div className="bd-step" key={step.key} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
            <div className={`bd-step-icon bd-step-icon--${state}`}>
              <step.Icon />
            </div>
            <span className={`bd-step-label bd-step-label--${state}`}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions({ page: 1 });
        if (isMounted) {
          setTransactions(Array.isArray(response?.data) ? response.data : []);
        }
      } catch {
        if (isMounted) setTransactions([]);
      } finally {
        if (isMounted) {
          setLoading(false);
          setTimeout(() => setMounted(true), 50);
        }
      }
    };
    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Acheteur';

  const activeStatuses = ['pending_payment', 'payment_received', 'in_shipping', 'delivered'];
  const currentOrder = transactions.find((t) => activeStatuses.includes(t.status)) || null;
  const recentTransactions = transactions.slice(0, 4);

  const getToken = (t) => {
    console.log('DEBUG BUYER TX:', t);
    return t?.token || t?.id;
  };

  return (
    <div className={`bd-page ${mounted ? 'bd-mounted' : ''}`}>
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
            <h1>Bonjour, {firstName}</h1>
            <p>Voici où en est votre commande.</p>
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
            <div className="bd-hero-card">
              <SkeletonBlock height={220} radius={16} />
            </div>
          ) : !currentOrder ? (
            <article className="bd-hero-card">
              <div className="bd-hero-glow" aria-hidden="true" />
              <p className="bd-empty">Vous n'avez pas encore de commande en cours.</p>
            </article>
          ) : (
            <>
              <article className="bd-hero-card">
                <div className="bd-hero-glow" aria-hidden="true" />
                <div className="bd-hero-top">
                  <div className="bd-hero-product">
                    <div className={`bd-product-badge ${getCategoryVisual(currentOrder.title).gradient}`}>
                      {(() => { const V = getCategoryVisual(currentOrder.title); return <V.Icon />; })()}
                    </div>
                    <div>
                      <span className="bd-hero-eyebrow">Votre commande</span>
                      <h2>{currentOrder.title}</h2>
                    </div>
                  </div>
                  <span className="bd-badge-protected">
                    <IconShieldCheck /> Protégée
                  </span>
                </div>

                <TrackingSteps currentStep={STATUS_TO_STEP[currentOrder.status] ?? 0} />

                <div className="bd-hero-footer">
                  <div className="bd-hero-footer-text">
                    <span className="bd-lock-badge"><IconLock /></span>
                    <span>{formatAmount(currentOrder.amount, currentOrder.currency)} en sécurité, en attente de livraison</span>
                  </div>
                  {currentOrder.status === 'delivered' ? (
                    <button className="bd-cta-btn" type="button" onClick={() => navigate(`/pay/${getToken(currentOrder)}`)}>
                      Confirmer la réception
                    </button>
                  ) : (
                    <button className="bd-cta-btn" type="button" onClick={() => navigate(`/pay/${getToken(currentOrder)}`)}>
                      Voir le détail
                    </button>
                  )}
                </div>
              </article>

              <section className="bd-history">
                <div className="bd-section-heading">
                  <h3>Commandes récentes</h3>
                  <button type="button" className="bd-see-all" onClick={() => navigate('/buyer/transactions')}>
                    Voir tout <IconChevronRight />
                  </button>
                </div>

                <div className="bd-history-list">
                  {recentTransactions.map((tx, i) => {
                    const visual = getCategoryVisual(tx.title);
                    return (
                      <div
                        className="bd-history-row"
                        key={tx.id}
                        style={{ animationDelay: `${0.1 + i * 0.06}s`, cursor: 'pointer' }}
                        onClick={() => navigate(`/pay/${getToken(tx)}`)}
                      >
                        <div className={`bd-product-badge bd-product-badge--sm ${visual.gradient}`}>
                          <visual.Icon />
                        </div>
                        <div className="bd-history-info">
                          <strong>{tx.title}</strong>
                          <span>{tx.vendor?.name || 'Vendeur'}</span>
                        </div>
                        <span className={`bd-status-pill bd-status-pill--${TX_STATUS_VARIANT[tx.status] || 'pending'}`}>
                          {TX_STATUS_LABEL[tx.status] || tx.status}
                        </span>
                        <time>{formatDate(tx.created_at)}</time>
                        <strong className="bd-history-amount">{formatAmount(tx.amount, tx.currency)}</strong>
                        <button
                          type="button"
                          className="bd-history-details"
                          aria-label={`Détails de ${tx.title}`}
                          onClick={(e) => { e.stopPropagation(); navigate(`/pay/${getToken(tx)}`); }}
                        >
                          <IconChevronRight />
                        </button>
                      </div>
                    );
                  })}

                  {recentTransactions.length === 0 && (
                    <p className="bd-empty">Vous n'avez pas encore de commande.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default BuyerDashboard;