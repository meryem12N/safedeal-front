import { Link } from 'react-router-dom';
import heroPhoto from '../assets/hero-photo.png';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroNavAnimation } from '../hooks/useHeroNavAnimation';
import { useHiwProgress } from '../hooks/useHiwProgress';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useCountUp } from '../hooks/useCountUp';
import './Landing.css';

const HIW_STEPS = [
  { num: '01', icon: '🔗', title: 'Créez votre transaction', text: "Le vendeur vérifié renseigne le produit et le prix, puis génère un lien sécurisé à partager sur Instagram ou WhatsApp." },
  { num: '02', icon: '💳', title: 'Payez en toute sécurité', text: "L'acheteur clique sur le lien, consulte le profil vérifié du vendeur, puis paie — les fonds sont bloqués sous séquestre." },
  { num: '03', icon: '✅', title: 'Confirmez la réception', text: "Une fois le produit reçu et conforme, l'acheteur confirme et les fonds sont automatiquement libérés au vendeur." },
];

function StatCounter({ target, suffix, label }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="vv-stat" ref={ref}>
      <span className="vv-stat-num">{value.toLocaleString('fr-FR')}{suffix}</span>
      <span className="vv-stat-label">{label}</span>
    </div>
  );
}

function Landing() {
  useScrollReveal();
  const { navRef, solid } = useHeroNavAnimation();
  const { sectionRef, progress } = useHiwProgress();
  const { scrollToId } = useSmoothScroll();

  const cardProgress = [0, 1, 2].map((i) => {
    const p = (progress - i * 0.25) * 3.2;
    return Math.min(Math.max(p, 0), 1);
  });

  return (
    <div className="landing-page">
      <div className="hero-photo" id="accueil" style={{ backgroundImage: `url(${heroPhoto})` }}>
        <nav className={`landing-nav-dark ${solid ? 'nav-solid' : ''}`} ref={navRef}>
          <div className="landing-brand">
            <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
              <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
              <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
              <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="landing-brand-text">SafeDeal</span>
          </div>
          <div className="landing-nav-links">
            <a href="#accueil" onClick={(e) => { e.preventDefault(); scrollToId('accueil'); }}>Accueil</a>
            <a href="#comment-ca-marche" onClick={(e) => { e.preventDefault(); scrollToId('comment-ca-marche'); }}>Comment ça marche</a>
            <a href="#vendeurs-verifies" onClick={(e) => { e.preventDefault(); scrollToId('vendeurs-verifies'); }}>Vendeurs vérifiés</a>
            <a href="#litiges">Litiges</a>
            <a href="#faq">FAQ</a>
          </div>
          <Link to="/login" className="landing-nav-cta">Se connecter</Link>
        </nav>

        <div className="hero-photo-content">
          <h1 className="hero-photo-title">
            La confiance devient<br />
            <span className="gradient-text">enfin une norme</span>.
          </h1>
          <p className="hero-photo-subtitle">
            SafeDeal vérifie chaque vendeur et sécurise chaque paiement jusqu'à la réception du produit —
            pour que vendre sur les réseaux sociaux ne soit plus jamais un pari.
          </p>
          <div className="cta-row-left">
            <Link to="/register" className="btn btn-primary">Créer mon compte vérifié</Link>
            <button className="btn btn-ghost-dark">Voir comment ça marche</button>
          </div>
        </div>
      </div>

      <div className="landing-content-wrap">
        <div className="hiw-section" id="comment-ca-marche" ref={sectionRef}>
          <div className="hiw-head">
            <span className="hiw-kicker">Comment ça marche</span>
            <h2 className="hiw-title">Trois étapes vers une transaction sécurisée</h2>
            <p className="hiw-subtitle">
              De la création du lien à la libération du paiement, chaque étape est tracée et protégée.
            </p>
          </div>

          <div className="hiw-track">
            <svg className="hiw-line" viewBox="0 0 1000 4" preserveAspectRatio="none">
              <line className="hiw-line-bg" x1="0" y1="2" x2="1000" y2="2" />
              <line
                className="hiw-line-fill"
                x1="0" y1="2" x2="1000" y2="2"
                pathLength="1"
                style={{ strokeDashoffset: 1 - progress }}
              />
            </svg>

            {HIW_STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`hiw-step ${cardProgress[i] > 0.7 ? 'active' : ''}`}
                style={{
                  opacity: cardProgress[i],
                  transform: `translateY(${(1 - cardProgress[i]) * 30}px) scale(${0.96 + cardProgress[i] * 0.04})`,
                  filter: `blur(${(1 - cardProgress[i]) * 6}px)`,
                }}
              >
                <span className="hiw-ghost-num">{step.num}</span>
                <div className="hiw-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="vv-section" id="vendeurs-verifies">
          <div className="hiw-head">
            <span className="section-kicker">Vendeurs vérifiés</span>
            <h2 className="section-title">Une communauté de confiance, vérifiée point par point</h2>
            <p className="section-subtitle">
              Chaque vendeur passe par un processus de vérification avant de pouvoir créer une transaction.
            </p>
          </div>

          <div className="vv-stats">
            <StatCounter target={3200} suffix="+" label="Vendeurs vérifiés" />
            <StatCounter target={98} suffix="%" label="Taux de satisfaction" />
            <StatCounter target={12000} suffix="+" label="Transactions sécurisées" />
          </div>

          <div className="vv-criteria">
            <div className="vv-crit-card reveal" style={{ transitionDelay: '0.05s' }}>
              <div className="vv-crit-icon">🪪</div>
              <h3>CIN vérifiée</h3>
              <p>Identité confirmée via pièce nationale avant toute activation du compte vendeur.</p>
            </div>
            <div className="vv-crit-card reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="vv-crit-icon">📱</div>
              <h3>Téléphone confirmé</h3>
              <p>Numéro validé par code OTP, lié en permanence au compte vérifié.</p>
            </div>
            <div className="vv-crit-card reveal" style={{ transitionDelay: '0.25s' }}>
              <div className="vv-crit-icon">📊</div>
              <h3>Historique suivi</h3>
              <p>Chaque transaction passée reste visible et contribue à la réputation du vendeur.</p>
            </div>
          </div>

          <div className="vv-profiles">
            <div className="vv-profile-card reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="vv-avatar">👩🏻</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name">Salma B. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating">★★★★★ <span>(48 ventes)</span></div>
              </div>
            </div>
            <div className="vv-profile-card reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="vv-avatar">👨🏽</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name">Yassine K. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating">★★★★★ <span>(112 ventes)</span></div>
              </div>
            </div>
            <div className="vv-profile-card reveal" style={{ transitionDelay: '0.3s' }}>
              <div className="vv-avatar">👩🏽</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name">Imane R. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating">★★★★☆ <span>(29 ventes)</span></div>
              </div>
            </div>
          </div>
        </div>

        <footer className="landing-footer" id="litiges">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="landing-brand">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <path d="M16 2 L28 6.5 V15 C28 22.5 22.8 27.8 16 30 V2 Z" fill="#2A46E0"/>
                  <path d="M16 2 L4 6.5 V15 C4 22.5 9.2 27.8 16 30 V2 Z" fill="#3B5BFF"/>
                  <path d="M9.5 15.5 L14 20 L22.5 10.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="landing-brand-text" style={{ color: '#0F1420' }}>SafeDeal</span>
              </div>
              <p className="footer-tagline">La couche de confiance pour vos ventes sur les réseaux sociaux, au Maroc.</p>
            </div>

            <div className="footer-col">
              <h4>Produit</h4>
              <a href="#comment-ca-marche" onClick={(e) => { e.preventDefault(); scrollToId('comment-ca-marche'); }}>Comment ça marche</a>
              <a href="#vendeurs-verifies" onClick={(e) => { e.preventDefault(); scrollToId('vendeurs-verifies'); }}>Vendeurs vérifiés</a>
              <a href="#litiges">Litiges</a>
            </div>

            <div className="footer-col">
              <h4>Entreprise</h4>
              <a href="#">À propos</a>
              <a href="#">Sécurité</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-col">
              <h4>Légal</h4>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Politique de confidentialité</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SafeDeal Maroc. Tous droits réservés.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;