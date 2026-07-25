import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'vendor',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
            <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
            <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SafeDeal</span>
        </Link>

        <h1 className="auth-title">Créer votre compte</h1>
        <p className="auth-subtitle">Rejoignez SafeDeal en toute confiance.</p>

        {generalError && <div className="auth-error-banner">{generalError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
            {errors.name && <span className="auth-field-error">{errors.name[0]}</span>}
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
              required
            />
            {errors.email && <span className="auth-field-error">{errors.email[0]}</span>}
          </div>

          <div className="auth-field">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            {errors.password && <span className="auth-field-error">{errors.password[0]}</span>}
          </div>

          <div className="auth-field">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="auth-field">
            <label>Je suis</label>
            <div className="auth-role-toggle">
              <button
                type="button"
                className={form.role === 'vendor' ? 'active' : ''}
                onClick={() => setForm({ ...form, role: 'vendor' })}
              >
                Vendeur
              </button>
              <button
                type="button"
                className={form.role === 'buyer' ? 'active' : ''}
                onClick={() => setForm({ ...form, role: 'buyer' })}
              >
                Acheteur
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;