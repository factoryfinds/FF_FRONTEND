"use client";

import React, { useState, useEffect } from "react";
// ✅ Try different import patterns for MultiImageInput
// import MultiImageInput from "react-multiple-image-input"; // Default import
// If the above doesn't work, try:
// import { MultiImageInput } from "react-multiple-image-input";
// Or if it's a default export:
const MultiImageInput = require("react-multiple-image-input").default;

import { getAllProducts, Product } from '../../../../utlis/api';
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

// ✅ Helper function to convert data URL to File
function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// ✅ Define proper interfaces for better type safety
interface ImageFile {
    file?: File;
    dataURL?: string;
}

interface ImageInputType {
    [key: string]: ImageFile | string;
}

interface ColorType {
    name: string;
    hex: string;
}

interface UploadResponse {
    imageUrls: string[];
    message?: string;
}

interface ErrorResponse {
    message: string;
}

export default function AddProductPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [images, setImages] = useState<ImageInputType>({});
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState<"men" | "women" | "unisex">("unisex");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<ColorType[]>([{ name: "", hex: "#000000" }]);
    const [inventory, setInventory] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ✅ Fetch products function
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const data = await getAllProducts();
            console.log("Fetched products:", data);
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        
        // ✅ Check for admin access (avoid localStorage on server side)
        if (typeof window !== "undefined") {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user || user.role !== "admin") {
                router.push("/unauthorized");
            }
        }
    }, [router]);

    // ✅ Loading state
    if (loadingProducts) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    // ✅ Handle size selection
    const handleSizeChange = (size: string) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    // ✅ Handle color changes
    const handleColorChange = (index: number, key: "name" | "hex", value: string) => {
        const updatedColors = [...colors];
        updatedColors[index][key] = value;
        setColors(updatedColors);
    };

    // ✅ Add new color field
    const addColorField = () => {
        setColors([...colors, { name: "", hex: "#000000" }]);
    };

    // ✅ Remove color field
    const removeColorField = (index: number) => {
        if (colors.length > 1) {
            setColors(colors.filter((_, i) => i !== index));
        }
    };

    // ✅ Reset form
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setGender('unisex');
        setOriginalPrice('');
        setDiscountedPrice('');
        setImages({});
        setSizes([]);
        setColors([{ name: '', hex: '#000000' }]);
        setInventory('');
    };

    // ✅ Form submission with proper typing
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.keys(images).length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        // Basic validation
        if (!title.trim() || !category || !originalPrice || !discountedPrice) {
            alert("Please fill in all required fields.");
            return;
        }

        if (Number(discountedPrice) > Number(originalPrice)) {
            alert("Discounted price cannot be higher than original price.");
            return;
        }

        setSubmitting(true);

        try {
            // 1. Upload images with proper typing
            const formData = new FormData();
            Object.values(images).forEach((img: ImageFile | string, index: number) => {
                if (typeof img === 'object' && img.file) {
                    formData.append("images", img.file);
                } else if (typeof img === "string" && img.startsWith("data:image")) {
                    const file = dataURLtoFile(img, `image${index}.jpg`);
                    formData.append("images", file);
                }
            });

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData: ErrorResponse = await uploadRes.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || "Image upload failed");
            }

            const uploadData: UploadResponse = await uploadRes.json();
            const uploadedImageUrls = uploadData.imageUrls;

            // 2. Filter out empty colors
            const validColors = colors.filter(color => color.name.trim() !== "");

            // 3. Prepare product payload
            const payload = {
                title: title.trim(),
                description: description.trim(),
                category,
                gender,
                originalPrice: Number(originalPrice),
                discountedPrice: Number(discountedPrice),
                images: uploadedImageUrls,
                sizes,
                colors: validColors,
                inventory: Number(inventory) || 0,
            };

            // 4. Create product
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("✅ Product added successfully!");
                resetForm();
                await fetchProducts(); // Refresh product list
                setShowForm(false); // Hide form after successful submission
            } else {
                const errData: ErrorResponse = await res.json();
                throw new Error(errData.message || "Product creation failed");
            }
        } catch (err) {
            console.error("Product submission error:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            alert("❌ Something went wrong: " + errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <button
                        className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={() => setShowForm(!showForm)}
                        disabled={submitting}
                    >
                        {showForm ? "Hide Form" : "Add Product"}
                    </button>
                </div>

                {/* Add Product Form */}
                {showForm && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h2>
                        
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Product Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Images (Crop 1:1) *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <MultiImageInput
                                        images={images}
                                        setImages={setImages}
                                        max={5}
                                        allowCrop={true}
                                        cropConfig={{
                                            crop: { unit: "%", width: 90 },
                                            aspect: 1,
                                            ruleOfThirds: true,
                                            maxWidth: 800,
                                            minWidth: 100,
                                        }}
                                        theme={{
                                            background: "#f9fafb",
                                            outlineColor: "#d1d5db",
                                            textColor: "#374151",
                                            buttonColor: "#6b7280",
                                            modalColor: "#ffffff",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Title and Description */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Title *
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter product title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter product description"
                                    />
                                </div>
                            </div>

                            {/* Category and Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="shirt">Shirt</option>
                                        <option value="t-shirt">T-Shirt</option>
                                        <option value="jeans">Jeans</option>
                                        <option value="trouser">Trouser</option>
                                        <option value="jacket">Jacket</option>
                                        <option value="kurti">Kurti</option>
                                        <option value="saree">Saree</option>
                                        <option value="tops">Tops</option>
                                        <option value="dresses">Dresses</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value as "men" | "women" | "unisex")}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="unisex">Unisex</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                    </select>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Original Price *
                                    </label>
                                    <input
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discounted Price *
                                    </label>
                                    <input
                                        type="number"
                                        value={discountedPrice}
                                        onChange={(e) => setDiscountedPrice(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Inventory
                                    </label>
                                    <input
                                        type="number"
                                        value={inventory}
                                        onChange={(e) => setInventory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Available Sizes
                                </label>
                                <div className="flex gap-4 flex-wrap">
                                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                        <label key={size} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={sizes.includes(size)}
                                                onChange={() => handleSizeChange(size)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Available Colors
                                </label>
                                <div className="space-y-3">
                                    {colors.map((color, idx) => (
                                        <div key={idx} className="flex gap-3 items-center">
                                            <input
                                                type="text"
                                                placeholder="Color Name (e.g., Red, Blue)"
                                                value={color.name}
                                                onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="color"
                                                value={color.hex}
                                                onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                                                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            {colors.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeColorField(idx)}
                                                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addColorField}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        + Add Another Color
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? "Adding Product..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Grid */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        All Products ({products.length})
                    </h2>
                    
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                            <p className="text-gray-600">Add your first product to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    _id={product._id}
                                    title={product.title}
                                    images={product.images}
                                    originalPrice={product.originalPrice}
                                    discountedPrice={product.discountedPrice}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}