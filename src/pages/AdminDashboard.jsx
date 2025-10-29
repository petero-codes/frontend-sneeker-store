import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiCheckCircle, FiXCircle, FiClock, 
  FiTrendingUp, FiLogOut, FiRefreshCw, FiArrowRight,
  FiUsers, FiShoppingBag, FiPackage, FiBox, FiTrendingDown,
  FiShoppingCart, FiActivity, FiPercent, FiEye, FiPlus,
  FiAlertCircle, FiZap
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryChart from '../components/charts/CategoryChart';
import SalesBarChart from '../components/charts/SalesBarChart';
import { adminApi } from '../utils/adminApi';

// Comprehensive fallback data
const FALLBACK_DATA = {
  stats: {
    today: { 
      revenue: 125000, 
      successful: 47, 
      failed: 3, 
      pending: 8,
      orders: 58,
      newUsers: 12
    },
    total: { 
      revenue: 2450000, 
      successful: 892, 
      failed: 45, 
      pending: 12,
      users: 1247,
      products: 156,
      orders: 949
    },
    weeklyRevenue: [
      { _id: '2025-01-20', total: 85000 },
      { _id: '2025-01-21', total: 92000 },
      { _id: '2025-01-22', total: 78000 },
      { _id: '2025-01-23', total: 105000 },
      { _id: '2025-01-24', total: 118000 },
      { _id: '2025-01-25', total: 95000 },
      { _id: '2025-01-26', total: 125000 }
    ]
  },
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', amount: 12499, status: 'completed', date: '2 hours ago', paymentMethod: 'M-Pesa' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 8999, status: 'processing', date: '3 hours ago', paymentMethod: 'Card' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 18799, status: 'completed', date: '5 hours ago', paymentMethod: 'M-Pesa' },
    { id: 'ORD-004', customer: 'Sarah Williams', amount: 6549, status: 'pending', date: '6 hours ago', paymentMethod: 'M-Pesa' }
  ],
  topProducts: [
    { id: 'prod-001', name: 'Nike Air Max 270', sold: 234, revenue: 2925000, category: 'Footwear', status: 'active' },
    { id: 'prod-002', name: 'Adidas Ultraboost', sold: 189, revenue: 1881000, category: 'Footwear', status: 'active' },
    { id: 'prod-003', name: 'Puma Hoodie', sold: 156, revenue: 1014000, category: 'Apparel', status: 'active' },
    { id: 'prod-004', name: 'Nike Shorts', sold: 142, revenue: 639000, category: 'Apparel', status: 'active' },
    { id: 'prod-005', name: 'Converse Sneakers', sold: 98, revenue: 980000, category: 'Footwear', status: 'active' }
  ],
  recentActivities: [
    { type: 'order', message: 'New order #ORD-001 from John Doe', time: '2 min ago', icon: '📦' },
    { type: 'user', message: 'New user registered: Jane Smith', time: '15 min ago', icon: '👤' },
    { type: 'payment', message: 'Payment completed: KSh 12,499', time: '18 min ago', icon: '💰' },
    { type: 'stock', message: 'Low stock alert: Puma Hoodie', time: '1 hour ago', icon: '⚠️' }
  ],
  categoryData: [
    { category: 'Footwear', value: 45 },
    { category: 'Apparel', value: 30 },
    { category: 'Accessories', value: 25 }
  ],
  monthlyData: [
    { month: 'Jan', value: 2450000 },
    { month: 'Feb', value: 3120000 },
    { month: 'Mar', value: 2890000 },
    { month: 'Apr', value: 3450000 },
    { month: 'May', value: 3780000 },
    { month: 'Jun', value: 4210000 }
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(FALLBACK_DATA.stats);
  const [recentOrders, setRecentOrders] = useState(FALLBACK_DATA.recentOrders);
  const [topProducts, setTopProducts] = useState(FALLBACK_DATA.topProducts);
  const [recentActivities, setRecentActivities] = useState(FALLBACK_DATA.recentActivities);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getStats();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || FALLBACK_DATA.recentOrders);
        setIsOnline(true);
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (error) {
      console.warn('Using fallback data:', error.message);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `KSh ${stats.total.revenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'from-green-500 to-emerald-600',
      trend: '+12.5%',
      subtitle: 'All time sales'
    },
    {
      title: 'Total Users',
      value: stats.total.users.toLocaleString(),
      icon: FiUsers,
      color: 'from-blue-500 to-cyan-600',
      trend: '+8.2%',
      subtitle: 'Registered users'
    },
    {
      title: 'Total Products',
      value: stats.total.products,
      icon: FiPackage,
      color: 'from-purple-500 to-pink-600',
      trend: '+24',
      subtitle: 'Active products'
    },
    {
      title: 'Total Orders',
      value: stats.total.orders,
      icon: FiShoppingBag,
      color: 'from-orange-500 to-red-600',
      trend: '+15.3%',
      subtitle: 'Completed orders'
    },
    {
      title: 'Conversion Rate',
      value: '12.8%',
      icon: FiPercent,
      color: 'from-indigo-500 to-blue-600',
      trend: '+2.1%',
      subtitle: 'Purchase rate'
    },
    {
      title: 'Active Sessions',
      value: '892',
      icon: FiActivity,
      color: 'from-teal-500 to-cyan-600',
      trend: '+4.7%',
      subtitle: 'Current users'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

    return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">Welcome back! Here's what's happening with your business.</p>
            {isOnline ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Live
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                Offline Mode
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-[#00A676] hover:bg-[#008A5E] text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - 6 Cards in One Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
        <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
            </div>
            <h3 className="text-gray-400 text-xs font-medium mb-1">{stat.title}</h3>
            <p className="text-xl font-bold text-white truncate">{stat.value}</p>
            <p className="text-gray-500 text-[10px] mt-1">{stat.subtitle}</p>
        </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
              <div>
              <h3 className="text-lg font-bold text-white">Earning Reports</h3>
              <p className="text-gray-400 text-sm">Weekly revenue trends</p>
              </div>
            </div>
          <div className="h-80">
            <RevenueChart weeklyData={stats.weeklyRevenue} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">KSh 545.69K</p>
              <p className="text-xs text-gray-400">Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">KSh 256.34K</p>
              <p className="text-xs text-gray-400">Profit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">KSh 74.19K</p>
              <p className="text-xs text-gray-400">Expense</p>
            </div>
            </div>
          </motion.div>

        {/* Category & Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-4">Sales by Category</h3>
            <div className="h-64">
              <CategoryChart categoryData={FALLBACK_DATA.categoryData} />
              </div>
            </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Monthly Sales</h3>
            <div className="h-48">
              <SalesBarChart monthlyData={FALLBACK_DATA.monthlyData} />
            </div>
            </div>
          </motion.div>
      </div>

      {/* Bottom Grid - Top Products, Recent Orders, Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-[#00A676] hover:text-[#008A5E]">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00A676] to-[#008A5E] rounded-lg flex items-center justify-center font-bold text-white">
                    {index + 1}
              </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
              </div>
            </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{product.sold}</p>
                  <p className="text-xs text-gray-400">sold</p>
              </div>
            </div>
            ))}
            </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-[#00A676] hover:text-[#008A5E]">
              View All
            </Link>
          </div>
                <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A676] to-[#008A5E] flex items-center justify-center">
                    <FiShoppingBag className="w-4 h-4 text-white" />
                  </div>
                      <div>
                    <p className="text-sm font-medium text-white">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                      </div>
                      <div className="text-right">
                  <p className="text-sm font-bold text-white">KSh {order.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-bold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="text-xl">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
        </motion.div>
            </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center space-x-3 p-4 bg-gradient-to-br from-[#00A676] to-[#008A5E] hover:from-[#008A5E] hover:to-[#00A676] rounded-lg transition-all text-white"
          >
            <FiPackage className="w-5 h-5" />
            <span className="font-medium">Manage Products</span>
                  </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
          >
            <FiShoppingBag className="w-5 h-5" />
            <span className="font-medium">View Orders</span>
                            </button>
          <button
            onClick={() => navigate('/admin/inventory')}
            className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
          >
            <FiBox className="w-5 h-5" />
            <span className="font-medium">Inventory</span>
                            </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
          >
            <FiTrendingUp className="w-5 h-5" />
            <span className="font-medium">View Analytics</span>
                        </button>
                      </div>
        </motion.div>
    </div>
  );
};

export default AdminDashboard;
