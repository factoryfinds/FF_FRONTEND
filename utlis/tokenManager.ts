// utils/tokenManager.ts
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  _id: string;
  phone: string;
  role: string;
}

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

class TokenManager {
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing: boolean = false;

  // Get tokens from localStorage
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  }

  // Set tokens in localStorage
  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Clear all auth data
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Check if token is expired (with 1 minute buffer)
  isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    
    try {
      const payload: TokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Add 1 minute buffer to refresh before actual expiration
      return currentTime >= (expirationTime - 60000);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const { refreshToken } = this.getTokens();
    
    if (!refreshToken) {
      this.handleAuthFailure();
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: TokenData = await response.json();
      
      // Update tokens
      this.setTokens(data.accessToken, data.refreshToken);
      
      // Dispatch custom event to notify components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tokenRefreshed'));
      }

      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.handleAuthFailure();
      throw error;
    }
  }

  // Handle authentication failure
  handleAuthFailure(): void {
    this.clearTokens();
    
    if (typeof window !== 'undefined') {
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('authFailure'));
      
      // Show toast notification
      toast.error('Session expired. Please login again.');
      
      // Redirect to home page or login page
      // window.location.href = '/';
    }
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(): Promise<string> {
    const { accessToken } = this.getTokens();
    
    if (!accessToken || this.isTokenExpired(accessToken)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        throw new Error('Unable to get valid access token');
      }
    }
    
    return accessToken;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const { accessToken, refreshToken } = this.getTokens();
    return !!(accessToken && refreshToken);
  }

  // Get user data from localStorage
  getUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const tokenManager = new TokenManager();

// Enhanced API utility with automatic token refresh
export const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Get valid access token
    const accessToken = await tokenManager.getValidAccessToken();
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    
    if (accessToken) {
      (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    }

    // Make API call
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 responses (token might be invalid)
    if (response.status === 401) {
      try {
        // Try to refresh token and retry
        const newAccessToken = await tokenManager.refreshAccessToken();
        (headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
        
        // Retry the request with new token
        return await fetch(url, {
          ...options,
          headers,
        });
      } catch (refreshError) {
        // If refresh fails, handle auth failure
        tokenManager.handleAuthFailure();
        throw new Error('Authentication failed');
      }
    }

    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default tokenManager;