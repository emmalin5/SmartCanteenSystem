/**
 * Fake API Endpoint: /api/owner/menu
 * Supports GET (list) and POST (create)
 */

import { getMenuItems, setMenuItems, generateMenuId } from './store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const menuItems = getMenuItems();
    return res.status(200).json({ menuItems, total: menuItems.length });
  }

  if (req.method === 'POST') {
    const { id, name, category, price, stock, available = true } = req.body || {};

    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    const newItem = {
      id: id || generateMenuId(),
      name,
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      available: Boolean(available)
    };

    const menuItems = getMenuItems();
    setMenuItems([newItem, ...menuItems]);

    return res.status(201).json(newItem);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
