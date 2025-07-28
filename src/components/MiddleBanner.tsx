"use client";
import Image from "next/image";
import backgroundImg1 from "@/photos/middleBanner.png";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
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
