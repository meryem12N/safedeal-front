import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import BuyerSettings from './BuyerSettings';

/**
 * Aiguilleur pour /settings : affiche la page Sécurité claire pour un acheteur.
 * Le vendeur n'a pas encore de page Paramètres séparée — il retombe sur
 * la page Profil combinée existante (Profile.jsx) en attendant.
 */
function SettingsRoute() {
  const { user } = useAuth();
  return user?.role === 'buyer' ? <BuyerSettings /> : <Profile />;
}

export default SettingsRoute;