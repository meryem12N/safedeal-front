import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { IconShield } from '../components/DashboardIcons';
import './BuyerDisputeStatus.css';

const STATUS_STEPS = [
  { key: 'submitted', label: 'Réclamation envoyée' },
  { key: 'under_review', label: 'En cours d\'examen' },
  { key: 'resolved', label: 'Décision rendue' },
];

function BuyerDisputeStatus() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await api.get(`/transactions/${transactionId}`);
        setTransaction(data.data);
      } catch {
        setError("Impossible de charger ce litige.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="bds-page">
        <div className="bds-card bds-card--center">
          <span className="bds-spinner" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bds-page">
        <div className="bds-card bds-card--center">
          <p>{error}</p>
          <Link to="/buyer/disputes" className="bds-back-btn">Retour aux litiges</Link>
        </div>
      </div>
    );
  }

  // TODO: brancher le vrai statut de litige et la réponse vendeur une fois l'API disponible.
  // Placeholder actuel : on affiche toujours "en cours d'examen" pour la démo visuelle.
  const currentStepIndex = 1;
  const vendorResponse = null; // sera rempli quand l'API renverra transaction.dispute.vendor_response
  const amountFormatted = Number(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  return (
    <div className="bds-page">
      <div className="bds-brand">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
          <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#054BF9" />
          <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3D6BFF" />
          <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>SafeDeal</span>
      </div>

      <div className="bds-card">
        <div className="bds-card-head">
          <span className="bds-head-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </span>
          <div>
            <h1>Suivi de votre litige</h1>
            <p>Transaction : <strong>{transaction.title}</strong> — {amountFormatted} {transaction.currency}</p>
          </div>
        </div>

        <div className="bds-steps">
          {STATUS_STEPS.map((step, i) => (
            <div className="bds-step" key={step.key}>
              <div className={`bds-step-dot ${i <= currentStepIndex ? 'bds-step-dot--active' : ''} ${i === currentStepIndex ? 'bds-step-dot--current' : ''}`}>
                {i < currentStepIndex && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={i <= currentStepIndex ? 'bds-step-label--active' : ''}>{step.label}</span>
              {i < STATUS_STEPS.length - 1 && <span className={`bds-step-line ${i < currentStepIndex ? 'bds-step-line--done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="bds-my-complaint">
          <div className="bds-complaint-head">
            <span className="bds-complaint-avatar">Moi</span>
            <div>
              <strong>Votre réclamation</strong>
              <span className="bds-complaint-category">Produit endommagé</span>
            </div>
          </div>
          <p className="bds-complaint-text">
            "Le produit reçu ne correspond pas à ce qui était décrit. L'emballage était endommagé et l'article présentait des rayures visibles à l'ouverture."
          </p>
          <span className="bds-complaint-note">Réclamation illustrative — en attente de connexion à la vraie donnée backend.</span>
        </div>

        {vendorResponse ? (
          <div className="bds-vendor-response">
            <div className="bds-complaint-head">
              <span className="bds-complaint-avatar bds-complaint-avatar--vendor">V</span>
              <div>
                <strong>Réponse du vendeur</strong>
              </div>
            </div>
            <p className="bds-complaint-text">{vendorResponse}</p>
          </div>
        ) : (
          <div className="bds-waiting-banner">
            <span className="bds-waiting-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>En attente de la réponse du vendeur. Vous serez notifiée dès qu'elle sera disponible.</span>
          </div>
        )}

        <Link to="/buyer/disputes" className="bds-back-btn">Retour aux litiges</Link>
      </div>

      <p className="bds-footer-note">
        <IconShield />
        <span>Votre réclamation est examinée avec la réponse du vendeur pour une décision équitable.</span>
      </p>
    </div>
  );
}

export default BuyerDisputeStatus;