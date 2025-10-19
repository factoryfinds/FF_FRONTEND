"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getProductsFromUserCart,
  APIError,
} from "../../../utlis/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useRazorpay from "../../../hooks/useRazorpay";
import {
  RazorpayOptions,
  RazorpayResponse
} from "../../../types/razorpay";

/* ----- Types ----- */
type CartItem = {
  _id: string;
  quantity: number;
  size: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    originalPrice?: number;
    discountedPrice?: number;
  };
};

type Address = {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
};

interface AddressResponse {
  addresses?: Address[];
  data?: Address[];
  result?: Address[];
  address?: Address[];
  addressData?: Address[];
  [key: string]: unknown;
}

/* ----- Helpers ----- */
const extractAddresses = (response: AddressResponse | Address[]): Address[] => {
  if (Array.isArray(response)) return response;
  const paths: (keyof AddressResponse)[] = [
    "addresses",
    "data",
    "result",
    "address",
    "addressData",
  ];
  for (const p of paths) {
    const v = response[p];
    if (Array.isArray(v)) return v as Address[];
  }
  return [];
};

const isValidPhone = (s: string) => /^\d{10}$/.test(s);
const isValidPincode = (s: string) => /^\d{6}$/.test(s);

const validateAddressFields = (addr: Address): { ok: boolean; message: string } => {
  if (!isValidPhone(addr.phone)) {
    return { ok: false, message: "Phone must be 10 digits" };
  }
  if (!isValidPincode(addr.pincode)) {
    return { ok: false, message: "PIN code must be 6 digits" };
  }
  return { ok: true, message: "" };
};

/* ---------- Animations ---------- */
const stepMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

