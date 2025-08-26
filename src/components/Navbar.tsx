"use client";

import { useState, useRef, useEffect } from "react";
import {
    FiMenu,
    FiSearch,
    FiPhone,
    FiUser,
    FiHeart,
    FiX,
    // FiUsers,
    FiClock,
    FiTrendingUp,
    FiBox,
    // FiChevronDown,
    // FiChevronUp,
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

// ✅ Define user interface for better type safety
interface User {
    role?: string;
    [key: string]: unknown;
}

// ✅ Animated Brand Text Component
const AnimatedBrandText = ({ onClick }: { onClick: () => void }) => {
    const languages = [
        { text: "FACTORY FINDS", lang: "English" },
        { text: "फैक्टरी फाइंड्स", lang: "Hindi" },
        { text: "فیکٹری فائنڈز", lang: "Urdu" },
        { text: "FACTORY FINDS", lang: "English" },
        { text: "फैक्टरी फाइंड्स", lang: "Hindi" },
        { text: "ફેક્ટરી ફાઇન્ડ્સ", lang: "Gujarati" },
        { text: "फैक्टरी फाइंड्स", lang: "Marathi" },
        { text: "FACTORY FINDS", lang: "English" },
        { text: "फैक्टरी फाइंड्स", lang: "Hindi" },
        { text: "ఫ్యాక్టరీ ఫైండ్స్", lang: "Telugu" },
        { text: "ಫ್ಯಾಕ್ಟರಿ ಫೈಂಡ್ಸ್", lang: "Kannada" },
        { text: "FACTORY FINDS", lang: "English" },
        { text: "फैक्टरी फाइंड्स", lang: "Hindi" },
        { text: "ফেক্টরি ফাইন্ডস", lang: "Assamese" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % languages.length);
                setIsVisible(true);
            }, 300); // Half second for fade out

        }, 2500); // Change every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wide cursor-pointer font-semibold group transition-all duration-300 hover:scale-105 hover:text-black ${isVisible
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform -translate-y-2'
                    }`}
                onClick={onClick}
                style={{
                    fontFamily: languages[currentIndex].lang === 'Tamil' || languages[currentIndex].lang === 'Telugu' || languages[currentIndex].lang === 'Kannada' || languages[currentIndex].lang === 'Malayalam'
                        ? 'system-ui, -apple-system, sans-serif'
                        : 'inherit'
                }}
            >
                {languages[currentIndex].text}
            </div>
        </div>
    );
};

const Navbar = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    // const [showMen, setShowMen] = useState(false);
    // const [showWomen, setShowWomen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // ✅ Search functionality states
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);

    const accountRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // ✅ Search keywords for suggestions
    const keywords = [
        "tshirt", "t-shirt", "oversized tshirt", "regular fit tshirt", "polo", "baggy tshirt",
        "sweatshirt", "jacket", "hoodie", "kurti", "jeans", "shirt", "top", "co-ord",
        "saree", "dress", "trouser", "formal shirt", "casual wear", "ethnic wear"
    ];

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
        function handleClickOutside(event: MouseEvent) {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close search dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDesktopSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Update suggestions as user types
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim()) {
                const matches = keywords.filter(keyword =>
                    keyword.toLowerCase().includes(query.toLowerCase())
                );
                setSuggestions(matches.slice(0, 5)); // top 5 suggestions
            } else {
                setSuggestions([]);
            }
        }, 200);
        return () => clearTimeout(timeout);
    }, [query]);

    // Check auth state on component mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userString = localStorage.getItem("user");
        const user: User | null = userString ? JSON.parse(userString) : null;

        setIsLoggedIn(!!token);
        setRole(user?.role || null);
    }, []);

    // Update auth state when login drawer opens/closes
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userString = localStorage.getItem("user");
        const user: User | null = userString ? JSON.parse(userString) : null;

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

    // ✅ Search handler function
    const handleSearch = (value: string) => {
        if (!value.trim()) return;

        // Navigate to search page with query
        router.push(`/product/search?q=${encodeURIComponent(value.trim())}`);

        // Reset states
        setQuery('');
        setSuggestions([]);
        setIsDesktopSearchOpen(false);
        setIsSearchOpen(false);
    };

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
        if (!isSearchOpen) {
            setQuery(''); // Reset query when opening
        }
    };

    return (
        <>
            {/* Fixed Navbar Container with Gradient */}
            <div className="fixed top-0 left-0 right-0 z-50 ">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-white"></div>

                {/* Overlay for mobile when drawers are open */}
                {isMobile && (isMenuOpen || isCallDrawerOpen) && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsCallDrawerOpen(false);
                        }}
                    />
                )}

                {/* Top Navbar */}
                <nav className="w-full h-20 md:h-28 px-4 md:px-8 relative z-30">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Section */}
                        <div className="flex items-center gap-4 md:gap-10 text-sm text-black font-medium flex-1">
                            <div
                                className="flex items-center gap-2 cursor-pointer font-light group transition-transform duration-300 hover:scale-105 hover:text-black"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <FiMenu size={18} />
                                <span className="hidden sm:inline">Menu</span>
                            </div>

                            {/* ✅ Desktop Search with Dropdown */}
                            <div className="hidden md:block relative" ref={searchRef}>
                                <div
                                    className="flex items-center gap-2 cursor-pointer font-light group transition-transform duration-300 hover:scale-105 hover:text-black"
                                    onClick={() => setIsDesktopSearchOpen(!isDesktopSearchOpen)}
                                >
                                    <FiSearch size={18} />
                                    <span>Search</span>
                                </div>

                                {/* Desktop Search Dropdown */}
                                {isDesktopSearchOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                                        <div className="p-4">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                                                <FiSearch size={16} className="text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                                    className="bg-transparent flex-1 outline-none text-sm"
                                                    autoFocus
                                                />
                                                {query && (
                                                    <button
                                                        onClick={() => setQuery('')}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <FiX size={14} className="text-gray-500" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Search Button */}
                                            {query && (
                                                <button
                                                    onClick={() => handleSearch(query)}
                                                    className="w-full mb-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                                                >
                                                    Search for &quot;{query}&quot;
                                                </button>
                                            )}

                                            {/* Suggestions */}
                                            {suggestions.length > 0 && (
                                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Suggestions</p>
                                                    {suggestions.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm rounded transition-colors flex items-center gap-2"
                                                            onClick={() => handleSearch(item)}
                                                        >
                                                            <FiSearch size={14} className="text-gray-400" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Popular searches when no query */}
                                            {!query && (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Popular Searches</p>
                                                    {['tshirt', 'jeans', 'kurti', 'jacket', 'saree'].map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm rounded transition-colors flex items-center gap-2"
                                                            onClick={() => handleSearch(item)}
                                                        >
                                                            <FiTrendingUp size={14} className="text-gray-400" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Search Icon - shows when search is closed */}
                            {isMobile && !isSearchOpen && (
                                <div
                                    className="flex items-center gap-2 cursor-pointer font-light group transition-transform duration-300 hover:scale-105 hover:text-black md:hidden"
                                    onClick={toggleMobileSearch}
                                >
                                    <FiSearch size={18} />
                                </div>
                            )}
                        </div>

                        {/* Center: Animated Brand - Absolutely centered */}
                        <AnimatedBrandText onClick={() => router.push("/")} />

                        {/* Right Section */}
                        <div className="flex items-center gap-3 md:gap-10 text-sm text-black font-medium flex-1 justify-end">

                            {/* Admin link (desktop only) */}
                            {role === "admin" && (
                                <div
                                    className="hidden md:block cursor-pointer font-light hover:scale-105 transition-colors"
                                    onClick={() => router.push("/admin/dashboard")}
                                >
                                    Admin
                                </div>
                            )}

                            {/* Call Us – shown only on desktop now */}
                            <div
                                className="hidden md:flex items-center gap-1 cursor-pointer font-light hover:scale-105 transition-colors"
                                onClick={() => setIsCallDrawerOpen(true)}
                            >
                                <span>Contact Us</span>
                            </div>

                            {/* Heart Icon – shown only on desktop */}
                            <FiHeart
                                size={18}
                                className="hidden md:block cursor-pointer font-light hover:scale-105 transition-colors"
                                onClick={() => {
                                    setIsAccountOpen(false);
                                    router.push("/profile/wishlist");
                                }}
                            />

                            {/* Account Dropdown */}
                            <div className="relative" ref={accountRef}>
                                <FiUser
                                    size={18}
                                    className="cursor-pointer hover:scale-105 transition-colors"
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                />

                                {isAccountOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        {isLoggedIn ? (
                                            <ul className="text-sm text-gray-800 py-2">
                                                {/* Admin Dashboard – Mobile only */}
                                                {role === "admin" && (
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden flex items-center gap-2"
                                                        onClick={() => {
                                                            setIsAccountOpen(false);
                                                            router.push("/admin/dashboard");
                                                        }}
                                                    >
                                                        <FiSettings size={16} />
                                                        Admin Dashboard
                                                    </li>
                                                )}
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
                                                {/* ❤️ Wishlist – Mobile only */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsAccountOpen(false);
                                                        router.push("/profile/wishlist");
                                                    }}
                                                >
                                                    <FiHeart size={16} />
                                                    Wishlist
                                                </li>
                                                {/* 📞 Call Us – Mobile only */}
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden flex items-center gap-2"
                                                    onClick={() => {
                                                        setIsCallDrawerOpen(true);
                                                        setIsAccountOpen(false);
                                                    }}
                                                >
                                                    <FiPhone size={16} />
                                                    Contact Us
                                                </li>

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
                                                <p className="mb-2 text-center text-gray-800">You&rsquo;re not logged in.</p>
                                                <button
                                                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
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

                {/* ✅ Mobile Search Bar - Enhanced with suggestions */}
                <div className={`md:hidden relative z-20 overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-16 py-3' : 'max-h-0 py-0'
                    }`}>
                    <div className="relative px-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <FiSearch size={16} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                className="bg-transparent flex-1 outline-none text-sm text-black placeholder-gray-500"
                                autoFocus={isSearchOpen}
                            />
                            {query && (
                                <button
                                    onClick={() => handleSearch(query)}
                                    className="px-2 py-1 bg-black text-white rounded text-xs font-medium"
                                >
                                    Go
                                </button>
                            )}
                            <button
                                onClick={toggleMobileSearch}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <FiX size={16} className="text-gray-500" />
                            </button>
                        </div>
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
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    <ul className="flex flex-col gap-1 px-4 md:px-6 py-4 text-gray-900 text-sm">
                        {/* Men Category */}
                        {/* <li>
                            <div
                                className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
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
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Shirt</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">T-Shirt</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Jeans</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Trouser</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Jacket</li>
                                </ul>
                            )}
                        </li> */}

                        {/* Women Category */}
                        {/* <li>
                            <div
                                className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
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
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Kurti</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Saree</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Jeans</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Tops</li>
                                    <li className="cursor-pointer hover:text-black py-1 transition-colors">Dresses</li>
                                </ul>
                            )}
                        </li> */}

                        {/* Other Menu Items */}
                        <li className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                            <FiClock className="text-[16px]" />
                            <span>New Arrivals</span>
                        </li>

                        <li
                            onClick={() => {
                                router.push('/product/trending');
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                            <FiTrendingUp className="text-[16px]" />
                            <span>Trending</span>
                        </li>

                        <li
                            onClick={() => {
                                router.push('/product/allProducts');
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors"
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
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
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

                        <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                            <FaPeopleArrows className="text-blue-600" />
                            <span>Need Help?</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
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