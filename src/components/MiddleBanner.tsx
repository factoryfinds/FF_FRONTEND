"use client";
import Image from "next/image";
import backgroundImg1 from "@/photos/middleBanner1.webp";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Image
          src={backgroundImg1}
          alt="Background"
          fill
          className="object-cover object-center md:object-[center_top]"
          priority
          quality={85}
          placeholder="blur"
        />
      </motion.div>

      {/* A centered, elegant overlay with text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4 bg-black/20">
        <h1 className="text-4xl md:text-6xl font-extralight tracking-widest text-center uppercase">
          Crafted for a new era
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide mt-4 text-center">
          The finest materials, the perfect fit.
        </p>
      </div>
    </section>
  );
}