/* ----- Component ----- */
export default function CheckoutPage() {
  const router = useRouter();

  // Razorpay hook
  const { createOrder, verifyPayment, loading: paymentLoading, error: paymentError } = useRazorpay();

  // page state
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authError, setAuthError] = useState(false);

  // flow
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [orderId, setOrderId] = useState<string | null>(null);

  // to supress warning
  const a = orderId + "5454547sdknufeba554"
  console.log("a5d44sf454" + a);
  // payment processing
  const [processingPayment, setProcessingPayment] = useState(false);

  // address form
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Address>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const topRef = useRef<HTMLDivElement | null>(null);

  /* ----- Razorpay Script Loader ----- */
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ----- Data fetch ----- */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(false);

      const [addrResp, cartResp] = await Promise.all([getAddresses(), getProductsFromUserCart()]);
      const fetchedAddresses = extractAddresses(addrResp as AddressResponse | Address[]);
      setAddresses(fetchedAddresses);
      setCartItems(cartResp?.items ?? []);

      if (fetchedAddresses.length > 0) {
        const def = fetchedAddresses.find((a) => a.isDefault) || fetchedAddresses[0];
        setSelectedAddress(def);
      } else {
        setSelectedAddress(null);
      }
    } catch (err: unknown) {
      if (err instanceof APIError && (err.code === "UNAUTHORIZED" || err.status === 401)) {
        setAuthError(true);
      } else if (err instanceof Error && (err.message === "UNAUTHORIZED" || err.message.includes("401"))) {
        setAuthError(true);
      } else {
        console.error("Checkout fetch error:", err);
        toast.error("Failed to load checkout data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ----- Price math ----- */
  const getItemPrice = useCallback((item: CartItem) => {
    return item.product?.discountedPrice || item.product?.originalPrice || 1999;
  }, []);

  const bagTotal = useMemo(
    () =>
      cartItems.reduce((s, it) => {
        const price = getItemPrice(it);
        return s + price * (it.quantity || 1);
      }, 0),
    [cartItems, getItemPrice]
  );

  const grandTotal = bagTotal;
  console.log(grandTotal);

  /* ----- Payment Handler ----- */
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select delivery address first");
      return;
    }

    // For COD, directly place order
    if (paymentMethod === "cod") {
      setLoading(true);
      try {
        setTimeout(() => {
          setLoading(false);
          const id = `ORD-${Date.now().toString().slice(-6)}`;
          setOrderId(id);
          setStep(4);
          toast.success("Order placed successfully!");
        }, 1400);
      } catch (error) {
        setLoading(false);
        console.error('COD Order error:', error);
        toast.error("Failed to place order. Please try again.");
      }
      return;
    }

    // For online payment, initiate Razorpay
    try {
      setProcessingPayment(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order
      const orderData = await createOrder({
        amount: grandTotal,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        }
      });

      console.log('Key received from backend:', orderData.key_id);
      console.log('Key type check:', {
        isLiveKey: orderData.key_id?.startsWith('rzp_live_'),
        isTestKey: orderData.key_id?.startsWith('rzp_test_'),
        keyPrefix: orderData.key_id?.substring(0, 12)
      });

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.cart_summary.totalAmount,
        currency: "INR",
        name: 'Factory Finds',
        description: `Purchase of ${cartItems.length} item(s)`,
        image: '/logo.png',
        order_id: orderData.razorpay_order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            setProcessingPayment(true);
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: {
                street: selectedAddress.street,
                pincode: selectedAddress.pincode,
                city: selectedAddress.city,
                state: selectedAddress.state,
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
              },
            });

            if (verificationResult.success) {
              setOrderId(response.razorpay_payment_id);
              setStep(4);
              toast.success("Payment successful! Order placed.");
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: '',
          contact: selectedAddress.phone
        },
        notes: {
          address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
        },
        method: {
          upi: true,
          card: true,
          wallet: true,
          paylater: false,
          netbanking: true
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  /* ----- Address form handlers ----- */
  const openAddForm = () => {
    setEditingId(null);
    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setFormOpen(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const el = document.querySelector<HTMLInputElement>('input[name="fullName"]');
      el?.focus();
    }, 120);
  };

  const openEditForm = (addr: Address) => {
    setEditingId(addr._id || null);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || "India",
      isDefault: addr.isDefault,
    });
    setFormOpen(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const el = document.querySelector<HTMLInputElement>('input[name="fullName"]');
      el?.focus();
    }, 120);
  };

  type StringKeys<T> = Extract<keyof T, string>;

  const handleFormChange = <K extends StringKeys<Address>>(key: K, value: Address[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saveAddress = async () => {
    const v = validateAddressFields(form);
    if (!v.ok) {
      toast.error(v.message);
      return;
    }

    try {
      setFormLoading(true);
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success("Address updated");
      } else {
        const { ...payload } = form;
        await addAddress(payload);
        toast.success("Address added");
      }

      // Refresh addresses and select new/edited
      const addrResp = await getAddresses();
      const fetched = extractAddresses(addrResp as AddressResponse | Address[]);
      setAddresses(fetched);

      if (editingId) {
        const edited = fetched.find((a) => a._id === editingId) || fetched[0] || null;
        setSelectedAddress(edited ?? null);
      } else {
        const matched = fetched.find(
          (a) => a.fullName === form.fullName && a.phone === form.phone && a.street === form.street
        );
        setSelectedAddress(matched || fetched[fetched.length - 1] || fetched[0] || null);
      }

      setFormOpen(false);
      setEditingId(null);
    } catch (err: unknown) {
      console.error("saveAddress error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save address. Try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const removeAddress = async (id?: string) => {
    if (!id) return toast.error("Invalid address id");
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      const addrResp = await getAddresses();
      const fetched = extractAddresses(addrResp as AddressResponse | Address[]);
      setAddresses(fetched);
      if (!fetched.some((a) => a._id === selectedAddress?._id)) {
        setSelectedAddress(fetched[0] || null);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete address");
    }
  };

  /* ----- UI helpers ----- */
  const StepBubble = ({ n, label }: { n: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-light transition-all duration-300 ${step >= n ? "bg-black text-white border border-black" : "bg-white text-gray-800 border border-gray-700"
          }`}
      >
        {n}
      </div>
      <div className="text-xs font-light text-gray-900 mt-2 uppercase tracking-[0.1em]">{label}</div>
    </div>
  );

  // Loading states
  const isProcessing = loading || processingPayment || paymentLoading;
  const buttonText = isProcessing
    ? "Processing..."
    : paymentMethod === "cod"
      ? "Place Order"
      : `Pay ₹${grandTotal.toLocaleString()}`;

  if (loading && !processingPayment) return <LoadingOverlay isVisible={loading} />;

  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-6">🔒</div>
          <h3 className="text-lg font-semibold text-black mb-3 tracking-tight">Please log in to checkout</h3>
          <p className="text-sm font-light text-gray-600 mb-8 uppercase tracking-[0.1em] leading-relaxed">You need an account to complete purchase.</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
              onClick={() => router.push("/")}
            >
              Login
            </button>
            <button
              className="px-6 py-3 bg-white border border-gray-300 text-xs font-light uppercase tracking-[0.2em] hover:border-black transition-all duration-300"
              onClick={() => router.push("/")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-lg font-semibold text-black mb-3 tracking-tight">Your cart is empty</h2>
          <p className="text-sm font-light text-gray-600 mb-8 uppercase tracking-[0.1em] leading-relaxed">Add items to continue.</p>
          <button
            className="bg-black text-white px-8 py-4 text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
            onClick={() => router.push("/product/allProducts")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ----- Render ----- */
  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div ref={topRef} />

      {/* Loading overlay for payment processing */}
      {processingPayment && <LoadingOverlay isVisible={processingPayment} />}

      {/* Header - Luxury styling */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 border border-gray-300 hover:border-black transition-colors duration-300"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-md font-semibold text-black tracking-tighter">Checkout</h1>
        </div>
      </div>

      {/* Step indicator - Refined */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <StepBubble n={1} label="Summary" />
          <div className="w-4 h-[1px] bg-black" />
          <StepBubble n={2} label="Address" />
          <div className="w-4 h-[1px] bg-black" />
          <StepBubble n={3} label="Payment" />
          <div className="w-4 h-[1px] bg-black" />
          <StepBubble n={4} label="Success" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.section key="step1" {...stepMotion} className="bg-white border border-black p-6 lg:p-8">
                <h2 className="text-md font-semibold text-black mb-6 tracking-tight uppercase">Order Summary</h2>

                <div className="space-y-6">
                  {cartItems.map((it) => {
                    const price = getItemPrice(it);
                    return (
                      <div key={`${it._id}-${it.size}`} className="flex gap-4 items-start border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={it.product.images?.[0] || "/placeholder.png"} alt={it.product.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-black tracking-tight leading-tight">{it.product.title}</h3>
                          <div className="text-xs text-gray-600 mt-2 uppercase tracking-[0.1em]">Size: {it.size} • Qty: {it.quantity}</div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-xs font-light text-gray-600 uppercase tracking-widest">₹{price.toLocaleString()}</div>
                            <div className="text-sm font-medium text-black tracking-wide">₹{(price * it.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="px-8 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
                  >
                    Continue
                  </button>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section key="step2" {...stepMotion} className="bg-white border border-black p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-md font-semibold text-black tracking-tight uppercase ">Delivery Address</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={openAddForm}
                      className="text-xs text-black hover:text-gray-700 flex items-center gap-2 border-b border-gray-300 hover:border-black transition-colors duration-300 uppercase tracking-[0.1em] font-light"
                    >
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                </div>

                {/* If no addresses — show CTA to add */}
                {addresses.length === 0 && !formOpen && (
                  <div className="py-8 text-center">
                    <p className="text-sm font-light text-gray-600 mb-6 uppercase tracking-[0.1em]">No saved addresses — please add one to continue.</p>
                    <button
                      onClick={openAddForm}
                      className="px-8 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300"
                    >
                      Add Address
                    </button>
                  </div>
                )}

                {/* Address list */}
                {addresses.length > 0 && (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border p-6 cursor-pointer transition-all duration-300 flex justify-between items-start gap-6 ${selectedAddress?._id === addr._id ? "border-black bg-gray-50" : "border-gray-300 hover:border-black"
                          }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="radio"
                              checked={selectedAddress?._id === addr._id}
                              onChange={() => setSelectedAddress(addr)}
                              className="accent-black"
                            />
                            <p className="text-sm font-semibold text-black tracking-tight">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-light uppercase tracking-[0.1em]">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="ml-6 space-y-1">
                            <p className="text-xs font-light text-gray-600 tracking-wide">{addr.phone}</p>
                            <p className="text-xs font-light text-gray-600 tracking-wide">{addr.street}</p>
                            <p className="text-xs font-light text-gray-600 tracking-wide">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditForm(addr); }}
                            className="text-gray-600 hover:text-black p-2 border border-gray-200 hover:border-black transition-colors duration-300"
                            aria-label="Edit address"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeAddress(addr._id); }}
                            className="text-gray-600 border border-gray-200 p-2 hover:bg-red-50 hover:border-red-300 transition-colors duration-300"
                          >
                            <Trash2 size={14} className="text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formOpen && (
                  <div className="mt-6 p-6 bg-white border border-gray-300">
                    <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-[0.15em]">
                      {editingId ? "Edit Address" : "Add New Address"}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={(e) => handleFormChange("fullName", e.target.value)}
                          className="p-3 border border-gray-300 focus:border-black outline-none text-sm font-light transition-colors duration-300"
                          placeholder="Full name"
                        />
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={(e) => handleFormChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="p-3 border border-gray-300 focus:border-black outline-none text-sm font-light transition-colors duration-300"
                          placeholder="Phone (10 digits)"
                          inputMode="numeric"
                        />
                      </div>

                      <input
                        value={form.street}
                        onChange={(e) => handleFormChange("street", e.target.value)}
                        className="w-full p-3 border border-gray-300 focus:border-black outline-none text-sm font-light transition-colors duration-300"
                        placeholder="Street address"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          value={form.city}
                          onChange={(e) => handleFormChange("city", e.target.value)}
                          className="p-3 border border-gray-300 focus:border-black outline-none text-sm font-light transition-colors duration-300"
                          placeholder="City"
                        />
                        <select
                          value={form.state}
                          onChange={(e) => handleFormChange("state", e.target.value)}
                          className="p-3 border border-gray-300 focus:border-black outline-none text-sm font-light transition-colors duration-300"
                        >
                          <option value="">Select State</option>
                          {[
                            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
                            "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
                            "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
                          ].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input value={form.pincode} onChange={(e) => handleFormChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} className="p-3 border border-gray-300 rounded focus:border-black outline-none" placeholder="PIN code" inputMode="numeric" />
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setFormOpen(false); setEditingId(null); }} className="px-4 py-2 border border-gray-300 rounded" disabled={formLoading}>Cancel</button>
                        <button onClick={saveAddress} className="px-4 py-2 bg-black text-white rounded border border-black" disabled={formLoading}>{formLoading ? "Saving..." : editingId ? "Update" : "Add Address"}</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button className="px-4 py-2 border border-gray-300 rounded" onClick={() => setStep(1)}>Back</button>
                  <button onClick={() => { if (!selectedAddress) { toast.error("Select or add an address first"); return; } setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-4 py-2 bg-black text-white rounded border border-black disabled:opacity-50">Continue</button>
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section
                key="step3"
                {...stepMotion}
                className="bg-white border border-gray-300 rounded-xl p-6"
              >
                {/* Heading */}
                <h2 className="text-sm font-semibold tracking-tight uppercase mb-4 text-black">
                  Payment
                </h2>

                {/* Payment Options */}
                <div className="space-y-3">
                  {/* Online Payment */}
                  <div
                    onClick={() => setPaymentMethod("prepaid")}
                    className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "prepaid"
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-black"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-black tracking-tight">
                          Online Payment
                        </p>
                        <p className="text-xs text-green-600 tracking-wide">
                          Free Delivery Worth ₹89  · Faster checkout
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "prepaid"}
                        onChange={() => setPaymentMethod("prepaid")}
                        className="accent-black"
                      />
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className="border rounded-lg p-4 cursor-not-allowed bg-gray-100 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-black tracking-tight">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-600 tracking-wide">
                          Not available at the moment
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="pay"
                        disabled
                        className="accent-black cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 tracking-tight hover:border-black transition"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handlePlaceOrder()}
                    className="px-4 py-2 bg-black text-white rounded-md border border-black text-xs font-medium tracking-tight disabled:opacity-50 hover:bg-gray-800 transition"
                    disabled={isProcessing}
                  >
                    {buttonText}
                  </button>
                </div>

                {/* Payment Error */}
                {paymentError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-600 tracking-tight">{paymentError}</p>
                  </div>
                )}
              </motion.section>
            )}

            {step === 4 && (
              <motion.section key="step4" {...stepMotion} className="bg-white border border-gray-300 rounded p-8 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-4">
                  {paymentMethod === "cod"
                    ? "Your order is confirmed. You can pay when you receive the items."
                    : "Payment completed successfully! Your order is confirmed."
                  }
                </p>
                <p className="text-gray-600 mb-4">We will send updates via email / SMS.</p>
                {/* <p className="font-medium mb-6">
                  {orderId ? `Order ID: ${orderId}` : ""}
                </p> */}
                <div className="flex justify-center gap-3">
                  <button onClick={() => router.push("/product/allProducts")} className="px-4 py-2 bg-black text-white rounded border border-black">Continue shopping</button>
                  <button onClick={() => router.push("/profile/orders")} className="px-4 py-2 border border-gray-300 rounded">View orders</button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-300 rounded-xl p-6 sticky top-20">
            {/* Heading */}
            <h3 className="text-sm font-semibold tracking-tight uppercase mb-4 text-black">
              Order Summary
            </h3>

            {/* Totals */}
            <div className="space-y-2 font-medium text-xs mb-4 text-gray-700 tracking-tight">
              <div className="flex justify-between">
                <span>Bag Total</span>
                <span>₹{bagTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Original Price</span>
                <span>₹{bagTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-sm font-semibold tracking-tight text-black">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1) {
                      if (!selectedAddress) {
                        toast.error("Please select an address first");
                        return;
                      }
                      setStep(2);
                    } else if (step === 2) {
                      setStep(3);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full bg-black text-white py-3 border border-black tracking-tight text-xs uppercase hover:bg-gray-800 transition"
                >
                  Continue
                </button>
              ) : step === 3 ? (
                <button
                  onClick={() => handlePlaceOrder()}
                  className={`w-full py-3 rounded border tracking-tight text-xs uppercase ${selectedAddress && !isProcessing
                    ? "bg-black text-white border-black hover:bg-gray-800 transition"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                    }`}
                  disabled={!selectedAddress || isProcessing}
                >
                  {buttonText}
                </button>
              ) : null}

              {/* Payment Error */}
              {paymentError && step === 3 && (
                <div className="mt-2 text-xs text-red-500 tracking-tight">
                  {paymentError}
                </div>
              )}
            </div>

            {/* Info Badges */}
            <div className="mt-4 text-xs tracking-tight text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-green-600" />
                <span>100% secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-blue-600" />
                <span>Free delivery above ₹499</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-500" />
                <span>Delivery in 2-4 days</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}