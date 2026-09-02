import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStats } from '../../store/slices/adminSlice';
import AdminStatsCards from './AdminStatsCards';
import PendingVerifications from './PendingVerifications';
import FlaggedReviews from './FlaggedReviews';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, pendingVerifications: pendingVerificationsCount, flaggedReviews: flaggedReviewsCount } = useSelector(
    (state) => state.admin
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();
        
        if (response.data.success) {
          dispatch(setStats(response.data.data));
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [dispatch]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

      {/* Subtle Background Blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animated-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animated-blob-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-gradient mb-3">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor platform activity and manage user verifications
          </p>
        </div>

        {/* Stats Overview */}
        <div className="animate-fade-in-up delay-200">
          <AdminStatsCards stats={stats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Section - Pending Verifications & Disputes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Lawyer Verifications */}
            <div className="animate-fade-in-up delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                  📋
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pending Lawyer Verifications
                  </h2>
                  <p className="text-sm text-gray-600">
                    {stats.pendingVerifications} awaiting review
                  </p>
                </div>
              </div>
              <PendingVerifications />
            </div>

            {/* Flagged Reviews */}
            <div className="animate-fade-in-up delay-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                  🚩
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Flagged Reviews
                  </h2>
                  <p className="text-sm text-gray-600">
                    {stats.flaggedReviews} requiring attention
                  </p>
                </div>
              </div>
              <FlaggedReviews />
            </div>
          </div>

          {/* Right Section - Quick Stats */}
          <div className="space-y-6">
            {/* Platform Health */}
            <div className="card-glass hover-lift animate-fade-in-up delay-700">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">💚</span>
                Platform Health
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Active Users</p>
                    <p className="text-sm font-bold text-green-600">85%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">System Uptime</p>
                    <p className="text-sm font-bold text-green-600">99.9%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" style={{ width: '99.9%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">API Response</p>
                    <p className="text-sm font-bold text-blue-600">92ms avg</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Actions */}
            <div className="card-glass hover-lift animate-fade-in-up delay-1000">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Recent Actions
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { action: 'Verified lawyer', user: 'Adv. Rahul Kumar', time: '2 min ago', color: 'green' },
                  { action: 'Resolved dispute', user: 'Dispute #245', time: '1 hour ago', color: 'blue' },
                  { action: 'Suspended account', user: 'User #5432', time: '3 hours ago', color: 'red' },
                  { action: 'Approved payout', user: 'Lawyer #123', time: '5 hours ago', color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-white/60 transition-all border-l-4 border-transparent hover:border-blue-500">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.user}</p>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-glass hover-lift animate-fade-in-up delay-1000">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all font-medium text-gray-700 flex items-center gap-3 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">👥</span>
                  Manage Users
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all font-medium text-gray-700 flex items-center gap-3 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">👨‍⚖️</span>
                  Manage Lawyers
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition-all font-medium text-gray-700 flex items-center gap-3 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                  View Disputes
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all font-medium text-gray-700 flex items-center gap-3 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
