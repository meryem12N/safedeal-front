import { Link } from 'react-router-dom';
import heroVideo from '../assets/hero-video.mp4';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroNavAnimation } from '../hooks/useHeroNavAnimation';
import { useHiwProgress } from '../hooks/useHiwProgress';
import { useLitigesProgress } from '../hooks/useLitigesProgress';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useCountUp } from '../hooks/useCountUp';
import { useAccordion } from '../hooks/useAccordion';
import { useInView } from '../hooks/useInView';
import './Landing.css';

const HIW_STEPS = [
  { num: '01', icon: '🔗', title: 'Créez votre transaction', text: "Le vendeur vérifié renseigne le produit et le prix, puis génère un lien sécurisé à partager sur Instagram ou WhatsApp." },
  { num: '02', icon: '💳', title: 'Payez en toute sécurité', text: "L'acheteur clique sur le lien, consulte le profil vérifié du vendeur, puis paie — les fonds sont bloqués sous séquestre." },
  { num: '03', icon: '✅', title: 'Confirmez la réception', text: "Une fois le produit reçu et conforme, l'acheteur confirme et les fonds sont automatiquement libérés au vendeur." },
];

const LITIGES_STEPS = [
  { icon: '🚩', title: 'Signalement du litige', text: "L'acheteur signale un problème directement depuis la transaction, avec preuves à l'appui (photos, messages)." },
  { icon: '🔍', title: 'Analyse du dossier', text: "SafeDeal examine les preuves des deux parties : conformité du produit, échanges, historique de la transaction." },
  { icon: '⚖️', title: "Décision d'arbitrage", text: "Une décision équitable est rendue : remboursement total, partiel, ou libération des fonds au vendeur." },
  { icon: '✅', title: 'Résolution appliquée', text: "Les fonds sont transférés selon la décision, et le dossier est clôturé et archivé pour les deux parties." },
];

const FAQ_ITEMS = [
  { q: "Comment mon paiement est-il protégé ?", a: "Une fois que vous payez, les fonds sont bloqués sous séquestre par SafeDeal — le vendeur ne les reçoit qu'après que vous ayez confirmé la bonne réception du produit." },
  { q: "Que se passe-t-il si je ne reçois pas mon colis ?", a: "Vous pouvez ouvrir un litige directement depuis votre transaction. Nos équipes examinent les preuves et statuent en votre faveur si le produit n'a effectivement pas été livré." },
  { q: "Comment un vendeur devient-il vérifié ?", a: "Le vendeur doit soumettre sa CIN et confirmer son numéro de téléphone par code OTP. Ce n'est qu'après validation qu'il peut créer des transactions sur la plateforme." },
  { q: "Combien de temps prend la libération des fonds ?", a: "Dès que l'acheteur confirme la réception, les fonds sont libérés au vendeur automatiquement, généralement en quelques minutes." },
  { q: "SafeDeal prend-il une commission ?", a: "Oui, une petite commission est prélevée sur chaque transaction sécurisée pour couvrir les frais de vérification et d'arbitrage." },
  { q: "Puis-je utiliser SafeDeal sans compte vérifié en tant qu'acheteur ?", a: "Oui, seul le vendeur doit être vérifié. En tant qu'acheteur, vous pouvez payer une transaction sans passer par cette vérification." },
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

function FaqItem({ item, index, isOpen, onToggle }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`faq-item ${inView ? 'faq-in-view' : ''} ${isOpen ? 'open' : ''}`}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <button className="faq-question" onClick={onToggle}>
        <span>{item.q}</span>
        <span className="faq-chevron">⌄</span>
      </button>
      <div className="faq-answer-wrap" style={{ maxHeight: isOpen ? '200px' : '0px' }}>
        <p className="faq-answer">{item.a}</p>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const { openIndex, toggle } = useAccordion(0);

  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <FaqItem
          key={item.q}
          item={item}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}

