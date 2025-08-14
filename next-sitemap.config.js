// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://factoryfinds.store',
  generateRobotsTxt: true,
  exclude: [
    '/unauthorized',
    '/profile/cart',
    '/profile/orders',
    '/profile/wishlist',
    '/profile/address',
    '/admin/*',
    '/admin',
    '/checkout'
  ],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Important pages ko order dena
    const priorityMap = {
      '/': 1.0,
      '/product/trending': 0.9,
      '/product/allProducts': 0.9,
    };

    return {
      loc: path,
      changefreq: 'daily',
      priority: priorityMap[path] || 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
