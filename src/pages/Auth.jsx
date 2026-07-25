import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import authVisual from '../assets/auth-visual.png';
import authVisualRegister from '../assets/auth-visual-register.png';

function EyeIcon({ visible }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      {visible ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
        </>
      ) : (
        <path d="M3 3l18 18M10.6 10.6a3 3 0 004.24 4.24M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.4-1M17.4 17.4C19.6 15.8 22 12 22 12s-1.4-2.8-4-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      )}
    </svg>
  );
}

function ValidationIcon({ state }) {
  if (state === 'valid') {
    return (
      <span className="val-icon val-valid">
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    );
  }
  if (state === 'invalid') {
    return (
      <span className="val-icon val-invalid">
        <svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
      </span>
    );
  }
  return null;
}

function LabeledField({ label, state, children }) {
  return (
    <div className={`lf ${state === 'invalid' ? 'lf-invalid' : ''} ${state === 'valid' ? 'lf-valid' : ''}`}>
      <label className="lf-label">{label}</label>
      <div className="lf-inputwrap">
        {children}
        <ValidationIcon state={state} />
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  function getStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }
  const score = getStrength(password);
  const labels = ['Faible', 'Moyen', 'Bon', 'Excellent'];
  const colors = ['#DC3545', '#E8A63D', '#3B5BFF', '#22C55E'];
  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-strength-bars">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="pw-strength-bar" style={{ background: i < score ? colors[Math.max(score - 1, 0)] : 'rgba(15,20,30,0.1)' }} />
        ))}
      </div>
      {score > 0 && <span className="pw-strength-label" style={{ color: colors[Math.max(score - 1, 0)] }}>{labels[Math.max(score - 1, 0)]}</span>}
    </div>
  );
}

