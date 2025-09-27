// "use client";

// import Image, { StaticImageData } from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import LoadingOverlay from "./LoadingOverlay";
// import img1 from "@/photos/t-shirt-cateogry.png";
// import img2 from "@/photos/JACKET.jpg";
// import img3 from "@/photos/jacket-category.png";
// import img4 from "@/photos/SHIRTS.jpg";
// import img5 from "@/photos/TOPS.jpg";
// import img6 from "@/photos/jeans-category.png";
// import img7 from "@/photos/background_for_launch.png"
// // import img7 from "@/photos/hero_banner.png";

// interface CategoryItem {
//   title: string;
//   image: StaticImageData;
//   slug: string;
// }

// const MainScreen = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const items: CategoryItem[] = [
//     { title: "T-SHIRTS", image: img1, slug: "t-shirts" },
//     { title: "SHIRTS", image: img4, slug: "shirts" },
//     { title: "JEANS", image: img3, slug: "jeans" },
//     { title: "TROUSERS", image: img6, slug: "trousers" },
//     { title: "TOPS", image: img5, slug: "tops" },
//     { title: "JACKETS", image: img2, slug: "jackets" },
//   ];

//   const handleCategoryClick = async (slug: string): Promise<void> => {
//     try {
//       // Show loading overlay
//       setIsLoading(true);

//       // Add a small delay to ensure loading state is visible
//       await new Promise(resolve => setTimeout(resolve, 100));

//       // Navigate to the category page
//       router.push(`/product/category/${slug}`);

//       // Note: The loading will automatically hide when the new page loads
//       // But if navigation fails, we should hide it
//     } catch (error) {
//       console.error("Navigation error:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <LoadingOverlay isVisible={isLoading} />
//       <div className="relative w-full h-dvh flex flex-col justify-center items-center lg:mb-15 sm:mb-10">
//         <Image
//           src={img7}
//           alt="background image"
//           fill
//           style={{ objectFit: "cover" }}   // change to "contain" only if you don’t want cropping
//           quality={100}
//           placeholder="blur"
//         />

//         {/* Subtle background texture */}
//         <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]" />

//         {/* Content block (now always centered) */}
//         <div className="relative z-10 max-w-4xl mx-auto px-8 text-center w-full">
//           {/* Premium accent line */}
//           <div className="w-12 h-px bg-black mx-auto mb-6 sm:mb-8 opacity-60" />

//           {/* Main headline */}
//           <h1 style={{ textShadow: '2px 2px 4px rgba(218, 165, 32, 0.7)' }}
//             className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[0.2em] uppercase leading-tight text-black mb-4 sm:mb-6">
//             Launching
//             <br />
//             <span style={{ textShadow: '2px 2px 4px rgba(218, 165, 32, 0.7)' }}
//               className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[0.3em]">Soon</span>
//           </h1>

//           {/* Refined tagline */}
//           <h2 style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
//             className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-gray-800 mb-3 sm:mb-4 tracking-wide">
//             Premium T-Shirts. Redefined.
//           </h2>

//           {/* Elegant description */}
//           <p style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
//             className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 max-w-md mx-auto mb-8 sm:mb-12 leading-loose">
//             Superior fabric
//             <span className="mx-3 text-gray-400">·</span>
//             Timeless design
//             <span className="mx-3 text-gray-400">·</span>
//             Uncompromising quality
//           </p>

//           {/* Subtle call-to-action */}
//           <div className="flex flex-col items-center gap-4 sm:gap-6">
//             <button className="group relative px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm tracking-[0.15em] font-light uppercase text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out overflow-hidden">
//               <span className="relative z-10">Notify Me</span>
//               <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//             </button>

//             {/* Minimal social proof or brand mark */}
//             <p 
//               className="text-xs tracking-[0.2em] uppercase text-gray-800 font-light">
//               Est. 2025
//             </p>
//           </div>

//           {/* Bottom accent */}
//           <div className="w-12 h-px bg-black mx-auto mt-12 sm:mt-16 opacity-60" />
//         </div>

//         {/* Subtle corner elements - Hidden on mobile, visible on tablet and up */}
//         <div className="hidden sm:block absolute top-6 sm:top-8 left-6 sm:left-8 w-6 sm:w-8 h-6 sm:h-8 border-l border-t border-black opacity-50" />
//         <div className="hidden sm:block absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-6 sm:w-8 h-6 sm:h-8 border-r border-b border-black opacity-50" />
//       </div>




//       <section className="w-full py-2 px-4 mb-25 sm:px-6 bg-white text-black">
//         <div className="relative mt-5 z-10 max-w-4xl mx-auto px-8 text-center w-full">
//           <h2
//             className="text-base  sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-800 mb-3 sm:mb-4 tracking-wide">
//             Discover Our Curated Collection
//           </h2>

