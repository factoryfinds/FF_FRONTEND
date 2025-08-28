import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const BASE_URL = 'https://ff-backend-00ri.onrender.com';

// Backend API Response Types
interface CreateOrderResponse {
  success: boolean;
  razorpay_order: {
    id: string;
    amount: number;
    currency: string;
  };
  key_id: string;
  cart_summary: {
    items_count: number;
    subtotal: number;
    shippingCharges: number;
    totalAmount: number;
    discountAmount: number;
  };
}

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    itemsCount: number;
  };
}

// Request Types
interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  couponCode?: string;
}

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  couponCode?: string;
}

interface PaymentDetailsResponse {
  success: boolean;
  payment: any; // Razorpay payment object
}

interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

const useRazorpay = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage or your auth context
  const getAuthToken = () => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Invalid user in localStorage", e);
      }
    }

    return {
      user,
      token,
    };
  };

  const createOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = getAuthToken();

      if (!user || !token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post<CreateOrderResponse>(
        `${BASE_URL}/api/payment/create-order`,
        {
          ...orderData,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to create order';

      // Handle stock errors specifically
      if (axiosError.response?.data?.errors) {
        setError(`${errorMessage}: ${axiosError.response.data.errors.join(', ')}`);
      } else {
        setError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = getAuthToken();

      if (!user || !token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post<PaymentVerificationResponse>(
        `${BASE_URL}/api/payment/verify-payment`,
        {
          ...paymentData,
          userId: user._id,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || 'Payment verification failed';

      // Handle stock errors specifically
      if (axiosError.response?.data?.errors) {
        setError(`${errorMessage}: ${axiosError.response.data.errors.join(', ')}`);
      } else {
        setError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDetails = async (paymentId: string): Promise<PaymentDetailsResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { token } = getAuthToken();

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get<PaymentDetailsResponse>(
        `${BASE_URL}/api/payment/payment-details/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to fetch payment details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error manually
  const clearError = () => {
    setError(null);
  };

  return {
    createOrder,
    verifyPayment,
    getPaymentDetails,
    loading,
    error,
    clearError
  };
};

export default useRazorpay;