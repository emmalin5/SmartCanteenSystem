/**
 * Fake API Endpoint: /api/admin/students/:id
 * Supports GET, PUT, DELETE
 */

import { getStudents, setStudents } from './store';

export default function handler(req, res) {
  const { id } = req.query;
  const current = getStudents();
  const studentIndex = current.findIndex((student) => student.id === id);

  if (req.method === 'GET') {
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    return res.status(200).json(current[studentIndex]);
  }

  if (req.method === 'PUT') {
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const currentStudent = current[studentIndex];
    const nextRestaurantId = req.body?.restaurantId ?? currentStudent.restaurantId;
    const restaurantChanged = currentStudent.restaurantId !== nextRestaurantId;

    const updatedStudent = {
      ...currentStudent,
      ...req.body,
      balance: Number(req.body?.balance ?? currentStudent.balance),
      restaurantAssignedAt: restaurantChanged && nextRestaurantId
        ? new Date().toISOString()
        : currentStudent.restaurantAssignedAt || ''
    };

    const nextStudents = [...current];
    nextStudents[studentIndex] = updatedStudent;
    setStudents(nextStudents);

    return res.status(200).json(updatedStudent);
  }

  if (req.method === 'DELETE') {
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const removedStudent = current[studentIndex];
    const nextStudents = current.filter((student) => student.id !== id);
    setStudents(nextStudents);

    return res.status(200).json({ success: true, student: removedStudent });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
