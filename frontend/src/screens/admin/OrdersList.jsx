// src/screens/admin/OrdersList.jsx - FIXED
import React, { useEffect, useState } from 'react';
import { getOrders } from '../../api/api';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders(1, 50);
      console.log('Orders response:', res.data);
      
      // Handle different response structures
      const ordersData = res.data?.data || res.data?.items || res.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      const message = err?.response?.data?.message || 'Failed to load orders';
      toast.error(message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'EMAIL_VERIFIED': 'bg-blue-100 text-blue-800',
      'WHATSAPP_CONFIRMED': 'bg-purple-100 text-purple-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'SHIPPED': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-teal-100 text-teal-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-indigo-600" size={48} />
          <span className="ml-4 text-xl text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Orders: <span className="font-bold text-gray-800">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-6 font-medium text-gray-900">
                      #{order.id.toString().padStart(6, '0')}
                    </td>
                    <td className="px-8 py-6 text-gray-700">{order.email}</td>
                    <td className="px-8 py-6 text-gray-700">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-8 py-6 font-semibold text-gray-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}