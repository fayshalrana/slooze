# Commodities Management System

A comprehensive role-based commodities management system built with React, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & Access

- **Login System**: Secure email/password authentication
- **Role-Based Access Control**: Different access levels for Managers and Store Keepers
- **Session Management**: Persistent sessions with localStorage

### 📊 Core Features

- **Dashboard** (Manager Only): Overview of inventory statistics and insights
- **Product Management**: View, add, and edit products
  - View all products with detailed information
  - Add new products (Managers & Store Keepers)
  - Edit existing products (Managers & Store Keepers)
  - Delete products

### 🎨 UI Enhancements

- **Light/Dark Mode**: Toggle between themes with persistent preference
- **Role-Based UI Restrictions**: Dynamic menu and feature visibility based on user roles
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS

## Role-Based Access

| Feature           | Manager | Store Keeper |
| ----------------- | ------- | ------------ |
| Login             | ✅      | ✅           |
| Dashboard         | ✅      | ❌           |
| View Products     | ✅      | ✅           |
| Add/Edit Products | ✅      | ✅           |
| Role-Based UI     | ✅      | ✅           |

## Demo Credentials

### Manager Account

- **Email**: `manager@example.com`
- **Password**: `manager123`

### Store Keeper Account

- **Email**: `storekeeper@example.com`
- **Password**: `keeper123`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx  # Route protection component
├── contexts/            # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Theme state management
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Dashboard (Manager only)
│   └── Products.tsx    # Product management page
├── services/           # API services
│   └── api.ts          # API calls and mock data
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client (configured for future API integration)

## Features Implementation

### Authentication Flow

1. User enters credentials on login page
2. System validates credentials (mock authentication)
3. Session token and user data stored in localStorage
4. Protected routes check authentication status
5. Role-based access enforced at route and UI levels

### Dashboard

- Fetches and displays inventory statistics
- Shows total products, total value, low stock items, and categories
- Provides insights and warnings for low stock items
- Only accessible to Managers

### Product Management

- **Product List View**: Displays up to 50 products with pagination
- **Multiple View Modes**: Toggle between table view and card view layouts
- **Product Images**: Display product images in both table and card views with fallback support
- **Product Details Modal**: Click on any product name to view comprehensive product details including:
  - Product image, name, category, quantity, unit, and price
  - Views and revenue statistics
  - Created and updated dates
  - Full product description
- **Advanced Filtering**: Filter products by category, price range, and date range with a user-friendly modal interface
- **Sorting**: Sort products by any column (name, views, price, revenue)
- **Bulk Selection**: Select multiple products using checkboxes
- **Delete Confirmation**: Custom modal for product deletion confirmation (replaces browser confirm dialog)
- **Export to PDF**: Download product reports as PDF files
- **Analytics Panel**: Real-time analytics charts showing:
  - Total Views with trend indicators
  - Total Sales with trend indicators
  - Total Earnings with trend indicators
- **Tab Navigation**: Switch between Published and Draft product tabs
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- Add/Edit form with validation
- Real-time updates after operations
- Role-based edit permissions

### Theme System

- Light and dark mode support
- Preference saved in localStorage
- Smooth transitions between themes
- Uses Tailwind's dark mode classes

### 📱 Additional Features

- **Notifications System**: View and manage all notifications with read/unread status
- **Account Settings**: Profile management with image upload and security settings
- **Search Functionality**: Dynamic search bar with suggestions for pages and products
- **Layout Toggle**: Switch between different layout modes (default, grid, card, minimal) across pages
- **Help & Support**: Direct email support link for assistance

## Future Enhancements

- Connect to real backend API
- Add product search functionality
- Add product categories management
- Add user management (Admin role)
- Implement real-time updates
- Add more export formats (CSV, Excel)

## License

MIT
