import { memo } from "react";
import { Award, ShieldCheck, Truck, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

const BADGES: readonly Badge[] = [
  { 
    icon: ShieldCheck, 
    title: "Authenticity Guaranteed",
    description: "Every piece is authentic and verified"
  },
  { 
    icon: Truck, 
    title: "Complimentary Shipping",
    description: "Free delivery on all orders"
  },
  { 
    icon: Repeat, 
    title: "Effortless Exchange",
    description: "hassle-free Exchange"
  },
  { 
    icon: Award, 
    title: "Premium Quality",
    description: "Handpicked collections"
  },
] as const;

const TESTIMONIALS: readonly Testimonial[] = [
  {
    text: "Exceptional quality and service",
    author: "Priya M.",
    role: "Verified Buyer"
  },
  {
    text: "The most elegant pieces",
    author: "Rahul K.",
    role: "Style Enthusiast"
  },
  {
    text: "Worth every rupee",
    author: "Aisha S.",
    role: "Fashion Curator"
  },
] as const;

// Memoized Badge Item with Luxury Design
const LuxuryBadgeItem = memo(({ badge }: { badge: Badge }) => {
  const Icon = badge.icon;
  
  return (
    <div className="group relative">
      <div className="flex flex-col items-center text-center space-y-3 transition-all duration-500">
        {/* Icon Container with Minimalist Border */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center transition-all duration-300 group-hover:border-gray-600 group-hover:scale-105">
            <Icon 
              className="w-7 h-7 text-gray-900 transition-colors duration-300 group-hover:text-gray-600" 
              strokeWidth={1.5}
              aria-hidden="true" 
            />
          </div>
          {/* Subtle hover effect ring */}
          <div className="absolute inset-0 rounded-full bg-gray-900 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
        
        {/* Text Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
            {badge.title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-[200px]">
            {badge.description}
          </p>
        </div>
      </div>
    </div>
  );
});

LuxuryBadgeItem.displayName = "LuxuryBadgeItem";

// Memoized Testimonial Card
const TestimonialCard = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex flex-col items-center text-center px-4">
    <div className="mb-3">
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <p className="text-sm italic text-gray-700 mb-3 leading-relaxed">
      &quot;{testimonial.text}&quot;
    </p>
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-gray-900 tracking-wide">
        {testimonial.author}
      </p>
      <p className="text-xs text-gray-500">
        {testimonial.role}
      </p>
    </div>
  </div>
));

TestimonialCard.displayName = "TestimonialCard";

// Main Luxury Badges Section
const LuxuryBadgesSection = memo(() => (
  <section 
    className="bg-white border-t border-b border-gray-200 py-12 sm:py-16"
    aria-labelledby="trust-badges-heading"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="trust-badges-heading" className="sr-only">Our Commitments</h2>
      
      {/* Badges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
        {BADGES.map((badge, index) => (
          <LuxuryBadgeItem key={`badge-${index}`} badge={badge} />
        ))}
      </div>

      {/* Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />

      {/* Testimonials Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase mb-2">
            Trusted by Connoisseurs
          </h3>
          <div className="flex justify-center items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={`testimonial-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  </section>
));

LuxuryBadgesSection.displayName = "LuxuryBadgesSection";

// Understated Footer Strip
const LuxuryFooterStrip = memo(() => (
  <section 
    className="bg-gray-900 py-3"
    aria-label="Additional information"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs text-gray-400 uppercase tracking-widest">
        <span>Secure Payments</span>
        <span className="hidden sm:inline text-gray-700">•</span>
        <span>Nationwide Shipping</span>
        <span className="hidden sm:inline text-gray-700">•</span>
        <span>Curated Collections</span>
      </div>
    </div>
  </section>
));

LuxuryFooterStrip.displayName = "LuxuryFooterStrip";

// Main Component
export default function TrustBadges() {
  return (
    <>
      {/* <LuxuryBadgesSection /> */}
      <LuxuryFooterStrip />
    </>
  );
}