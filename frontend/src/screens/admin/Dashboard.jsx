// src/screens/admin/Dashboard.jsx - FIXED NO BLINKING
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './components/StatsCard';
import { Package, ShoppingBag, DollarSign, TrendingUp, Users, AlertCircle, Box, Plus } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    revenue: 0,
    salesToday: 0,
    activeCustomers: 0,
    pendingOrders: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Prevent multiple simultaneous fetches
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    // Prevent duplicate fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/orders'),
      ]);

      const productsData = productsRes.data.items || productsRes.data || [];
      const ordersData = ordersRes.data.data || ordersRes.data || [];

      const products = Array.isArray(productsData) ? productsData : [];
      const orders = Array.isArray(ordersData) ? ordersData : [];

      const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean)).size;
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

      const today = new Date().setHours(0, 0, 0, 0);
      const salesToday = orders
        .filter(o => new Date(o.createdAt) >= today)
        .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

      const uniqueCustomers = new Set(orders.map(o => o.email)).size;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

      setStats({
        totalProducts: products.length,
        totalCategories: uniqueCategories || 0,
        totalOrders: orders.length,
        revenue: totalRevenue,
        salesToday,
        activeCustomers: uniqueCustomers,
        pendingOrders,
      });

      setRecentProducts(products.slice(0, 5));
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, manage your store
        </h1>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading dashboard data...</div>
      )}

      {/* First Row - 4 Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          change={0}
          icon={<Box className="w-8 h-8 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatsCard
          title="Total Categories"
          value={stats.totalCategories}
          change={0}
          icon={<Package className="w-8 h-8 text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={0}
          icon={<ShoppingBag className="w-8 h-8 text-green-600" />}
          color="bg-green-50"
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          change={0}
          icon={<DollarSign className="w-8 h-8 text-yellow-600" />}
          color="bg-yellow-50"
        />
      </div>

      {/* Second Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          title="Sales Today"
          value={`$${stats.salesToday.toFixed(2)}`}
          change={0}
          icon={<TrendingUp className="w-8 h-8 text-pink-600" />}
          color="bg-pink-50"
        />
        <StatsCard
          title="Active Customers"
          value={stats.activeCustomers}
          change={0}
          icon={<Users className="w-8 h-8 text-orange-600" />}
          color="bg-orange-50"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          change={0}
          icon={<AlertCircle className="w-8 h-8 text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-4 text-gray-600">Product ID</th>
                <th className="text-left py-4 text-gray-600">Name</th>
                <th className="text-left py-4 text-gray-600">Category</th>
                <th className="text-left py-4 text-gray-600">Price</th>
                <th className="text-left py-4 text-gray-600">Stock</th>
                <th className="text-left py-4 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No products yet
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 text-gray-600">#{p.id.toString().padStart(5, '0')}</td>
                    <td className="py-4">{p.title}</td>
                    <td className="py-4 text-gray-600">{p.category || 'Uncategorized'}</td>
                    <td className="py-4">${Number(p.price).toFixed(2)}</td>
                    <td className="py-4">{p.stock}</td>
                    <td className="py-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          p.stock > 20
                            ? 'bg-green-100 text-green-800'
                            : p.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.stock > 20 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}