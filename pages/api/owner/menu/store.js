/**
 * In-memory menu store for restaurant owner
 */

const initialMenuItems = [
  { id: 'MENU001', name: 'Veg Thali', category: 'Lunch', price: 65, available: true, stock: 24 },
  { id: 'MENU002', name: 'Paneer Wrap', category: 'Snacks', price: 45, available: true, stock: 14 },
  { id: 'MENU003', name: 'Masala Dosa', category: 'Breakfast', price: 40, available: true, stock: 8 },
  { id: 'MENU004', name: 'Chicken Biryani', category: 'Lunch', price: 80, available: false, stock: 0 },
  { id: 'MENU005', name: 'Fruit Salad', category: 'Snacks', price: 35, available: true, stock: 6 },
  { id: 'MENU006', name: 'Idli Sambar', category: 'Breakfast', price: 30, available: true, stock: 20 }
];

let menuItems = [...initialMenuItems];

export const getMenuItems = () => menuItems;
export const setMenuItems = (nextMenuItems) => {
  menuItems = nextMenuItems;
};

export const generateMenuId = () => {
  const nextNumber = menuItems.length + 1;
  return `MENU${String(nextNumber).padStart(3, '0')}`;
};