//           {/* Elegant description */}
//           <p
//             className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 max-w-md mx-auto mb-8 sm:mb-12 leading-loose">
//             Superior fabric

//           </p>
//         </div>
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
//             {items.map((item, idx) => (
//               <div
//                 key={idx}
//                 className={`group cursor-pointer relative w-full aspect-[3/4] overflow-hidden transition-all duration-300 ${isLoading
//                   ? 'pointer-events-none opacity-75'
//                   : 'hover:scale-[1.01] hover:shadow-xl'
//                   }`}
//                 onClick={() => handleCategoryClick(item.slug)}
//               >
//                 <Image
//                   src={item.image}
//                   alt={item.title}
//                   fill
//                   style={{ objectFit: "cover" }}
//                   loading={idx < 3 ? "eager" : "lazy"}
//                   sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                   quality={85}
//                   placeholder="blur"
//                 />

//                 {/* Refined title overlay */}
//                 <div className="absolute inset-0 flex items-end justify-center pb-8">
//                   <h3 className="sm:text-xs md:text-sm lg:text-sm font-normal text-white tracking-widest text-center uppercase">
//                     {item.title}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default MainScreen;
// components/MainScreen.tsx - Updated with premium email notification dialog
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingOverlay from "./LoadingOverlay";
import img1 from "@/photos/P-1.png";
import img2 from "@/photos/JACKET.jpg";
import img3 from "@/photos/jacket-category.png";
import img4 from "@/photos/SHIRTS.jpg";
import img5 from "@/photos/TOPS.jpg";
import img6 from "@/photos/jeans-category.png";
// import img7 from "@/photos/background_for_launch.webp";
import { notifyUser } from "../../utlis/api";
import mobileBackgroundImg from "@/photos/THUMBNAIL-1.jpg"

// Move categories to a separate server component for better SEO
export const categories = [
  { title: "T-SHIRTS", image: img1, slug: "t-shirts", description: "Premium cotton t-shirts" },
  { title: "SHIRTS", image: img4, slug: "shirts", description: "Formal and casual shirts" },
  { title: "JEANS", image: img3, slug: "jeans", description: "Denim jeans for all occasions" },
  { title: "TROUSERS", image: img6, slug: "trousers", description: "Comfortable trousers" },
  { title: "TOPS", image: img5, slug: "tops", description: "Trendy tops and blouses" },
  { title: "JACKETS", image: img2, slug: "jackets", description: "Stylish jackets and outerwear" },
];

const MainScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleCategoryClick = async (slug: string): Promise<void> => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(`/product/category/${slug}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNotifyClick = () => {
    setIsDialogOpen(true);
    setIsSubmitted(false);
    setEmail("");
    setEmailError("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    const result = await notifyUser(email); // send to backend
    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        closeDialog();
      }, 3000);
    } else {
      setEmailError(result.message); // show backend error
    }

    // Auto close dialog after 3 seconds
    setTimeout(() => {
      setIsDialogOpen(false);
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsSubmitted(false);
    setEmail("");
    setEmailError("");
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      {/* Premium Email Notification Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative bg-white mx-4 max-w-md w-full border border-gray-200 shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close dialog"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 sm:p-10">
              {!isSubmitted ? (
                <>
                  {/* Dialog header */}
                  <div className="text-center mb-8">
                    <div className="w-8 h-px bg-black mx-auto mb-6 opacity-60" />
                    <h3 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
                      Join The Launch
                    </h3>
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 leading-loose">
                      Be the first to discover
                      <br />
                      our premium collection
                    </p>
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="Enter your email address"
                        className={`w-full px-0 py-3 text-sm tracking-wide bg-transparent border-0 border-b ${emailError ? 'border-red-400' : 'border-gray-300'
                          } focus:border-black focus:outline-none transition-colors duration-300 placeholder-gray-500`}
                        autoComplete="email"
                        autoFocus
                      />
                      {emailError && (
                        <p className="mt-2 text-xs text-red-500 tracking-wide">{emailError}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="group relative w-full px-6 py-3 text-xs tracking-[0.15em] font-light uppercase text-black border border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out overflow-hidden"
                      >
                        <span className="relative z-10">Notify Me</span>
                        <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </button>
                    </div>
                  </form>

                  {/* Footer accent */}
                  <div className="w-8 h-px bg-black mx-auto mt-8 opacity-60" />
                </>
              ) : (
                <>
                  {/* Success state */}
                  <div className="text-center py-4">
                    <div className="w-8 h-px bg-black mx-auto mb-6 opacity-60" />

                    {/* Success icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-black flex items-center justify-center">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-black mb-4">
                      You&apos;re In
                    </h3>
                    <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 leading-loose mb-6">
                      You will be notified the moment
                      <br />
                      our premium collection goes live
                    </p>

                    <p className="text-xs tracking-wide text-gray-500">
                      Check your email for confirmation
                    </p>

                    <div className="w-8 h-px bg-black mx-auto mt-8 opacity-60" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with proper semantic HTML for SEO */}
      <section 
      className="relative w-full h-dvh flex flex-col justify-center items-center lg:mb-15 sm:mb-10"
      aria-label="Hero section"
    >
      {/* Mobile-optimized image for screens < 768px */}
      <Image
        src={mobileBackgroundImg}
        alt="Factory Finds - Premium clothing launching soon"
        fill
        style={{ objectFit: "cover" }}
        quality={85} // Optimized for mobile
        placeholder="blur"
        priority // Critical for LCP
        // className="block md:hidden"
        sizes="100vw"
      />
      
      {/* Desktop-optimized image for screens >= 768px */}
      {/* <Image
        src={img7}
        alt="Factory Finds - Premium clothing launching soon"
        fill
        style={{ objectFit: "cover" }}
        quality={90} // Higher quality for desktop
        placeholder="blur"
        priority // Critical for LCP
        className="hidden md:block"
        sizes="100vw"
      /> */}
      
      {/* Optional: Overlay for better text readability */}
      {/* <div 
        className="absolute inset-0 bg-black/20 z-10" 
        aria-hidden="true"
      /> */}

        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]" />

        {/* SEO-optimized content structure */}
        <header className="relative z-10 max-w-4xl mx-auto px-8 text-center w-full">
          <div className="w-12 h-px bg-black mx-auto mb-6 sm:mb-8 opacity-60" />

          <h1
            style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0)' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl  font-extralight tracking-[0.2em] uppercase leading-tight text-white mb-4 sm:mb-6"
          >
            Launching
            <br />
            <span
              // style={{ textShadow: '1px 1px 4px rgba(255, 255, 255, 1)' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[0.3em]"
            >
              Soon
            </span>
          </h1>

          <h2
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed text-gray-900 mb-3 sm:mb-4 tracking-wide"
          >
            Premium T-Shirts. Redefined.
          </h2>

          <p
            className="text-xs sm:text-sm tracking-[0.2em] font-normal uppercase text-white max-w-md mx-auto mb-8 sm:mb-12 leading-loose"
          >
            Superior fabric
            <span className="mx-3 text-gray-400">·</span>
            Timeless design
            <span className="mx-3 text-gray-400">·</span>
            Uncompromising quality
          </p>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <button
              onClick={handleNotifyClick}
              className="group relative px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm tracking-[0.15em] font-normal uppercase text-white border bg-black border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out overflow-hidden"
              aria-label="Get notified when Factory Finds launches"
            >
              <span className="relative z-10">Notify Me</span>
              <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>

            <p className="text-xs tracking-[0.2em] uppercase text-white font-normal">
              Est. 2025
            </p>
          </div>

          <div className="w-12 h-px bg-black mx-auto mt-12 sm:mt-16 opacity-60" />
        </header>

        <div className="hidden sm:block absolute top-6 sm:top-8 left-6 sm:left-8 w-6 sm:w-8 h-6 sm:h-8 border-l border-t border-black opacity-50" />
        <div className="hidden sm:block absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-6 sm:w-8 h-6 sm:h-8 border-r border-b border-black opacity-50" />
      </section>

      {/* Categories Section with proper semantic HTML */}
      <section className="w-full py-2 px-4 mb-25 sm:px-6 bg-white text-black">
        <div className="relative mt-5 z-10 max-w-4xl mx-auto px-8 text-center w-full">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-800 mb-3 sm:mb-4 tracking-wide">
            Discover Our Curated Collection
          </h2>
          <p className="text-xs sm:text-sm tracking-[0.2em] font-light uppercase text-gray-600 max-w-md mx-auto mb-8 sm:mb-12 leading-loose">
            Superior fabric
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {categories.map((item, idx) => (
              <article
                key={item.slug}
                className={`group cursor-pointer relative w-full aspect-[3/4] overflow-hidden transition-all duration-300 ${isLoading ? 'pointer-events-none opacity-75' : 'hover:scale-[1.01] hover:shadow-xl'
                  }`}
                onClick={() => handleCategoryClick(item.slug)}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} - ${item.description}`}
                  fill
                  style={{ objectFit: "cover" }}
                  loading={idx < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={85}
                  placeholder="blur"
                />

                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <h3 className="sm:text-xs md:text-sm lg:text-sm font-normal text-white tracking-widest text-center uppercase">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainScreen;