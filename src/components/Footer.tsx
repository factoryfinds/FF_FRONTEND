const Footer = () => {
  return (
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
              <p>factoryfinds.business@gmail.com</p>
              <p>+91-9027661442</p>
              <p className="mt-2">For a quicker response, DM us on Instagram</p>
              <p>@factoryfinds.store</p>
              <p>India</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-start md:items-end gap-2 text-sm">
            <a href="#" className="hover:underline">Sitemap</a>
            <a href="aboutUs" className="hover:underline">Legal & Privacy</a>
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
  );
};

export default Footer;