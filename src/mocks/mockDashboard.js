export const overviewData = [
  { day: 'Jan', ventes: 3200 }, { day: 'Fév', ventes: 2900 }, { day: 'Mar', ventes: 3800 },
  { day: 'Avr', ventes: 4100 }, { day: 'Mai', ventes: 3600 }, { day: 'Juin', ventes: 4800 },
  { day: 'Juil', ventes: 3780 }, { day: 'Août', ventes: 5200 }, { day: 'Sep', ventes: 6100 },
  { day: 'Oct', ventes: 5400 }, { day: 'Nov', ventes: 6800 }, { day: 'Déc', ventes: 5900 },
];

export const revenueSpark = [{ v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 40 }, { v: 60 }, { v: 55 }];
export const ordersSpark = [{ v: 15 }, { v: 25 }, { v: 20 }, { v: 30 }, { v: 28 }, { v: 38 }, { v: 42 }];
export const profitSpark = [{ v: 10 }, { v: 18 }, { v: 15 }, { v: 28 }, { v: 22 }, { v: 35 }, { v: 32 }];

export const topProducts = [
  { id: 1, name: 'iPhone 16 Pro', sold: 512, percent: 48, category: 'phone', rating: 4.9 },
  { id: 2, name: 'Console PS5', sold: 310, percent: 28, category: 'game', rating: 4.8 },
  { id: 3, name: 'Sac à main Zara', sold: 210, percent: 18, category: 'bag', rating: 4.6 },
  { id: 4, name: 'MacBook Air', sold: 120, percent: 6, category: 'laptop', rating: 4.9 },
];

export const recentTransactionsTable = [
  { id: 1, name: 'iPhone 16 Pro', category: 'phone', amount: '102 000 MAD', status: 'success', date: '20 Jul 2026', time: '10:24', rating: 4.9 },
  { id: 2, name: 'Sac à main Zara', category: 'bag', amount: '15 300 MAD', status: 'pending', date: '20 Jul 2026', time: '09:15', rating: 4.6 },
  { id: 3, name: 'Console PS5', category: 'game', amount: '37 200 MAD', status: 'success', date: '20 Jul 2026', time: '08:42', rating: 4.8 },
];

export const activityFeed = [
  { id: 1, type: 'order', title: 'Nouvelle commande', desc: 'iPhone 16 Pro · 102 000 MAD', time: 'Il y a 2 min' },
  { id: 2, type: 'payment', title: 'Paiement reçu', desc: 'Sac à main Zara · 15 300 MAD', time: 'Il y a 5 min' },
  { id: 3, type: 'vendor', title: 'Nouveau vendeur', desc: 'Yassine a rejoint votre équipe', time: 'Il y a 1 h' },
  { id: 4, type: 'stock', title: 'Stock mis à jour', desc: 'Console PS5 · 37 200 MAD', time: 'Il y a 2 h' },
];

export const calendarEvents = {
  20: [
    { id: 1, title: 'Réunion avec l\'équipe', time: '11:00 AM' },
    { id: 2, title: 'Livraison · iPhone 16 Pro', time: '03:30 PM' },
  ],
};

export const CURRENT_MONTH_LABEL = 'Juillet 2026';
export const CALENDAR_DAYS = [
  [null, null, 29, 30], // padding start ignored, handled in component
];