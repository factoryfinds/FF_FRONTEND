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
        <p className="text-lg">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 lg:px-30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-lg font-semibold">Address Book</h2>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          {showForm ? "Cancel" : <Plus/>}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-white border border-gray-300 rounded-xl shadow-sm max-w-2xl mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="space-y-4">
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full name"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-black"
            />
            {/* Street */}
            <input
              type="text"
              placeholder="Street address"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, street: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-black"
            />
            {/* City / State / PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                className="p-3 border border-gray-300 rounded-lg focus:border-black"
              />
              <select
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, state: e.target.value }))
                }
                className="p-3 border border-gray-300 rounded-lg focus:border-black"
              >
                <option value="">Select State</option>
                {/* State options */}
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
              <input
                type="text"
                placeholder="PIN Code"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
                className="p-3 border border-gray-300 rounded-lg focus:border-black"
              />
            </div>
            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-black"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-xl hover:border-black"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No addresses saved yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {/* Address list */}
          {addresses.length > 0 && (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setNewAddress(addr)}
                  className={`border rounded-xl p-4 cursor-pointer transition-colors flex justify-between items-start gap-4 ${newAddress._id === addr._id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {/* Left: Address Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={17}
                        className={`${newAddress._id === addr._id
                          ? "text-black"
                          : "text-gray-400"
                          } transition-colors`}
                      />

                      <p className="font-medium">{addr.fullName}</p>
                      {addr.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{addr.phone}</p>
                    <p className="text-sm text-gray-600 ml-6">{addr.street}</p>
                    <p className="text-sm text-gray-600 ml-6">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(addr);
                      }}
                      className="text-gray-600 hover:text-black p-2 rounded border border-gray-200" aria-label="Edit address"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr._id);
                      }}
                      className="text-gray-600 border border-gray-200 p-2 rounded text-sm hover:bg-red-50"
                    >
                      <Trash2 size={16} className="text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </ul>
      )}
    </div>
  );
}
