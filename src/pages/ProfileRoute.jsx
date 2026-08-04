import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import BuyerProfile from './BuyerProfile';

/**
 * Aiguilleur : affiche la version claire du profil pour un acheteur,
 * la version sombre existante pour un vendeur.
 * Permet à /profile et /settings de rester des routes uniques
 * sans dupliquer la logique de navigation dans UserMenu.
 */
function ProfileRoute() {
  const { user } = useAuth();
  return user?.role === 'buyer' ? <BuyerProfile /> : <Profile />;
}

export default ProfileRoute;