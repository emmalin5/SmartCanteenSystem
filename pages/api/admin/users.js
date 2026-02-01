/**
 * Fake API Endpoint: GET /api/admin/users
 * Returns list of all students/users (admin only)
 */

// Mock user data
const mockUsers = [
  {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    cardId: 'CARD123456',
    cardStatus: 'active',
    balance: 1250.50,
    registrationDate: '2024-09-01T00:00:00Z',
    totalTransactions: 142,
    totalSpent: 6250.00
  },
  {
    id: 'STU002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    cardId: 'CARD123457',
    cardStatus: 'active',
    balance: 850.25,
    registrationDate: '2024-09-01T00:00:00Z',
    totalTransactions: 98,
    totalSpent: 4320.50
  },
  {
    id: 'STU003',
    name: 'Bob Johnson',
    email: 'bob.johnson@university.edu',
    cardId: 'CARD123458',
    cardStatus: 'blocked',
    balance: 0.00,
    registrationDate: '2024-09-02T00:00:00Z',
    totalTransactions: 45,
    totalSpent: 2100.00,
    blockReason: 'Lost card reported'
  },
  {
    id: 'STU004',
    name: 'Alice Williams',
    email: 'alice.williams@university.edu',
    cardId: 'CARD123459',
    cardStatus: 'active',
    balance: 2100.75,
    registrationDate: '2024-09-02T00:00:00Z',
    totalTransactions: 156,
    totalSpent: 7890.25
  },
  {
    id: 'STU005',
    name: 'Charlie Brown',
    email: 'charlie.brown@university.edu',
    cardId: 'CARD123460',
    cardStatus: 'active',
    balance: 450.00,
    registrationDate: '2024-09-03T00:00:00Z',
    totalTransactions: 67,
    totalSpent: 3150.00
  },
  {
    id: 'STU006',
    name: 'Diana Prince',
    email: 'diana.prince@university.edu',
    cardId: 'CARD123461',
    cardStatus: 'active',
    balance: 1750.50,
    registrationDate: '2024-09-03T00:00:00Z',
    totalTransactions: 123,
    totalSpent: 5670.75
  },
  {
    id: 'STU007',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@university.edu',
    cardId: 'CARD123462',
    cardStatus: 'blocked',
    balance: 320.00,
    registrationDate: '2024-09-04T00:00:00Z',
    totalTransactions: 34,
    totalSpent: 1680.00,
    blockReason: 'Suspicious activity'
  },
  {
    id: 'STU008',
    name: 'Fiona Chen',
    email: 'fiona.chen@university.edu',
    cardId: 'CARD123463',
    cardStatus: 'active',
    balance: 980.25,
    registrationDate: '2024-09-04T00:00:00Z',
    totalTransactions: 89,
    totalSpent: 4120.50
  }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json({
      users: mockUsers,
      total: mockUsers.length,
      active: mockUsers.filter(u => u.cardStatus === 'active').length,
      blocked: mockUsers.filter(u => u.cardStatus === 'blocked').length
    });
  }, 500);
}



