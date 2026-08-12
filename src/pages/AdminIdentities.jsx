import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import api from '../services/api';
import './AdminPages.css';

function IconGrid(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 13.5c2.8.4 5 2.8 5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconTransactions(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
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

function IconWallet(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconShieldX(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconIdCard(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 10h6M13 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconDownload(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconSort(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...props}>
      <path d="M6 4v16m0-16-3.5 3.5M6 4l3.5 3.5M18 20V4m0 16 3.5-3.5M18 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconModalClose(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { Icon: IconGrid, label: "Vue d'ensemble", path: '/admin/dashboard' },
  { Icon: IconTransactions, label: 'Transactions', path: '/admin/transactions' },
  { Icon: IconUsers, label: 'Utilisateurs', path: '/admin/users' },
  { Icon: IconShieldCheck, label: 'Vérifications', path: '/admin/identities', active: true },
  { Icon: IconDispute, label: 'Litiges', path: '/admin/disputes' },
];



const MOCK_IDENTITIES = [
  { id: 1, userName: 'Yassine Tazi', email: 'yassine.tazi@gmail.com', documentType: 'Carte d\'identité', documentRef: '22654412', submittedAt: '2026-08-04T14:32:00' },
  { id: 2, userName: 'Sara Kabbaj', email: 'sara.kabbaj@gmail.com', documentType: 'Passeport', documentRef: 'P3487221', submittedAt: '2026-08-04T09:15:00' },
  { id: 3, userName: 'Omar Idrissi', email: 'omar.idrissi@gmail.com', documentType: 'Carte d\'identité', documentRef: '22654498', submittedAt: '2026-08-03T18:44:00' },
  { id: 4, userName: 'Nadia Bennis', email: 'nadia.bennis@gmail.com', documentType: 'Carte d\'identité', documentRef: '22654425', submittedAt: '2026-08-02T11:20:00' },
];

// TODO ASMAE : LES DEMANDES APPROUVÉES/REJETÉES DISPARAISSENT DE LA FILE D'ATTENTE UNE
// FOIS TRAITÉES (PAS D'HISTORIQUE PERSISTANT CÔTÉ FRONTEND). CES CHIFFRES SONT ILLUSTRATIFS
// EN ATTENDANT UN VRAI ENDPOINT D'HISTORIQUE (GET /ADMIN/IDENTITIES?STATUS=ALL).
const MOCK_HISTORY_STATS = { approved: 15, rejected: 1, newThisMonth: 6 };

function formatDate(iso) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

function exportToCsv(identities) {
  const header = ['Nom', 'Email', 'Document', 'Référence', 'Date de soumission'];
  const rows = identities.map((i) => [i.userName, i.email, i.documentType, i.documentRef, formatDate(i.submittedAt)]);
  const csv = [header, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'verifications-identite.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function AdminIdentities() {
  const navigate = useNavigate();
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [docModal, setDocModal] = useState(null);
  const [docLoading, setDocLoading] = useState(false);

  const viewDocument = async (userId, type, label) => {
    setDocLoading(true);
    setDocModal({ label, url: null });
    try {
      const res = await api.get(`/admin/identities/${userId}/document/${type}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      setDocModal({ label, url });
    } catch (err) {
      setDocModal({ label, url: null, error: true });
    } finally {
      setDocLoading(false);
    }
  };

  const closeDocModal = () => {
    if (docModal?.url) URL.revokeObjectURL(docModal.url);
    setDocModal(null);
  };

  useEffect(() => {
    api.get('/admin/identities')
      .then((res) => setIdentities(res.data?.data || res.data || []))
      .catch(() => setLoadError("Impossible de charger les demandes de vérification."))
      .finally(() => setLoading(false));
  }, []);

  const totalAllTime = identities.length + MOCK_HISTORY_STATS.approved + MOCK_HISTORY_STATS.rejected;

  const visibleIdentities = identities
    .filter((idn) => (idn.userName || '').toLowerCase().includes(search.toLowerCase()) || (idn.email || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = new Date(b.submittedAt) - new Date(a.submittedAt);
      return sortOrder === 'recent' ? diff : -diff;
    });

  const handleDecision = async (userId, decision) => {
    let payload = {};
    if (decision === 'reject') {
      const reason = window.prompt('Motif du rejet (visible par l\'utilisateur) :');
      if (!reason) return;
      payload = { reason };
    }
    setProcessingId(userId);
    try {
      await api.post(`/admin/identities/${userId}/${decision}`, payload);
      setIdentities((current) => current.filter((i) => i.userId !== userId));
    } catch (err) {
      setLoadError("Impossible de traiter cette demande pour le moment.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="adm-page">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <span className="adm-brand-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span>SafeDeal</span>
            <small>Admin</small>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              className={`adm-nav-item ${item.active ? 'adm-nav-item--active' : ''} ${!item.path ? 'adm-nav-item--disabled' : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              disabled={!item.path}
            >
              <item.Icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <UserMenu theme="admin" roleOverride="Administrateur" />
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-title">
            <h1>Vérifications d'identité</h1>
            <p>{identities.length} demande(s) en attente d'examen.</p>
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-icon-btn" type="button"><IconSettings /></button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-tx-summary-row">
            <div className="adm-tx-summary-card adm-tx-summary-card--blue">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--blue adm-tx-summary-icon--round"><IconUsers /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Total demandes</span>
                <strong>{totalAllTime}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--blue">+{MOCK_HISTORY_STATS.newThisMonth} ce mois</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--gold">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--gold adm-tx-summary-icon--round"><IconClock /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">En attente</span>
                <strong>{identities.length}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--gold">{Math.round((identities.length / totalAllTime) * 100)}% du total</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--green">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--green adm-tx-summary-icon--round"><IconShieldCheck /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Approuvées</span>
                <strong>{MOCK_HISTORY_STATS.approved}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--green">{Math.round((MOCK_HISTORY_STATS.approved / totalAllTime) * 100)}% du total</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--red">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--red adm-tx-summary-icon--round"><IconShieldX /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Rejetées</span>
                <strong>{MOCK_HISTORY_STATS.rejected}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--red">{Math.round((MOCK_HISTORY_STATS.rejected / totalAllTime) * 100)}% du total</small>
              </div>
            </div>
          </div>

          <div className="adm-filters-row">
            <div className="adm-search-shell">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un nom ou un email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="adm-filter-pill"
              onClick={() => setSortOrder((s) => (s === 'recent' ? 'ancien' : 'recent'))}
            >
              <IconSort /> {sortOrder === 'recent' ? 'Plus récent' : 'Plus ancien'}
            </button>
            <button type="button" className="adm-filter-pill" onClick={() => exportToCsv(visibleIdentities)}>
              <IconDownload /> Exporter
            </button>
          </div>

          {visibleIdentities.length === 0 ? (
            <div className="adm-empty-card">
              <span className="adm-empty-icon"><IconCheck /></span>
              <strong>Aucune demande en attente</strong>
              <p>Toutes les vérifications d'identité ont été traitées.</p>
            </div>
          ) : (
            <div className="adm-list">
              {visibleIdentities.map((idn, i) => (
                <div key={idn.userId || i} className="adm-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="adm-card-left">
                    <span className="adm-avatar">{idn.userName[0].toUpperCase()}</span>
                    <div>
                      <strong>{idn.userName}</strong>
                      <span className="adm-card-sub">{idn.userEmail}</span>
                    </div>
                  </div>

                  <div className="adm-card-mid">
                    <span className="adm-badge adm-badge--pending adm-badge--uppercase adm-badge--stacked">En attente</span>
                    <span className="adm-doc-badge adm-doc-badge--icon"><IconIdCard /> {idn.documentType} · {idn.documentRef}</span>
                    <div className="adm-doc-view-row">
                      <button type="button" className="adm-doc-view-btn" onClick={() => viewDocument(idn.id, 'front', 'Pièce d\'identité')}>
                        <IconEye /> Voir le document
                      </button>
                      <button type="button" className="adm-doc-view-btn" onClick={() => viewDocument(idn.id, 'selfie', 'Selfie')}>
                        <IconEye /> Voir le selfie
                      </button>
                    </div>
                  </div>

                  <div className="adm-card-mid adm-card-mid--date">
                    <span className="adm-card-time">Demandé le<br />{formatDate(idn.submittedAt)}</span>
                  </div>

                  <div className="adm-card-actions">
                    <button
                      type="button"
                      className="adm-btn adm-btn--reject"
                      disabled={processingId === idn.userId}
                      onClick={() => handleDecision(idn.userId, 'reject')}
                    >
                      <IconX /> Rejeter
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn--approve"
                      disabled={processingId === idn.userId}
                      onClick={() => handleDecision(idn.userId, 'approve')}
                    >
                      <IconCheck /> Approuver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        </div>
      </main>

      {docModal && (
        <div className="adm-modal-overlay" onClick={closeDocModal}>
          <div className="adm-modal adm-doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div>
                <h3>{docModal.label}</h3>
              </div>
              <button className="adm-modal-close" type="button" onClick={closeDocModal}>
                <IconModalClose />
              </button>
            </div>

            {docLoading ? (
              <div className="adm-doc-modal-state">
                <span className="nt-spinner" style={{ width: 28, height: 28, borderColor: 'var(--adm-border)', borderTopColor: 'var(--adm-blue)' }} />
                <span style={{ color: 'var(--adm-text-muted)', fontSize: 13 }}>Chargement du document...</span>
              </div>
            ) : docModal.error ? (
              <div className="adm-doc-modal-state adm-doc-modal-state--error">
                <span className="adm-doc-modal-state-icon"><IconX /></span>
                <span style={{ fontSize: 13 }}>Impossible de charger ce document.</span>
              </div>
            ) : (
              <div className="adm-doc-modal-image-wrap">
                <img src={docModal.url} alt={docModal.label} className="adm-doc-modal-image" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminIdentities;