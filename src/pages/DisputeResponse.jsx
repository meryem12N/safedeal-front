import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { IconShield, IconCheck } from '../components/DashboardIcons';
import './DisputeForm.css';
import './DisputeResponse.css';

function DisputeResponse() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [response, setResponse] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await api.get(`/transactions/${transactionId}`);
        setTransaction(data.data);
      } catch {
        setError("Impossible de charger cette transaction.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files).slice(0, 4);
    setFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!response.trim() || response.trim().length < 10) {
      setFormError('Veuillez rédiger votre réponse (10 caractères minimum).');
      return;
    }

    setSubmitting(true);
    try {


      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setFormError("Impossible d'envoyer votre réponse pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="df-page">
        <div className="df-card df-card--center">
          <span className="df-spinner" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="df-page">
        <div className="df-card df-card--center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="df-page">
        <div className="df-brand">
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0" />
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF" />
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>SafeDeal</span>
        </div>
        <div className="df-card df-card--center df-success-anim">
          <span className="df-success-icon">
            <svg viewBox="0 0 100 100" width="56" height="56">
              <circle className="df-success-circle" cx="50" cy="50" r="42" fill="none" strokeWidth="4" />
              <path className="df-success-tick" d="M30 52 L44 65 L72 35" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2>Réponse envoyée</h2>
          <p>
            Votre réponse concernant <strong>{transaction.title}</strong> a bien été transmise.
            Notre équipe va examiner les deux versions et rendra une décision sous peu.
          </p>
          <Link to="/disputes" className="df-back-btn">Retour aux litiges</Link>
        </div>
      </div>
    );
  }

  const amountFormatted = Number(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  return (
    <div className="df-page">
      <div className="df-brand">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
          <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0" />
          <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF" />
          <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>SafeDeal</span>
      </div>

      <div className="df-card df-form-anim">
        <div className="df-card-head">
          <span className="df-head-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M12 3.5 21.5 20h-19L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 9.5v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
          </span>
          <div>
            <h1>Répondre au litige</h1>
            <p>Transaction : <strong>{transaction.title}</strong> — {amountFormatted} {transaction.currency}</p>
          </div>
        </div>

        <div className="dr-buyer-complaint">
          <div className="dr-buyer-head">
            <span className="dr-buyer-avatar">
              {(transaction.buyer?.name || 'A')[0].toUpperCase()}
            </span>
            <div>
              <strong>Réclamation de l'acheteur</strong>
              <span className="dr-buyer-category">Produit endommagé</span>
            </div>
          </div>
          <p className="dr-buyer-text">
            "Le produit reçu ne correspond pas à ce qui était décrit. L'emballage était endommagé et l'article présentait des rayures visibles à l'ouverture."
          </p>
          <span className="dr-buyer-note">Réclamation illustrative — en attente de connexion à la vraie donnée backend.</span>
        </div>

        <form onSubmit={handleSubmit} className="df-form">
          <div className="df-field-group">
            <label className="df-label" htmlFor="response">Votre réponse</label>
            <textarea
              id="response"
              className="df-textarea"
              rows={6}
              placeholder="Expliquez votre version des faits, apportez des précisions..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="df-field-group">
            <label className="df-label">Ajouter des preuves (photos, optionnel)</label>
            <label className="df-upload-zone">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={submitting} hidden />
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>{files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : 'Cliquez pour ajouter des photos'}</span>
            </label>
          </div>

          {formError && <div className="df-error df-shake">{formError}</div>}

          <div className="df-form-actions">
            <Link to="/disputes" className="df-cancel-btn">Annuler</Link>
            <button type="submit" className="df-submit-btn" disabled={submitting}>
              {submitting ? <span className="df-btn-spinner" /> : 'Envoyer ma réponse'}
            </button>
          </div>
        </form>
      </div>

      <p className="df-footer-note">
        <IconShield />
        <span>Votre réponse sera examinée avec la réclamation de l'acheteur pour une décision équitable.</span>
      </p>
    </div>
  );
}

export default DisputeResponse;