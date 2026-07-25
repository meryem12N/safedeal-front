import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError('Une erreur est survenue. Vérifiez votre email et réessayez.');
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

        {sent ? (
          <>
            <h1 className="auth-title-v3">Vérifiez votre email</h1>
            <p className="auth-subtitle-v3">
              Si un compte existe pour <strong>{email}</strong>, vous allez recevoir un lien pour réinitialiser votre mot de passe.
            </p>
            <Link to="/login" className="auth-btn-v3" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>
              Retour à la connexion
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-title-v3">Mot de passe oublié</h1>
            <p className="auth-subtitle-v3">Entrez votre email, on vous envoie un lien de réinitialisation.</p>

            {error && <div className="auth-error-banner">{error}</div>}

            <form className="auth-form-standalone" onSubmit={handleSubmit}>
              <div className="lf">
                <label className="lf-label">Email</label>
                <div className="lf-inputwrap">
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-v3" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>

            <p className="auth-switch-standalone">
              <Link to="/login">Retour à la connexion</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;