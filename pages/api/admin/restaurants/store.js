/**
 * In-memory restaurant store for mock admin endpoints
 */

const initialRestaurants = [
  {
    id: 'REST001',
    name: 'Main Canteen',
    location: 'Campus Center',
    ownerName: 'Rahul Sharma',
    status: 'active',
    openingHours: '08:00-20:00'
  },
  {
    id: 'REST002',
    name: 'North Canteen',
    location: 'North Wing',
    ownerName: 'Priya Desai',
    status: 'active',
    openingHours: '07:30-19:30'
  },
  {
    id: 'REST003',
    name: 'Cafeteria',
    location: 'Library Block',
    ownerName: 'Arjun Patel',
    status: 'inactive',
    openingHours: '09:00-17:00'
  }
];

let restaurants = [...initialRestaurants];

export const getRestaurants = () => restaurants;
export const setRestaurants = (nextRestaurants) => {
  restaurants = nextRestaurants;
};

export const generateRestaurantId = () => {
  const nextNumber = restaurants.length + 1;
  return `REST${String(nextNumber).padStart(3, '0')}`;
};
