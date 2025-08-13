'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, getUserAnalytics } from '../../../utlis/api';
import { Users, ShoppingBag, TrendingUp, DollarSign, Activity, UserCheck, Eye, BarChart3 } from 'lucide-react';

interface AdminStats {
  message: string;
  adminId: string;
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
}

interface UserAnalyticsData {
  data: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    verifiedUsers: number;
    usersWithOrders: number;
    userGrowth: Array<{
      month: string;
      count: number;
    }>;
    summary: {
      verificationRate: string;
      conversionRate: string;
    };
  };
}

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, analyticsRes] = await Promise.all([
          getAdminStats(),
          getUserAnalytics()
        ]);
        setAdminStats(statsRes);
        setUserAnalytics(analyticsRes);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-800">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400">Loading admin dashboard...</p>
      </div>
    </div>
  );

  const stats = [
    {
      title: 'Total Users',
      value: adminStats?.stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-600',
      trend: `${userAnalytics?.data.newUsersThisMonth || 0} new this month`,
      trendColor: 'text-blue-400'
    },
    {
      title: 'Total Products',
      value: adminStats?.stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: 'bg-green-600',
      trend: 'Products available',
      trendColor: 'text-green-400'
    },
    {
      title: 'Total Orders',
      value: adminStats?.stats?.totalOrders || 0,
      icon: TrendingUp,
      color: 'bg-purple-600',
      trend: `${userAnalytics?.data.summary.conversionRate || 0}% conversion rate`,
      trendColor: 'text-purple-400'
    },
    {
      title: 'Total Revenue',
      value: `₹${(adminStats?.stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-600',
      trend: 'Total earnings',
      trendColor: 'text-orange-400'
    }
  ];

  const userStats = [
    {
      title: 'Active Users',
      value: userAnalytics?.data.activeUsers || 0,
      subtitle: 'Last 30 days',
      icon: Activity,
      color: 'text-green-400'
    },
    {
      title: 'Verified Users',
      value: userAnalytics?.data.verifiedUsers || 0,
      subtitle: `${userAnalytics?.data.summary.verificationRate || 0}% verified`,
      icon: UserCheck,
      color: 'text-blue-400'
    },
    {
      title: 'Users with Orders',
      value: userAnalytics?.data.usersWithOrders || 0,
      subtitle: `${userAnalytics?.data.summary.conversionRate || 0}% converted`,
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  const quickActions = [
    {
      title: 'User Analytics',
      description: 'View detailed user analytics and growth metrics',
      icon: BarChart3,
      color: 'bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Manage Users',
      description: 'View, search and manage user accounts',
      icon: Users,
      color: 'bg-green-600/10 border-green-600/20 hover:bg-green-600/20',
      textColor: 'text-green-400'
    },
    {
      title: 'View Reports',
      description: 'Generate and download detailed reports',
      icon: Eye,
      color: 'bg-purple-600/10 border-purple-600/20 hover:bg-purple-600/20',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">{adminStats?.message}</p>
          <p className="text-sm text-gray-500 mt-2">
            Admin ID: <span className="text-gray-300">{adminStats?.adminId}</span>
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                  <p className={`text-sm ${stat.trendColor}`}>{stat.trend}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Analytics Section */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Growth */}
        {userAnalytics?.data.userGrowth && userAnalytics.data.userGrowth.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">User Growth (Last 6 Months)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {userAnalytics.data.userGrowth.map((month, index) => (
                <div key={index} className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-lg font-bold text-white">{month.count}</p>
                  <p className="text-xs text-gray-400">{month.month}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button 
                  key={index} 
                  className={`p-6 rounded-lg border transition-all duration-200 text-left ${action.color}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className={`h-6 w-6 ${action.textColor}`} />
                    <h3 className="font-semibold text-white">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">All systems operational</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}