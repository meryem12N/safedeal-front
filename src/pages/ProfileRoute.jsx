import { useAuth } from '../context/AuthContext';
import VendorProfile from './VendorProfile';
import BuyerProfile from './BuyerProfile';

function ProfileRoute() {
  const { user } = useAuth();
  return user?.role === 'buyer' ? <BuyerProfile /> : <VendorProfile />;
}

export default ProfileRoute;