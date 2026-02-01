/**
 * Fake API Endpoint: /api/admin/restaurants
 * Supports GET (list) and POST (create)
 */

import { getRestaurants, setRestaurants, generateRestaurantId } from './store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const restaurants = getRestaurants();
    return res.status(200).json({ restaurants, total: restaurants.length });
  }

  if (req.method === 'POST') {
    const { id, name, location, ownerName, status = 'active', openingHours = '' } = req.body || {};

    if (!name || !location || !ownerName) {
      return res.status(400).json({ error: 'name, location, and ownerName are required' });
    }

    const newRestaurant = {
      id: id || generateRestaurantId(),
      name,
      location,
      ownerName,
      status,
      openingHours
    };

    const restaurants = getRestaurants();
    setRestaurants([newRestaurant, ...restaurants]);

    return res.status(201).json(newRestaurant);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
