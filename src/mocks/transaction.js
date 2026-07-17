export const mockTransaction = {
  id: 42,
  reference: "TXN-2025-0042",
  secure_link: "https://safedeal.ma/t/abc123xyz",
  product_name: "iPhone 14 Pro",
  product_description: "Très bon état, avec boîte",
  amount: 8500.00,
  currency: "MAD",
  status: "pending_payment",
  delivery_deadline_days: 5,
  shipping_carrier: null,
  tracking_number: null,
  vendor: {
    id: 1,
    name: "Youssef Amrani",
    is_verified: true,
    reputation_score: 4.5,
    total_transactions: 12
  },
  created_at: "2025-01-16T10:00:00Z",
  paid_at: null,
  shipped_at: null,
  delivered_at: null,
  closed_at: null
};

export const mockTransactionsList = {
  data: [
    { id: 42, reference: "TXN-2025-0042", product_name: "iPhone 14 Pro", amount: 8500.00, status: "pending_payment", role: "vendor", created_at: "2025-01-16T10:00:00Z" },
    { id: 41, reference: "TXN-2025-0041", product_name: "MacBook Air M2", amount: 12000.00, status: "closed", role: "vendor", created_at: "2025-01-10T10:00:00Z" },
    { id: 40, reference: "TXN-2025-0040", product_name: "AirPods Pro", amount: 1800.00, status: "dispute", role: "vendor", created_at: "2025-01-08T10:00:00Z" }
  ],
  meta: { current_page: 1, total: 3, per_page: 10, last_page: 1 }
};