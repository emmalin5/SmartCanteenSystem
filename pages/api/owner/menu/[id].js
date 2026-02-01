/**
 * Fake API Endpoint: /api/owner/menu/:id
 * Supports GET, PUT, DELETE
 */

import { getMenuItems, setMenuItems } from './store';

export default function handler(req, res) {
  const { id } = req.query;
  const menuItems = getMenuItems();
  const menuIndex = menuItems.findIndex((item) => item.id === id);

  if (req.method === 'GET') {
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    return res.status(200).json(menuItems[menuIndex]);
  }

  if (req.method === 'PUT') {
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const updatedItem = {
      ...menuItems[menuIndex],
      ...req.body,
      price: Number(req.body?.price ?? menuItems[menuIndex].price),
      stock: Number(req.body?.stock ?? menuItems[menuIndex].stock),
      available: typeof req.body?.available === 'boolean' ? req.body.available : menuItems[menuIndex].available
    };

    const nextItems = [...menuItems];
    nextItems[menuIndex] = updatedItem;
    setMenuItems(nextItems);

    return res.status(200).json(updatedItem);
  }

  if (req.method === 'DELETE') {
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const removedItem = menuItems[menuIndex];
    const nextItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(nextItems);

    return res.status(200).json({ success: true, menuItem: removedItem });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
