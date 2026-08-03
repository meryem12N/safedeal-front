import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyEmailCode, resendEmailVerificationCode } from '../services/authService';
import './Auth.css';

const EXPIRE_SECONDS = 10 * 60;
const RESEND_SECONDS = 60;

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('safedeal_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function VerifyEmail() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [expired, setExpired] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(EXPIRE_SECONDS);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);

  const storedUser = useMemo(() => getStoredUser(), []);
  const email = storedUser?.email || user?.email || '';

  useEffect(() => {
    const token = localStorage.getItem('safedeal_token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const expireTimer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(expireTimer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resendTimer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(expireTimer);
      clearInterval(resendTimer);
    };
  }, [navigate]);

  async function handleVerify(e) {
    e.preventDefault();
    setError('');

    if (!code || code.trim().length < 6) {
      setError('Veuillez saisir le code à 6 chiffres.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailCode(code);
      const freshUser = await refreshUser();
      const role = freshUser?.role || storedUser?.role || user?.role || 'buyer';
      navigate(role === 'vendor' ? '/verify-identity' : '/dashboard/buyer');
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid or expired verification code.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCountdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      await resendEmailVerificationCode();
      setCode('');
      setExpired(false);
      setRemainingSeconds(EXPIRE_SECONDS);
      setResendCountdown(RESEND_SECONDS);
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de renvoyer le code.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-page-v3">
      <div className="auth-container" style={{ maxWidth: 880 }}>
        <div className="form-container" style={{ width: '100%', left: 0 }}>
          <div className="auth-topbar">
            <div className="auth-topbar-brand">
              <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0" />
                <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF" />
                <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>SafeDeal</span>
            </div>
            <button type="button" className="auth-topbar-link" onClick={() => logout().finally(() => navigate('/login', { replace: true }))}>
              <span>Déconnexion</span>
            </button>
          </div>

          <form className="auth-form-v3" onSubmit={handleVerify}>
            <h1 className="auth-title-v3">Vérifiez votre email</h1>
            <p className="auth-subtitle-v3">
              Un code à 6 chiffres a été envoyé à <strong>{email || 'votre email'}</strong>
            </p>

            {error && <div className="auth-error-banner">{error}</div>}

            <div className="lf" style={{ width: '100%', maxWidth: 360 }}>
              <label className="lf-label">Code de vérification</label>
              <div className="lf-inputwrap">
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={expired}
                  required
                />
              </div>
            </div>

            <div className="auth-subtitle-v3" style={{ marginTop: 0, color: expired ? '#DC3545' : '#6B7280' }}>
              {expired
                ? 'Code expiré, demandez un nouveau code.'
                : `Code valable encore ${formatTimer(remainingSeconds)}`}
            </div>

            <button type="submit" className="auth-btn-v3" disabled={loading || expired}>
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>

            <button
              type="button"
              className={`auth-resend-btn ${resendCountdown === 0 ? 'active' : ''}`}
              onClick={handleResend}
              disabled={resendCountdown > 0 || resending}
            >
              {resending
                ? 'Envoi...'
                : resendCountdown > 0
                  ? `Renvoyer le code dans ${resendCountdown}s`
                  : 'Renvoyer le code'}
            </button>
          </form>

          <div className="auth-bottombar">
            <span>© 2026 SafeDeal Maroc</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
