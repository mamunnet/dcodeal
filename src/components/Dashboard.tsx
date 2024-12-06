import React, { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '../lib/admin';
import { Auth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = Auth.getInstance();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || !auth.isAdmin(currentUser)) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-4">No dashboard data available</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Total Products</h2>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">
                    {order.createdAt?.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{order.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 