function fieldState(value, isValid) {
  if (!value) return 'idle';
  return isValid ? 'valid' : 'invalid';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{9,15}$/;

function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRegisterActive = searchParams.get('mode') === 'register';

  const { login, register, verify2fa } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '', role: 'vendor',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [step2fa, setStep2fa] = useState(false);
  const [code2fa, setCode2fa] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  function switchMode(next) {
  setErrors({});
  setGeneralError('');
  setSearchParams({ mode: next }, { replace: true });
}

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);
    try {
      const data = await login(loginForm);
      if (data.requires_2fa) {
        setPendingEmail(loginForm.email);
        setStep2fa(true);
      } else if (data.email_verified === false) {
        navigate('/verify-email');
      } else {
        const role = data.user?.role;
        navigate(role === 'buyer' ? '/dashboard/buyer' : '/dashboard/vendor');
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.email_verified === false) {
        navigate('/verify-email');
        return;
      }
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else if (err.response?.status === 401) setGeneralError('Email ou mot de passe incorrect.');
      else setGeneralError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify2fa(e) {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);
    try {
      const data = await verify2fa({ email: pendingEmail, code: code2fa });
      const role = data.user?.role;
      navigate(role === 'buyer' ? '/dashboard/buyer' : '/dashboard/vendor');
    } catch (err) {
      if (err.response?.status === 429) setGeneralError('Trop de tentatives. Demandez un nouveau code.');
      else setGeneralError('Code incorrect ou expiré.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);
    try {
      await register(registerForm);
      navigate('/verify-email');
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else setGeneralError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-v3">
      <div className={`auth-container ${isRegisterActive ? 'right-panel-active' : ''}`}>

        <div className="form-container sign-up-container">
          <div className="auth-topbar">
            <Link to="/" className="auth-topbar-brand">
              <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
                <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
                <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SafeDeal</span>
            </Link>
            <button type="button" className="auth-topbar-link" onClick={() => switchMode('login')}>
              <span>Se connecter</span>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {registerSuccess ? (
            <div className="auth-form-v3" style={{ justifyContent: 'center' }}>
              <h1 className="auth-title-v3">Vérifiez votre email 📧</h1>
              <p className="auth-subtitle-v3">
                Un lien de confirmation a été envoyé à <strong>{registerForm.email}</strong>. Cliquez dessus pour activer votre compte, puis connectez-vous.
              </p>
              <button type="button" className="auth-btn-v3" onClick={() => switchMode('login')} style={{ marginTop: 20 }}>
                Aller à la connexion
              </button>
            </div>
          ) : (
            <form className="auth-form-v3" onSubmit={handleRegister}>
              <h1 className="auth-title-v3">Créer un compte</h1>
              {generalError && <div className="auth-error-banner">{generalError}</div>}

              <LabeledField label="Nom complet" state={fieldState(registerForm.name, registerForm.name.trim().length >= 2)}>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </LabeledField>
              {errors.name && <span className="auth-field-error">{errors.name[0]}</span>}

              <LabeledField label="Email" state={fieldState(registerForm.email, EMAIL_RE.test(registerForm.email))}>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </LabeledField>
              {errors.email && <span className="auth-field-error">{errors.email[0]}</span>}

              <LabeledField label="Téléphone" state={fieldState(registerForm.phone, PHONE_RE.test(registerForm.phone))}>
                <input
                  type="tel"
                  placeholder="+212600000000"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  required
                />
              </LabeledField>
              {errors.phone && <span className="auth-field-error">{errors.phone[0]}</span>}

              <LabeledField label="Mot de passe (8 caractères min.)" state={fieldState(registerForm.password, registerForm.password.length >= 8)}>
                <input
                  type={showRegPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
                <button type="button" className="lf-toggle" onClick={() => setShowRegPw(!showRegPw)}>
                  <EyeIcon visible={showRegPw} />
                </button>
              </LabeledField>
              {errors.password && <span className="auth-field-error">{errors.password[0]}</span>}
              <PasswordStrength password={registerForm.password} />

              <LabeledField
                label="Confirmer le mot de passe"
                state={fieldState(registerForm.password_confirmation, registerForm.password_confirmation === registerForm.password && registerForm.password_confirmation.length > 0)}
              >
                <input
                  type={showRegPw2 ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={registerForm.password_confirmation}
                  onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                  required
                />
                <button type="button" className="lf-toggle" onClick={() => setShowRegPw2(!showRegPw2)}>
                  <EyeIcon visible={showRegPw2} />
                </button>
              </LabeledField>

              <div className="auth-role-toggle-v3">
                <button type="button" className={registerForm.role === 'vendor' ? 'active' : ''} onClick={() => setRegisterForm({ ...registerForm, role: 'vendor' })}>Vendeur</button>
                <button type="button" className={registerForm.role === 'buyer' ? 'active' : ''} onClick={() => setRegisterForm({ ...registerForm, role: 'buyer' })}>Acheteur</button>
              </div>

              <label className="auth-checkbox-row">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required />
                <span>J'accepte les <a href="#">conditions d'utilisation</a></span>
              </label>

              <button type="submit" className="auth-btn-v3" disabled={loading}>
                {loading ? 'Création...' : "S'inscrire"}
              </button>
            </form>
          )}

          <div className="auth-bottombar">
            <span>© 2026 SafeDeal Maroc</span>
            <div className="auth-bottombar-right">
              <a href="#">Nous contacter</a>
              <span className="auth-lang">FR <svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
        </div>

        <div className="form-container sign-in-container">
          <div className="auth-topbar">
            <Link to="/" className="auth-topbar-brand">
              <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
                <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
                <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SafeDeal</span>
            </Link>
            <button type="button" className="auth-topbar-link" onClick={() => switchMode('register')}>
              <span>Créer un compte</span>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {step2fa ? (
            <form className="auth-form-v3" onSubmit={handleVerify2fa}>
              <h1 className="auth-title-v3">Vérification</h1>
              <p className="auth-subtitle-v3">Un code a été envoyé à {pendingEmail}.</p>
              {generalError && <div className="auth-error-banner">{generalError}</div>}

              <div className="lf">
                <label className="lf-label">Code de vérification</label>
                <div className="lf-inputwrap">
                  <input
                    type="text"
                    placeholder="123456"
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-v3" disabled={loading}>
                {loading ? 'Vérification...' : 'Valider'}
              </button>

              <button
                type="button"
                className="auth-forgot-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => { setStep2fa(false); setGeneralError(''); setCode2fa(''); }}
              >
                Retour
              </button>
            </form>
          ) : (
            <form className="auth-form-v3" onSubmit={handleLogin}>
              <h1 className="auth-title-v3">Bon retour</h1>
              <p className="auth-subtitle-v3">Connectez-vous à votre compte SafeDeal.</p>
              {generalError && <div className="auth-error-banner">{generalError}</div>}

              <LabeledField label="Email" state={fieldState(loginForm.email, EMAIL_RE.test(loginForm.email))}>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </LabeledField>
              {errors.email && <span className="auth-field-error">{errors.email[0]}</span>}

              <LabeledField label="Mot de passe" state={fieldState(loginForm.password, loginForm.password.length > 0)}>
                <input
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button type="button" className="lf-toggle" onClick={() => setShowLoginPw(!showLoginPw)}>
                  <EyeIcon visible={showLoginPw} />
                </button>
              </LabeledField>
              {errors.password && <span className="auth-field-error">{errors.password[0]}</span>}

              <div className="auth-row-between">
                <label className="auth-checkbox-row auth-checkbox-row-inline">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">Mot de passe oublié ?</Link>
              </div>

              <button type="submit" className="auth-btn-v3" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          )}

          <div className="auth-bottombar">
            <span>© 2026 SafeDeal Maroc</span>
            <div className="auth-bottombar-right">
              <a href="#">Nous contacter</a>
              <span className="auth-lang">FR <svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left" style={{ backgroundImage: `url(${authVisualRegister})` }}>
              <Link to="/" className="auth-brand-v3">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="white"/>
                  <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="white" opacity="0.7"/>
                  <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="#3B5BFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>SafeDeal</span>
              </Link>
              <h2>Déjà des vôtres ?</h2>
              <p>Connectez-vous pour retrouver vos transactions sécurisées.</p>
              <button type="button" className="auth-ghost-btn" onClick={() => switchMode('login')}>
                Se connecter
              </button>
            </div>

            <div className="overlay-panel overlay-right" style={{ backgroundImage: `url(${authVisual})` }}>
              <Link to="/" className="auth-brand-v3">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="white"/>
                  <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="white" opacity="0.7"/>
                  <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="#3B5BFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>SafeDeal</span>
              </Link>
              <h2>Nouveau ici ?</h2>
              <p>Créez votre compte et vendez en toute confiance dès aujourd'hui.</p>
              <button type="button" className="auth-ghost-btn" onClick={() => switchMode('register')}>
                Créer un compte
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;