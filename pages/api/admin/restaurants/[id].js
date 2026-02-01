/**
 * Fake API Endpoint: /api/admin/restaurants/:id
 * Supports GET, PUT, DELETE
 */

import { getRestaurants, setRestaurants } from './store';

export default function handler(req, res) {
  const { id } = req.query;
  const restaurants = getRestaurants();
  const restaurantIndex = restaurants.findIndex((restaurant) => restaurant.id === id);

  if (req.method === 'GET') {
    if (restaurantIndex === -1) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    return res.status(200).json(restaurants[restaurantIndex]);
  }

  if (req.method === 'PUT') {
    if (restaurantIndex === -1) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const updatedRestaurant = {
      ...restaurants[restaurantIndex],
      ...req.body
    };

    const nextRestaurants = [...restaurants];
    nextRestaurants[restaurantIndex] = updatedRestaurant;
    setRestaurants(nextRestaurants);

    return res.status(200).json(updatedRestaurant);
  }

  if (req.method === 'DELETE') {
    if (restaurantIndex === -1) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const removedRestaurant = restaurants[restaurantIndex];
    const nextRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    setRestaurants(nextRestaurants);

    return res.status(200).json({ success: true, restaurant: removedRestaurant });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
