"use client";

import Image from "next/image";
import img1 from "@/photos/t-shirt-cateogry.png"
import img2 from "@/photos/jacket-category.png"
import img3 from "@/photos/jeans-category.png"

const MainScreen = () => {
  const items = [
    {
      title: "T-Shirts",
      image:  img1,
    },
    {
      title: "Jeans",
      image: img2,
    },
    {
      title: "Jackets",
      image: img3,
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-center mt-4 mb-20 tracking-wide leading-snug max-w-3xl mx-auto">
          Find Your Signature Look In Our Curated Collection
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {items.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-xl font-light tracking-wide text-center group-hover:text-gray-600 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainScreen;