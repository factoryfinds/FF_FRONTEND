// components/FounderStory.tsx
"use client";

export default function FounderStory() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Image Side */}

    

          {/* Text Side */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <div className="w-12 h-px bg-black mb-6 opacity-60" />
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-gray-900 mb-2">
                Our Story
              </h2>
              <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-gray-500 font-normal mb-6">
                Est. 2025
              </p>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-sm sm:text-base font-light">
                After years of settling for overpriced basics or cheap quality, I decided 
                enough was enough. Factory Finds was born from a simple frustration: why 
                can&apos;t we have premium t-shirts at honest prices?
              </p>
              <p className="text-sm sm:text-base font-light">
                We work directly with manufacturers, cutting out middlemen to bring you 
                240 GSM combed cotton tees that actually last. No gimmicks, no BS—just 
                quality fabric and honest pricing.
              </p>
              <p className="text-sm sm:text-base font-light">
                Every tee is designed for Indian climates and body types, because premium 
                shouldn&apos;t mean uncomfortable. That&apos;s our promise.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                — Founder, Factory Finds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
