/**
 * Fake API Endpoint: GET /api/owner/dashboard
 * Returns restaurant owner dashboard data
 */

import { getMenuItems } from './menu/store';
import { getRestaurants } from '../admin/restaurants/store';

const mockOwnerDashboard = {
  ownerId: 'OWN001',
  ownerName: 'Rahul Sharma',
  restaurantId: 'REST001',
  restaurantName: 'Main Canteen',
  summary: {
    totalOrders: 124,
    totalRevenue: 6840.5,
    avgOrderValue: 55.17,
    activeMenuItems: 18,
    lowStockItems: 3
  },
  menuItems: [
    { id: 'MENU001', name: 'Veg Thali', category: 'Lunch', price: 65, available: true, stock: 24 },
    { id: 'MENU002', name: 'Paneer Wrap', category: 'Snacks', price: 45, available: true, stock: 14 },
    { id: 'MENU003', name: 'Masala Dosa', category: 'Breakfast', price: 40, available: true, stock: 8 },
    { id: 'MENU004', name: 'Chicken Biryani', category: 'Lunch', price: 80, available: false, stock: 0 },
    { id: 'MENU005', name: 'Fruit Salad', category: 'Snacks', price: 35, available: true, stock: 6 },
    { id: 'MENU006', name: 'Idli Sambar', category: 'Breakfast', price: 30, available: true, stock: 20 }
  ],
  recentOrders: [
    { id: 'ORD001', orderNumber: '#1024', customerName: 'STU001', itemsCount: 2, total: 95, status: 'completed', time: '10:05 AM' },
    { id: 'ORD002', orderNumber: '#1025', customerName: 'STU004', itemsCount: 1, total: 65, status: 'preparing', time: '10:12 AM' },
    { id: 'ORD003', orderNumber: '#1026', customerName: 'STU002', itemsCount: 3, total: 120, status: 'completed', time: '10:20 AM' },
    { id: 'ORD004', orderNumber: '#1027', customerName: 'STU008', itemsCount: 1, total: 45, status: 'completed', time: '10:30 AM' }
  ],
  lowStockItems: [
    { id: 'MENU003', name: 'Masala Dosa', category: 'Breakfast', stock: 8 },
    { id: 'MENU005', name: 'Fruit Salad', category: 'Snacks', stock: 6 },
    { id: 'MENU002', name: 'Paneer Wrap', category: 'Snacks', stock: 14 }
  ]
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulate API delay
  setTimeout(() => {
    const restaurants = getRestaurants();
    const restaurant =
      restaurants.find((rest) => rest.ownerName === mockOwnerDashboard.ownerName) ||
      restaurants.find((rest) => rest.id === 'REST001') ||
      restaurants[0];

    const menuItems = getMenuItems();
    const activeMenuItems = menuItems.filter((item) => item.available).length;
    const lowStockItems = menuItems.filter((item) => item.stock <= 10);

    res.status(200).json({
      ...mockOwnerDashboard,
      restaurantId: restaurant?.id || 'REST001',
      restaurantName: restaurant?.name || 'Main Canteen',
      summary: {
        totalOrders: 124,
        totalRevenue: 6840.5,
        avgOrderValue: 55.17,
        activeMenuItems,
        lowStockItems: lowStockItems.length
      },
      menuItems,
      lowStockItems
    });
  }, 500);
}
