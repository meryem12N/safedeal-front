import { useAuth } from '../context/AuthContext';
import VendorSettings from './VendorSettings';
import BuyerSettings from './BuyerSettings';

function SettingsRoute() {
  const { user } = useAuth();
  return user?.role === 'buyer' ? <BuyerSettings /> : <VendorSettings />;
}

export default SettingsRoute;