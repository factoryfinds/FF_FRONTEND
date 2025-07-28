"use client";
import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../../../utlis/api"; // ✅ Correct this path as needed

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

  // ✅ Extract addresses from API response
  const extractAddresses = (response: any): Address[] => {
    console.log("Raw API response:", response);
    
    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    }
    
    // Common response structures
    const possiblePaths = [
      'addresses',
      'data',
      'result',
      'address',
      'addressData'
    ];
    
    for (const path of possiblePaths) {
      if (response && Array.isArray(response[path])) {
        console.log(`Found addresses in response.${path}:`, response[path]);
        return response[path];
      }
    }
    
    console.log("No addresses found in response, returning empty array");
    return [];
  };

  // ✅ Fetch addresses on component mount
  const loadAddresses = async () => {
    try {
      console.log("Fetching addresses...");
      const response = await getAddresses();
      const addressList = extractAddresses(response);
      console.log("Processed addresses:", addressList);
      setAddresses(addressList);
    } catch (err) {
      console.error("Failed to load addresses:", err);
      alert("Failed to load addresses. Please try again.");
      setAddresses([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      await loadAddresses();
      setInitialLoading(false);
    };
    init();
  }, []);

  // ✅ Validate form data
  const validateAddress = (address: Address): boolean => {
    const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
    return requiredFields.every(field => {
      const value = address[field as keyof Address];
      return typeof value === 'string' && value.trim() !== '';
    });
  };

  // ✅ Save (Add or Update)
  const handleSave = async () => {
    if (!validateAddress(newAddress)) {
      alert("Please fill in all required fields");
      return;
    }

    // Basic phone validation
    if (!/^\d{10}$/.test(newAddress.phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Basic pincode validation
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        console.log("Updating address with ID:", editingId, "Data:", newAddress);
        const result = await updateAddress(editingId, newAddress);
        console.log("Update result:", result);
        
        // For update, we'll refresh the entire list to be safe
        await loadAddresses();
        alert("Address updated successfully!");
      } else {
        console.log("Adding new address:", newAddress);
        const { _id, ...addressWithoutId } = newAddress;
        const result = await addAddress(addressWithoutId);
        console.log("Add result:", result);
        
        // For add, we'll also refresh the entire list
        await loadAddresses();
        alert("Address added successfully!");
      }

      // Reset form
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

    } catch (err: any) {
      console.error("Failed to save address:", err);
      alert(err.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Address
  const handleDelete = async (id: string | undefined) => {
    console.log("Delete function called with ID:", id);
    
    if (!id) {
      console.error("No ID provided for deletion");
      alert("Invalid address ID - cannot delete");
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      console.log("Calling deleteAddress API with ID:", id);
      const result = await deleteAddress(id);
      console.log("Delete API result:", result);
      
      // Refresh the addresses list after successful deletion
      await loadAddresses();
      alert("Address deleted successfully!");
      
    } catch (err: any) {
      console.error("Failed to delete address:", err);
      alert(err.message || "Failed to delete address. Please try again.");
    }
  };

  // ✅ Start Editing
  const handleEdit = (addr: Address) => {
    console.log("Editing address:", addr);
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

  // ✅ Cancel form
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
      <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
        <div className="flex items-center justify-center">
          <p className="text-lg">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Address Management</h2>
        <button
          className="px-4 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {/* Debug Section - Remove in production */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
        <p className="text-yellow-700">Addresses count: {addresses.length}</p>
        <p className="text-yellow-700">First address ID: {addresses[0]?._id || 'N/A'}</p>
        <button 
          onClick={loadAddresses}
          className="mt-2 px-3 py-1 bg-yellow-200 rounded text-yellow-800 hover:bg-yellow-300"
        >
          Refresh Addresses
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="Enter street address"
                value={newAddress.street}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, street: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={newAddress.state}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">--Select State--</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  placeholder="6-digit PIN"
                  value={newAddress.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewAddress((prev) => ({ ...prev, pincode: value }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="10-digit phone number"
                value={newAddress.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setNewAddress((prev) => ({ ...prev, phone: value }));
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
                required
              />
            </div>

            <div className="p-3 bg-blue-50 text-sm text-blue-700 rounded-md">
              <p>📍 Please ensure all details are correct for smooth delivery.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No addresses saved yet.</p>
          <p className="text-gray-500 text-sm mt-2">Click "Add Address" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Saved Addresses ({addresses.length})</h3>
          <ul className="space-y-4">
            {addresses.map((addr, idx) => (
              <li key={addr._id || idx} className="p-6 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Debug info */}
                <div className="text-xs text-gray-400 mb-2 font-mono">
                  Debug - ID: {addr._id || 'NO_ID'} | Type: {typeof addr._id}
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-2">{addr.fullName}</p>
                    <p className="text-gray-700 mb-1">{addr.street}</p>
                    <p className="text-gray-700 mb-1">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-gray-700 mb-1">{addr.country}</p>
                    <p className="text-gray-600">📞 {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default Address
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      onClick={() => handleEdit(addr)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                      onClick={() => {
                        console.log("Delete clicked for:", { id: addr._id, address: addr });
                        handleDelete(addr._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}