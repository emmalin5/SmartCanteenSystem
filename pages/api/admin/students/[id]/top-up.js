/**
 * Fake API Endpoint: POST /api/admin/students/:id/top-up
 * Adds amount to student balance
 */

import { getStudents, setStudents } from '../store';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { amount } = req.body || {};
  const topUpAmount = Number(amount);

  if (!id) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  if (!Number.isFinite(topUpAmount) || topUpAmount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const students = getStudents();
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const updatedStudent = {
    ...students[studentIndex],
    balance: Number(students[studentIndex].balance || 0) + topUpAmount
  };

  const nextStudents = [...students];
  nextStudents[studentIndex] = updatedStudent;
  setStudents(nextStudents);

  return res.status(200).json(updatedStudent);
}
