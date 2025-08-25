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
  };
  couponCode?: string;
  userId: string;   // 👈 add this
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
export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Payment Method Configuration
export interface PaymentMethodConfig {
  card?: boolean;
  netbanking?: boolean;
  wallet?: boolean;
  upi?: boolean;
  paylater?: boolean;
  cardless_emi?: boolean;
  emi?: boolean;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  method?: PaymentMethodConfig;
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface ProductInfo {
  description: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

// types/order.ts (acha rahega alag file me types rakhe)
export interface OrderItem {
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
  size: string;
  quantity: number;
  priceAtPurchase: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface GetOrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}
