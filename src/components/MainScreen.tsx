// Make sure this file is named MainScreen.tsx (not .js)

"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingOverlay from "./LoadingOverlay"; // Adjust path as needed
import img1 from "@/photos/t-shirt-cateogry.png";
import img2 from "@/photos/JACKET.jpg";
import img3 from "@/photos/jacket-category.png";
import img4 from "@/photos/SHIRTS.jpg";
import img5 from "@/photos/TOPS.jpg";
import img6 from "@/photos/jeans-category.png";

interface CategoryItem {
  title: string;
  image: StaticImageData;
  slug: string;
}

const MainScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const items: CategoryItem[] = [
    { title: "T-SHIRTS", image: img1, slug: "t-shirts" },
    { title: "SHIRTS", image: img4, slug: "shirts" },
    { title: "JEANS", image: img3, slug: "jeans" },
    { title: "TROUSERS", image: img6, slug: "trousers" },
    { title: "TOPS", image: img5, slug: "tops" },
    { title: "JACKETS", image: img2, slug: "jackets" },
  ];

  const handleCategoryClick = async (slug: string): Promise<void> => {
    try {
      // Show loading overlay
      setIsLoading(true);
      
      // Add a small delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to the category page
      router.push(`/product/category/${slug}`);
      
      // Note: The loading will automatically hide when the new page loads
      // But if navigation fails, we should hide it
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />
      
      <section className="w-full py-2 px-2 mb-25 sm:px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center px-4 mt-12 mb-16">
            <p className="uppercase text-xs sm:text-xs tracking-wider font-light text-gray-500">
              Defining Your Signature Style
            </p>
            <h2 className="text-3xl font-light mt-2">
              The Collection
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className={`group cursor-pointer relative w-full aspect-[3/4] bg-gray-100 overflow-hidden transition-all duration-300 ${
                  isLoading 
                    ? 'pointer-events-none opacity-75' 
                    : 'hover:scale-[1.02]'
                }`}
                onClick={() => handleCategoryClick(item.slug)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  loading={idx < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNzUK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD/2Q=="
                />

                {/* Dark overlay on hover - disabled when loading */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isLoading 
                    ? 'bg-black/10' 
                    : 'bg-black/0 group-hover:bg-black/20'
                }`} />

                {/* Title on bottom center */}
                <div className="absolute bottom-4 w-full flex justify-center">
                  <div className={`px-4 py-1 rounded-sm transition-all duration-300 ${
                    isLoading
                      ? 'bg-white/70'
                      : 'bg-white/80 group-hover:bg-white/90'
                  }`}>
                    <h3 className="text-sm sm:text-base font-semibold text-black tracking-wide text-center">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainScreen;