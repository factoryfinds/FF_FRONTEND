// components/WhyChooseUs.tsx
"use client";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Premium Fabric",
      description: "240 GSM combed cotton for superior softness and durability",
      icon: "◆",
    },
    {
      title: "Perfect Fit",
      description: "Designed for Indian body types with reinforced stitching",
      icon: "◇",
    },
    {
      title: "No Compromise",
      description: "Pre-shrunk, fade-resistant, and built to last seasons",
      icon: "◈",
    },
    {
      title: "Easy Returns",
      description: "7-day hassle-free returns if you're not completely satisfied",
      icon: "◉",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-12 h-px bg-black mx-auto mb-6 opacity-60" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">
            Why Factory Finds
          </h2>
          <p className="text-sm tracking-[0.15em] uppercase text-gray-500 font-normal">
            Built Different
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="flex items-start justify-center md:justify-start mb-4">
                <span className="text-3xl text-gray-900 mr-4">{feature.icon}</span>
                <div>
                  <h3 className="text-base sm:text-lg uppercase tracking-[0.15em] font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed tracking-wide font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
