// components/TrustBadges.tsx
"use client";

export default function TrustBadges() {
  const badges = [
    { icon: "✓", text: "Secure Checkout" },
    { icon: "↺", text: "Returns Available" },
    { icon: "₹", text: "Easy Checkout" },
    { icon: "⭐", text: "Premium Quality" },
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center mb-3 text-lg sm:text-xl font-light">
                {badge.icon}
              </div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.15em] text-gray-700 font-normal">
                {badge.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
