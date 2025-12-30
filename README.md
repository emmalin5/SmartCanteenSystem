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
- Analytics dashboard with:
  - Total users, transactions, revenue
  - Transactions by meal type
  - Transactions by location

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

**Note:** All API endpoints are fake/mock endpoints that return simulated data. They are not connected to a real backend.

## Usage

### Accessing Student Dashboard

Navigate to `/student/STU001` (or any student ID) to view the student dashboard.

Example: `http://localhost:3000/student/STU001`

### Accessing Admin Dashboard

Navigate to `/admin` to view the admin dashboard.

Example: `http://localhost:3000/admin`

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

