/**
 * Fake API Endpoint: GET /api/admin/transactions
 * Returns all transactions across all students (admin only)
 */

// Generate mock transactions for all users
const generateAllTransactions = () => {
  const transactions = [];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const locations = ['Main Canteen', 'North Canteen', 'South Canteen', 'Cafeteria'];
  const studentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007', 'STU008'];
  
  // Generate transactions for last 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    // Generate 20-40 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 21) + 20;
    
    for (let i = 0; i < transactionsPerDay; i++) {
      const studentId = studentIds[Math.floor(Math.random() * studentIds.length)];
      const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const amount = Math.round((Math.random() * 50 + 30) * 100) / 100; // ₹30-80
      
      const hour = mealType === 'Breakfast' ? 8 : mealType === 'Lunch' ? 13 : mealType === 'Dinner' ? 19 : 15;
      const minute = Math.floor(Math.random() * 60);
      
      transactions.push({
        id: `TXN${String(day).padStart(2, '0')}${String(i).padStart(3, '0')}`,
        studentId: studentId,
        studentName: `Student ${studentId}`,
        cardId: `CARD${123456 + parseInt(studentId.slice(-1))}`,
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

  const { page = 1, limit = 50, studentId, startDate, endDate } = req.query;

  // Simulate API delay
  setTimeout(() => {
    let transactions = generateAllTransactions();
    
    // Apply filters
    if (studentId) {
      transactions = transactions.filter(txn => txn.studentId === studentId);
    }
    
    if (startDate) {
      transactions = transactions.filter(txn => new Date(txn.timestamp) >= new Date(startDate));
    }
    
    if (endDate) {
      transactions = transactions.filter(txn => new Date(txn.timestamp) <= new Date(endDate));
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    // Calculate totals
    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    res.status(200).json({
      transactions: paginatedTransactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: transactions.length,
        totalPages: Math.ceil(transactions.length / limitNum)
      },
      summary: {
        totalTransactions: transactions.length,
        totalAmount: totalAmount,
        averageTransaction: transactions.length > 0 ? totalAmount / transactions.length : 0
      }
    });
  }, 700);
}

