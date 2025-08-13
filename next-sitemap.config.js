// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://factoryfinds.store',
  generateRobotsTxt: true,
  exclude: [
    '/unauthorized',
    '/profile/cart',
    '/profile/orders',
    '/profile/wishlist',
    '/admin/add-products',
    '/admin/'
  ],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};
