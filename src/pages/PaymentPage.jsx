import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { IconShield, IconLock, IconCheck } from '../components/DashboardIcons';
import secureDealIllustration from '../assets/payment-shield-illustration.png';
import './PaymentPage.css';

const TIMELINE_STEPS = [
  { key: 'pending_payment', label: 'Paiement' },
  { key: 'payment_received', label: 'Séquestre' },
  { key: 'in_shipping', label: 'Expédition' },
  { key: 'delivered', label: 'Confirmation' },
];

const TIMELINE_ICONS = {
  pending_payment: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  payment_received: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="9.5" y="11" width="5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  in_shipping: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  delivered: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function getTimelineIndex(status) {
  const index = TIMELINE_STEPS.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
}

function PaymentPage() {
  const { transactionId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justPaid = searchParams.get('payment') === 'success';
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessDetails, setShowSuccessDetails] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await api.get(`/transactions/${transactionId}`);
        setTransaction(data.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setError("Cette transaction n'existe pas ou a été supprimée.");
        } else {
          setError('Impossible de charger les informations de la transaction.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handlePay = async () => {
    if (!user) {
      navigate(`/auth?mode=login&redirect=/pay/${transactionId}`);
      return;
    }

    setPaying(true);
    setError('');

    try {
      await api.post(`/transactions/${transactionId}/claim`);

      const { data } = await api.post(`/transactions/${transaction.id}/checkout`);

      if (data?.checkout_url) {
        localStorage.setItem('safedeal_pending_payment_id', transactionId);
        console.log('DEBUG - id sauvegarde:', transaction.id, '- valeur localStorage:', localStorage.getItem('safedeal_pending_payment_id'));
        setTimeout(() => {
          window.location.href = data.checkout_url;
        }, 2000);
      } else {
        setError("Impossible de générer le lien de paiement.");
        setPaying(false);
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 403) {
        setError(message || "Vous n'êtes pas autorisé à payer cette transaction.");
      } else if (status === 422) {
        setError(message || "Cette transaction ne peut pas être payée dans son état actuel.");
      } else {
        setError("Impossible de lancer le paiement pour le moment.");
      }
      setPaying(false);
    }
  };

  const handleSliderStart = () => {
    if (confirming) return;
    setIsDragging(true);
  };

  const handleSliderMove = (clientX, trackElement) => {
    if (!isDragging || !trackElement) return;
    const rect = trackElement.getBoundingClientRect();
    const knobSize = 52;
    const usableWidth = rect.width - knobSize;
    const relativeX = clientX - rect.left - knobSize / 2;
    const percent = Math.max(0, Math.min(100, (relativeX / usableWidth) * 100));
    setSliderProgress(percent);

    if (percent >= 92) {
      setIsDragging(false);
      setSliderProgress(100);
      handleConfirmReceipt();
    }
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    if (sliderProgress < 92) {
      setSliderProgress(0);
    }
  };

  const handleConfirmReceipt = async () => {
    setConfirming(true);
    setError('');
    try {
      const { data } = await api.post(`/transactions/${transaction.id}/deliver`);
      setTransaction(data?.data || { ...transaction, status: 'delivered' });
      setShowConfirmModal(false);
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message || "Impossible de confirmer la réception pour le moment.");
      setShowConfirmModal(false);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="pp-page">
        <div className="pp-glow pp-glow-1" />
        <div className="pp-glow pp-glow-2" />
        <div className="pp-card pp-card--center">
          <span className="pp-spinner-large" />
          <p className="pp-loading-text">Chargement de la transaction...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pp-page">
        <div className="pp-glow pp-glow-1" />
        <div className="pp-glow pp-glow-2" />
        <div className="pp-card pp-card--center">
          <span className="pp-error-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
          </span>
          <h2>Lien invalide</h2>
          <p className="pp-error-text">{error}</p>
        </div>
      </div>
    );
  }

  const normalizedAmount = typeof transaction.amount === 'string' ? transaction.amount.replace(',', '.') : transaction.amount;
  const amount = Number(normalizedAmount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const currentStepIndex = getTimelineIndex(transaction.status);
  const shortId = transaction.id ? `SD-${String(transaction.id).padStart(6, '0')}` : '';

  return (
    <div className="pp-page">
      <div className="pp-bg-arc pp-bg-arc-1" />
      <div className="pp-bg-arc pp-bg-arc-2" />
      <div className="pp-bg-dot pp-bg-dot-1" />
      <div className="pp-bg-dot pp-bg-dot-2" />
      <div className="pp-bg-dot pp-bg-dot-3" />
      <div className="pp-bg-dot pp-bg-dot-4" />

      <div className="pp-header">
        <div className="pp-brand">
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0" />
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF" />
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>SafeDeal</span>
        </div>
        {justPaid && transaction.status !== 'closed' && (
          <div className="pp-header-actions">
            <Link to="/" className="pp-header-home">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>

      {justPaid && transaction.status !== 'closed' && (
        <div className="pp-success2">
          <div className="pp-success2-badge-wrap">
            <span className="pp-success2-dot pp-success2-dot-1" />
            <span className="pp-success2-dot pp-success2-dot-2" />
            <span className="pp-success2-dot pp-success2-dot-3" />
            <span className="pp-flash-confetti pp-flash-confetti-1" />
            <span className="pp-flash-confetti pp-flash-confetti-2" />
            <span className="pp-flash-confetti pp-flash-confetti-3" />
            <span className="pp-flash-confetti pp-flash-confetti-4" />
            <span className="pp-flash-confetti pp-flash-confetti-5" />
            <span className="pp-flash-confetti pp-flash-confetti-6" />
            <div className="pp-success2-badge">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="pp-success2-title">
            Paiement <span>sécurisé</span>
          </h1>
          <p className="pp-success2-sub">Votre paiement a bien été reçu.</p>
          <p className="pp-success2-desc">
            Votre argent est conservé en toute sécurité jusqu'à la confirmation de la livraison.
          </p>

          <button
            type="button"
            className="pp-success2-toggle"
            onClick={() => setShowSuccessDetails((v) => !v)}
          >
            {showSuccessDetails ? 'Masquer les détails' : 'Voir les détails'}
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              style={{ transform: showSuccessDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showSuccessDetails && (
            <>
              <div className="pp-success2-layout">
                <div className="pp-success2-card">
                  <div className="pp-success2-card-head">
                    <span className="pp-success2-check-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <strong>Paiement confirmé</strong>
                      <p>Votre paiement est sécurisé chez SafeDeal.</p>
                    </div>
                    <span className="pp-success2-safe-badge">
                      <IconShield /> Safe &amp; Secure
                    </span>
                  </div>

                  <div className="pp-success2-rows">
                    <div className="pp-success2-row">
                      <span className="pp-success2-row-label">
                        <span className="pp-success2-row-icon pp-success2-row-icon--blue">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                            <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                          </svg>
                        </span>
                        Produit
                      </span>
                      <strong>{transaction.title}</strong>
                    </div>
                    <div className="pp-success2-row">
                      <span className="pp-success2-row-label">
                        <span className="pp-success2-row-icon pp-success2-row-icon--green">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                            <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M5 6v11c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8" />
                          </svg>
                        </span>
                        Montant
                      </span>
                      <strong className="pp-success2-amount">{amount} {transaction.currency || 'MAD'}</strong>
                    </div>
                    <div className="pp-success2-row">
                      <span className="pp-success2-row-label">
                        <span className="pp-success2-row-icon pp-success2-row-icon--purple">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                            <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                          </svg>
                        </span>
                        Référence
                      </span>
                      <strong>{shortId || `SD-${String(transaction.id).padStart(6, '0')}`}</strong>
                    </div>
                    <div className="pp-success2-row">
                      <span className="pp-success2-row-label">
                        <span className="pp-success2-row-icon pp-success2-row-icon--gold">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </span>
                        Date
                      </span>
                      <strong>
                        {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())}
                      </strong>
                    </div>
                    <div className="pp-success2-row">
                      <span className="pp-success2-row-label">
                        <span className="pp-success2-row-icon pp-success2-row-icon--blue">
                          <IconShield />
                        </span>
                        Statut
                      </span>
                      <span className="pp-success2-status-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        {transaction.status_label || 'En attente de paiement'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pp-success2-side">
                  <div className="pp-success2-next-card">
                    <span className="pp-success2-next-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <strong>Prochaine étape</strong>
                    <p>Le vendeur prépare et expédie votre commande. Vous serez notifié dès son envoi.</p>
                  </div>

                  <div className="pp-success2-tip">
                    <span className="pp-success2-tip-icon">💡</span>
                    <div>
                      <strong>À savoir</strong>
                      <p>Vous serez notifiée dès que le vendeur confirmera l'expédition de votre commande.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pp-success2-progress-card">
                <div className="pp-success2-progress-head">
                  <span>Étape {currentStepIndex + 1} sur {TIMELINE_STEPS.length}</span>
                  <strong>{Math.round(((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100)}%</strong>
                </div>
                <div className="pp-success2-progress-track">
                  <div
                    className="pp-success2-progress-fill"
                    style={{ width: `${((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              </>
          )}
        </div>
      )}
      {transaction.status === 'closed' ? (
        <div className="pp-success-screen">
          <div className="pp-confetti pp-confetti-1" />
          <div className="pp-confetti pp-confetti-2" />
          <div className="pp-confetti pp-confetti-3" />
          <div className="pp-confetti pp-confetti-4" />
          <div className="pp-confetti pp-confetti-5" />
          <div className="pp-confetti pp-confetti-6" />

          <div className="pp-success-check">
            <svg viewBox="0 0 100 100" width="90" height="90">
              <circle className="pp-success-circle" cx="50" cy="50" r="46" fill="none" strokeWidth="4" />
              <path className="pp-success-tick" d="M28 52 L43 66 L74 34" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="pp-success-title">Transaction terminée !</h1>
          <p className="pp-success-subtitle">
            Merci d'avoir confirmé la réception de <strong>{transaction.title}</strong>.<br />
            Le paiement a été libéré au vendeur en toute sécurité.
          </p>

          <div className="pp-success-amount-card">
            <span>Montant transféré</span>
            <strong>{amount} {transaction.currency || 'DH'}</strong>
          </div>

          <Link to="/" className="pp-success-home-btn">
            Retour à l'accueil
          </Link>
        </div>
      ) : (
      !justPaid && (
      <div className="pp-layout">
        <div className="pp-card pp-card--main">
          <div className="pp-card-glare" />
          <div className="pp-card-head">
            <span className="pp-shield-icon"><IconShield /></span>
            <div>
              <div className="pp-card-title-row">
                <h2>Paiement sécurisé</h2>
                <span className="pp-protected-badge">Protégé</span>
              </div>
              <p>Votre argent est conservé en toute sécurité jusqu'à confirmation.</p>
            </div>
          </div>

          <div className="pp-recap">
            <div className="pp-recap-row">
              <div className="pp-recap-label">
                <span className="pp-recap-icon pp-recap-icon--blue">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/>
                  </svg>
                </span>
                <span>Produit / Service</span>
              </div>
              <strong>{transaction.title}</strong>
            </div>

            <div className="pp-recap-row pp-recap-row--amount">
              <div className="pp-recap-label">
                <span className="pp-recap-icon pp-recap-icon--green">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M5 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M5 11v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </span>
                <span>Montant à payer</span>
              </div>
              <div className="pp-amount-block">
                <strong className="pp-recap-amount">{amount} <span>{transaction.currency || 'DH'}</span></strong>
                <small>Paiement protégé</small>
              </div>
            </div>

            <div className="pp-recap-row">
              <div className="pp-recap-label">
                <span className="pp-recap-icon pp-recap-icon--purple">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Statut</span>
              </div>
              <span className="pp-status-pill">{transaction.status_label || 'En attente de paiement'}</span>
            </div>
          </div>

          {transaction.status === 'in_shipping' && (
            <button className="pp-pay-btn pp-pay-btn--confirm" type="button" onClick={() => setShowConfirmModal(true)}>
              <IconCheck />
              <span>Confirmer la réception</span>
            </button>
          )}
          {transaction.status === 'pending_payment' && (
            <>
              {error && <p className="pp-pay-error">{error}</p>}
              <button className="pp-pay-btn" type="button" onClick={handlePay} disabled={paying}>
                <IconLock />
                <span>
                  {paying
                    ? 'Traitement...'
                    : !user
                    ? 'Se connecter pour payer'
                    : `Payer ${amount} ${transaction.currency || 'DH'}`}
                </span>
              </button>
            </>
          )}

          {['in_shipping', 'delivered'].includes(transaction.status) && (
            <Link to={`/dispute/${transactionId}`} className="pp-dispute-link">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
              </svg>
              Signaler un problème avec cette transaction
            </Link>
          )}

          <div className="pp-trust-row">
            <div className="pp-trust-item">
              <span className="pp-trust-icon pp-trust-icon--blue"><IconShield /></span>
              <strong>Paiement protégé</strong>
              <small>Votre paiement est 100% sécurisé</small>
            </div>
            <div className="pp-trust-item">
              <span className="pp-trust-icon pp-trust-icon--green"><IconCheck /></span>
              <strong>Argent séquestré</strong>
              <small>Conservé jusqu'à confirmation</small>
            </div>
            <div className="pp-trust-item">
              <span className="pp-trust-icon pp-trust-icon--purple">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                  <path d="M17 2v4a1 1 0 0 1-1 1H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12a8 8 0 0 0-14.93-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M7 22v-4a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12a8 8 0 0 0 14.93 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
              <strong>Remboursement possible</strong>
              <small>En cas de problème, vous êtes couvert</small>
            </div>
          </div>
        </div>

        <div className="pp-side">
          <div className="pp-side-card">
            <div className="pp-help-block">
              <span className="pp-help-icon">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
                  <path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <rect x="2.5" y="13" width="5" height="6" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <rect x="16.5" y="13" width="5" height="6" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </span>
              <div>
                <strong>Besoin d'aide ?</strong>
                <p>Notre équipe est disponible pour vous accompagner.</p>
              </div>
              <a href="#" className="pp-help-link">
                Contacter le support
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            <div className="pp-illustration-block">
              <img src={secureDealIllustration} alt="SecureDeal" className="pp-illustration" />
            </div>

            <div className="pp-howitworks-block">
              <strong className="pp-howitworks-title">Comment ça fonctionne ?</strong>
              <div className="pp-howitworks-steps">
                <div className="pp-howitworks-step">
                  <span className="pp-howitworks-num">1</span>
                  <div>
                    <strong>Paiement effectué</strong>
                    <p>Vous payez en toute sécurité</p>
                  </div>
                </div>
                <div className="pp-howitworks-step">
                  <span className="pp-howitworks-num">2</span>
                  <div>
                    <strong>Argent séquestré</strong>
                    <p>Nous conservons votre argent</p>
                  </div>
                </div>
                <div className="pp-howitworks-step">
                  <span className="pp-howitworks-num">3</span>
                  <div>
                    <strong>Confirmation</strong>
                    <p>Le vendeur confirme la réception</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
      )}

      {transaction.status === 'delivered' && (
        <div className="pp-status-banner pp-status-banner--neutral">
          <span className="pp-status-banner-icon">
            <IconCheck />
          </span>
          <div>
            <strong>Réception confirmée</strong>
            <p>En attente de libération des fonds par le vendeur.</p>
          </div>
        </div>
      )}

      {transaction.status === 'dispute' && (
        <div className="pp-status-banner pp-status-banner--dispute">
          <span className="pp-status-banner-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
          </span>
          <div>
            <strong>Litige en cours</strong>
            <p>Cette transaction fait l'objet d'un litige. Notre équipe examine la situation.</p>
          </div>
        </div>
      )}

      {transaction.status === 'refunded' && (
        <div className="pp-status-banner pp-status-banner--neutral">
          <span className="pp-status-banner-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M17 2v4a1 1 0 0 1-1 1H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12a8 8 0 0 0-14.93-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M7 22v-4a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12a8 8 0 0 0 14.93 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <div>
            <strong>Transaction remboursée</strong>
            <p>Le montant a été remboursé à l'acheteur.</p>
          </div>
        </div>
      )}

      {transaction.status === 'cancelled' && (
        <div className="pp-status-banner pp-status-banner--neutral">
          <span className="pp-status-banner-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <div>
            <strong>Transaction annulée</strong>
            <p>Cette transaction a été annulée.</p>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="pp-modal-overlay"
          onClick={() => !confirming && !isDragging && setShowConfirmModal(false)}
          onMouseMove={(e) => handleSliderMove(e.clientX, document.getElementById('pp-slider-track'))}
          onMouseUp={handleSliderEnd}
          onMouseLeave={handleSliderEnd}
          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX, document.getElementById('pp-slider-track'))}
          onTouchEnd={handleSliderEnd}
        >
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pp-modal-product-visual">
              <span className="pp-modal-big-icon"><IconCheck /></span>
            </div>

            <h3>Avez-vous bien reçu votre produit ?</h3>
            <p className="pp-modal-product-name">{transaction.title}</p>
            <p className="pp-modal-amount">{amount} {transaction.currency || 'DH'}</p>

            <div
              id="pp-slider-track"
              className={`pp-slider-track ${confirming ? 'pp-slider-track--confirming' : ''}`}
            >
              <span className="pp-slider-fill" style={{ width: `${sliderProgress}%` }} />
              <span className="pp-slider-text">
                {confirming ? 'Confirmation...' : 'Glissez pour confirmer →'}
              </span>
              <button
                type="button"
                className="pp-slider-knob"
                style={{ left: `calc(${sliderProgress}% )` }}
                onMouseDown={handleSliderStart}
                onTouchStart={handleSliderStart}
                disabled={confirming}
                aria-label="Glisser pour confirmer la réception"
              >
                {confirming ? (
                  <span className="pp-slider-spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="button"
              className="pp-modal-cancel-link"
              onClick={() => setShowConfirmModal(false)}
              disabled={confirming}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {!['closed', 'dispute', 'refunded', 'cancelled'].includes(transaction.status) && (
        <div className="pp-timeline-card">
          <div className="pp-timeline">
            {TIMELINE_STEPS.map((step, index) => {
              const isDone = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div className="pp-timeline-step-wrap" key={step.key}>
                  <div
                    className={`pp-timeline-step ${isDone ? 'pp-timeline-step--done' : ''} ${
                      isCurrent ? 'pp-timeline-step--current' : ''
                    }`}
                  >
                    <span className="pp-timeline-dot">{TIMELINE_ICONS[step.key]}</span>
                    <span className="pp-timeline-label">{step.label}</span>
                    <span
                      className={`pp-timeline-badge ${
                        isDone ? 'pp-timeline-badge--done' : isCurrent ? 'pp-timeline-badge--current' : 'pp-timeline-badge--pending'
                      }`}
                    >
                      {isDone ? 'Terminé' : isCurrent ? 'Étape actuelle' : 'En attente'}
                    </span>
                  </div>

                  {index < TIMELINE_STEPS.length - 1 && (
                    <span className={`pp-timeline-line ${index < currentStepIndex ? 'pp-timeline-line--done' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="pp-footer-note">
        <IconShield />
        <span>
          Propulsé par <Link to="/">SafeDeal Maroc</Link> — la plateforme sécurisée pour vos transactions entre particuliers.
        </span>
      </p>
    </div>
  );
}

export default PaymentPage;