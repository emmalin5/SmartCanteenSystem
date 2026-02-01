# Smart Canteen System - Frontend

RFID-based IoT cashless university canteen payment system frontend built with Next.js.

## Features

### Student Dashboard
- View meals consumed today
- Monthly usage statistics and breakdown
- Next meal time window information
- Notifications list with mark as read functionality
- Report lost card functionality

### Admin Dashboard
- User management (view all students)
- Block/Unblock cards
- Transaction history table
- Student CRUD (create, update, delete)
- Student balance top-up
- Restaurant CRUD (create, update, delete)
- Search in students, restaurants, and transactions

### Restaurant Owner Dashboard
- Menu item CRUD (create, update, delete)
- Low stock alerts
- Students assigned this month (count + list)

## Tech Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls

## Project Structure

```
Smart Canteen System/
├── components/          # Reusable React components
│   ├── Loading.js
│   ├── Error.js
│   ├── Notification.js
│   ├── NotificationList.js
│   └── MealTimeWindow.js
├── lib/                 # Utility functions
│   └── api.js          # API client configuration
├── pages/              # Next.js pages
│   ├── api/            # Fake REST API endpoints
│   │   ├── student/
│   │   │   └── [id]/
│   │   │       ├── dashboard.js
│   │   │       ├── transactions.js
│   │   │       └── report-lost-card.js
│   │   └── admin/
│   │       ├── users.js
│   │       ├── block-card.js
│   │       ├── unblock-card.js
│   │       └── transactions.js
│   ├── student/
│   │   └── [id].js     # Student dashboard
│   ├── admin/
│   │   └── index.js    # Admin dashboard
│   ├── _app.js         # App wrapper
│   └── index.js        # Home page
├── styles/
│   └── globals.css     # Global styles with Tailwind
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using JSON Server (Mock API)

This project can use JSON Server for mock data instead of the built-in Next.js API routes.

1. Install dependencies (if you haven't already):
```bash
npm install
```

2. Start the mock API server:
```bash
npm run mock:api
```

3. Tell the frontend to use JSON Server by setting an environment variable:
```
NEXT_PUBLIC_API_PROVIDER=json-server
```

4. Start the Next.js dev server:
```bash
npm run dev
```

JSON Server will run at http://localhost:3001 and the frontend will use it automatically.

## API Endpoints

### Student Endpoints

- `GET /api/student/:id/dashboard` - Get student dashboard data
- `GET /api/student/:id/transactions` - Get student transaction history
- `POST /api/student/:id/report-lost-card` - Report a lost card

### Admin Endpoints

- `GET /api/admin/users` - Get all users
- `POST /api/admin/block-card` - Block a card
- `POST /api/admin/unblock-card` - Unblock a card
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create a student
- `PUT /api/admin/students/:id` - Update a student
- `DELETE /api/admin/students/:id` - Delete a student
- `POST /api/admin/students/:id/top-up` - Add balance to student
- `GET /api/admin/restaurants` - Get all restaurants
- `POST /api/admin/restaurants` - Create a restaurant
- `PUT /api/admin/restaurants/:id` - Update a restaurant
- `DELETE /api/admin/restaurants/:id` - Delete a restaurant

### Restaurant Owner Endpoints

- `GET /api/owner/dashboard` - Get restaurant owner dashboard data
- `GET /api/owner/menu` - Get menu items
- `POST /api/owner/menu` - Create menu item
- `PUT /api/owner/menu/:id` - Update menu item
- `DELETE /api/owner/menu/:id` - Delete menu item
- `GET /api/owner/students` - Get students list for owner dashboard

**Note:** All API endpoints are fake/mock endpoints that return simulated data. They are not connected to a real backend.

When JSON Server is enabled, the mock data is served from [mock/db.json](mock/db.json) using the routes in [mock/routes.json](mock/routes.json).

## Usage

### Accessing Student Dashboard

Navigate to `/student/STU001` (or any student ID) to view the student dashboard.

Example: `http://localhost:3000/student/STU001`

### Accessing Admin Dashboard

Navigate to `/admin` to view the admin dashboard.

Example: `http://localhost:3000/admin`

### Accessing Restaurant Owner Dashboard

Navigate to `/owner` to view the restaurant owner dashboard.

Example: `http://localhost:3000/owner`

## Features Overview

### Student Dashboard Features

1. **Meals Today**: Displays all meals consumed today with time, location, and amount
2. **Monthly Usage**: Shows total spent, total meals, average per meal, and daily average
3. **Usage Breakdown**: Visual representation of daily spending
4. **Next Meal Window**: Shows upcoming meal time with status (active/upcoming)
5. **Notifications**: List of notifications with type-based styling (info, success, warning, error)
6. **Report Lost Card**: Modal form to report lost/stolen/damaged cards

### Admin Dashboard Features

1. **User Management**: Table showing all students with their card status, balance, and transaction history
2. **Card Management**: Block/Unblock cards with one click
3. **Transaction History**: Complete transaction log with filtering capabilities
4. **Analytics**: 
   - Summary cards (total users, transactions, revenue, average transaction)
   - Transactions by meal type (visual breakdown)
   - Transactions by location

## Components

### Reusable Components

- **Loading**: Loading spinner with optional message
- **Error**: Error display with retry functionality
- **Notification**: Individual notification card with type-based styling
- **NotificationList**: List of notifications with mark as read functionality
- **MealTimeWindow**: Displays next meal window information

## Styling

The project uses Tailwind CSS with custom color scheme:
- Primary colors: Blue shades (primary-50 to primary-900)
- Custom utility classes: `.card`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

- All data is simulated using mock APIs
- No real database or Firebase connection
- API responses include simulated delays (500-800ms) to mimic real network latency
- Student IDs can be changed in the URL (e.g., `/student/STU002`)

## Future Enhancements

- Connect to Firebase backend
- Add authentication and authorization
- Real-time notifications
- Advanced analytics with charts (Chart.js, Recharts)
- Export transaction data
- Card recharge functionality
- Email/SMS notifications

## License

This is an academic project for demonstration purposes.



