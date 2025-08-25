// Make sure this file is named MainScreen.tsx (not .js)

"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import img1 from "@/photos/t-shirt-cateogry.png";
import img2 from "@/photos/JACKET.jpg";
import img3 from "@/photos/jacket-category.png";
import img4 from "@/photos/SHIRTS.jpg";
import img5 from "@/photos/TOPS.jpg";
import img6 from "@/photos/jeans-category.png";

interface CategoryItem {
  title: string;
  image: StaticImageData; // or StaticImageData if you import it from 'next/image'
  slug: string;
}

const MainScreen = () => {
  const router = useRouter();

  const items: CategoryItem[] = [
    { title: "T-SHIRTS", image: img1, slug: "t-shirts" },
    { title: "SHIRTS", image: img4, slug: "shirts" },
    { title: "JEANS", image: img3, slug: "jeans" },
    { title: "TROUSERS", image: img6, slug: "trousers" },
    { title: "TOPS", image: img5, slug: "tops" },
    { title: "JACKETS", image: img2, slug: "jackets" },
  ];

  const handleCategoryClick = (slug: string): void => {
    router.push(`/product/category/${slug}`);
  };

  return (
    <section className="w-full py-2 px-2 mb-25  sm:px-6 bg-white text-black">
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
              className="group cursor-pointer relative w-full aspect-[3/4] bg-gray-100 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              onClick={() => handleCategoryClick(item.slug)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
                loading={idx < 3 ? "eager" : "lazy"} // Load first 3 immediately
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Add blur
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              {/* Title on bottom center */}
              <div className="absolute bottom-4 w-full flex justify-center">
                <div className="bg-white/80 group-hover:bg-white/90 px-4 py-1 rounded-sm transition-all duration-300">
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
  );
};

export default MainScreen;