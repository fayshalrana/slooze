import type { Product, UserRole } from "../types";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

// Mock Users
export const mockUsers = [
  { id: '1', email: 'manager@example.com', password: 'manager123', role: 'Manager' as UserRole, name: 'Fayshal Rana' },
  { id: '2', email: 'storekeeper@example.com', password: 'keeper123', role: 'Store Keeper' as UserRole, name: 'Raif Rahman' },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wheat',
    category: 'Grains',
    quantity: 5000,
    unit: 'kg',
    price: 25.50,
    description: 'Premium quality wheat',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Rice',
    category: 'Grains',
    quantity: 3000,
    unit: 'kg',
    price: 30.00,
    description: 'Basmati rice',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Sugar',
    category: 'Sweeteners',
    quantity: 200,
    unit: 'kg',
    price: 45.00,
    description: 'White refined sugar',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    name: 'Coffee Beans',
    category: 'Beverages',
    quantity: 50,
    unit: 'kg',
    price: 120.00,
    description: 'Arabica coffee beans',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
];

// Product Generation Data
export const productNames = [
  "Wheat",
  "Rice",
  "Sugar",
  "Coffee Beans",
  "Tea",
  "Flour",
  "Salt",
  "Pepper",
  "Olive Oil",
  "Vegetable Oil",
  "Butter",
  "Milk",
  "Eggs",
  "Cheese",
  "Yogurt",
  "Bread",
  "Pasta",
  "Noodles",
  "Cereal",
  "Oats",
  "Corn",
  "Barley",
  "Quinoa",
  "Lentils",
  "Beans",
  "Chickpeas",
  "Peas",
  "Potatoes",
  "Onions",
  "Garlic",
  "Tomatoes",
  "Carrots",
  "Broccoli",
  "Spinach",
  "Lettuce",
  "Cucumber",
  "Peppers",
  "Mushrooms",
  "Apples",
  "Bananas",
  "Oranges",
  "Grapes",
  "Strawberries",
  "Blueberries",
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Shrimp",
  "Tofu",
];

export const productCategories = [
  "Grains",
  "Sweeteners",
  "Beverages",
  "Dairy",
  "Produce",
  "Meat",
  "Seafood",
  "Pantry",
];

export const productUnits = ["kg", "g", "L", "ml", "pieces", "pack"];

// Dashboard Chart Data
export const overviewData = [
  { month: "Jan", value: 2000, target: 2500 },
  { month: "Feb", value: 3000, target: 3500 },
  { month: "Mar", value: 4500, target: 4000 },
  { month: "Apr", value: 3500, target: 4000 },
  { month: "May", value: 5000, target: 4500 },
  { month: "Jun", value: 4000, target: 4500 },
  { month: "Jul", value: 4500, target: 5000 },
  { month: "Aug", value: 5500, target: 5000 },
  { month: "Sep", value: 6000, target: 5500 },
  { month: "Oct", value: 5500, target: 6000 },
  { month: "Nov", value: 6500, target: 6000 },
  { month: "Dec", value: 7000, target: 6500 },
];

export const weeklyData = [
  { day: "Mo", value: 200, secondary: 50 },
  { day: "Tu", value: 300, secondary: 80 },
  { day: "We", value: 450, secondary: 100 },
  { day: "Th", value: 500, secondary: 120 },
  { day: "Fr", value: 350, secondary: 70 },
  { day: "Sa", value: 250, secondary: 60 },
  { day: "Su", value: 200, secondary: 50 },
];

export const smallBarData = [
  { name: "A", value: 300 },
  { name: "B", value: 250 },
  { name: "C", value: 400 },
  { name: "D", value: 350 },
  { name: "E", value: 450 },
  { name: "F", value: 380 },
  { name: "C", value: 400 },
  { name: "D", value: 350 },
  { name: "E", value: 450 },
  { name: "F", value: 380 },
];

export const earningLineData = [
  { month: "Jan", value: 2000, previous: 1800 },
  { month: "Feb", value: 3000, previous: 2800 },
  { month: "Mar", value: 4500, previous: 4200 },
  { month: "Apr", value: 3500, previous: 3400 },
  { month: "May", value: 5000, previous: 4800 },
  { month: "Jun", value: 4000, previous: 3900 },
  { month: "Jul", value: 4500, previous: 4400 },
  { month: "Aug", value: 5500, previous: 5300 },
  { month: "Sep", value: 6000, previous: 5800 },
  { month: "Oct", value: 5500, previous: 5400 },
  { month: "Nov", value: 6500, previous: 6300 },
  { month: "Dec", value: 7000, previous: 6800 },
];

