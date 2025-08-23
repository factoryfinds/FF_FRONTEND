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

/* ----- Type helpers ----- */
// Only keys of Address which are string | undefined
// type StringKeys<T> = {
//   [K in keyof T]: T[K] extends string | undefined ? K : never;
// }[keyof T];

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
// const nonEmpty = (s?: string) => typeof s === "string" && s.trim().length > 0;
const validateAddressFields = (addr: Address): { ok: boolean; message: string } => {
  // const required: StringKeys<Address>[] = [
  //   "fullName",
  //   "phone",
  //   "street",
  //   "city",
  //   "state",
  //   "pincode",
  // ];

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
    return item.product?.discountedPrice || item.product?.originalPrice || 799;
  }, []);

  const bagTotal = useMemo(
    () =>
      cartItems.reduce((s, it) => {
        const price = getItemPrice(it);
        return s + price * (it.quantity || 1);
      }, 0),
    [cartItems, getItemPrice]
  );

  const prepaidDiscount = paymentMethod === "prepaid" ? Math.round(bagTotal * 0.05) : 0;
  const additionalDiscount = bagTotal >= 10000 ? 100 : 0;
  const deliveryCharges = bagTotal >= 499 ? 0 : 99;
  const totalDiscount = prepaidDiscount + additionalDiscount;
  const grandTotal = bagTotal - totalDiscount + deliveryCharges;

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
        const {...payload } = form;
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

  /* ----- Step navigation ----- */
  // const nextStep = () => {
  //   if (step === 1) {
  //     if (!selectedAddress) {
  //       toast.error("Please select or add an address to continue");
  //       return;
  //     }
  //     setStep(2);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //     return;
  //   }
  //   if (step === 2) {
  //     setStep(3);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //     return;
  //   }
  //   if (step === 3) {
  //     if (!selectedAddress) {
  //       toast.error("Please select delivery address first");
  //       return;
  //     }
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //       const id = `ORD-${Date.now().toString().slice(-6)}`;
  //       setOrderId(id);
  //       setStep(4);
  //     }, 1400);
  //     return;
  //   }
  // };

  // const prevStep = () => {
  //   if (step > 1) {
  //     setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  /* ----- UI helpers ----- */
  const StepBubble = ({ n, label }: { n: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-medium transition-colors border ${step >= n ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-300"
          }`}
      >
        {n}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );

  if (loading) return <LoadingOverlay isVisible={loading} />;

  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-medium mb-2">Please log in to checkout</h3>
          <p className="text-gray-600 mb-6">You need an account to complete purchase.</p>
          <div className="flex justify-center gap-3">
            <button className="px-4 py-2 bg-black text-white rounded border border-black" onClick={() => router.push("/login")}>Login</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded" onClick={() => router.push("/")}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to continue.</p>
          <button className="bg-black text-white px-6 py-3 rounded border border-black" onClick={() => router.push("/products")}>Continue shopping</button>
        </div>
      </div>
    );
  }

  /* ----- Render ----- */
  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div ref={topRef} />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded border border-gray-300 hover:border-black transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-medium">Checkout</h1>
      </div>

      {/* Step indicator */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between md:justify-center gap-6">
        <div className="flex items-center gap-6">
          <StepBubble n={1} label="Address" />
          <div className="w-8 h-[1px] bg-gray-300 hidden md:block" />
          <StepBubble n={2} label="Payment" />
          <div className="w-8 h-[1px] bg-gray-300 hidden md:block" />
          <StepBubble n={3} label="Summary" />
          <div className="w-8 h-[1px] bg-gray-300 hidden md:block" />
          <StepBubble n={4} label="Success" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.section key="step1" {...stepMotion} className="bg-white border border-gray-300 rounded p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Delivery Address</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={openAddForm} className="text-sm text-black hover:text-gray-700 flex items-center gap-2 border-b border-gray-300">
                      <Plus size={14} /> Add new
                    </button>
                  </div>
                </div>

                {/* If no addresses — show CTA to add */}
                {addresses.length === 0 && !formOpen && (
                  <div className="py-6">
                    <p className="text-gray-600 mb-4">No saved addresses — please add one to continue.</p>
                    <button onClick={openAddForm} className="px-4 py-2 bg-black text-white rounded border border-black">Add Address</button>
                  </div>
                )}

                {/* Address list */}
                {addresses.length > 0 && (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border rounded p-4 cursor-pointer transition-colors flex justify-between items-start gap-4 ${selectedAddress?._id === addr._id ? "border-black bg-gray-50" : "border-gray-300 hover:border-black"}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input type="radio" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} className="accent-black" />
                            <p className="font-medium">{addr.fullName}</p>
                            {addr.isDefault && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{addr.phone}</p>
                          <p className="text-sm text-gray-600 ml-6">{addr.street}</p>
                          <p className="text-sm text-gray-600 ml-6">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEditForm(addr); }} className="text-gray-600 hover:text-black p-2 rounded border border-gray-200" aria-label="Edit address">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); removeAddress(addr._id); }} className="text-gray-600 border border-gray-200 p-2 rounded text-sm hover:bg-red-50">
                            <Trash2 size={16} className="text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formOpen && (
                  <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
                    <h3 className="text-md font-medium mb-3">{editingId ? "Edit Address" : "Add New Address"}</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input name="fullName" value={form.fullName} onChange={(e) => handleFormChange("fullName", e.target.value)} className="p-3 border border-gray-300 rounded focus:border-black outline-none" placeholder="Full name" />
                        <input name="phone" value={form.phone} onChange={(e) => handleFormChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="p-3 border border-gray-300 rounded focus:border-black outline-none" placeholder="Phone (10 digits)" inputMode="numeric" />
                      </div>

                      <input value={form.street} onChange={(e) => handleFormChange("street", e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:border-black outline-none" placeholder="Street address" />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input value={form.city} onChange={(e) => handleFormChange("city", e.target.value)} className="p-3 border border-gray-300 rounded focus:border-black outline-none" placeholder="City" />
                        <select value={form.state} onChange={(e) => handleFormChange("state", e.target.value)} className="p-3 border border-gray-300 rounded focus:border-black outline-none">
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

                <div className="flex justify-end mt-6">
                  <button onClick={() => { if (!selectedAddress) { toast.error("Select or add an address first"); return; } setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-4 py-2 bg-black text-white rounded border border-black disabled:opacity-50">Continue</button>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section key="step2" {...stepMotion} className="bg-white border border-gray-300 rounded p-6">
                <h2 className="text-lg font-medium mb-4">Payment</h2>
                <div className="space-y-3">
                  <div onClick={() => setPaymentMethod("prepaid")} className={`border rounded p-4 cursor-pointer ${paymentMethod === "prepaid" ? "border-black bg-gray-50" : "border-gray-300 hover:border-black"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Online Payment</p>
                        <p className="text-sm text-green-600">Extra 5% OFF · Faster checkout</p>
                      </div>
                      <div>
                        <input type="radio" name="pay" checked={paymentMethod === "prepaid"} onChange={() => setPaymentMethod("prepaid")} className="accent-black" />
                      </div>
                    </div>
                  </div>

                  <div onClick={() => setPaymentMethod("cod")} className={`border rounded p-4 cursor-pointer ${paymentMethod === "cod" ? "border-black bg-gray-50" : "border-gray-300 hover:border-black"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                      <div>
                        <input type="radio" name="pay" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-black" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button className="px-4 py-2 border border-gray-300 rounded" onClick={() => setStep(1)}>Back</button>
                  <button className="px-4 py-2 bg-black text-white rounded border border-black" onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Continue</button>
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section key="step3" {...stepMotion} className="bg-white border border-gray-300 rounded p-6">
                <h2 className="text-lg font-medium mb-4">Review Order</h2>

                <div className="space-y-4">
                  {cartItems.map((it) => {
                    const price = getItemPrice(it);
                    return (
                      <div key={`${it._id}-${it.size}`} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={it.product.images?.[0] || "/placeholder.png"} alt={it.product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{it.product.title}</h3>
                          <div className="text-sm text-gray-600 mt-1">Size: {it.size} • Qty: {it.quantity}</div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm text-gray-600">₹{price.toLocaleString()}</div>
                            <div className="font-semibold">₹{(price * it.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-6 gap-3">
                  <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-300 rounded">Back</button>
                  <div className="flex items-center gap-3">
                    <button onClick={() => {
                      if (!selectedAddress) { toast.error("Select delivery address first"); return; }
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        const id = `ORD-${Date.now().toString().slice(-6)}`;
                        setOrderId(id);
                        setStep(4);
                      }, 1400);
                    }} className="px-4 py-2 bg-black text-white rounded border border-black">{paymentMethod === "cod" ? "Place Order" : `Pay ₹${grandTotal.toLocaleString()}`}</button>
                  </div>
                </div>
              </motion.section>
            )}

            {step === 4 && (
              <motion.section key="step4" {...stepMotion} className="bg-white border border-gray-300 rounded p-8 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-semibold mb-2">Order Placed</h2>
                <p className="text-gray-600 mb-4">Your order is confirmed. We will send updates via email / SMS.</p>
                <p className="font-medium mb-6">{orderId ? `Order ID: ${orderId}` : ""}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => router.push("/products")} className="px-4 py-2 bg-black text-white rounded border border-black">Continue shopping</button>
                  <button onClick={() => router.push("/orders")} className="px-4 py-2 border border-gray-300 rounded">View orders</button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-300 rounded p-6 sticky top-20">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600"><span>Bag Total</span><span>₹{bagTotal.toLocaleString()}</span></div>
              {prepaidDiscount > 0 && (<div className="flex justify-between text-green-600"><span>Prepaid Discount</span><span>-₹{prepaidDiscount.toLocaleString()}</span></div>)}
              {additionalDiscount > 0 && (<div className="flex justify-between text-green-600"><span>Additional Discount</span><span>-₹{additionalDiscount.toLocaleString()}</span></div>)}
              <div className="flex justify-between"><span>Delivery</span><span className={deliveryCharges === 0 ? "text-green-600" : ""}>{deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}</span></div>
              {totalDiscount > 0 && (<div className="flex justify-between text-green-600 font-medium"><span>Total Savings</span><span>₹{totalDiscount.toLocaleString()}</span></div>)}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-semibold text-lg"><span>Grand Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
            </div>

            <div className="mt-4">
              {step < 3 ? (
                <button onClick={() => { if (step === 1) { if (!selectedAddress) { toast.error("Please select an address first"); return; } setStep(2); } else if (step === 2) { setStep(3); } window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full bg-black text-white py-3 rounded border border-black">Continue</button>
              ) : step === 3 ? (
                <button onClick={() => { if (!selectedAddress) { toast.error("Please select an address"); return; } setLoading(true); setTimeout(() => { setLoading(false); const id = `ORD-${Date.now().toString().slice(-6)}`; setOrderId(id); setStep(4); }, 1400); }} className={`w-full py-3 rounded border ${selectedAddress ? "bg-black text-white border-black" : "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"}`} disabled={!selectedAddress}>
                  {paymentMethod === "cod" ? "Place Order" : `Pay ₹${grandTotal.toLocaleString()}`}
                </button>
              ) : null}
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2"><Shield size={14} className="text-green-600" /> <span>100% secure payments</span></div>
              <div className="flex items-center gap-2"><Truck size={14} className="text-blue-600" /> <span>Free delivery above ₹499</span></div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-orange-500" /> <span>Delivery in 2-4 days</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}