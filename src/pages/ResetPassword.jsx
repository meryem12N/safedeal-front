import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailFromLink = searchParams.get('email') || '';

  const [form, setForm] = useState({
    email: emailFromLink,
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword({ ...form, token });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Le lien est peut-être expiré. Réessayez depuis "Mot de passe oublié".');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-v3">
      <div className="auth-standalone-card">
        <Link to="/" className="auth-topbar-brand" style={{ marginBottom: 28 }}>
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SafeDeal</span>
        </Link>

        {success ? (
          <>
            <h1 className="auth-title-v3">Mot de passe modifié</h1>
            <p className="auth-subtitle-v3">Redirection vers la connexion...</p>
          </>
        ) : (
          <>
            <h1 className="auth-title-v3">Nouveau mot de passe</h1>
            <p className="auth-subtitle-v3">Choisissez un mot de passe sécurisé.</p>

            {error && <div className="auth-error-banner">{error}</div>}

            <form className="auth-form-standalone" onSubmit={handleSubmit}>
              {!emailFromLink && (
                <div className="lf">
                  <label className="lf-label">Email</label>
                  <div className="lf-inputwrap">
                    <input
                      type="email"
                      placeholder="vous@exemple.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="lf">
                <label className="lf-label">Nouveau mot de passe</label>
                <div className="lf-inputwrap">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="lf">
                <label className="lf-label">Confirmer le mot de passe</label>
                <div className="lf-inputwrap">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-v3" disabled={loading}>
                {loading ? 'Modification...' : 'Réinitialiser'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;