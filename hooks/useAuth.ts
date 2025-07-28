// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { tokenManager } from '../utlis/tokenManager';

interface UserData {
  _id: string;
  phone: string;
  role: string;
}

interface UseAuthReturn {
  isLoggedIn: boolean;
  user: UserData | null;
  role: string | null;
  isLoading: boolean;
  logout: () => void;
  handleLoginSuccess: (userData: UserData) => void;
  updateAuthState: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update auth state
  const updateAuthState = useCallback(() => {
    const isAuthenticated = tokenManager.isAuthenticated();
    const userData = tokenManager.getUser();
    
    setIsLoggedIn(isAuthenticated);
    setUser(userData);
    setRole(userData?.role || null);
    setIsLoading(false);
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    tokenManager.clearTokens();
    updateAuthState();
    
    // Reload page to reset app state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, [updateAuthState]);

  // Handle login success
  const handleLoginSuccess = useCallback((userData: UserData) => {
    // Tokens are already set by the login process
    updateAuthState();
  }, [updateAuthState]);

  // Check token validity periodically
  useEffect(() => {
    // Initial auth state check
    updateAuthState();

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          // This will automatically refresh token if needed
          await tokenManager.getValidAccessToken();
          updateAuthState();
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Listen for token refresh events
    const handleTokenRefresh = () => {
      updateAuthState();
    };

    // Listen for auth failure events
    const handleAuthFailure = () => {
      updateAuthState();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenRefreshed', handleTokenRefresh);
      window.addEventListener('authFailure', handleAuthFailure);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('tokenRefreshed', handleTokenRefresh);
        window.removeEventListener('authFailure', handleAuthFailure);
      }
    };
  }, [updateAuthState, logout]);

  return {
    isLoggedIn,
    user,
    role,
    isLoading,
    logout,
    handleLoginSuccess,
    updateAuthState,
  };
};