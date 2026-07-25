import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as identityService from '../services/identityService';
import './VerifyIdentity.css';

const STATUS_CONFIG = {
  not_submitted: { label: 'Non soumis', color: '#9AA3BF', icon: '📄' },
  pending: { label: 'En cours de vérification', color: '#E8A63D', icon: '⏳' },
  approved: { label: 'Vérifié', color: '#22C55E', icon: '✅' },
  rejected: { label: 'Rejeté', color: '#DC3545', icon: '❌' },
};

function FileDropzone({ label, hint, file, onFile, accept, required }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(files) {
    if (files && files[0]) onFile(files[0]);
  }

  return (
    <div className="fd-wrap">
      <label className="fd-label">{label}{required && <span className="fd-required">*</span>}</label>
      <div
        className={`fd-zone ${dragActive ? 'fd-active' : ''} ${file ? 'fd-has-file' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        {file ? (
          <div className="fd-preview">
            <span className="fd-check">✓</span>
            <span className="fd-filename">{file.name}</span>
            <button type="button" className="fd-remove" onClick={(e) => { e.stopPropagation(); onFile(null); }}>
              Changer
            </button>
          </div>
        ) : (
          <div className="fd-empty">
            <span className="fd-icon">📤</span>
            <span className="fd-text">Cliquez ou glissez un fichier ici</span>
            <span className="fd-hint">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function VerifyIdentity() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [docType, setDocType] = useState('cin');
  const [idDocument, setIdDocument] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    identityService
      .getIdentityStatus()
      .then((data) => setStatus(data))
      .catch(() => setStatus({ verification_status: 'not_submitted' }))
      .finally(() => setLoadingStatus(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setErrors({});

    if (!idDocument) {
      setError('Merci de sélectionner votre pièce d\'identité.');
      return;
    }

    const formData = new FormData();
    formData.append('id_document', idDocument);
    formData.append('id_document_type', docType);
    if (selfie) formData.append('selfie', selfie);

    setSubmitting(true);
    try {
      const data = await identityService.submitIdentity(formData);
      setStatus({ verification_status: data.verification_status || 'pending' });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 403) {
        setError('Cette action est réservée aux vendeurs.');
      } else if (err.response?.status === 409) {
        setError('Une demande de vérification est déjà en cours.');
      } else {
        setError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const currentStatus = status?.verification_status || 'not_submitted';
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.not_submitted;

  if (loadingStatus) {
    return (
      <div className="vid-page">
        <div className="vid-card">
          <p className="vid-loading">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vid-page">
      <div className="vid-card">
        <Link to="/" className="vid-brand">
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SafeDeal</span>
        </Link>

        <h1 className="vid-title">Vérification d'identité</h1>
        <p className="vid-subtitle">
          Pour créer des transactions en tant que vendeur, votre identité doit être vérifiée.
        </p>

        <div className="vid-status-banner" style={{ borderColor: config.color, background: `${config.color}15` }}>
          <span className="vid-status-icon">{config.icon}</span>
          <div>
            <div className="vid-status-label" style={{ color: config.color }}>{config.label}</div>
            {status?.submitted_at && (
              <div className="vid-status-date">Soumis le {new Date(status.submitted_at).toLocaleDateString('fr-FR')}</div>
            )}
            {currentStatus === 'rejected' && status?.rejection_reason && (
              <div className="vid-rejection-reason">Motif : {status.rejection_reason}</div>
            )}
          </div>
        </div>

        {(currentStatus === 'not_submitted' || currentStatus === 'rejected') && (
          <form className="vid-form" onSubmit={handleSubmit}>
            {error && <div className="vid-error-banner">{error}</div>}

            <div className="vid-doctype-toggle">
              <button type="button" className={docType === 'cin' ? 'active' : ''} onClick={() => setDocType('cin')}>
                🪪 CIN
              </button>
              <button type="button" className={docType === 'passport' ? 'active' : ''} onClick={() => setDocType('passport')}>
                📘 Passeport
              </button>
            </div>

            <FileDropzone
              label="Pièce d'identité"
              hint="JPG, PNG ou PDF — max 5 Mo"
              file={idDocument}
              onFile={setIdDocument}
              accept="image/jpeg,image/png,application/pdf"
              required
            />
            {errors.id_document && <span className="vid-field-error">{errors.id_document[0]}</span>}

            <FileDropzone
              label="Selfie (optionnel)"
              hint="Pour accélérer la validation"
              file={selfie}
              onFile={setSelfie}
              accept="image/jpeg,image/png"
            />

            <button type="submit" className="vid-submit-btn" disabled={submitting}>
              {submitting ? 'Envoi en cours...' : 'Soumettre pour vérification'}
            </button>
          </form>
        )}

        {currentStatus === 'pending' && (
          <div className="vid-pending-info">
            <p>Votre dossier est en cours d'examen par notre équipe. Cela prend généralement 24 à 48h.</p>
            <button type="button" className="vid-secondary-btn" onClick={() => navigate('/')}>
              Retour à l'accueil
            </button>
          </div>
        )}

        {currentStatus === 'approved' && (
          <div className="vid-pending-info">
            <p>Votre identité est vérifiée ! Vous pouvez maintenant créer des transactions.</p>
            <button type="button" className="vid-submit-btn" onClick={() => navigate('/')}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyIdentity;