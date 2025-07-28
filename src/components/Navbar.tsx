"use client";

import { useState, useRef, useEffect } from "react";
import {
    FiMenu,
    FiSearch,
    FiPhone,
    FiUser,
    FiHeart,
    FiX,
    FiUsers,
    FiClock,
    FiTrendingUp,
    FiBox,
    FiChevronDown,
    FiChevronUp,
    FiPower,
} from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import {
    FaWhatsapp,
    FaPhoneAlt,
    FaQuestion,
    FaPeopleArrows
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import LoginDrawer from "@/components/LoginDrawer";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [showMen, setShowMen] = useState(false);
    const [showWomen, setShowWomen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const accountRef = useRef(null);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close account dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check auth state on component mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        setIsLoggedIn(!!token);
        setRole(user?.role || null);
    }, []);

    // Update auth state when login drawer opens/closes
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        setIsLoggedIn(!!token);
        setRole(user?.role || null);
    }, [isLoginDrawerOpen]);

    // Prevent body scroll when menu is open on mobile
    useEffect(() => {
        if (isMobile && (isMenuOpen || isCallDrawerOpen)) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isCallDrawerOpen, isMobile]);

    const handleLogout = async () => {
        try {
            // Optional: Call backend logout endpoint if you have one
            // await logout(); // This would be from your API utils

            // Clear all auth-related data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            // Update local state
            setIsLoggedIn(false);
            setIsAccountOpen(false);
            setRole(null);

            // Show success message
            toast.success("Logged out successfully!");

            // Refresh page after a brief delay
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Logout error:', error);

            // Even if API call fails, still clear local data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setIsLoggedIn(false);
            setIsAccountOpen(false);
            setRole(null);

            toast.error("Logout completed with errors");
            window.location.reload();
        }
    };

    const toggleMobileSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <>
            {/* Fixed Navbar Container */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                {/* Overlay for mobile when drawers are open */}
                {isMobile && (isMenuOpen || isCallDrawerOpen) && (
                    <div
                        className="fixed inset-0  bg-opacity-50 z-30"
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsCallDrawerOpen(false);
                        }}
                    />
                )}

                {/* Top Navbar */}
                <nav className="w-full h-20 md:h-28 px-4 md:px-8 bg-white border-b border-gray-200 relative z-30">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Section */}
                        <div className="flex items-center gap-4 md:gap-10 text-sm text-gray-900 font-medium flex-1">
                            <div
                                className="flex items-center gap-2 cursor-pointer font-light hover:text-black"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <FiMenu size={18} />
                                <span className="hidden sm:inline">Menu</span>
                            </div>

                            {/* Search - hidden on mobile, shown on larger screens */}
                            <div className="hidden md:flex items-center gap-2 cursor-pointer font-light hover:text-black">
                                <FiSearch size={18} />
                                <span>Search</span>
                            </div>

                            {/* Mobile Search Icon - shows when search is closed */}
                            {isMobile && !isSearchOpen && (
                                <div
                                    className="flex items-center gap-2 cursor-pointer font-light hover:text-black md:hidden"
                                    onClick={toggleMobileSearch}
                                >
                                    <FiSearch size={18} />
                                </div>
                            )}
                        </div>

                        {/* Center: Brand - Absolutely centered */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wide cursor-pointer font-semibold text-black whitespace-nowrap"
                                onClick={() => router.push("/")}
                            >
                                FACTORY FINDS
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3 md:gap-10 text-sm text-gray-900 font-medium flex-1 justify-end">

                            {/* Admin link (desktop only) */}
                            {role === "admin" && (
                                <div
                                    className="hidden md:block cursor-pointer font-light hover:text-black"
                                    onClick={() => router.push("/admin/dashboard")}
                                >
                                    Admin
                                </div>
                            )}

                            {/* Call Us – shown only on desktop now */}
                            <div
                                className="hidden md:flex items-center gap-1 cursor-pointer font-light hover:text-black"
                                onClick={() => setIsCallDrawerOpen(true)}
                            >
                                <span>Contact Us</span>
                            </div>

                            {/* Heart Icon – shown only on desktop */}
                            <FiHeart
                                size={18}
                                className="hidden md:block cursor-pointer font-light hover:text-black"
                                onClick={() => {
                                    setIsAccountOpen(false);
                                    router.push("/profile/wishlist");
                                }}
                            />

                            {/* Account Dropdown */}
                            <div className="relative" ref={accountRef}>
                                <FiUser
                                    size={18}
                                    className="cursor-pointer hover:text-black"
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                />

                                {isAccountOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        {isLoggedIn ? (
                                            <ul className="text-sm text-gray-800 py-2">
                                                {/* 📞 Call Us – Mobile only */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-light block md:hidden flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsCallDrawerOpen(true);
                                                        setIsAccountOpen(false);
                                                    }}
                                                >
                                                    <FiPhone size={16} />
                                                    Contact Us
                                                </li>

                                                {/* ❤️ Wishlist – Mobile only */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer block md:hidden flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsAccountOpen(false);
                                                        router.push("/profile/wishlist");
                                                    }}
                                                >
                                                    <FiHeart size={16} />
                                                    Wishlist
                                                </li>

                                                {/* 👤 Profile */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsAccountOpen(false);
                                                        router.push("/profile/cart");
                                                    }}
                                                >
                                                    <FiUser size={16} />
                                                    Profile
                                                </li>

                                                {/* 🛍️ Check-out Bag */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsAccountOpen(false);
                                                        router.push("/profile/cart");
                                                    }}
                                                >
                                                    <FiBox size={16} />
                                                    Check-out Bag
                                                </li>

                                                {/* Admin Dashboard – Mobile only */}
                                                {role === "admin" && (
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer block md:hidden flex items-center gap-2"
                                                        onClick={() => {
                                                            setIsAccountOpen(false);
                                                            router.push("/admin/dashboard");
                                                        }}
                                                    >
                                                        <FiSettings size={16} />
                                                        Admin Dashboard
                                                    </li>
                                                )}

                                                {/* 🚪 Logout */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                    onClick={handleLogout}
                                                >
                                                    <FiPower size={16} />
                                                    Logout
                                                </li>

                                            </ul>

                                        ) : (
                                            <div className="p-4 text-sm">
                                                <p className="mb-2 text-center">You're not logged in.</p>
                                                <button
                                                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900"
                                                    onClick={() => {
                                                        setIsLoginDrawerOpen(true);
                                                        setIsAccountOpen(false);
                                                    }}
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Search Bar - Slides down/up */}
                <div className={`md:hidden bg-white border-b border-gray-200 px-4 overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-16 py-3' : 'max-h-0 py-0'
                    }`}>
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-3 py-2">
                        <FiSearch size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent flex-1 outline-none text-sm"
                            autoFocus={isSearchOpen}
                        />
                        <button
                            onClick={toggleMobileSearch}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <FiX size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className={`${isSearchOpen ? 'h-32 md:h-28' : 'h-20 md:h-28'}`}></div>

            {/* Left Sidebar Menu */}
            <div className={`fixed top-0 left-0 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } ${isMobile ? "w-full" : "w-1/4"}`}>

                <div className="flex justify-between items-center px-4 md:px-6 py-10 border-b border-gray-200">
                    <h2 className="font-semibold text-black text-xl md:text-2xl">
                        Categories
                    </h2>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    <ul className="flex flex-col gap-1 px-4 md:px-6 py-4 text-gray-900 text-sm">
                        {/* Men Category */}
                        <li>
                            <div
                                className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => setShowMen(!showMen)}
                            >
                                <div className="flex items-center gap-3">
                                    <FiUser className="text-[16px]" />
                                    <span>Men</span>
                                </div>
                                {showMen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                            </div>
                            {showMen && (
                                <ul className="ml-8 mt-1 text-[13px] space-y-2 pb-2">
                                    <li className="cursor-pointer hover:text-black py-1">Shirt</li>
                                    <li className="cursor-pointer hover:text-black py-1">T-Shirt</li>
                                    <li className="cursor-pointer hover:text-black py-1">Jeans</li>
                                    <li className="cursor-pointer hover:text-black py-1">Trouser</li>
                                    <li className="cursor-pointer hover:text-black py-1">Jacket</li>
                                </ul>
                            )}
                        </li>

                        {/* Women Category */}
                        <li>
                            <div
                                className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => setShowWomen(!showWomen)}
                            >
                                <div className="flex items-center gap-3">
                                    <FiUsers className="text-[16px]" />
                                    <span>Women</span>
                                </div>
                                {showWomen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                            </div>
                            {showWomen && (
                                <ul className="ml-8 mt-1 text-[13px] space-y-2 pb-2">
                                    <li className="cursor-pointer hover:text-black py-1">Kurti</li>
                                    <li className="cursor-pointer hover:text-black py-1">Saree</li>
                                    <li className="cursor-pointer hover:text-black py-1">Jeans</li>
                                    <li className="cursor-pointer hover:text-black py-1">Tops</li>
                                    <li className="cursor-pointer hover:text-black py-1">Dresses</li>
                                </ul>
                            )}
                        </li>

                        {/* Other Menu Items */}
                        <li className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100">
                            <FiClock className="text-[16px]" />
                            <span>New Arrivals</span>
                        </li>

                        <li className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100">
                            <FiTrendingUp className="text-[16px]" />
                            <span>Trending</span>
                        </li>

                        <li
                            onClick={() => {
                                router.push('/product/allProducts');
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100"
                        >
                            <FiBox className="text-[16px]" />
                            <span>All Products</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Call Us Drawer (Right Sidebar) */}
            <div className={`fixed top-0 right-0 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isCallDrawerOpen ? "translate-x-0" : "translate-x-full"
                } ${isMobile ? "w-4/5 max-w-sm" : "w-full max-w-sm"}`}>

                <div className="flex justify-between items-center px-4 md:px-6 py-12 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-black">Contact Us</h2>
                    <button
                        onClick={() => setIsCallDrawerOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="px-4 md:px-6 py-6">
                    <p className="text-sm text-gray-600 mb-6">
                        Wherever you are, our Factory Finds team will be delighted to assist you.
                    </p>

                    <div className="space-y-4 text-sm text-gray-800">
                        <a
                            href="tel:+919027661442"
                            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            <FaPhoneAlt className="text-green-600" />
                            <span>+91 90276 61442</span>
                        </a>

                        <a
                            href="mailto:factoryfinds.business@gmail.com"
                            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            <MdEmail className="text-red-600" />
                            <span>Send an Email</span>
                        </a>

                        <a
                            href="https://wa.me/919027661442"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            <FaWhatsapp className="text-green-600" />
                            <span>WhatsApp</span>
                        </a>

                        <hr className="my-6" />

                        <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer">
                            <FaPeopleArrows className="text-blue-600" />
                            <span>Need Help?</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer">
                            <FaQuestion className="text-purple-600" />
                            <span>FAQ</span>
                        </div>
                    </div>
                </div>
            </div>

            <LoginDrawer isOpen={isLoginDrawerOpen} onClose={() => setIsLoginDrawerOpen(false)} />
        </>
    );
};

export default Navbar;