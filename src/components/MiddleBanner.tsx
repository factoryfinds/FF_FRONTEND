"use client";
import Image from "next/image";
import backgroundImg1 from "@/photos/middleBanner1.webp";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src={backgroundImg1}
        alt="Background"
        fill
        className="object-cover object-center md:object-[center_top] scale-110 md:scale-100"
        priority
        placeholder="blur"
        quality={75}
      />
    </section>

  );
}
