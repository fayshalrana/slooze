import axios from 'axios';
import type { LoginCredentials, LoginResponse, Product, DashboardStats } from '../types';
import { mockUsers, mockProducts } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    return {
      user: userWithoutPassword,
      token,
    };
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockProducts];
  },
  
  getById: async (id: string): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },
  
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newProduct: Product = {
      ...product,
      id: String(mockProducts.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct: Product = {
      ...mockProducts[index],
      ...product,
      id,
      updatedAt: new Date().toISOString(),
    };
    mockProducts[index] = updatedProduct;
    return updatedProduct;
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const products = await productService.getAll();
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockItems = products.filter(p => p.quantity < 500).length;
    const categories = new Set(products.map(p => p.category)).size;
    
    return {
      totalProducts: products.length,
      totalValue,
      lowStockItems,
      categories,
    };
  },
};

export default api;

