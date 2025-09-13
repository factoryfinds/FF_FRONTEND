"use client";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  return (
    <>
      {/* Moving Black Ribbon */}
      <div className="bg-black text-white py-4 overflow-hidden">
        <div className="marquee">
          <div className="marquee__inner">
            <span>NATIONWIDE SHIPPING AVAILABLE</span>
            <span>FREE DELIVERY</span>
            <span>FAST & RELIABLE DELIVERY</span>
            <span>SECURE PAYMENT</span>
            <span>NATIONWIDE SHIPPING AVAILABLE</span>
            <span>FREE DELIVERY</span>
            <span>FAST & RELIABLE DELIVERY</span>
            <span>SECURE PAYMENT</span>
            <span>FAST & RELIABLE DELIVERY</span>
            <span>SECURE PAYMENT</span>
            
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm px-6 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

            {/* Country + Manufacturer */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium leading-none">
                <span className="text-xl inline-block">🇮🇳</span>
                <span className="underline">India</span>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Factory Finds</p>
                <p>263153, Rudrapur</p>
                <p>Uttarakhand</p>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Please refer to the product label for specific country of origin for each product.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <p className="font-bold">Contact us</p>
              <div className="space-y-1 break-words">
                <p className="break-all">factoryfinds.business@gmail.com</p>
                <p>+91-9027661442</p>
                <p className="mt-2">For a quicker response, DM us on Instagram</p>
                <p>@factoryfinds.store</p>
                <p>India</p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col items-start md:items-end gap-2 text-sm">
              <a href="https://www.factoryfinds.store/sitemap-0.xml" className="hover:underline">Sitemap</a>
              <button
                onClick={() => router.push("/aboutUs")}
                className="hover:underline text-gray-700 cursor-pointer bg-transparent border-none"
              >
                Legal & Privacy
              </button>
              <button
                onClick={() => router.push("/aboutUs")}
                className="hover:underline text-gray-700 cursor-pointer bg-transparent border-none"
              >
                Return Policy & Size Details
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-6">
            <div className="text-center md:text-left font-semibold tracking-wide text-lg text-gray-800">
              FACTORY FINDS
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              © 2025 Factory Finds. All rights reserved.
            </div>
          </div>
          
        </div>
        
      </footer>
      {/* Bottom Social Links */}
          <div className="flex justify-center gap-8 text-xs font-semibold text-white border-t bg-black py-10 border-gray-100 pt-6">
            <a href="https://www.instagram.com/factoryfinds.store?igsh=d2thdnpmaHBscWN6" className="hover:underline">INSTAGRAM</a>
            <a href="https://youtube.com" className="hover:underline">YOUTUBE</a>
            <a href="https://www.linkedin.com/company/108400263/" className="hover:underline">LINKEDIN</a>
          </div>

      <style jsx>{`
        .marquee {
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        .marquee__inner {
          display: inline-flex;
          animation: marquee 25s linear infinite;
          width: max-content;
        }

        .marquee__inner span {
          display: inline-block;
          padding: 0 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-30%);
          }
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
          .marquee__inner {
            animation: marquee 20s linear infinite;
          }
          .marquee__inner span {
            font-size: 0.75rem;
          }
        }

        /* Desktop optimization */
        @media (min-width: 1024px) {
          .marquee__inner {
            animation: marquee 12s linear infinite;
          }
          .marquee__inner span {
            font-size: .75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;