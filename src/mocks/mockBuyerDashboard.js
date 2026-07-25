export const spentSpark = [{ v: 4 }, { v: 6 }, { v: 5 }, { v: 8 }, { v: 7 }, { v: 9 }, { v: 11 }, { v: 10 }, { v: 13 }];
export const purchasesSpark = [{ v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 8 }];
export const escrowSpark = [{ v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 9 }, { v: 8 }, { v: 10 }];

// currentStep : 0 = Payé, 1 = Séquestré, 2 = Expédié, 3 = Livré, 4 = Confirmé
export const trackingOrders = [
  { id: 1, name: 'iPhone 15 Pro', orderNumber: 'AMZ-12345', category: 'electronics', currentStep: 2, status: 'transit', deliveryDate: '22 Mai 2025' },
  { id: 2, name: 'Nike Air Max', orderNumber: 'JUM-67890', category: 'fashion', currentStep: 2, status: 'transit', deliveryDate: '25 Mai 2025' },
  { id: 3, name: 'Casque Sony WH-1000XM5', orderNumber: 'ALI-11223', category: 'electronics', currentStep: 1, status: 'sequestre', deliveryDate: '28 Mai 2025' },
  { id: 4, name: 'Sac à dos Eastpak', orderNumber: 'MAR-44556', category: 'fashion', currentStep: 0, status: 'preparation', deliveryDate: '01 Juin 2025' },
];

export const balanceData = {
  available: '10 780 MAD',
  pendingRefund: '2 330 MAD',
  totalRefunded: '4 850 MAD',
};

export const buyerTransactions = [
  { id: 1, merchant: 'Amazon', orderNumber: 'AMZ-12345', amount: '-1 250 MAD', status: 'termine', date: "Aujourd'hui" },
  { id: 2, merchant: 'Jumia', orderNumber: 'JUM-67890', amount: '-850 MAD', status: 'termine', date: 'Hier' },
  { id: 3, merchant: 'AliExpress', orderNumber: 'ALI-11223', amount: '-320 MAD', status: 'encours', date: '18 Mai 2025' },
  { id: 4, merchant: 'Marjane', orderNumber: 'MAR-44556', amount: '-540 MAD', status: 'termine', date: '12 Mai 2025' },
  { id: 5, merchant: 'Carrefour', orderNumber: 'CAR-77893', amount: '-610 MAD', status: 'termine', date: '10 Mai 2025' },
];

export const buyerActivityFeed = [
  { id: 1, type: 'shipped', title: 'Le vendeur a expédié votre commande', desc: 'Commande #AMZ-12345', time: 'Il y a 2 min' },
  { id: 2, type: 'payment', title: 'Paiement de 1 250 MAD séquestré avec succès', desc: 'Commande #AMZ-12345', time: 'Il y a 5 min' },
  { id: 3, type: 'transit', title: 'Votre commande #JUM-67890 est en transit', desc: 'Nike Air Max', time: 'Il y a 1 h' },
  { id: 4, type: 'deadline', title: 'Délai de confirmation pour la commande #ALI-11223', desc: 'Se termine dans 2 jours', time: 'Il y a 2 h' },
  { id: 5, type: 'reminder', title: "N'oubliez pas de confirmer la réception", desc: 'Commande #MAR-44556', time: 'Il y a 3 h' },
];