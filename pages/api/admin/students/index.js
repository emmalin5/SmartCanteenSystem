/**
 * Fake API Endpoint: /api/admin/students
 * Supports GET (list) and POST (create)
 */

import { getStudents, setStudents, generateStudentId, generateCardId } from './store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const students = getStudents();
    return res.status(200).json({
      students,
      total: students.length,
      active: students.filter((u) => u.cardStatus === 'active').length,
      blocked: students.filter((u) => u.cardStatus === 'blocked').length
    });
  }

  if (req.method === 'POST') {
    const {
      id,
      name,
      email,
      cardId,
      cardStatus = 'active',
      balance = 0,
      restaurantId = ''
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const newStudent = {
      id: id || generateStudentId(),
      name,
      email,
      cardId: cardId || generateCardId(),
      cardStatus,
      restaurantId,
      restaurantAssignedAt: restaurantId ? new Date().toISOString() : '',
      balance: Number(balance) || 0,
      registrationDate: new Date().toISOString(),
      totalTransactions: 0,
      totalSpent: 0
    };

    const students = getStudents();
    setStudents([newStudent, ...students]);

    return res.status(201).json(newStudent);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
