/**
 * Fake API Endpoint: POST /api/student/:id/report-lost-card
 * Handles lost card reporting
 */

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { reason, contactNumber, additionalInfo } = req.body;

  // Validate required fields
  if (!reason || !contactNumber) {
    return res.status(400).json({ 
      error: 'Missing required fields: reason and contactNumber are required' 
    });
  }

  // Simulate API delay
  setTimeout(() => {
    // Mock response
    const response = {
      success: true,
      message: 'Lost card reported successfully. Your card has been blocked and a replacement will be issued within 2-3 business days.',
      reportId: `REPORT${Date.now()}`,
      studentId: id,
      cardStatus: 'blocked',
      timestamp: new Date().toISOString(),
      estimatedReplacementDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    res.status(200).json(response);
  }, 800);
}



