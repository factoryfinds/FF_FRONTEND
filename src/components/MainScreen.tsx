"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, memo } from "react";
import { notifyUser } from "../../utlis/api";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  bgGradient: string;
  accentText: string;
  buttonColor: string;
  textAccent: string;
  heroImage?: string; // ← STRING, not StaticImageData anymore
}

const SLIDES: readonly Slide[] = [
  {
    id: 1,
    title: "The New Essential",
    subtitle: "                                                                              ",
    description: "                                                                            ",
    buttonLabel: "Shop Now",
    bgGradient: "",
    accentText: "",
    buttonColor: "black",
    textAccent: "black",
    heroImage: "https://res.cloudinary.com/djmednwcm/image/upload/v1761646521/DSC06216_tvzfm1.jpg",
  },
  {
    id: 2,
    title: "Crafted to Endure",
    subtitle: "Thoughtfully Made",
    description:
      "Not just another tee. Each piece goes through precision stitching and pre-shrunk washing for that perfect, lasting fit.",
    buttonLabel: "Shop Now",
    bgGradient:
      "bg-gradient-to-b from-[#fffaf6] via-[#fef3eb] to-[#fbe8da]",
    accentText: "Limited Drop • Factory Finds Originals",
    buttonColor: "orange-600",
    textAccent: "orange-600",
    heroImage: "https://res.cloudinary.com/djmednwcm/image/upload/v1761646276/DSC06169_r5wtot.jpg"
  },
] as const;

const EmailDialog = memo(({
  isOpen,
  onClose,
  isSubmitted
}: {
  isOpen: boolean;
  onClose: () => void;
  isSubmitted: boolean;
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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
      setTimeout(() => onClose(), 3000);
    } else {
      setEmailError(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white mx-4 max-w-md w-full border border-gray-200 shadow-2xl rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
          aria-label="Close dialog"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
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
                  Be the first to discover <br /> our premium collection
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
                    className={`w-full px-0 py-3 text-sm tracking-wide bg-transparent border-0 border-b ${emailError
                        ? "border-red-400"
                        : "border-gray-300 focus:border-black"
                      } focus:outline-none transition-colors duration-300 placeholder-gray-500`}
                    autoComplete="email"
                    autoFocus
                  />
                  {emailError && (
                    <p className="mt-2 text-xs text-red-500 tracking-wide">
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="group relative w-full px-6 py-3 text-xs tracking-[0.15em] font-light uppercase text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out overflow-hidden"
                >
                  <span className="relative z-10">Notify Me</span>
                  <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-8 h-px bg-black mx-auto mb-6 opacity-60" />
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-black flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
                You&apos;re In
              </h3>
              <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 leading-loose mb-6">
                You will be notified the moment <br />
                our premium collection goes live
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EmailDialog.displayName = "EmailDialog";

const MainScreen = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = SLIDES.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slideCount]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setIsSubmitted(false);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const handleShopClick = useCallback(() => {
    router.push("/product/allProducts");
  }, [router]);

  return (
    <>
      <EmailDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        isSubmitted={isSubmitted}
      />

      <div
        className="relative w-full h-screen sm:h-[90vh] overflow-hidden flex items-stretch"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <section
              key={slide.id}
              className={`relative w-full flex-shrink-0 flex flex-col justify-center items-center text-center ${slide.heroImage ? '' : slide.bgGradient
                }`}
            >
              {slide.heroImage && (
                <>
                  <Image
                    src={slide.heroImage}
                    alt={slide.title}
                    fill
                    priority={slide.id === 1}
                    quality={90}
                    className="object-cover"
                    unoptimized // ← Add this if you're using Cloudinary's optimizations
                  />
                  <div className="absolute inset-0 bg-black/30 z-[1]" />
                </>
              )}

              <header className="relative z-10 max-w-3xl mx-auto px-6 w-full">
                {slide.subtitle && (
                  <p className={`uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 font-light ${slide.heroImage ? 'text-white/80' : 'text-black/60'
                    }`}>
                    {slide.subtitle}
                  </p>
                )}

                <h1 className={`text-[1.5rem] xs:text-[3.5rem] sm:text-[3.5rem] md:text-[6rem] font-bold tracking-tight leading-[1.1] mb-10 ${slide.heroImage ? 'text-white' : 'text-black'
                  }`}>
                  {slide.title}
                </h1>

                {slide.description && (
                  <p className={`text-sm sm:text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed ${slide.heroImage ? 'text-white/90' : 'text-black/70'
                    }`}>
                    {slide.description}
                  </p>
                )}

                <button
                  onClick={handleShopClick}
                  className={`px-12 py-4 text-xs sm:text-sm tracking-[0.25em] uppercase font-light ${slide.heroImage
                      ? 'bg-white text-black border border-white hover:bg-transparent hover:text-white'
                      : 'bg-black text-white border border-black hover:bg-white hover:text-black'
                    } transition-all duration-300 ease-in-out`}
                >
                  {slide.buttonLabel}
                </button>

                {slide.accentText && (
                  <p className={`mt-8 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-light ${slide.heroImage ? 'text-white/70' : 'text-black/60'
                    }`}>
                    {slide.accentText}
                  </p>
                )}
              </header>
            </section>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handlePrevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-5 sm:h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 text-xl sm:text-2xl backdrop-blur-sm"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-5 sm:h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all duration-300 text-xl sm:text-2xl backdrop-blur-sm"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </>
  );
};

export default memo(MainScreen);