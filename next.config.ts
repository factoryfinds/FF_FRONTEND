import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // 👈 Add Cloudinary hostname here
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "factoryfinds.store", // non-www
          },
        ],
        destination: "https://www.factoryfinds.store/:path*", // force www + https
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
