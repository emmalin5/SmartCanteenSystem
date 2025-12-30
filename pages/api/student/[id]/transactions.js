/**
 * Fake API Endpoint: GET /api/student/:id/transactions
 * Returns transaction history for a student
 */

// Mock transaction data
const generateMockTransactions = (studentId) => {
  const transactions = [];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const locations = ['Main Canteen', 'North Canteen', 'South Canteen', 'Cafeteria'];
  
  // Generate last 30 days of transactions
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random number of transactions per day (0-3)
    const transactionsPerDay = Math.floor(Math.random() * 4);
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const amount = Math.round((Math.random() * 50 + 30) * 100) / 100; // ₹30-80
      
      const hour = mealType === 'Breakfast' ? 8 : mealType === 'Lunch' ? 13 : mealType === 'Dinner' ? 19 : 15;
      const minute = Math.floor(Math.random() * 60);
      
      transactions.push({
        id: `TXN${String(i).padStart(3, '0')}${String(j).padStart(2, '0')}`,
        studentId: studentId,
        cardId: 'CARD123456',
        mealType: mealType,
        amount: amount,
        location: location,
        timestamp: new Date(date.setHours(hour, minute, 0)).toISOString(),
        status: 'completed',
        transactionType: 'payment'
      });
    }
  }
  
  // Sort by timestamp (newest first)
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Simulate API delay
  setTimeout(() => {
    const transactions = generateMockTransactions(id);
    
    res.status(200).json({
      studentId: id,
      transactions: transactions,
      total: transactions.length,
      totalAmount: transactions.reduce((sum, txn) => sum + txn.amount, 0)
    });
  }, 600);
}