export const salesLineData = [
  { date: "Nov 20th", value: 5000, previous: 4800 },
  { date: "Nov 25th", value: 5500, previous: 5300 },
  { date: "Nov 30th", value: 6000, previous: 5800 },
  { date: "Dec 5th", value: 5800, previous: 5600 },
  { date: "Dec 10th", value: 6500, previous: 6300 },
  { date: "Dec 15th", value: 7000, previous: 6800 },
  { date: "Dec 20th", value: 7500, previous: 7300 },
];

export const viewsLineData = [
  { date: "Nov 20th", value: 3000, previous: 2800 },
  { date: "Nov 25th", value: 3500, previous: 3300 },
  { date: "Nov 30th", value: 4000, previous: 3800 },
  { date: "Dec 5th", value: 3800, previous: 3600 },
  { date: "Dec 10th", value: 4500, previous: 4300 },
  { date: "Dec 15th", value: 5000, previous: 4800 },
  { date: "Dec 20th", value: 5500, previous: 5300 },
];

export const subscriptionsData = [
  { month: "Jan", value: 5000 },
  { month: "Feb", value: 6000 },
  { month: "Mar", value: 5500 },
  { month: "Apr", value: 7000 },
  { month: "May", value: 8000 },
  { month: "Jun", value: 7500 },
  { month: "Jul", value: 9000 },
  { month: "Aug", value: 8500 },
  { month: "Sep", value: 10000 },
  { month: "Oct", value: 9500 },
  { month: "Nov", value: 11000 },
  { month: "Dec", value: 11293 },
];

export const subscriptionsPerformersData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 150 },
  { month: "Mar", value: 120 },
  { month: "Apr", value: 180 },
  { month: "May", value: 200 },
  { month: "Jun", value: 250 },
];

export interface RecentSale {
  id: string;
  name: string;
  email: string;
  amount: number;
}

export const recentSales: RecentSale[] = [
  {
    id: "1",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
  {
    id: "2",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
  {
    id: "3",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
  {
    id: "4",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
  {
    id: "5",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
  {
    id: "6",
    name: "Indra Maulana",
    email: "Indramaulana@gmail.com",
    amount: 1500,
  },
];

export interface TopProduct {
  id: string;
  name: string;
  email: string;
  date: string;
  amount: number;
  image: string;
}

export const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "Product 1",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 900,
    image: "📱",
  },
  {
    id: "2",
    name: "Product 2",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 800,
    image: "💻",
  },
  {
    id: "3",
    name: "Product 3",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 700,
    image: "📷",
  },
  {
    id: "4",
    name: "Product 4",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 600,
    image: "⌚",
  },
  {
    id: "5",
    name: "Product 5",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 500,
    image: "🔊",
  },
  {
    id: "6",
    name: "Product 6",
    email: "Youremail@email.com",
    date: "02/10/2024",
    amount: 400,
    image: "📱",
  },
];

export interface PaymentHistory {
  id: string;
  email: string;
  amount: number;
  status: string;
}

export const paymentHistory: PaymentHistory[] = [
  { id: "1", email: "Youremail@email.com", amount: 500, status: "Success" },
  { id: "2", email: "Youremail@email.com", amount: 400, status: "Success" },
  { id: "3", email: "Youremail@email.com", amount: 300, status: "Success" },
  { id: "4", email: "Youremail@email.com", amount: 200, status: "Success" },
  { id: "5", email: "Youremail@email.com", amount: 100, status: "Success" },
];

// Products Page Chart Data
export const viewsChartData = [
  { date: "Nov 20th", views: 80000, previous: 75000 },
  { date: "Nov 25th", views: 85000, previous: 80000 },
  { date: "Nov 30th", views: 90000, previous: 85000 },
  { date: "Dec 5th", views: 95000, previous: 90000 },
  { date: "Dec 10th", views: 100000, previous: 95000 },
  { date: "Dec 15th", views: 105000, previous: 100000 },
  { date: "Dec 20th", views: 112893, previous: 105000 },
];

// Notifications
export const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New order received",
    message: "You have a new order from customer #1234",
    type: "info",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "Payment successful",
    message: "Payment of $1,234.56 has been processed successfully",
    type: "success",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    title: "Low stock alert",
    message: "Product 'Wheat' is running low on stock (50 units remaining)",
    type: "warning",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "4",
    title: "New customer registered",
    message: "A new customer has registered in your store",
    type: "info",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "5",
    title: "System update",
    message: "Your system has been updated to the latest version",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "6",
    title: "Order cancelled",
    message: "Order #5678 has been cancelled by the customer",
    type: "warning",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
];

