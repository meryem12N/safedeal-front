import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '../components/DashboardIcons';
import { createTransaction } from '../services/transactionService';
import './Dashboard.css';

const NAV_ITEMS = [
  { Icon: IconHome, label: 'Dashboard' },
  { Icon: IconBox, active: true, label: 'Transactions' },
  { Icon: IconWallet, label: 'Finance' },
  { Icon: IconDispute, label: 'Litiges' },
  { Icon: IconProfile, label: 'Profil' },
  { Icon: IconSettings, label: 'Paramètres' },
];

function NewTransaction() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'MAD',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Vendeur';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
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
      setFormData({ title: '', amount: '', currency: 'MAD' });
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

  const handleCopyLink = async () => {
    if (!success?.secure_link) return;

    try {
      await navigator.clipboard.writeText(success.secure_link);
      setCopyStatus('Lien copié !');
    } catch {
      setCopyStatus('Copie impossible dans ce navigateur.');
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
          <span>Dashboard</span>
        </div>

        <nav className="ud-nav-full">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.label}
              className={`ud-nav-item-full ${item.active ? 'active' : ''}`}
              style={{ animationDelay: `${0.1 + index * 0.03}s` }}
              type="button"
            >
              <item.Icon /> <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="ud-nav-item-full ud-logout-full" onClick={logout} type="button">
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
            <input type="text" placeholder="Rechercher une transaction, un produit..." />
            <span className="ud-kbd">⌘K</span>
          </div>

          <div className="ud-topbar-right">
            <button className="ud-icon-btn" type="button"><IconBell /></button>
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
            <h1>Créer une nouvelle transaction</h1>
            <p>Renseignez le produit ou service à sécuriser, puis générez un lien public pour recevoir le paiement en toute confiance.</p>
          </div>

          <div className="ud-create-transaction-layout">
            <div className="ud-table-card ud-form-card">
              <div className="ud-table-head-bar">
                <h3>Informations de la transaction</h3>
                <span className="ud-see-all-text">SecureDeal</span>
              </div>

              <form className="ud-create-transaction-form" onSubmit={handleSubmit}>
                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="title">Titre du produit/service</label>
                  <div className="ud-input-shell">
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="ud-form-input"
                      placeholder="Ex. iPhone 14"
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="amount">Montant</label>
                  <div className="ud-input-shell ud-input-shell--currency">
                    <span className="ud-currency-badge">MAD</span>
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
                  </div>
                </div>

                <div className="ud-field-group">
                  <label className="ud-field-label" htmlFor="currency">Devise</label>
                  <div className="ud-input-shell">
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="ud-form-input"
                      disabled={submitting}
                    >
                      <option value="MAD">MAD</option>
                    </select>
                  </div>
                </div>

                {error && <div className="ud-form-error">{error}</div>}

                <div className="ud-form-actions">
                  <button className="ud-new-btn-full ud-form-submit" type="submit" disabled={submitting}>
                    {submitting ? 'Création...' : 'Créer la transaction'}
                  </button>
                </div>
              </form>
            </div>

            {success?.secure_link && (
              <div className="ud-table-card ud-success-card">
                <div className="ud-table-head-bar">
                  <h3>Lien sécurisé généré</h3>
                  <span className="ud-see-all-text">Confirmation</span>
                </div>

                <div className="ud-success-content">
                  <p className="ud-success-title">Votre transaction a bien été créée.</p>
                  <div className="ud-success-link-wrap">
                    <span className="ud-success-link">{success.secure_link}</span>
                  </div>
                  <div className="ud-success-actions">
                    <button className="ud-new-btn-full ud-form-submit" type="button" onClick={handleCopyLink}>
                      Copier le lien
                    </button>
                    {copyStatus && <span className="ud-copy-status">{copyStatus}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NewTransaction;
