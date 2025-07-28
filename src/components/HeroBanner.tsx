"use client";
import Image from "next/image";
import backgroundImg1 from "@/photos/Hero Image.png";

export default function HeroBanner() {
  return (
    <section className="relative w-full aspect-[16/20] md:aspect-[16/9] lg:h-screen lg:aspect-auto overflow-hidden">
      <Image
        src={backgroundImg1}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </section>
  );
}