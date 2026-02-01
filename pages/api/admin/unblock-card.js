/**
 * Fake API Endpoint: POST /api/admin/unblock-card
 * Unblocks a student card (admin only)
 */

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cardId } = req.body;

  if (!cardId) {
    return res.status(400).json({ error: 'cardId is required' });
  }

  // Simulate API delay
  setTimeout(() => {
    const response = {
      success: true,
      message: `Card ${cardId} has been unblocked successfully`,
      cardId: cardId,
      cardStatus: 'active',
      unblockedAt: new Date().toISOString(),
      unblockedBy: 'admin' // In real app, this would come from auth token
    };

    res.status(200).json(response);
  }, 600);
}



