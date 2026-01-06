'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  paymentIntentId: string;
  productName: string;
  retailerName: string;
  amount: number;
  styleLinkFee: number;
  retailerAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  customerEmail?: string;
  trackingNumber?: string;
}

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  processing: <Package className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-purple-500" />,
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <Eye className="w-5 h-5 text-red-500" />,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to StyleLink
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600">Track and manage your StyleLink purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here!
            </p>
            <Link 
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                    <p className="text-sm text-gray-600">Sold by {order.retailerName}</p>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcons[order.status]}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium">${(order.amount / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">StyleLink Fee</p>
                    <p className="font-medium text-purple-600">
                      ${(order.styleLinkFee / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium">{order.trackingNumber}</p>
                      </div>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                        Track Package
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Payment Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Price</span>
                        <span>${(order.retailerAmount / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">StyleLink Service Fee (3%)</span>
                        <span className="text-purple-600">${(order.styleLinkFee / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
                        <span>Total Paid</span>
                        <span>${(order.amount / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
