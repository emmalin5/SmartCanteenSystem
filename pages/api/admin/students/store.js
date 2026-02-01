/**
 * In-memory student store for mock admin endpoints
 */

const initialStudents = [
  {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    cardId: 'CARD123456',
    restaurantId: 'REST001',
    restaurantAssignedAt: '2026-01-15T09:00:00Z',
    cardStatus: 'active',
    balance: 1250.5,
    registrationDate: '2024-09-01T00:00:00Z',
    totalTransactions: 142,
    totalSpent: 6250.0
  },
  {
    id: 'STU002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    cardId: 'CARD123457',
    restaurantId: 'REST002',
    restaurantAssignedAt: '2026-01-10T09:00:00Z',
    cardStatus: 'active',
    balance: 850.25,
    registrationDate: '2024-09-01T00:00:00Z',
    totalTransactions: 98,
    totalSpent: 4320.5
  },
  {
    id: 'STU003',
    name: 'Bob Johnson',
    email: 'bob.johnson@university.edu',
    cardId: 'CARD123458',
    restaurantId: 'REST001',
    restaurantAssignedAt: '2026-01-20T09:00:00Z',
    cardStatus: 'blocked',
    balance: 0,
    registrationDate: '2024-09-02T00:00:00Z',
    totalTransactions: 45,
    totalSpent: 2100.0,
    blockReason: 'Lost card reported'
  }
];

let students = [...initialStudents];

export const getStudents = () => students;
export const setStudents = (nextStudents) => {
  students = nextStudents;
};

export const generateStudentId = () => {
  const nextNumber = students.length + 1;
  return `STU${String(nextNumber).padStart(3, '0')}`;
};

export const generateCardId = () => {
  const nextNumber = 123456 + students.length + 1;
  return `CARD${nextNumber}`;
};
