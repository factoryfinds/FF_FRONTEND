"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../../../utlis/api";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Edit3,
  Trash2,
  Plus
} from "lucide-react";

interface Address {
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

interface AddressResponse {
  addresses?: Address[];
  data?: Address[];
  result?: Address[];
  address?: Address[];
  addressData?: Address[];
  [key: string]: unknown;
}

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export default function AddressPage() {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const extractAddresses = (response: AddressResponse | Address[]): Address[] => {
    if (Array.isArray(response)) return response;
    const possiblePaths: (keyof AddressResponse)[] = [
      "addresses",
      "data",
      "result",
      "address",
      "addressData",
    ];
    for (const path of possiblePaths) {
      const value = response[path];
      if (Array.isArray(value)) return value;
    }
    return [];
  };

  const loadAddresses = useCallback(async () => {
    try {
      const response = await getAddresses();
      setAddresses(extractAddresses(response));
    } catch (err) {
      const errorMessage = toErrorWithMessage(err).message;
      toast.error(`Failed to load addresses: ${errorMessage}`);
      setAddresses([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      await loadAddresses();
      setInitialLoading(false);
    })();
  }, [loadAddresses]);

  const validateAddress = (address: Address): boolean => {
    const requiredFields: (keyof Address)[] = [
      "fullName",
      "phone",
      "street",
      "city",
      "state",
      "pincode",
    ];
    return requiredFields.every((field) => {
      const value = address[field];
      return typeof value === "string" && value.trim() !== "";
    });
  };

  const handleSave = async () => {
    if (!validateAddress(newAddress)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^\d{10}$/.test(newAddress.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      toast.error("Enter a valid 6-digit PIN code");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateAddress(editingId, newAddress);
        toast.success("Address updated successfully!");
      } else {
        const {...addressData } = newAddress; 
        await addAddress(addressData);
        toast.success("Address added successfully!");
      }
      await loadAddresses();
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error(toErrorWithMessage(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return toast.error("Invalid address ID");
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully!");
      await loadAddresses();
    } catch (err) {
      toast.error(toErrorWithMessage(err).message);
    }
  };

  const handleEdit = (addr: Address) => {
    setNewAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || "India",
    });
    setEditingId(addr._id || null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setEditingId(null);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-xs font-black uppercase tracking-[0.15em]">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-8 lg:px-12 py-8">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-8">
        <h2 className="text-xs sm:text-sm font-black text-black uppercase tracking-[0.15em]">Address Book</h2>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
        >
          {showForm ? "Cancel" : <><Plus size={16} /> Add Address</>}
        </button>
      </div>

      {showForm && (
        <div className="p-8 bg-white border border-gray-300 shadow-sm max-w-3xl mb-8">
          <h3 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-6">
            {editingId ? "Edit Address" : "New Address"}
          </h3>
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
              />
            </div>
            
            {/* Street */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="Enter street address"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, street: e.target.value }))
                }
                className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
              />
            </div>
            
            {/* City / State / PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                  State *
                </label>
                <select
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
                >
                  <option value="">Select State</option>
                  {[
                    "Andhra Pradesh",
                    "Arunachal Pradesh",
                    "Assam",
                    "Bihar",
                    "Chhattisgarh",
                    "Goa",
                    "Gujarat",
                    "Haryana",
                    "Himachal Pradesh",
                    "Jharkhand",
                    "Karnataka",
                    "Kerala",
                    "Madhya Pradesh",
                    "Maharashtra",
                    "Manipur",
                    "Meghalaya",
                    "Mizoram",
                    "Nagaland",
                    "Odisha",
                    "Punjab",
                    "Rajasthan",
                    "Sikkim",
                    "Tamil Nadu",
                    "Telangana",
                    "Tripura",
                    "Uttar Pradesh",
                    "Uttarakhand",
                    "West Bengal",
                    "Delhi",
                  ].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  placeholder="6-digit PIN"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                    }))
                  }
                  className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-[0.15em] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
                className="w-full px-4 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors duration-300 text-sm font-light tracking-wide"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-3 text-xs text-black underline hover:no-underline font-light uppercase tracking-[0.1em] transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-4 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">No addresses saved yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setNewAddress(addr)}
              className={`border p-6 cursor-pointer transition-colors flex justify-between items-start gap-4 ${
                newAddress._id === addr._id
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {/* Left: Address Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin
                    size={18}
                    className={`${
                      newAddress._id === addr._id
                        ? "text-black"
                        : "text-gray-400"
                    } transition-colors`}
                  />
                  <p className="text-sm font-black text-black uppercase tracking-wide">{addr.fullName}</p>
                  {addr.isDefault && (
                    <span className="px-3 py-1 bg-black text-white text-xs uppercase tracking-wider font-light">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-light tracking-wide ml-7">{addr.phone}</p>
                <p className="text-sm text-gray-600 font-light tracking-wide ml-7">{addr.street}</p>
                <p className="text-sm text-gray-600 font-light tracking-wide ml-7">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(addr);
                  }}
                  className="text-black hover:bg-gray-100 p-3 border border-gray-300 hover:border-black transition-colors"
                  aria-label="Edit address"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr._id);
                  }}
                  className="text-black hover:bg-gray-100 p-3 border border-gray-300 hover:border-black transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}