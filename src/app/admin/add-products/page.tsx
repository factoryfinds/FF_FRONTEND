"use client";

import React, { useState, useEffect } from "react";
import { MultiImageInput } from "react-multiple-image-input"; // ✅ Named export
import { getAllProducts } from '../../../../utlis/api'
import ProductCard from "@/components/ProductCard"; // only for product 
import { useRouter } from "next/navigation";


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



export default function AddProductPage() {

    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [images, setImages] = useState<any>({}); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("unisex");
    const [originalPrice, setOriginalPrice] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState([{ name: "", hex: "#000000" }]);
    const [inventory, setInventory] = useState("");

    const [products, setProducts] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loadingProducts, setLoadingProducts] = useState(true);

    // 🔁 Define at component level so it can be reused
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true); // ⏳ start loading
            const all = await getAllProducts();
            setProducts(all);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoadingProducts(false); // ✅ stop loading
        }
    };

    useEffect(() => {
        fetchProducts();
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user || user.role != "admin") {
            router.push("/unauthorized"); // or homepage
        }
    }, []);

    if (loadingProducts) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Loading products...</p>
                {/* Or replace with a custom spinner component */}
            </div>
        );
    }


    const handleSizeChange = (size: string) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const handleColorChange = (index: number, key: "name" | "hex", value: string) => {
        const updatedColors = [...colors];
        updatedColors[index][key] = value;
        setColors(updatedColors);
    };

    const addColorField = () => {
        setColors([...colors, { name: "", hex: "#000000" }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.keys(images).length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        try {
            // 1. Upload images to /api/upload
            const formData = new FormData();
            Object.values(images).forEach((img: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                if (img?.file) {
                    formData.append("images", img.file); // ✅ use if available
                } else if (typeof img === "string" && img.startsWith("data:image")) {
                    const file = dataURLtoFile(img, `image${index}.jpg`);
                    formData.append("images", file); // ✅ base64 converted
                }
            });


            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                headers: {
                    // Don't set Content-Type for FormData - browser sets it automatically
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // ✅ Fixed: use accessToken instead of token
                },
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error("Image upload failed");
            }

            const uploadData = await uploadRes.json();
            const uploadedImageUrls = uploadData.imageUrls; // assuming your backend returns { imageUrls: [...] }

            // 2. Prepare payload with uploaded image URLs
            const payload = {
                title,
                description,
                category,
                gender,
                originalPrice: Number(originalPrice),
                discountedPrice: Number(discountedPrice),
                images: uploadedImageUrls, // use cloudinary URLs here
                sizes,
                colors,
                inventory: Number(inventory),
            };

            // 3. Post product to /api/products
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // ✅ Fixed: use accessToken instead of token
                },
                body: JSON.stringify(payload),
            });


            if (res.ok) {
                alert("✅ Product added successfully!");
                // optionally reset form
                fetchProducts();
                // ✅ Reset form state
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

            } else {
                const errData = await res.json();
                alert("❌ Product upload failed: " + errData.message);
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(err);
            alert("❌ Something went wrong: " + err.message);
        }
    };


    return (
        <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-6 bg-white">
                <h1 className="text-2xl font-bold text-black">Product Management</h1>
                <button
                    className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Hide Form" : "Add Product"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-md border border-gray-800 space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm mb-1 text-black font-medium">
                                Product Images (Crop 1:1)
                            </label>
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
                                    background: "#000",      // Black background or your panel color
                                    outlineColor: "#888",    // Outline border color for crop box
                                    textColor: "#fff",       // For label text or hint text
                                    buttonColor: "#444",     // For delete/change buttons
                                    modalColor: "#111",      // Crop modal bg
                                }}
                                // style={{
                                //     container: {
                                //         maxHeight: "90vh",         // Limit height of image modal
                                //         overflowY: "auto",         // Enable scroll
                                //         paddingBottom: "4rem",     // Room for button
                                //     },
                                //     cropArea: {
                                //         maxHeight: "60vh",         // Make image appear smaller
                                //         objectFit: "contain",
                                //     },
                                //     modal: {
                                //         padding: "1rem",
                                //         borderRadius: "8px",
                                //     },
                                //     input: {
                                //         backgroundColor: "#222",
                                //         color: "#fff",
                                //     }
                                // }}
                            />

                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-black">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                required
                                className="w-full p-2 rounded border border-gray-700 text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-black">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full p-2 rounded border border-gray-700 text-black"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-black">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-700 text-black"
                                    required
                                >
                                    <option value="">Select</option>
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
                                <label className="block text-sm mb-1 text-black">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-700 text-black"
                                >
                                    <option value="unisex">Unisex</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-black">Original Price</label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-700 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-black">Discounted Price</label>
                                <input
                                    type="number"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-700 text-black"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-black">Sizes</label>
                            <div className="flex gap-3 flex-wrap text-black">
                                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                    <label key={size}>
                                        <input
                                            type="checkbox"
                                            checked={sizes.includes(size)}
                                            onChange={() => handleSizeChange(size)}
                                            className="mr-1"
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-black">Colors</label>
                            {colors.map((color, idx) => (
                                <div key={idx} className="flex gap-3 items-center mb-2">
                                    <input
                                        type="text"
                                        placeholder="Color Name"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                                        className="p-2 border border-gray-700 rounded text-black"
                                    />
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                                        className="w-10 h-10 border border-gray-700 rounded"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addColorField}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                + Add Color
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-black">Inventory</label>
                            <input
                                type="number"
                                value={inventory}
                                onChange={(e) => setInventory(e.target.value)}
                                className="w-full p-2 rounded border border-gray-700 text-black"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-black hover:bg-gray-900 text-white font-medium px-4 py-2 rounded"
                        >
                            Submit Product
                        </button>
                    </form>
                </div>
            )}
            {/* 📦 Product List */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
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


        </div>
    );
}