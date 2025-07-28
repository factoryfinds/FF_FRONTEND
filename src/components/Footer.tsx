const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">

          {/* Country + Manufacturer */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-xl">🇮🇳</span>
              <span className="underline">India</span>
            </div>
            <div className="space-y-1">
              <p className="font-bold">Full Name and Address</p>
              <p>Factory Finds</p>
              <p>Friends Colony</p>
              <p>263153, Rudrapur</p>
              <p>Uttarakhand</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Please refer to the product label for specific country of origin for each product.
            </p>
          </div>

          {/* Importer */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <p className="font-bold">Contact us</p>
              <p>factoryfinds.business@gmail.com | +91-9027661442</p>
              <br />
              <p>For a quicker response, DM us on Instagram</p>
              <p>@factory_finds_</p>
              <p>INDIA</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-2 text-right text-sm whitespace-nowrap">
            <a href="#" className="hover:underline">Sitemap</a>
            <a href="#" className="hover:underline">Legal & Privacy</a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="text-center md:text-left font-semibold tracking-wider text-lg text-gray-800">
            FACTORY FINDS
          </div>
          <div className="text-right mt-4 md:mt-0">
            © 2025 Factory Finds. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
