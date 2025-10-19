
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { notifyUser } from "../../utlis/api";

const MainScreen = () => {
  const router = useRouter();
  const [isLoading, {/*setIsLoading*/}] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Memoize slides to prevent recreation on every render
  const slides = useMemo(() => [
    {
      id: 1,
      type: 'discount',
      gradient: 'from-[#ffffff] via-[#f0f0f0] to-[#dbe8f2]',
    },
    {
      id: 2,
      type: 'combo',
      gradient: 'from-[#fff5f0] via-[#ffe4d6] to-[#ffd4b8]',
    },
  ], []); // Empty dependency array - slides never change

  // Memoize slideCount to avoid accessing .length repeatedly
  const slideCount = useMemo(() => slides.length, [slides.length]);

  // Auto-slide with performance optimization
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000); // Changed back to 5 seconds for better readability

    return () => clearInterval(interval);
  }, [isPaused, slideCount]); // Only recreate when pause state or slideCount changes

  // Memoized navigation handler
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Memoized handlers for mouse events
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    const result = await notifyUser(email);
    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        closeDialog();
      }, 3000);
    } else {
      setEmailError(result.message);
    }

    setTimeout(() => {
      setIsDialogOpen(false);
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setIsSubmitted(false);
    setEmail("");
    setEmailError("");
  }, []);

  // Memoized navigation handlers
  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const handleShopClick = useCallback(() => {
    router.push('/product/allProducts');
  }, [router]);

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      {/* Premium Email Notification Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative bg-white mx-4 max-w-md w-full border border-gray-200 shadow-2xl">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close dialog"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 sm:p-10">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-8 h-px bg-black mx-auto mb-6 opacity-60" />
                    <h3 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
                      Join The Launch
                    </h3>
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 leading-loose">
                      Be the first to discover
                      <br />
                      our premium collection
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="Enter your email address"
                        className={`w-full px-0 py-3 text-sm tracking-wide bg-transparent border-0 border-b ${
                          emailError ? 'border-red-400' : 'border-gray-300'
                        } focus:border-black focus:outline-none transition-colors duration-300 placeholder-gray-500`}
                        autoComplete="email"
                        autoFocus
                      />
                      {emailError && (
                        <p className="mt-2 text-xs text-red-500 tracking-wide">{emailError}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="group relative w-full px-6 py-3 text-xs tracking-[0.15em] font-light uppercase text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out overflow-hidden"
                      >
                        <span className="relative z-10">Notify Me</span>
                        <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </button>
                    </div>
                  </form>

                  <div className="w-8 h-px bg-black mx-auto mt-8 opacity-60" />
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <div className="w-8 h-px bg-black mx-auto mb-6 opacity-60" />

                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-black flex items-center justify-center">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
                      You&apos;re In
                    </h3>
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 leading-loose mb-6">
                      You will be notified the moment
                      <br />
                      our premium collection goes live
                    </p>

                    <p className="text-xs tracking-wide text-gray-500">
                      Check your email for confirmation
                    </p>

                    <div className="w-8 h-px bg-black mx-auto mt-8 opacity-60" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Optimized */}
      <div
        className="relative w-full min-h-[70dvh] sm:min-h-[80dvh] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 1: Discount Offer */}
          <section
            className={`relative w-full min-h-[70dvh] sm:min-h-[80dvh] flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-b ${slides[0].gradient} text-center`}
            aria-label="Discount offer banner"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15),transparent_70%)] opacity-10" />

            <header className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 w-full">
              <h1 className="text-[1.85rem] xs:text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-bold tracking-[0.05em] xs:tracking-[0.1em] uppercase text-black leading-[1.1] mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)] px-2">
                Big. Bold. <span className="block xs:inline">Better Deals.</span>
              </h1>

              <p className="text-base xs:text-lg sm:text-2xl md:text-3xl font-semibold text-black mb-3 tracking-wide px-2">
                Up to <span className="text-red-500">40% Off</span> <span className="block xs:inline">+ Extra 5%</span>
              </p>

              <p className="text-[9px] xs:text-[10px] sm:text-sm text-black/80 uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.25em] mb-6 sm:mb-8 px-2">
                Auto-Applied • No Code • Limited
              </p>

              <button
                onClick={handleShopClick}
                className="px-5 xs:px-8 sm:px-10 py-2.5 xs:py-3 text-[10px] xs:text-xs sm:text-base tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                aria-label="Shop Diwali sale collection"
              >
                SHOP SALE
              </button>

              <p className="text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-black/70 mt-6 font-light">
                Factory Finds — Designed to Stand Out
              </p>
            </header>

            <div className="hidden sm:block absolute top-6 left-6 w-6 h-6 border-l border-t border-black/30" />
            <div className="hidden sm:block absolute bottom-6 right-6 w-6 h-6 border-r border-b border-black/30" />
          </section>

          {/* SLIDE 2: Buy 2 Get 1 Free - MOBILE OPTIMIZED */}
          <section
            className={`relative w-full min-h-[70dvh] sm:min-h-[80dvh] flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-b ${slides[1].gradient} text-center`}
            aria-label="Buy 2 Get 1 Free offer banner"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.1),transparent_70%)] opacity-20" />

            <header className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 w-full">
              {/* Badge - Ultra Small Screen Optimized */}
              <div className="inline-block bg-red-600 text-white px-2.5 py-1.5 text-[9px] xs:text-[10px] sm:text-sm uppercase tracking-wider font-bold mb-3 sm:mb-4 rounded-full shadow-lg max-w-[95%] sm:max-w-none break-words text-center leading-tight">
                🎁 Diwali Special
              </div>

              <h1 className="text-[1.75rem] xs:text-[2.2rem] sm:text-[3.5rem] md:text-[4rem] font-bold tracking-[0.02em] xs:tracking-[0.05em] sm:tracking-[0.1em] uppercase text-black leading-[1.1] mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)] px-2">
                Buy 2 Get 1 <span className="text-orange-600 block xs:inline">FREE</span>
              </h1>

              <p className="text-sm xs:text-base sm:text-xl md:text-2xl font-medium text-black/90 mb-2 tracking-wide px-2">
                Mix & Match 3 Tees
              </p>

              <p className="text-[11px] xs:text-xs sm:text-base text-black/70 mb-5 sm:mb-6 max-w-xl mx-auto leading-relaxed px-3 sm:px-4">
                Choose free tee after adding 2. Pick size at checkout.
              </p>

              {/* How it works - Ultra Compact for Small Screens */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 mb-6 sm:mb-8 text-[9px] xs:text-[10px] sm:text-sm px-2">
                <div className="flex items-center gap-1.5 xs:gap-2">
                  <span className="bg-black text-white w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0">1</span>
                  <span className="text-black/80 uppercase tracking-wide sm:tracking-wider whitespace-nowrap">Buy 2 Products</span>
                </div>
                <span className="hidden sm:inline text-black/40">→</span>
                <div className="flex items-center gap-1.5 xs:gap-2">
                  <span className="bg-black text-white w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0">2</span>
                  <span className="text-black/80 uppercase tracking-wide sm:tracking-wider whitespace-nowrap">You’ll get a confirmation message</span>
                </div>
                <span className="hidden sm:inline text-black/40">→</span>
                <div className="flex items-center gap-1.5 xs:gap-2">
                  <span className="bg-black text-white w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0">3</span>
                  <span className="text-black/80 uppercase tracking-wide sm:tracking-wider whitespace-nowrap">Choose Your Free T-Shirt</span>
                </div>
              </div>

              <button
                onClick={handleShopClick}
                className="px-4 xs:px-6 sm:px-10 py-2.5 xs:py-3 text-[10px] xs:text-xs sm:text-base tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold bg-orange-600 text-white border border-orange-600 hover:bg-white hover:text-orange-600 transition-all duration-300 shadow-[0_4px_10px_rgba(255,100,0,0.3)]"
                aria-label="Shop combo offer"
              >
                BUILD COMBO
              </button>

              <p className="text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-black/60 mt-6 font-light">
                Limited Time • While Stocks Last
              </p>
            </header>

            <div className="hidden sm:block absolute top-6 left-6 w-6 h-6 border-l border-t border-orange-600/40" />
            <div className="hidden sm:block absolute bottom-6 right-6 w-6 h-6 border-r border-b border-orange-600/40" />
          </section>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-black w-8'
                  : 'bg-black/30 hover:bg-black/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation - ACCESSIBILITY FIXED (44x44px minimum) */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm text-xl sm:text-2xl"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm text-xl sm:text-2xl"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </>
  );
};

export default MainScreen;