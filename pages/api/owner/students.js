/**
 * Fake API Endpoint: GET /api/owner/students
 * Returns students list for owner dashboard
 */

import { getStudents } from '../admin/students/store';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const students = getStudents();

  return res.status(200).json({
    students,
    total: students.length
  });
}
