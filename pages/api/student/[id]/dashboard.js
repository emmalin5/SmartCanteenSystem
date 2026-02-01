/**
 * Fake API Endpoint: GET /api/student/:id/dashboard
 * Returns student dashboard data including meals, usage, and notifications
 */

// Mock data for student dashboard
const mockDashboardData = {
  studentId: 'STU001',
  studentName: 'John Doe',
  cardId: 'CARD123456',
  cardStatus: 'active', // active, blocked, lost
  balance: 1250.50,
  mealsToday: [
    {
      id: 'MEAL001',
      mealType: 'Breakfast',
      time: '08:30',
      amount: 45.00,
      location: 'Main Canteen',
      status: 'completed'
    },
    {
      id: 'MEAL002',
      mealType: 'Lunch',
      time: '13:15',
      amount: 65.00,
      location: 'Main Canteen',
      status: 'completed'
    }
  ],
  monthlyUsage: {
    currentMonth: 'November 2024',
    totalSpent: 1850.00,
    totalMeals: 42,
    averagePerMeal: 44.05,
    dailyAverage: 61.67,
    breakdown: [
      { date: '2024-11-01', amount: 120.00, meals: 3 },
      { date: '2024-11-02', amount: 95.00, meals: 2 },
      { date: '2024-11-03', amount: 110.00, meals: 3 },
      { date: '2024-11-04', amount: 85.00, meals: 2 },
      { date: '2024-11-05', amount: 130.00, meals: 3 },
    ]
  },
  nextMealWindow: {
    mealType: 'Dinner',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Main Canteen',
    isActive: false
  },
  notifications: [
    {
      id: 'NOTIF001',
      type: 'info',
      title: 'Low Balance Alert',
      message: 'Your balance is below ₹200. Please recharge soon.',
      timestamp: '2024-11-05T10:30:00Z',
      read: false
    },
    {
      id: 'NOTIF002',
      type: 'success',
      title: 'Transaction Successful',
      message: 'Payment of ₹65.00 completed at Main Canteen',
      timestamp: '2024-11-05T13:15:00Z',
      read: false
    },
    {
      id: 'NOTIF003',
      type: 'warning',
      title: 'Card Usage Reminder',
      message: 'You have not used your card today. Next meal window: Dinner (18:00-20:00)',
      timestamp: '2024-11-05T15:00:00Z',
      read: true
    }
  ]
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Simulate API delay
  setTimeout(() => {
    // Return mock data with student ID
    const response = {
      ...mockDashboardData,
      studentId: id,
      studentName: `Student ${id}`,
    };

    res.status(200).json(response);
  }, 500); // 500ms delay to simulate network latency
}



