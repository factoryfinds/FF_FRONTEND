import { toast } from 'react-hot-toast';

// Base configuration
const BASE_URL = 'http://192.168.29.110:5000/api';

// Types
export interface User {
  _id: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  _id: string;
  phone: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface AdminDashboard {
  message: string;
  adminId: string;
  stats?: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
  };
}

// Token management
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Generic API error handler
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle cases where response is not JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }
      data = {};
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        clearTokens();
        toast.error('Session expired. Please login again.');
        throw new APIError('Unauthorized', 401, 'UNAUTHORIZED');
      }
      
      // Handle validation errors from express-validator
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessage = data.errors.map((err: any) => err.msg).join(', ');
        throw new APIError(errorMessage, response.status, 'VALIDATION_ERROR');
      }
      
      throw new APIError(
        data.message || data.error || 'An error occurred',
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    console.error('API Request failed:', error);
    throw new APIError('Network error. Please check your connection.');
  }
};

// 🔐 Authentication APIs
export const sendOTP = async (phone: string): Promise<{ message: string }> => {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
};

export const verifyOTP = async (phone: string, otp: string): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });

  // Store tokens after successful verification
  if (data.accessToken && data.refreshToken) {
    setTokens(data.accessToken, data.refreshToken);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  try {
    // If you have a logout endpoint, uncomment this
    // await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
};

// 🔄 Token refresh utility - Updated to match backend endpoint
export const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  
  if (!refreshToken) {
    throw new APIError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
  }

  const data = await apiRequest<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  
  return data;
};

// 📍 Address APIs
export const getAddresses = async (): Promise<Address[]> => {
  return apiRequest('/address');
};

export const addAddress = async (address: Omit<Address, '_id'>): Promise<Address> => {
  return apiRequest('/address', {
    method: 'POST',
    body: JSON.stringify(address),
  });
};

export const updateAddress = async (
  addressId: string,
  updatedData: Partial<Address>
): Promise<Address> => {
  return apiRequest(`/address/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
};

export const deleteAddress = async (addressId: string): Promise<{ message: string }> => {
  return apiRequest(`/address/${addressId}`, {
    method: 'DELETE',
  });
};

// 🛡️ Admin APIs
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  return apiRequest('/admin/dashboard');
};

// 📦 Product APIs
export const getAllProducts = async (): Promise<Product[]> => {
  return apiRequest('/products');
};

export const getProductById = async (productId: string): Promise<Product> => {
  return apiRequest(`/products/${productId}`);
};

// 🛒 Cart APIs
export const addProductToCart = async ({
  productId,
  quantity = 1,
  size,
}: {
  productId: string;
  quantity?: number;
  size: string;
}): Promise<{ message: string; cart: CartItem[] }> => {
  const token = getToken();
  
  if (!token) {
    toast.error('Please log in to add items to cart');
    throw new APIError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  return apiRequest('/products/addToCart', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity, size }),
  });
};

export const getProductsFromUserCart = async (): Promise<Cart> => {
  const token = getToken();

  if (!token) {
    toast.error('Please log in to view your cart');
    throw new APIError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  return apiRequest('/user/cart');
};

export const updateCartItem = async ({
  productId,
  quantity,
  size,
}: {
  productId: string;
  quantity: number;
  size: string;
}): Promise<{ message: string; cart: CartItem[] }> => {
  return apiRequest('/user/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity, size }),
  });
};

export const removeFromCart = async ({
  productId,
  size,
}: {
  productId: string;
  size: string;
}): Promise<{ message: string; cart: CartItem[] }> => {
  return apiRequest('/user/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify({ productId, size }),
  });
};

export const clearCart = async (): Promise<{ message: string }> => {
  return apiRequest('/user/cart/clear', {
    method: 'DELETE',
  });
};

// 📋 Order APIs
export const createOrder = async (orderData: {
  addressId: string;
  paymentMethod: string;
}): Promise<{ message: string; orderId: string }> => {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getUserOrders = async (): Promise<any[]> => {
  return apiRequest('/user/orders');
};

// 👤 User profile APIs
export const getUserProfile = async (): Promise<User> => {
  return apiRequest('/user/profile');
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};