import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconBox, IconWallet, IconDispute, IconProfile,
  IconSettings, IconLogout, IconSearch, IconBell, IconLock, IconShield,
  IconChevronDown, IconChevronRight, IconCheck,
} from '../components/DashboardIcons';
import ProductIcon from '../components/ProductIcon';
import {
  trackingOrders,
  balanceData, buyerTransactions,
} from '../mocks/mockBuyerDashboard';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function SkeletonBlock({ height = 20, width = '100%', radius = 8 }) {
  return <div className="ud-skeleton" style={{ height, width, borderRadius: radius }} />;
}

function HourglassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M7 3h10M7 21h10M8 3c0 4 2.2 5.1 4 6 1.8-.9 4-2 4-6M8 21c0-4 2.2-5.1 4-6 1.8.9 4 2 4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BuyerSummaryCard({ icon: Icon, headerIcon: HeaderIcon, eyebrow, title, children, variant, action }) {
  const hasLargeBadge = variant === 'purple' || variant === 'gold';

  return (
    <article className={`buyer-summary-card buyer-summary-card--${variant}`}>
      {hasLargeBadge ? (
        <div className="ud-stat-card-header">
          <div className="ud-stat-card-content">
            <div className="buyer-summary-card__top">
              <div className="buyer-card-heading">
                <span className={`buyer-card-heading__icon buyer-card-heading__icon--${variant}`}><HeaderIcon /></span>
                <span>{eyebrow}</span>
              </div>
              <button className="buyer-summary-card__more" type="button" aria-label={`Options ${eyebrow}`}>•••</button>
            </div>
            <h2>{title}</h2>
            {children}
            {action && (
              <button className="buyer-summary-card__action" type="button">
                {action}
                <IconChevronRight />
              </button>
            )}
          </div>
          <div className={`ud-badge-large ${variant === 'purple' ? 'ud-badge-purple' : 'ud-badge-gold'}`}>
            {variant === 'gold' && <span className="ud-ring-dashed" />}
            <Icon />
          </div>
        </div>
      ) : (
        <>
          <div className="buyer-summary-card__top">
            <div className="buyer-summary-card__eyebrow">
              <span className="buyer-summary-card__icon"><Icon /></span>
              <span>{eyebrow}</span>
            </div>
            <button className="buyer-summary-card__more" type="button" aria-label={`Options ${eyebrow}`}>•••</button>
          </div>
          <div className="buyer-summary-card__body">
            <h2>{title}</h2>
            {children}
          </div>
          {action && (
            <button className="buyer-summary-card__action" type="button">
              {action}
              <IconChevronRight />
            </button>
          )}
        </>
      )}
    </article>
  );
}

function BuyerBalanceCard() {
  return (
    <article className="buyer-balance-card">
      <div className="buyer-balance-card__top">
        <span className="buyer-summary-card__icon"><IconWallet /></span>
        <span>Solde disponible</span>
      </div>
      <strong>{balanceData.available}</strong>
      <p>Disponible pour vos<br />prochains achats.</p>
      <div className="buyer-balance-card__spark" aria-hidden="true" />
      <button className="buyer-summary-card__action" type="button">Voir le solde <IconChevronRight /></button>
    </article>
  );
}

const NAV_ITEMS = [
  { Icon: IconHome, active: true, label: 'Dashboard' },
  { Icon: IconBox, label: 'Mes achats' },
  { Icon: IconWallet, label: 'Finance' },
  { Icon: IconDispute, label: 'Litiges' },
  { Icon: IconProfile, label: 'Profil' },
  { Icon: IconSettings, label: 'Paramètres' },
];

const STEPS = ['Payé', 'Séquestré', 'Expédié', 'Livré', 'Confirmé'];

const TX_STATUS_LABEL = { termine: 'Terminé', encours: 'En cours' };

