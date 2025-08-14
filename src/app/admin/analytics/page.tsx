'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Eye,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Activity,
  AlertTriangle,
  Star
} from 'lucide-react';
import { getProductStats, getUserAnalytics, type ProductStatsResponse, type UserAnalytics } from '../../../../utlis/api';

export default function AnalyticsPage() {
  const [productStats, setProductStats] = useState<ProductStatsResponse | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('products');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productData, userData] = await Promise.all([
          getProductStats(),
          getUserAnalytics()
        ]);

        setProductStats(productData);
        setUserAnalytics(userData);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setError(err.message || 'Failed to fetch analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-800">
          <h2 className="text-lg font-semibold mb-2">Error Loading Analytics</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!productStats || !userAnalytics) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="text-yellow-400 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Star }
  ];

  // Prepare chart data
  const categoryChartData = productStats.data.categoryStats.map(cat => ({
    category: cat._id,
    products: cat.count,
    clicks: cat.totalClicks,
    cartAdds: cat.totalCartAdds,
    purchases: cat.totalPurchases,
    avgPrice: Math.round(cat.avgPrice)
  }));

  const genderChartData = productStats.data.genderStats.map(gender => ({
    gender: gender._id,
    products: gender.count,
    clicks: gender.totalClicks,
    cartAdds: gender.totalCartAdds,
    purchases: gender.totalPurchases
  }));

  const userGrowthData = userAnalytics.data.userGrowth.map(month => ({
    month: month.month,
    users: month.count
  }));

  const productGrowthData = productStats.data.productGrowth.map(month => ({
    month: month.month,
    products: month.count
  }));

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Comprehensive business performance insights
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="text-xs text-gray-400">PRODUCTS</span>
            </div>
            <p className="text-2xl font-bold text-white">{productStats.data.totalProducts}</p>
            <p className="text-sm text-gray-400">
              {productStats.data.newProductsThisMonth} new this month
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-green-500" />
              <span className="text-xs text-gray-400">USERS</span>
            </div>
            <p className="text-2xl font-bold text-white">{userAnalytics.data.totalUsers}</p>
            <p className="text-sm text-gray-400">
              {userAnalytics.data.activeUsers} active users
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-purple-500" />
              <span className="text-xs text-gray-400">TOTAL CLICKS</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {productStats.data.analytics.totalClicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              {productStats.data.conversionRates.clickToCart}% to cart
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="h-8 w-8 text-orange-500" />
              <span className="text-xs text-gray-400">CONVERSIONS</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {productStats.data.analytics.totalPurchases}
            </p>
            <p className="text-sm text-gray-400">
              {productStats.data.conversionRates.clickToPurchase}% overall rate
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${selectedTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Products Tab */}
        {selectedTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Clicked Products */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <Eye className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Most Clicked Products</h3>
              </div>
              <div className="space-y-3">
                {productStats.data.topPerformers.mostClicked.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white text-sm">{product.title}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </div>
                    <span className="text-blue-400 font-semibold">{product.clickCount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Added to Cart */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <ShoppingCart className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Most Added to Cart</h3>
              </div>
              <div className="space-y-3">
                {productStats.data.topPerformers.mostAddedToCart.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white text-sm">{product.title}</p>
                        <p className="text-xs text-gray-400">₹{product.discountedPrice}</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">{product.addedToCartCount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Purchased Products */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Most Purchased Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Rank</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Product</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Category</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Purchases</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.data.topPerformers.mostPurchased.map((product, index) => (
                      <tr key={product._id} className="border-b border-gray-800">
                        <td className="py-3">
                          <span className="w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-white">{product.title}</td>
                        <td className="py-3 text-gray-400">{product.category}</td>
                        <td className="py-3 text-purple-400 font-semibold">{product.purchaseCount}</td>
                        <td className="py-3 text-green-400 font-semibold">₹{product.discountedPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Performance Chart */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6">Category Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
                    <Bar dataKey="cartAdds" fill="#10B981" name="Cart Adds" />
                    <Bar dataKey="purchases" fill="#8B5CF6" name="Purchases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Stats */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">User Statistics</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-blue-400">{userAnalytics.data.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">Active Users (30d)</p>
                    <p className="text-2xl font-bold text-green-400">{userAnalytics.data.activeUsers.toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">New This Month</p>
                    <p className="text-2xl font-bold text-purple-400">{userAnalytics.data.newUsersThisMonth.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">Verification Rate</p>
                    <p className="text-2xl font-bold text-orange-400">{userAnalytics.data.summary.verificationRate}%</p>
                  </div>
                  <div className="text-orange-500">✓</div>
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">User Growth (6 Months)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Signup Sources */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6">User Signup Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userAnalytics.data.signupSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: { _id?: string; percent?: number }) => {
                          const { _id, percent } = props;
                          return `${_id ?? 'Unknown'} ${((percent ?? 0) * 100).toFixed(0)}%`;
                        }}

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {userAnalytics.data.signupSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {userAnalytics.data.signupSources.map((source, index) => (
                    <div key={source._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-white font-medium">{source._id || 'Unknown'}</span>
                      </div>
                      <span className="text-gray-300 font-semibold">{source.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {selectedTab === 'performance' && (
          <div className="space-y-6">
            {/* Conversion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Click to Cart</h3>
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-400">{productStats.data.conversionRates.clickToCart}%</p>
                <p className="text-sm text-gray-400 mt-2">Conversion rate</p>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Cart to Purchase</h3>
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-400">{productStats.data.conversionRates.cartToPurchase}%</p>
                <p className="text-sm text-gray-400 mt-2">Conversion rate</p>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Overall Conversion</h3>
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-400">{productStats.data.conversionRates.clickToPurchase}%</p>
                <p className="text-sm text-gray-400 mt-2">Click to purchase</p>
              </div>
            </div>

            {/* Gender Performance */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">Performance by Gender</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genderChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gender" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
                    <Bar dataKey="cartAdds" fill="#10B981" name="Cart Adds" />
                    <Bar dataKey="purchases" fill="#8B5CF6" name="Purchases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Growth */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">Product Growth (6 Months)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="products" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {selectedTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Low Stock Alert</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {productStats.data.insights.lowStockProducts.length > 0 ? (
                  productStats.data.insights.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                      <div>
                        <p className="font-medium text-white text-sm">{product.title}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <span className="text-yellow-400 font-semibold">{product.inventory} left</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No low stock products</p>
                )}
              </div>
            </div>

            {/* Inactive Products */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <Eye className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Inactive Products</h3>
                <span className="ml-2 text-xs text-gray-400">(0 clicks & cart adds)</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {productStats.data.insights.inactiveProducts.length > 0 ? (
                  productStats.data.insights.inactiveProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800">
                      <div>
                        <p className="font-medium text-white text-sm">{product.title}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <span className="text-red-400 text-xs">Needs attention</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">All products have engagement</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center mb-6">
                <Activity className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Recent Product Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Product</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Clicks</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Cart Adds</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Purchases</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-400">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.data.insights.recentActivity.length > 0 ? (
                      productStats.data.insights.recentActivity.map((product) => (
                        <tr key={product._id} className="border-b border-gray-800">
                          <td className="py-3 font-medium text-white">{product.title}</td>
                          <td className="py-3 text-blue-400">{product.clickCount}</td>
                          <td className="py-3 text-green-400">{product.addedToCartCount}</td>
                          <td className="py-3 text-purple-400">{product.purchaseCount}</td>
                          <td className="py-3 text-gray-400 text-sm">
                            {product.lastPurchasedAt
                              ? new Date(product.lastPurchasedAt).toLocaleDateString()
                              : new Date(product.updatedAt).toLocaleDateString()
                            }
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          No recent activity data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Insights */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center mb-6">
                <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Pricing Insights</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400 mb-1">Average Price</p>
                  <p className="text-xl font-bold text-white">₹{productStats.data.pricing.avgDiscountedPrice}</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400 mb-1">Highest Price</p>
                  <p className="text-xl font-bold text-green-400">₹{productStats.data.pricing.maxPrice}</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400 mb-1">Lowest Price</p>
                  <p className="text-xl font-bold text-blue-400">₹{productStats.data.pricing.minPrice}</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400 mb-1">Avg Discount</p>
                  <p className="text-xl font-bold text-purple-400">{productStats.data.pricing.avgDiscountPercent}%</p>
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white mb-3">Inventory Summary</h4>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">Total Inventory</span>
                    <span className="text-white font-semibold">{productStats.data.analytics.totalInventory}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">In Stock Rate</span>
                    <span className="text-green-400 font-semibold">{productStats.data.summary.stockRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">Out of Stock</span>
                    <span className="text-red-400 font-semibold">{productStats.data.outOfStockProducts}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-white mb-3">Performance Summary</h4>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">Total Analytics Events</span>
                    <span className="text-white font-semibold">
                      {(productStats.data.analytics.totalClicks +
                        productStats.data.analytics.totalCartAdds +
                        productStats.data.analytics.totalPurchases).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">User Conversion Rate</span>
                    <span className="text-blue-400 font-semibold">{userAnalytics.data.summary.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <span className="text-gray-300">Products Needing Attention</span>
                    <span className="text-yellow-400 font-semibold">
                      {productStats.data.insights.inactiveProducts.length + productStats.data.insights.lowStockProducts.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}