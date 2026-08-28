import { useAuth } from '../context/AuthContext';
import VendorSettings from './VendorSettings';
import BuyerSettings from './BuyerSettings';
import AdminSettings from './AdminSettings';

function SettingsRoute() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminSettings />;
  return user?.role === 'buyer' ? <BuyerSettings /> : <VendorSettings />;
}

export default SettingsRoute;