function TrackingSteps({ currentStep }) {
  return (
    <div className="ud-tracking-steps">
      {STEPS.map((label, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'current' : 'pending';
        return (
          <div key={label} className="ud-tracking-step">
            <div className={`ud-tracking-step-icon ud-tracking-step-icon--${state}`}>
              {state === 'done' && <IconCheck />}
              {state === 'current' && <span className="ud-tracking-dot" />}
              {state === 'pending' && <IconLock />}
            </div>
            <span className="ud-tracking-step-label">{label}</span>
            {i < STEPS.length - 1 && (
              <div className={`ud-tracking-connector ${i < currentStep ? 'ud-tracking-connector--done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900);
    const t2 = setTimeout(() => setMounted(true), 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Acheteur';
  const currentOrder = trackingOrders[0];

  return (
    <div className={`ud-page buyer-dashboard ${mounted ? 'ud-mounted' : ''}`}>
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
          {NAV_ITEMS.map((item, i) => (
            <button key={item.label} className={`ud-nav-item-full ${item.active ? 'active' : ''}`} style={{ animationDelay: `${0.1 + i * 0.03}s` }}>
              <item.Icon /> <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="ud-nav-item-full ud-logout-full" onClick={logout}>
          <IconLogout /> <span>Déconnexion</span>
        </button>
      </aside>

      <main className="ud-main-full">
        <div className="ud-topbar-full ud-entrance-top">
          <div className="ud-topbar-greeting">
            <h1>Bonjour, {firstName} 👋</h1>
          </div>
          <div className="ud-search-full">
            <IconSearch />
            <input type="text" placeholder="Rechercher une commande, un vendeur..." />
            <span className="ud-kbd">⌘K</span>
          </div>
          <div className="buyer-profile-bar">
            <button className="ud-icon-btn" aria-label="Notifications"><IconBell /></button>
            <button className="ud-icon-btn" aria-label="Paramètres"><IconSettings /></button>
            <span className="ud-topbar-divider" />
            <span className="buyer-profile-avatar">{firstName.charAt(0).toUpperCase()}</span>
            <span className="buyer-profile-name"><strong>{firstName}</strong><small>Acheteur</small></span>
            <IconChevronDown />
          </div>
        </div>

        <div className="ud-body-full">
          <div className="ud-greeting ud-entrance-fade">
            <p className="ud-greeting-sub">Voici un aperçu de vos achats aujourd'hui.</p>
          </div>

          {loading ? (
            <div className="buyer-summary-grid">
              {[0, 1, 2].map((i) => <div key={i} className="buyer-summary-card"><SkeletonBlock height={176} radius={14} /></div>)}
            </div>
          ) : (
            <>
              <div className="buyer-summary-grid">
                <BuyerSummaryCard icon={IconBox} eyebrow="Commande en cours" title={currentOrder.name} variant="blue" action="Voir le suivi">
                  <span className="buyer-order-meta">Commande #{currentOrder.orderNumber}</span>
                  <span className="buyer-order-delivery">Arrivée prévue <strong>Demain</strong></span>
                  <span className="ud-tracking-status ud-tracking-status--transit">En livraison</span>
                </BuyerSummaryCard>
                <BuyerSummaryCard icon={IconLock} headerIcon={IconShield} eyebrow="Montant séquestré" title="7 320 MAD" variant="purple" action="Voir les détails">
                  <p className="buyer-summary-card__description">Paiement sécurisé et protégé<br />jusqu'à la confirmation.</p>
                </BuyerSummaryCard>
                <BuyerSummaryCard icon={IconCheck} headerIcon={HourglassIcon} eyebrow="Prochaine action" title="Confirmer la réception" variant="gold" action="Confirmer maintenant">
                  <p className="buyer-action-countdown">Il vous reste <strong>2 jours</strong></p>
                </BuyerSummaryCard>
              </div>

              <div className="buyer-content-grid ud-entrance-fade" style={{ animationDelay: '0.3s' }}>
                <section className="buyer-tracking-card">
                  <div className="buyer-section-heading">
                    <h2>Suivi de votre commande</h2>
                    <span>{currentOrder.name} <small>· Commande #{currentOrder.orderNumber}</small></span>
                  </div>
                  <TrackingSteps currentStep={currentOrder.currentStep} />
                </section>
                <BuyerBalanceCard />
              </div>

              <section className="buyer-orders-card ud-entrance-fade" style={{ animationDelay: '0.5s' }}>
                <div className="buyer-section-heading">
                  <h2>Mes commandes récentes</h2>
                  <span className="ud-see-all-text">Voir toutes <IconChevronRight /></span>
                </div>
                <div className="buyer-orders-list">
                  {buyerTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="buyer-order-row">
                      <ProductIcon category="electronics" />
                      <div><strong>{transaction.merchant}</strong><span>Commande #{transaction.orderNumber}</span></div>
                      <span className={`ud-status-pill ud-status-${transaction.status === 'termine' ? 'success' : 'pending'}`}>{TX_STATUS_LABEL[transaction.status]}</span>
                      <time>{transaction.date}</time>
                      <strong>{transaction.amount}</strong>
                      <button type="button" aria-label={`Détails de ${transaction.merchant}`}><span>Détails</span><IconChevronRight /></button>
                    </div>
                  ))}
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
