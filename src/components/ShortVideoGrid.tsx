"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  category: string;
  duration: string;
}

// Sample reels data - Replace with your actual video URLs
const REELS: readonly Reel[] = [
  {
    id: "reel-1",
    videoUrl: "https://res.cloudinary.com/djmednwcm/video/upload/v1761667385/VID-4_vqbsly.mp4",
    thumbnail: "https://res.cloudinary.com/djmednwcm/image/upload/v1761651303/DSC06219_fdfel1.jpg",
    title: "Morning Elegance",
    category: "Get Ready With Me",
    duration: "0:45"
  },
  {
    id: "reel-2",
    videoUrl: "https://res.cloudinary.com/djmednwcm/video/upload/v1761650888/VID-3_ry3gen.mp4",
    thumbnail: "https://res.cloudinary.com/djmednwcm/image/upload/v1761651707/DSC06226_wh983r.jpg",
    title: "Casual Chic",
    category: "Styling Tips",
    duration: "0:03"
  },
  {
    id: "reel-3",
    videoUrl: "https://res.cloudinary.com/djmednwcm/video/upload/v1761650888/VID-3_ry3gen.mp4",
    thumbnail: "https://res.cloudinary.com/djmednwcm/image/upload/v1761651527/DSC06187_b77szh.jpg",
    title: "Evening Glam",
    category: "Get Ready With Me",
    duration: "0:52"
  },
  {
    id: "reel-4",
    videoUrl: "https://res.cloudinary.com/djmednwcm/video/upload/v1761649627/VID-1_bgszhf.mp4",
    thumbnail: "https://res.cloudinary.com/djmednwcm/image/upload/v1761646276/DSC06169_r5wtot.jpg",
    title: "Premium Fabrics",
    category: "Product Showcase",
    duration: "0:41"
  },
  {
    id: "reel-5",
    videoUrl: "https://res.cloudinary.com/djmednwcm/video/upload/v1761650888/VID-3_ry3gen.mp4",
    thumbnail: "https://res.cloudinary.com/djmednwcm/image/upload/v1761668942/DSC06245_vv50er.jpg",
    title: "Minimalist Style",
    category: "Collection Preview",
    duration: "0:36"
  },
] as const;

// Memoized Reel Card Component
const ReelCard = memo(({ 
  reel, 
  isActive, 
  onVideoClick 
}: { 
  reel: Reel; 
  isActive: boolean;
  onVideoClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && isLoaded) {
      videoRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isLoaded]);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
    onVideoClick();
  }, [isPlaying, onVideoClick]);

  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] group">
      <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          poster={reel.thumbnail}
          onLoadedData={handleLoadedData}
          aria-label={`${reel.title} video`}
        >
          <source src={reel.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors duration-300 group"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {!isPlaying && (
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
            </div>
          )}
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-white/80 font-medium">
              {reel.category}
            </p>
            <h3 className="text-sm font-semibold">
              {reel.title}
            </h3>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-medium">
          {reel.duration}
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ReelCard.displayName = "ReelCard";

// Scroll Button Component
const ScrollButton = memo(({ 
  direction, 
  onClick, 
  disabled 
}: { 
  direction: "left" | "right"; 
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute ${direction === "left" ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === "left" ? (
      <ChevronLeft className="w-5 h-5 text-gray-900" />
    ) : (
      <ChevronRight className="w-5 h-5 text-gray-900" />
    )}
  </button>
));

ScrollButton.displayName = "ScrollButton";

// Main Reels Showcase Component
export default function LuxuryReelsShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeReelId, setActiveReelId] = useState<string>(REELS[0].id);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 340;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === "right" ? scrollAmount : -scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    });
  }, []);

  const handleVideoClick = useCallback((reelId: string) => {
    setActiveReelId(reelId);
  }, []);

  return (
    <section 
      className="bg-white py-12 sm:py-16 border-t border-gray-200"
      aria-labelledby="reels-heading"
    >
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Authenticity Showcase
          </p>
          <h2 
            id="reels-heading"
            className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight"
          >
            Behind the Elegance
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
            Witness our craftsmanship and styling in action. Every piece tells a story of quality and refinement.
          </p>
        </div>

        {/* Reels Carousel */}
        <div className="relative">
          <ScrollButton 
            direction="left" 
            onClick={() => scroll("left")} 
            disabled={!canScrollLeft}
          />
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {REELS.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                isActive={activeReelId === reel.id}
                onVideoClick={() => handleVideoClick(reel.id)}
              />
            ))}
          </div>

          <ScrollButton 
            direction="right" 
            onClick={() => scroll("right")} 
            disabled={!canScrollRight}
          />
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 italic">
            Tap any video to play • Sound off for your convenience
          </p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}