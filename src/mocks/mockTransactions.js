export const mockVendorTransactions = [
  {
    id: 42, reference: 'TXN-2026-0042', title: 'iPhone 14 Pro', amount: 8500.00, currency: 'MAD',
    status: 'pending_payment', buyer_email: 'sara.k@example.com', delivery_deadline_days: 5,
    created_at: '2026-07-18T10:00:00.000000Z',
  },
  {
    id: 41, reference: 'TXN-2026-0041', title: 'Sac à main Zara', amount: 450.00, currency: 'MAD',
    status: 'payment_received', buyer_email: 'imane.r@example.com', delivery_deadline_days: 3,
    created_at: '2026-07-16T14:30:00.000000Z',
  },
  {
    id: 40, reference: 'TXN-2026-0040', title: 'Console PS5', amount: 6200.00, currency: 'MAD',
    status: 'in_shipping', buyer_email: 'yassine.b@example.com', delivery_deadline_days: 4,
    created_at: '2026-07-14T09:15:00.000000Z',
  },
  {
    id: 39, reference: 'TXN-2026-0039', title: 'Montre connectée', amount: 1200.00, currency: 'MAD',
    status: 'closed', buyer_email: 'nadia.f@example.com', delivery_deadline_days: 5,
    created_at: '2026-07-10T11:00:00.000000Z',
  },
  {
    id: 38, reference: 'TXN-2026-0038', title: 'Vélo VTT', amount: 3200.00, currency: 'MAD',
    status: 'cancelled', buyer_email: 'omar.t@example.com', delivery_deadline_days: 6,
    created_at: '2026-07-08T16:45:00.000000Z',
  },
];

export const mockBuyerTransactions = [
  {
    id: 55, reference: 'TXN-2026-0055', title: 'Écouteurs AirPods Pro', amount: 1800.00, currency: 'MAD',
    status: 'pending_payment', delivery_deadline_days: 4, created_at: '2026-07-19T08:00:00.000000Z',
    vendor: { id: 3, name: 'Salma B.', is_verified: true, reputation_score: 4.8 },
  },
  {
    id: 54, reference: 'TXN-2026-0054', title: 'Chaise de bureau', amount: 950.00, currency: 'MAD',
    status: 'in_shipping', delivery_deadline_days: 5, created_at: '2026-07-15T10:20:00.000000Z',
    vendor: { id: 5, name: 'Yassine K.', is_verified: true, reputation_score: 4.9 },
  },
  {
    id: 53, reference: 'TXN-2026-0053', title: 'Livre - Design Patterns', amount: 180.00, currency: 'MAD',
    status: 'closed', delivery_deadline_days: 3, created_at: '2026-07-05T13:00:00.000000Z',
    vendor: { id: 7, name: 'Imane R.', is_verified: true, reputation_score: 4.6 },
  },
];

export const STATUS_LABELS = {
  pending_payment: { label: 'En attente de paiement', color: '#E8A63D' },
  payment_received: { label: 'Paiement reçu', color: '#3B5BFF' },
  in_shipping: { label: 'En livraison', color: '#8B5CF6' },
  delivered: { label: 'Livré', color: '#06B6D4' },
  closed: { label: 'Terminée', color: '#22C55E' },
  dispute: { label: 'Litige', color: '#DC3545' },
  cancelled: { label: 'Annulée', color: '#9AA3BF' },
};