/**
 * Fake API Endpoint: POST /api/admin/block-card
 * Blocks a student card (admin only)
 */

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cardId, reason } = req.body;

  if (!cardId) {
    return res.status(400).json({ error: 'cardId is required' });
  }

  // Simulate API delay
  setTimeout(() => {
    const response = {
      success: true,
      message: `Card ${cardId} has been blocked successfully`,
      cardId: cardId,
      cardStatus: 'blocked',
      blockedAt: new Date().toISOString(),
      reason: reason || 'Admin action',
      blockedBy: 'admin' // In real app, this would come from auth token
    };

    res.status(200).json(response);
  }, 600);
}

