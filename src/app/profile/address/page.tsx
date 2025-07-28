"use client";
import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../../../utlis/api"; // ✅ Correct this path as needed

export default function AddressPage() {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch addresses on component mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.addresses || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load addresses");
      }
    };

    loadAddresses();
  }, []);

  // ✅ Save (Add or Update)
  const handleSave = async () => {
    const isValid = Object.values(newAddress).every((val) => val.trim() !== "");
    if (!isValid) return alert("Please fill in all fields");

    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await updateAddress(editingId, newAddress);
      } else {
        res = await addAddress(newAddress);
      }

      setAddresses(res.addresses || []);
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Address
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await deleteAddress(id);
      setAddresses(res.addresses || []);
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  // ✅ Start Editing
  const handleEdit = (addr: any) => {
    setNewAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Address</h2>
        <button
          className="px-4 py-2 bg-black text-white font-medium rounded hover:bg-gray-800"
          onClick={() => {
            setShowForm(!showForm);
            setNewAddress({
              fullName: "",
              phone: "",
              street: "",
              city: "",
              state: "",
              pincode: "",
            });
            setEditingId(null);
          }}
        >
          {showForm ? "Close" : "+ Add Address"}
        </button>
      </div>
      {showForm && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mb-5">
          <h3 className="text-xl font-bold mb-4">Delivery</h3>
          <div className="space-y-4">

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={newAddress.street}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, street: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                  value={newAddress.state}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="Andhra Pradesh">--Select--</option>
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

                  {/* Add more states as needed */}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">PIN code</label>
                <input
                  type="text"
                  placeholder="PIN code"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <span className="ml-2 text-gray-500">?</span>
              </div>
            </div>
            
            <div className="p-2 bg-gray-100 text-sm text-gray-600 rounded">
              Enter your shipping address to view available shipping methods.
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Add Address"}
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-gray-600">No saved addresses.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {addresses.map((addr, idx) => (
            <li key={addr._id || idx} className="p-4 border border-gray-300 rounded bg-white">
              <p className="font-semibold">{addr.fullName}</p>
              <p className="text-sm">
                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm">Phone: {addr.phone}</p>

              <div className="flex gap-4 mt-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(addr)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(addr._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
}