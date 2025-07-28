"use client";

import Image from "next/image";

const services = [
  {
    title: "Services",
    links: ["Contact Us"],
    image: "/images/service-1.jpg",
  },
  {
    title: "Art of Gifting",
    links: ["Gifts for Women", "Gifts for Men"],
    image: "/images/service-2.jpg",
  },
  {
    title: "Personalisation",
    links: ["Explore"],
    image: "/images/service-3.jpg",
  },
];

export default function PackageService() {
 return (
    <section className="w-full px-4 md:px-20 py-16 bg-white text-black">
      <div className="text-center mb-10">
        <h2 className="text-xl md:text-2xl font-light">Factory Finds Services</h2>
        <p className="text-sm font-light mt-2 leading-relaxed text-gray-700">
          Factory Finds offers complementary wrapping on all orders, carefully packaged<br />
          in the Maison&apos;s iconic boxes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="text-center">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="mt-6 text-sm font-medium">{service.title}</h3>
            <div className="mt-2 space-x-4 text-sm text-blue-700">
              {service.links.map((link, i) => (
                <a key={i} href="#" className="hover:underline">
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}