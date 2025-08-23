import { toast } from 'react-hot-toast';

// Base configuration
const BASE_URL = 'https://ff-backend-00ri.onrender.com/api';

// Types
export interface User {
  _id: string;
  phone: string;
  role: string;
  email?: string;
  name?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  analytics: {
    totalOrders: number;
    totalSpent: number;
    lastOrderAt?: Date;
  };
  signupSource?: 'mobile' | 'web' | 'instagram' | 'referral';
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
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  originalPrice: number;
  discountedPrice: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inventory: number;
  inStock: boolean;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Analytics fields
  clickCount?: number;
  addedToCartCount?: number;
  purchaseCount?: number;
  lastPurchasedAt?: Date;
}

export interface CartItem {
  _id: string;
  quantity: number;
  size: string;
  product: Product
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Admin-specific interfaces
export interface AdminDashboard {
  message: string;
  adminId: string;
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
}
export interface ProductStatsResponse {
  message: string;
  data: {
    // Basic counts
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    newProductsThisMonth: number;
    
    // Analytics totals
    analytics: {
      totalClicks: number;
      totalCartAdds: number;
      totalPurchases: number;
      totalInventory: number;
    };

    // Conversion rates
    conversionRates: {
      clickToCart: string;
      cartToPurchase: string;
      clickToPurchase: string;
    };

    // Top performers
    topPerformers: {
      mostClicked: Array<{
        _id: string;
        title: string;
        clickCount: number;
        images: string[];
        category: string;
      }>;
      mostAddedToCart: Array<{
        _id: string;
        title: string;
        addedToCartCount: number;
        images: string[];
        category: string;
        originalPrice: number;
        discountedPrice: number;
      }>;
      mostPurchased: Array<{
        _id: string;
        title: string;
        purchaseCount: number;
        images: string[];
        category: string;
        originalPrice: number;
        discountedPrice: number;
      }>;
    };

    // Category and gender breakdown
    categoryStats: Array<{
      _id: string;
      count: number;
      totalClicks: number;
      totalCartAdds: number;
      totalPurchases: number;
      avgPrice: number;
    }>;
    
    genderStats: Array<{
      _id: string;
      count: number;
      totalClicks: number;
      totalCartAdds: number;
      totalPurchases: number;
    }>;

    // Pricing information
    pricing: {
      avgOriginalPrice: number;
      avgDiscountedPrice: number;
      maxPrice: number;
      minPrice: number;
      avgDiscountPercent: string;
    };

    // Product management insights
    insights: {
      lowStockProducts: Array<{
        _id: string;
        title: string;
        inventory: number;
        category: string;
        images: string[];
      }>;
      inactiveProducts: Array<{
        _id: string;
        title: string;
        createdAt: string;
        category: string;
        images: string[];
      }>;
      recentActivity: Array<{
        _id: string;
        title: string;
        clickCount: number;
        addedToCartCount: number;
        purchaseCount: number;
        lastPurchasedAt?: string;
        updatedAt: string;
      }>;
    };

    // Growth trend
    productGrowth: Array<{
      month: string;
      count: number;
    }>;

    // Summary metrics
    summary: {
      totalProducts: number;
      stockRate: string;
      clickToCartRate: string;
      cartToPurchaseRate: string;
      overallConversionRate: string;
    };
  };
}


export interface UserAnalytics {
  message: string;
  data: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    verifiedUsers: number;
    usersWithOrders: number;
    userGrowth: Array<{
      month: string;
      count: number;
    }>;
    signupSources: Array<{
      _id: string;
      count: number;
    }>;
    summary: {
      totalUsers: number;
      newUsersThisMonth: number;
      activeUsers: number;
      verificationRate: string;
      conversionRate: string;
    };
  };
}

export interface UserListResponse {
  message: string;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface UserDetailsResponse {
  message: string;
  data: User & {
    cart: CartItem[];
    wishlist: Product[];
    addresses: Address[];
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

      if (response.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        throw new APIError('Forbidden', 403, 'FORBIDDEN');
      }

      // Handle validation errors from express-validator
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessage = data.errors.map((err: any) => err.msg).join(', '); // eslint-disable-line @typescript-eslint/no-explicit-any
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
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
};

// 🔄 Token refresh utility
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

// 🛡️ Admin APIs - Updated and Complete
export const getAdminDashboard = async (): Promise<{ message: string; adminId: string }> => {
  return apiRequest('/admin/dashboard');
};

export const getAdminStats = async (): Promise<AdminDashboard> => {
  return apiRequest('/admin/stats');
};

export const getUserAnalytics = async (): Promise<UserAnalytics> => {
  return apiRequest('/admin/users/analytics');
};

export const getUserList = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: 'all' | 'verified' | 'unverified' | 'active' | 'new';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const queryString = queryParams.toString();
  const endpoint = `/admin/users/list${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest(endpoint);
};

export const getUserDetails = async (userId: string): Promise<UserDetailsResponse> => {
  return apiRequest(`/admin/users/${userId}`);
};



// Get comprehensive product statistics
export const getProductStats = async (): Promise<ProductStatsResponse> => {
  return apiRequest('/admin/getProductStats');
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

// Add these functions to your existing api.ts file

// 🔄 Product Management APIs for Admin
export const updateProduct = async (
  productId: string,
  productData: Partial<{
    title: string;
    description: string;
    category: string;
    gender: 'men' | 'women' | 'unisex';
    originalPrice: number;
    discountedPrice: number;
    images: string[];
    sizes: string[];
    colors: { name: string; hex: string }[];
    inventory: number;
    inStock: boolean;
  }>
): Promise<{ message: string; product: Product }> => {
  return apiRequest(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const getProductForEdit = async (productId: string): Promise<Product> => {
  return apiRequest(`/products/edit/${productId}`);
};

export const deleteProduct = async (productId: string): Promise<{ message: string }> => {
  return apiRequest(`/products/${productId}`, {
    method: 'DELETE',
  });
};

interface BackendCartResponse {
  cart: CartItem[];
}

export const getProductsFromUserCart = async (): Promise<Cart> => {
  const token = getToken();

  if (!token) {
    toast.error('Please log in to view your cart');
    throw new APIError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  const response = await apiRequest<BackendCartResponse>('/user/cart');

  return {
    items: response.cart || [],
    totalAmount: 0
  };
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

// Updated API function in your api.ts file
export const removeFromCart = async (productId: string): Promise<{ message: string; cart: CartItem[] }> => {
  return apiRequest(`/user/cart/${productId}`, {
    method: 'DELETE',
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

export const getUserOrders = async (): Promise<any[]> => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

// 🛡️ Admin utility functions
export const checkAdminAccess = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
};

export const getCurrentUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};