function Landing() {
  useScrollReveal();
  const { navRef, solid, visible } = useHeroNavAnimation();
  const { sectionRef, progress } = useHiwProgress();
  const { sectionRef: litigesRef, progress: litigesProgress } = useLitigesProgress();
  const { scrollToId } = useSmoothScroll();

  const cardProgress = [0, 1, 2].map((i) => {
    const p = (progress - i * 0.25) * 3.2;
    return Math.min(Math.max(p, 0), 1);
  });

  return (
    <div className="landing-page">
      <nav
        className={`landing-nav-dark ${solid ? 'nav-solid' : ''} ${!visible ? 'nav-hidden' : ''}`}
        ref={navRef}
      >
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
          <a href="#litiges" onClick={(e) => { e.preventDefault(); scrollToId('litiges'); }}>Litiges</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq'); }}>FAQ</a>
        </div>
        <Link to="/login" className="landing-nav-cta">Se connecter</Link>
      </nav>

      <div className="hero-photo" id="accueil">
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
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

          <svg className="hiw-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64 C240,0 480,120 720,88 C960,56 1200,0 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>

        <div className="vv-section" id="vendeurs-verifies">
          <div className="vv-glow vv-glow-1" />

          <div className="lit-head">
            <span className="section-kicker">Vendeurs vérifiés</span>
            <h2 className="section-title-lg">Une communauté de confiance,<br />vérifiée point par point</h2>
            <p className="lit-subtitle-dark">
              Chaque vendeur passe par un processus de vérification avant de pouvoir créer une transaction.
            </p>
          </div>

          <div className="vv-stats-full">
            <StatCounter target={3200} suffix="+" label="Vendeurs vérifiés" />
            <StatCounter target={98} suffix="%" label="Taux de satisfaction" />
            <StatCounter target={12000} suffix="+" label="Transactions sécurisées" />
          </div>

          <div className="vv-criteria-full">
            <div className="vv-crit-card-full reveal" style={{ transitionDelay: '0.05s' }}>
              <div className="vv-crit-icon-lg">🪪</div>
              <h3>CIN vérifiée</h3>
              <p>Identité confirmée via pièce nationale avant toute activation du compte vendeur.</p>
            </div>
            <div className="vv-crit-card-full reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="vv-crit-icon-lg">📱</div>
              <h3>Téléphone confirmé</h3>
              <p>Numéro validé par code OTP, lié en permanence au compte vérifié.</p>
            </div>
            <div className="vv-crit-card-full reveal" style={{ transitionDelay: '0.25s' }}>
              <div className="vv-crit-icon-lg">📊</div>
              <h3>Historique suivi</h3>
              <p>Chaque transaction passée reste visible et contribue à la réputation du vendeur.</p>
            </div>
          </div>

          <div className="vv-profiles-full">
            <div className="vv-profile-card-full reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="vv-avatar-lg">👩🏻</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name-lg">Salma B. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating-lg">★★★★★ <span>(48 ventes)</span></div>
              </div>
            </div>
            <div className="vv-profile-card-full reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="vv-avatar-lg">👨🏽</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name-lg">Yassine K. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating-lg">★★★★★ <span>(112 ventes)</span></div>
              </div>
            </div>
            <div className="vv-profile-card-full reveal" style={{ transitionDelay: '0.3s' }}>
              <div className="vv-avatar-lg">👩🏽</div>
              <div className="vv-profile-info">
                <div className="vv-profile-name-lg">Imane R. <span className="vv-badge">✓</span></div>
                <div className="vv-profile-rating-lg">★★★★☆ <span>(29 ventes)</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lit-section" id="litiges" ref={litigesRef}>
          <div className="lit-glow lit-glow-1" />
          <div className="lit-glow lit-glow-2" />

          <div className="lit-head">
            <span className="lit-kicker">Litiges</span>
            <h2 className="lit-title">Un arbitrage juste,<br />à chaque étape</h2>
            <p className="lit-subtitle">
              En cas de désaccord, un processus clair et tracé protège acheteur comme vendeur.
            </p>
          </div>

          <div className="lit-line-h-track">
            <div
              className="lit-line-h-fill"
              style={{ width: `${Math.min(Math.max((litigesProgress - 0.1) * 1.4, 0), 1) * 100}%` }}
            />
          </div>

          <div className="lit-rows">
            {LITIGES_STEPS.map((step, i) => {
              const stepProgress = Math.min(Math.max((litigesProgress - 0.12 - i * 0.13) * 4, 0), 1);
              const fromLeft = i % 2 === 0;
              return (
                <div key={step.title} className={`lit-fullrow ${fromLeft ? '' : 'lit-fullrow-reverse'}`}>
                  <div
                    className={`lit-orb ${stepProgress > 0.5 ? 'active' : ''}`}
                    style={{
                      opacity: stepProgress,
                      transform: `scale(${0.7 + stepProgress * 0.3})`,
                    }}
                  >
                    <span className="lit-orb-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lit-orb-icon">{step.icon}</span>
                  </div>

                  <div
                    className="lit-fulltext"
                    style={{
                      opacity: stepProgress,
                      transform: `translateX(${fromLeft ? (1 - stepProgress) * 50 : (1 - stepProgress) * -50}px)`,
                    }}
                  >
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="faq-section" id="faq">
          <div className="hiw-head">
            <span className="section-kicker-light">FAQ</span>
            <h2 className="section-title">Questions fréquentes</h2>
            <p className="section-subtitle">
              Tout ce qu'il faut savoir avant de vendre ou d'acheter en toute confiance.
            </p>
          </div>
          <FaqAccordion />
        </div>

        <footer className="landing-footer">
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
              <a href="#litiges" onClick={(e) => { e.preventDefault(); scrollToId('litiges'); }}>Litiges</a>
            </div>

            <div className="footer-col">
              <h4>Entreprise</h4>
              <a href="#">À propos</a>
              <a href="#">Sécurité</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq'); }}>FAQ</a>
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