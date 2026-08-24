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

function IconCloseX(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function IconScale(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 3v18M7 21h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 7h6M14 7h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 7 1.5 12a2.5 2.5 0 0 0 5 0L4 7ZM20 7l-2.5 5a2.5 2.5 0 0 0 5 0L20 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
function IconTrendUp(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M3 16l6-6 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMessageCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" {...props}>
      <path d="M21 11.5a8.5 8.5 0 1 1-3.9-7.2L21 3l-1 4.2c.6 1.3 1 2.7 1 4.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

const NAV_ITEMS = [
  { Icon: IconGrid, label: "Vue d'ensemble", path: '/admin/dashboard' },
  { Icon: IconTransactions, label: 'Transactions', path: '/admin/transactions' },
  { Icon: IconUsers, label: 'Utilisateurs', path: '/admin/users' },
  { Icon: IconShieldCheck, label: 'Vérifications', path: '/admin/identities' },
  { Icon: IconDispute, label: 'Litiges', path: '/admin/disputes', active: true },
];


// TODO Asmae : les litiges résolus disparaissent de cette file une fois traités (pas
// d'historique persistant côté frontend). Ces chiffres sont illustratifs en attendant un
// vrai endpoint GET /admin/disputes?status=all.
const MOCK_HISTORY_STATS = { inReview: 3, resolved: 19, resolutionRate: 95 };

const DISPUTE_CATEGORY_LABEL = {
  not_received: 'Colis non reçu',
  damaged: 'Produit endommagé',
  not_as_described: 'Produit non conforme',
  other: 'Autre problème',
};

function formatDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function formatRelative(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} jour${days > 1 ? 's' : ''}`;
}

function exportDisputesToCsv(disputes) {
  const header = ['Référence', 'Produit', 'Acheteur', 'Vendeur', 'Motif', 'Montant', 'Ouvert le'];
  const rows = disputes.map((d) => [d.ref, d.transactionTitle, d.buyerName, d.vendorName, d.category, d.amount, formatDate(d.openedAt)]);
  const csv = [header, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'litiges.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function AdminDisputes() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [modalDispute, setModalDispute] = useState(null);

  useEffect(() => {
    api.get('/admin/disputes')
      .then((res) => {
        console.log('DEBUG DISPUTES:', res.data?.data);
        setDisputes(res.data?.data || []);
      })
      .catch(() => setLoadError("Impossible de charger les litiges."))
      .finally(() => setLoading(false));
  }, []);

  const totalAllTime = disputes.length + MOCK_HISTORY_STATS.resolved;

  const visibleDisputes = disputes
    .filter((d) =>
      (d.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.openedBy?.name || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return sortOrder === 'recent' ? diff : -diff;
    });
  const [decision, setDecision] = useState('refunded');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const openModal = (dispute) => {
    setModalDispute(dispute);
    setDecision('refunded');
    setNote('');
    setSubmitError('');
  };

  const closeModal = () => setModalDispute(null);

  const handleResolve = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post(`/admin/disputes/${modalDispute.id}/resolve`, { decision, note });
      setDisputes((current) => current.filter((d) => d.id !== modalDispute.id));
      closeModal();
    } catch (err) {
      const message = err?.response?.data?.message;
      setSubmitError(message || "Impossible de résoudre ce litige pour le moment.");
    } finally {
      setSubmitting(false);
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
            <h1>Litiges à trancher</h1>
            <p>{disputes.length} litige(s) en attente d'une décision.</p>
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-icon-btn" type="button"><IconSettings /></button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-tx-summary-row">
            <div className="adm-tx-summary-card adm-tx-summary-card--red">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--red adm-tx-summary-icon--round"><IconScale /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Litiges ouverts</span>
                <strong>{disputes.length}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--red">À traiter</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--gold">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--gold adm-tx-summary-icon--round"><IconClock /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">En cours d'examen</span>
                <strong>{MOCK_HISTORY_STATS.inReview}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--gold">En attente de décision</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--green">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--green adm-tx-summary-icon--round"><IconShieldCheck /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Résolus</span>
                <strong>{MOCK_HISTORY_STATS.resolved}</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--green">Ce mois-ci</small>
              </div>
            </div>
            <div className="adm-tx-summary-card adm-tx-summary-card--purple">
              <span className="adm-tx-summary-icon adm-tx-summary-icon--purple adm-tx-summary-icon--round"><IconTrendUp /></span>
              <div className="adm-tx-summary-text">
                <span className="adm-card-sub">Taux de résolution</span>
                <strong>{MOCK_HISTORY_STATS.resolutionRate}%</strong>
                <small className="adm-tx-summary-pct adm-tx-summary-pct--purple">Ce mois-ci</small>
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
                placeholder="Rechercher un litige, produit ou utilisateur..."
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
            <button type="button" className="adm-filter-pill" onClick={() => exportDisputesToCsv(visibleDisputes)}>
              <IconDownload /> Exporter
            </button>
          </div>

          {loadError && (
            <p style={{ textAlign: 'center', color: 'var(--adm-red)', padding: '30px 0', fontSize: 13 }}>{loadError}</p>
          )}

          {!loading && visibleDisputes.length === 0 && !loadError ? (
            <div className="adm-empty-card">
              <span className="adm-empty-icon"><IconCheck /></span>
              <strong>Aucun litige en attente</strong>
              <p>Tous les litiges ont été traités.</p>
            </div>
          ) : (
            <div className="adm-list">
              {visibleDisputes.map((d, i) => (
                <div key={d.id} className="adm-dispute-card-v2" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="adm-dv2-header">
                    <span className="adm-dv2-icon"><IconDispute /></span>
                    <div className="adm-dv2-header-text">
                      <span className="adm-dv2-title">Litige #{d.id}</span>
                      {d.transactionId && <span className="adm-dv2-ref">Transaction #{d.transactionId}</span>}
                      <span className="adm-badge adm-badge--dispute adm-badge--uppercase">Ouvert</span>
                    </div>
                    <button type="button" className="adm-btn adm-btn--examine" onClick={() => openModal(d)}>
                      Examiner <IconChevronRight />
                    </button>
                  </div>

                  <div className="adm-dv2-body">
                    <div>
                      <span className="adm-dv2-block-label">Signalé par</span>
                      <div className="adm-dv2-person">
                        <span className="adm-table-avatar adm-table-avatar--sm adm-table-avatar--purple">{(d.openedBy?.name || '?')[0]}</span>
                        <div>
                          <div className="adm-dv2-person-name">{d.openedBy?.name || '—'}</div>
                          <div className="adm-dv2-person-email">{d.openedBy?.email}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="adm-dv2-block-label">Motif</span>
                      <span className="adm-dv2-category">{DISPUTE_CATEGORY_LABEL[d.category] || d.category}</span>
                    </div>

                    <div>
                      <span className="adm-dv2-block-label">Ouvert le</span>
                      <div className="adm-dv2-date">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        {formatDate(d.createdAt)}
                      </div>
                      <div className="adm-dv2-date-relative">{formatRelative(d.createdAt)}</div>
                    </div>
                  </div>

                  <div className="adm-dv2-description">{d.description}</div>

                  <div className="adm-dv2-footer">
                    <span className="adm-dispute-messages">
                      <IconMessageCircle /> {(d.evidences || []).length} preuve{(d.evidences || []).length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        </div>
      </main>

      {modalDispute && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <span className="adm-modal-icon"><IconDispute /></span>
              <div>
                <h3>Trancher le litige</h3>
                <p>{modalDispute.transactionTitle}</p>
              </div>
              <button className="adm-modal-close" type="button" onClick={closeModal}>
                <IconCloseX />
              </button>
            </div>

            <form onSubmit={handleResolve}>
              <label className="adm-field-label">Décision</label>
              <div className="adm-decision-row">
                <button
                  type="button"
                  className={`adm-decision-btn ${decision === 'refunded' ? 'adm-decision-btn--active' : ''}`}
                  onClick={() => setDecision('refunded')}
                >
                  Rembourser l'acheteur
                </button>
                <button
                  type="button"
                  className={`adm-decision-btn ${decision === 'resolved' ? 'adm-decision-btn--active' : ''}`}
                  onClick={() => setDecision('resolved')}
                >
                  Valider pour le vendeur
                </button>
              </div>

              <label className="adm-field-label" htmlFor="adm-note">Note (visible par les deux parties)</label>
              <textarea
                id="adm-note"
                className="adm-textarea"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={submitting}
              />

              {submitError && <div className="adm-form-error">{submitError}</div>}

              <div className="adm-modal-actions">
                <button type="button" className="adm-modal-cancel" onClick={closeModal} disabled={submitting}>
                  Annuler
                </button>
                <button type="submit" className="adm-modal-submit" disabled={submitting}>
                  {submitting ? 'Envoi...' : 'Confirmer la décision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDisputes;