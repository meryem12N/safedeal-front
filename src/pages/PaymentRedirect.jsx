import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentRedirect() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const pendingId = localStorage.getItem('safedeal_pending_payment_id');
    localStorage.removeItem('safedeal_pending_payment_id');

    if (pendingId) {
      navigate(`/transactions/${pendingId}?payment=success`, { replace: true });
    } else {
      navigate('/transactions', { replace: true });
    }
  }, [navigate]);

  return null;
}

export default PaymentRedirect;