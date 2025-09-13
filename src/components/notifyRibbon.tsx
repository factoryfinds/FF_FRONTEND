"use client";

const NotiyRibbon = () => {
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
    )
}


export default NotiyRibbon;