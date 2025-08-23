"use client";

import Image from "next/image";
import img1 from "@/photos/t-shirt-cateogry.png";
import img2 from "@/photos/JACKET.jpg";
import img3 from "@/photos/jacket-category.png";
import img4 from "@/photos/SHIRTS.jpg";
import img5 from "@/photos/TOPS.jpg";
import img6 from "@/photos/jeans-category.png";

const MainScreen = () => {
  const items = [
    { title: "T-SHIRTS", image: img1 },
    { title: "SHIRTS", image: img4 },
    { title: "JEANS", image: img3 },
    { title: "TROUSERS", image: img6 },
    { title: "TOPS", image: img5 },
    { title: "JACKETS", image: img2 },
  ];

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
            <div key={idx} className="group cursor-pointer relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

              {/* Title on bottom center */}
              <div className="absolute bottom-4 w-full flex justify-center">
                <div className="bg-white/80 px-4 py-1 rounded-sm">
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
