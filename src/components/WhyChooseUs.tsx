"use client";

import { Link, Star } from "lucide-react";

export default function TrustBuilder() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Premium Rating Display */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-7 h-7 fill-black text-black" />
            ))}
          </div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 mb-3">
            4.8 from Customers
          </h2>
          <p className="text-sm tracking-[0.15em] uppercase text-gray-500">
            All Reviews Verified
          </p>
        </div>

        {/* Customer Gallery - Premium Grid */}
        {/* <div className="mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-black text-black" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Premium Quality Grid - Scannable */}
        <div className="grid sm:grid-cols-2 grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-light mb-3 text-gray-900">240</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-900 mb-2 font-medium">
              GSM Weight
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Premium cotton
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-light mb-3 text-gray-900">94%</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-900 mb-2 font-medium">
              Reorder Rate
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Customers buy again
            </div>
          </div>
          
          {/* <div className="text-center">
            <div className="text-5xl font-light mb-3 text-gray-900">6m</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-900 mb-2 font-medium">
              Guarantee
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              No questions asked
            </div>
          </div> */}
        </div>

        {/* Clean Testimonial Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "Fabric quality is insane. Better than brands at ₹2k.", name: "Arjun M.", city: "Mumbai" },
              { text: "Finally found tees that don't lose shape after wash.", name: "Priya S.", city: "Bangalore" },
              { text: "Bought 5 more. The fit is perfect for my build.", name: "Rahul K.", city: "Delhi" }
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-8 border border-gray-200">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  &quot;{review.text}&quot;
                </p>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                  {review.name} · {review.city}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Guarantee Banner */}
        <div className="bg-black text-white py-12 px-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-4">
            Premium Quality, Guaranteed
          </h3>
          <p className="text-sm text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Pre-shrunk • Fade-resistant • Export quality • Replace within 6 months if it fades, shrinks, or loses shape
          </p>
          <Link
            href="/product/allProducts"
            className="inline-block bg-white text-black py-4 px-10 text-xs uppercase tracking-[0.15em] hover:bg-gray-100 transition-colors"
          >
            Shop Premium Tees
          </Link>
        </div>

      </div>
    </section>
  );
}