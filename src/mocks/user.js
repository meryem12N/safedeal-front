export const mockUser = {
  id: 1,
  name: "Youssef Amrani",
  email: "youssef@example.com",
  phone: "+212600000000",
  role: "vendor",
  is_verified: true,
  verification_status: "approved",
  reputation_score: 4.5,
  total_transactions: 12,
  created_at: "2025-01-15T10:00:00Z"
};

export const mockNotifications = {
  data: [
    { id: 101, type: "payment_received", message: "Paiement reçu pour la transaction TXN-2025-0042", transaction_id: 42, is_read: false, created_at: "2025-01-16T11:00:00Z" },
    { id: 100, type: "identity_approved", message: "Votre identité a été vérifiée avec succès", transaction_id: null, is_read: true, created_at: "2025-01-15T14:00:00Z" }
  ],
  unread_count: 1
};