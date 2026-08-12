import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconHome,
  IconBox,
  IconWallet,
  IconDispute,
  IconProfile,
  IconSettings,
  IconLogout,
  IconSearch,
  IconBell,
  IconChevronDown,
  IconLock,
  IconShield,
  IconCheck,
} from '../components/DashboardIcons';
import { createTransaction } from '../services/transactionService';
import api from '../services/api';
import secureDealIllustration from '../assets/secure-deal-illustration.png';
import UserMenu from '../components/UserMenu';
import SidebarTransactionsMenu from '../components/SidebarTransactionsMenu';
import NotificationsPanel from '../components/NotificationsPanel';
import './Dashboard.css';
import './NewTransaction.css';

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard', path: '/dashboard/vendor' },
  { Icon: IconWallet, label: 'Finance', path: null },
  { Icon: IconDispute, label: 'Litiges', path: '/disputes' },
];

function NewTransaction() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'MAD',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [step, setStep] = useState(1);
  const [identityStatus, setIdentityStatus] = useState(null);
  const [identityLoading, setIdentityLoading] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Vendeur';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const fetchIdentityStatus = async () => {
    setIdentityLoading(true);
    try {
      const { data } = await api.get('/verify-identity/status');
      setIdentityStatus(data);
    } catch {
      setIdentityStatus(null);
    } finally {
      setIdentityLoading(false);
    }
  };

  const goToVerification = (event) => {
    event.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.amount) {
      setError('Veuillez remplir le titre du produit/service et le montant.');
      return;
    }

    const amount = Number(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Le montant doit être un nombre valide supérieur à 0.');
      return;
    }

    setStep(2);
    fetchIdentityStatus();
  };

  const backToInformations = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCopyStatus('');

    if (!formData.title.trim() || !formData.amount) {
      setError('Veuillez remplir le titre du produit/service et le montant.');
      return;
    }

    const amount = Number(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Le montant doit être un nombre valide supérieur à 0.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await createTransaction({
        title: formData.title.trim(),
        amount,
        currency: formData.currency,
      });

      setSuccess(response?.data || null);
      setStep(3);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 422) {
        setError('Les données envoyées sont invalides. Vérifiez le titre et le montant.');
      } else if (status === 401) {
        setError('Vous devez être connecté pour créer une transaction.');
      } else if (status === 500) {
        setError('Une erreur serveur s’est produite. Merci de réessayer plus tard.');
      } else {
        setError('Impossible de créer la transaction pour le moment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  

  const getBuyerLink = () => {
    if (!success) return '';
    return `${window.location.origin}/pay/${success.token}`;
  };

  const handleCopyLink = async () => {
    if (!success) return;

    try {
      await navigator.clipboard.writeText(getBuyerLink());
      setCopyStatus('Lien copié !');
    } catch {
      setCopyStatus('Copie impossible dans ce navigateur.');
    }
  };

  const handleShareLink = async () => {
    if (!success) return;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'SafeDeal Maroc', url: getBuyerLink() });
      } catch {
        
      }
    } else {
      handleCopyLink();
    }
  };

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
            className={`ud-nav-item-full ${NAV_ITEMS[0].active ? 'active' : ''}`}
            style={{ animationDelay: '0.1s' }}
            type="button"
            onClick={() => NAV_ITEMS[0].path && navigate(NAV_ITEMS[0].path)}
          >
            <IconHome /> <span>{NAV_ITEMS[0].label}</span>
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
            <h1>Bonjour, {firstName} 👋</h1>
          </div>

          <div className="ud-topbar-right">
            <NotificationsPanel />
            <button className="ud-icon-btn" type="button"><IconSettings /></button>
            <span className="ud-topbar-divider" />
            <Link to="/dashboard/vendor" className="ud-new-btn-full">
              Retour au dashboard
              <IconChevronDown />
            </Link>
          </div>
        </div>

        <div className="ud-body-full">
          <div className="ud-greeting ud-entrance-fade">
            <h1>Créer une nouvelle transaction <span className="nt-badge-new">Nouveau</span></h1>
            <p>Renseignez le produit ou service à sécuriser, puis générez un lien public pour recevoir le paiement en toute confiance.</p>
          </div>

          <div className="nt-stepper">
            <div className={`nt-step ${step === 1 ? 'nt-step--active' : 'nt-step--done'}`}>
              <span className="nt-step-num">{step > 1 ? '✓' : '1'}</span>
              <div className="nt-step-text">
                <strong>Informations</strong>
                <small>Détails de la transaction</small>
              </div>
            </div>
            <div className={`nt-step-line ${step > 1 ? 'nt-step-line--done' : ''}`} />
            <div className={`nt-step ${step === 2 ? 'nt-step--active' : step > 2 ? 'nt-step--done' : ''}`}>
              <span className="nt-step-num">{step > 2 ? '✓' : '2'}</span>
              <div className="nt-step-text">
                <strong>Vérification</strong>
                <small>Vérifiez les informations</small>
              </div>
            </div>
            <div className="nt-step-line" />
            <div className={`nt-step ${step === 3 ? 'nt-step--active' : ''}`}>
              <span className="nt-step-num">3</span>
              <div className="nt-step-text">
                <strong>Génération du lien</strong>
                <small>Recevez le paiement</small>
              </div>
            </div>
          </div>

          <div className={`ud-create-transaction-layout ${step === 2 ? 'nt-layout-full' : ''} ${success?.id ? 'nt-layout-centered' : ''}`}>
            {!success?.id && (
            <div className="ud-table-card ud-form-card">
              {step === 1 && (
                <div className="ud-table-head-bar">
                  <div className="nt-card-title">
                    <span className="nt-card-title-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <h3>Informations de la transaction</h3>
                  </div>
                  <span className="nt-securedeal-tag"><IconShield /> SecureDeal</span>
                </div>
              )}

              <form className="ud-create-transaction-form" onSubmit={handleSubmit}>
                {step === 1 && (
                <>
                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="title">Titre du produit / service</label>
                  <div className="ud-input-shell nt-input-shell">
                    <span className="nt-icon-box nt-icon-box--title">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                        <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/>
                      </svg>
                    </span>
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="ud-form-input"
                      placeholder="Ex. iPhone 14 Pro Max, Design Logo, Formation..."
                      maxLength={80}
                      disabled={submitting}
                      required
                    />
                    <span className="nt-char-count">{formData.title.length}/80</span>
                  </div>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="amount">Montant</label>
                  <div className="nt-amount-row">
                    <div className="ud-input-shell nt-input-shell nt-currency-shell">
                      <span className="nt-icon-box nt-icon-box--amount">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                          <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="M5 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="M5 11v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </span>
                      <span className="nt-currency-chip">MAD <IconChevronDown /></span>
                    </div>
                    <div className="ud-input-shell nt-input-shell nt-amount-shell">
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                        className="ud-form-input"
                        placeholder="1200.00"
                        disabled={submitting}
                        required
                      />
                      {formData.amount > 0 && (
                        <span className="nt-conversion">
                          {Number(formData.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="currency">Devise</label>
                  <div className="ud-input-shell nt-input-shell">
                    <span className="nt-icon-box nt-icon-box--currency">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    </span>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="ud-form-input"
                      disabled={submitting}
                    >
                      <option value="MAD">MAD - Dirham Marocain</option>
                    </select>
                  </div>
                </div>

                {error && <div className="ud-form-error">{error}</div>}
                <div className="ud-form-actions">
                  <button className="ud-new-btn-full ud-form-submit" type="button" onClick={goToVerification}>
                    <span>Continuer</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                </>
                )}

                {step === 2 && (
                  <div className="nt-verify-step">
                    <img src={secureDealIllustration} alt="SecureDeal" className="nt-verify-illustration" />
                    <div className="nt-verify-header">
                      <span className="nt-verify-header-icon"><IconShield /></span>
                      <div>
                        <h3>Vérifiez les informations</h3>
                        <p>Assurez-vous que tous les détails sont corrects avant de générer le lien de paiement.</p>
                      </div>
                    </div>

                    <div className="nt-verify-recap">
                      <div className="nt-verify-recap-row">
                        <div className="nt-verify-recap-label">
                          <span className="nt-icon-box nt-icon-box--title">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                              <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                              <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/>
                            </svg>
                          </span>
                          <span>Produit / Service</span>
                        </div>
                        <strong>{formData.title}</strong>
                      </div>

                      <div className="nt-verify-recap-row">
                        <div className="nt-verify-recap-label">
                          <span className="nt-icon-box nt-icon-box--amount">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                              <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/>
                              <path d="M5 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8"/>
                              <path d="M5 11v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" stroke="currentColor" strokeWidth="1.8"/>
                            </svg>
                          </span>
                          <span>Montant</span>
                        </div>
                        <strong>{Number(formData.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</strong>
                      </div>

                      <div className="nt-verify-recap-row">
                        <div className="nt-verify-recap-label">
                          <span className="nt-icon-box nt-icon-box--currency">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                              <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" stroke="currentColor" strokeWidth="1.6"/>
                            </svg>
                          </span>
                          <span>Devise</span>
                        </div>
                        <span className="nt-recap-currency-chip">{formData.currency}</span>
                      </div>
                    </div>

                    <div className="nt-identity-check">
                      {identityLoading ? (
                        <div className="nt-identity-line nt-identity-line--loading">
                          <span className="nt-spinner" />
                          Vérification de votre statut...
                        </div>
                      ) : identityStatus?.status === 'approved' ? (
                        <div className="nt-identity-line nt-identity-line--ok">
                          <span className="nt-identity-line-icon"><IconCheck /></span>
                          Votre identité est vérifiée, vous pouvez créer cette transaction.
                        </div>
                      ) : (
                        <div className="nt-identity-line nt-identity-line--warning">
                          <span className="nt-identity-line-icon">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                              <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                              <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                              <circle cx="12" cy="17" r="1" fill="currentColor"/>
                            </svg>
                          </span>
                          Votre identité n'est pas encore vérifiée ({identityStatus?.status || 'inconnu'}). Vous devez soumettre votre vérification d'identité avant de créer une transaction.
                        </div>
                      )}
                    </div>

                    {error && <div className="ud-form-error">{error}</div>}

                    <div className="ud-form-actions nt-verify-actions">
                      <button className="nt-back-btn" type="button" onClick={backToInformations}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                          <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Retour</span>
                      </button>
                      <button
                        className="ud-new-btn-full ud-form-submit"
                        type="submit"
                        disabled={submitting || identityStatus?.status !== 'approved'}
                      >
                        <span>{submitting ? 'Création...' : 'Confirmer et générer le lien'}</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {!success?.id && (
              <div className="nt-bottom-badges nt-bottom-badges--inline">
                <div className="nt-bottom-badge">
                  <span className="nt-bottom-badge-icon nt-bottom-badge-icon--blue">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <div><strong>Paiement sécurisé</strong><small>Vos données sont protégées</small></div>
                </div>
                <div className="nt-bottom-badge">
                  <span className="nt-bottom-badge-icon nt-bottom-badge-icon--purple">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M9.5 12l1.8 1.8L14.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div><strong>Argent séquestré</strong><small>Conservé jusqu'à confirmation</small></div>
                </div>
                <div className="nt-bottom-badge">
                  <span className="nt-bottom-badge-icon nt-bottom-badge-icon--green">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M8.5 12.5l2.2 2.2L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div><strong>Aucun frais caché</strong><small>Transparence garantie</small></div>
                </div>
              </div>
              )}
            </div>
            )}

            {step !== 2 && (success?.id ? (
              <>
              <div className="ud-table-card ud-success-card">
                <div className="ud-table-head-bar">
                  <div className="nt-card-title">
                    <span className="nt-card-title-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M9 15l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M11 7l1.5-1.5a3.5 3.5 0 0 1 5 5L16 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M13 17l-1.5 1.5a3.5 3.5 0 0 1-5-5L8 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <h3>Lien sécurisé généré</h3>
                  </div>
                  <span className="nt-securedeal-tag">Confirmation</span>
                </div>

                <div className="ud-success-content">
                  <p className="ud-success-title">
                    Votre transaction a bien été créée.<br />
                    Partagez ce lien pour recevoir le paiement.
                  </p>

                  <div className="ud-success-link-wrap">
                    <span className="ud-success-link">{getBuyerLink()}</span>
                    <button className="nt-copy-icon-btn" type="button" onClick={handleCopyLink} aria-label="Copier le lien">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                        <rect x="9" y="9" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                    </button>
                  </div>

                  <div className="ud-success-actions">
                    <button className="ud-new-btn-full ud-form-submit nt-copy-btn-full" type="button" onClick={handleCopyLink}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                      <span>Copier le lien</span>
                    </button>
                    {copyStatus && <span className="ud-copy-status">{copyStatus}</span>}

                    <div className="nt-or-divider"><span>OU</span></div>

                    <button className="nt-share-btn" type="button" onClick={handleShareLink}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                      <span>Partager le lien</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="ud-table-card nt-qr-card">
                <div className="nt-qr-badge"><IconShield /> SecureDeal</div>
                <div className="nt-qr-wrap">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=101-26-52&bgcolor=255-255-255&data=${encodeURIComponent(getBuyerLink())}`}
                    alt="QR code du lien sécurisé"
                    className="nt-qr-image"
                  />
                </div>
                <p className="nt-qr-caption">Scannez pour ouvrir le lien de paiement</p>
              </div>
              </>
            ) : (
              <div className="nt-side-panel">
                <div className="nt-side-top">
                  <div className="nt-side-content">
                    <span className="nt-side-badge"><IconShield /> SecureDeal</span>
                    <h2>Paiement sécurisé,<br /><span className="nt-side-highlight">zéro risque.</span></h2>
                    <p className="nt-side-sub">Votre argent est conservé en toute sécurité jusqu'à la confirmation de la transaction.</p>

                    <div className="nt-side-features">
                      <div className="nt-side-feature">
                        <span className="nt-side-feature-icon nt-side-feature-icon--blue"><IconLock /></span>
                        <div>
                          <strong>Paiement protégé</strong>
                          <p>Le vendeur reçoit l'argent seulement après votre confirmation.</p>
                        </div>
                      </div>
                      <div className="nt-side-feature">
                        <span className="nt-side-feature-icon nt-side-feature-icon--purple"><IconShield /></span>
                        <div>
                          <strong>Argent séquestré</strong>
                          <p>Votre paiement est conservé en toute sécurité sur SecureDeal.</p>
                        </div>
                      </div>
                      <div className="nt-side-feature">
                    <span className="nt-side-feature-icon nt-side-feature-icon--green">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M17 2v4a1 1 0 0 1-1 1H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 12a8 8 0 0 0-14.93-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M7 22v-4a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 12a8 8 0 0 0 14.93 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <div>
                      <strong>Remboursement possible</strong>
                      <p>En cas de problème, vous pouvez demander un remboursement.</p>
                    </div>
                  </div>
                    </div>
                  </div>

                  <img src={secureDealIllustration} alt="SecureDeal" className="nt-side-illustration" />
                </div>

                <div className="nt-trust-banner">
                  <span className="nt-trust-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z" fill="currentColor"/>
                      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="nt-trust-text">
                    <span className="nt-trust-title">Des milliers d'acheteurs et vendeurs nous font déjà confiance</span>
                    <small>Rejoignez une communauté sécurisée et transparente.</small>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {success?.id && (
            <div className="nt-next-steps">
              <div className="nt-next-steps-left">
                <span className="nt-next-steps-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.35.8.9.8 1.5V16h5.4v-.6c0-.6.3-1.15.8-1.5A6 6 0 0 0 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M9.7 19h4.6M10.4 21.5h3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </span>
                <div>
                  <strong>Étapes suivantes</strong>
                  <p>Copiez le lien et partagez-le avec votre acheteur. Le paiement sera automatiquement séquestré jusqu'à confirmation.</p>
                </div>
              </div>

              <div className="nt-next-steps-flow">
                <div className="nt-next-steps-step">
                  <span className="nt-next-steps-step-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <path d="M9 15l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M11 7l1.5-1.5a3.5 3.5 0 0 1 5 5L16 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M13 17l-1.5 1.5a3.5 3.5 0 0 1-5-5L8 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span>Lien partagé</span>
                </div>
                <span className="nt-next-steps-arrow">→</span>
                <div className="nt-next-steps-step">
                  <span className="nt-next-steps-step-icon">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </span>
                  <span>Paiement séquestré</span>
                </div>
                <span className="nt-next-steps-arrow">→</span>
                <div className="nt-next-steps-step">
                  <span className="nt-next-steps-step-icon">
                    <IconCheck />
                  </span>
                  <span>Confirmation</span>
                </div>
              </div>
            </div>
          )}

          </div>
      </main>
    </div>
  );
}

export default NewTransaction;
