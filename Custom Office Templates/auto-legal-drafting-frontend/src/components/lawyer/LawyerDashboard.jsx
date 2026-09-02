import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReviewRequests, setInProgressReviews, setCompletedReviews, toggleOnlineStatus, toggleBusyStatus, setAvailability } from '../../store/slices/lawyerSlice';
import { reviewAPI } from '../../utils/api';
import PendingRequests from './PendingRequests';

function LawyerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    reviewRequests,
    inProgressReviews,
    earnings,
    ratings,
    availability,
    stats
  } = useSelector((state) => state.lawyer);

  useEffect(() => {
    // Load reviews from API
    const fetchReviews = async () => {
      try {
        const response = await reviewAPI.getReviews();
        const allReviews = response.data.data || [];

        const pending = allReviews.filter((r) => r.status === 'pending');
        const inProgress = allReviews.filter((r) => r.status === 'in_progress');
        const completed = allReviews.filter((r) => r.status === 'completed');

        dispatch(setReviewRequests(pending));
        dispatch(setInProgressReviews(inProgress));
        dispatch(setCompletedReviews(completed));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* Role Verification Banner - Debugging helper */}
      {user?.role !== 'lawyer' && (
        <div className="bg-red-500 text-white p-4 text-center font-bold sticky top-0 z-50 shadow-lg animate-pulse">
          ⚠️ You are logged in as "{user?.role}" role, not "lawyer". You must log out and use a lawyer account to accept reviews.
          <br />
          <span className="text-sm font-normal">Use testlawyer@example.com / Password123</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">{user?.name}</span>! 👨‍⚖️
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Manage your legal practice, review documents, and track your earnings all in one place.
              </p>
            </div>

            {/* Availability Toggle */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
              <p className="text-blue-100 text-sm font-medium mb-3">Availability Status</p>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${availability.isOnline && !availability.isBusy
                  ? 'bg-green-500/20 border-green-400 text-green-300'
                  : availability.isOnline && availability.isBusy
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                    : 'bg-gray-500/20 border-gray-400 text-gray-300'
                  }`}>
                  <div className={`w-3 h-3 rounded-full ${availability.isOnline && !availability.isBusy
                    ? 'bg-green-400 animate-pulse'
                    : availability.isOnline && availability.isBusy
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-gray-400'
                    }`}></div>
                  <span className="font-bold">
                    {availability.isOnline && !availability.isBusy ? 'Online' : availability.isOnline && availability.isBusy ? 'Busy' : 'Offline'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(setAvailability({ isOnline: true, isBusy: false }))}
                    className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition shadow-lg shadow-green-900/20"
                    title="Go Online"
                  >
                    🟢
                  </button>
                  <button
                    onClick={() => dispatch(setAvailability({ isOnline: true, isBusy: true }))}
                    className="p-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition shadow-lg shadow-yellow-900/20"
                    title="Busy"
                  >
                    🟡
                  </button>
                  <button
                    onClick={() => dispatch(setAvailability({ isOnline: false, isBusy: false }))}
                    className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition shadow-lg shadow-gray-900/20"
                    title="Go Offline"
                  >
                    ⏸️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pending Requests */}
          <div className="card-glass group hover-lift cursor-pointer border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Requests</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {reviewRequests.length}
                </p>
                <p className="text-sm text-yellow-600 mt-2 font-medium">
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">📋</div>
            </div>
          </div>

          {/* In Progress */}
          <div className="card-glass group hover-lift cursor-pointer border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">In Progress</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {inProgressReviews.length}
                </p>
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  Active reviews
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">⏳</div>
            </div>
          </div>

          {/* Completed */}
          <div className="card-glass group hover-lift cursor-pointer border-l-4 border-l-green-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {stats.totalReviewsCompleted}
                </p>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  This month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">✅</div>
            </div>
          </div>

          {/* Rating */}
          <div className="card-glass group hover-lift cursor-pointer border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-4xl font-extrabold text-gray-900">
                    {ratings.averageRating}
                  </p>
                  <span className="text-2xl">⭐</span>
                </div>
                <p className="text-sm text-purple-600 mt-2 font-medium">
                  Top rated lawyer
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">🏆</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Requests Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-lg">📥</span>
                Pending Requests
              </h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                {reviewRequests.length} New
              </span>
            </div>

            {reviewRequests.length > 0 ? (
              <PendingRequests requests={reviewRequests} />
            ) : (
              <div className="card-glass p-12 text-center border-dashed border-2 border-gray-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 text-gray-400">
                  📭
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-500">You're all caught up! Relax or check back later.</p>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Earnings Card */}
            <div className="card-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-lg">💰</span>
                Earnings Overview
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Earnings (Month)</p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    ₹{earnings.thisMonth.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Pending Payout</span>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Processing</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{earnings.pendingPayout.toLocaleString()}
                  </p>
                </div>

                <button className="w-full btn-primary py-2.5 text-sm">
                  View Detailed Report
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: '👁️', label: 'View Public Profile' },
                  { icon: '⭐', label: 'Read Client Reviews' },
                  { icon: '⚙️', label: 'Account Settings' },
                  { icon: '❓', label: 'Help & Support' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                    <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-primary-600 transition-colors">{action.label}</span>
                    <span className="ml-auto text-gray-300 group-hover:text-primary-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="card bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Acceptance Rate</span>
                    <span className="font-bold text-gray-900">{stats.acceptanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.acceptanceRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm text-blue-700 font-medium">Avg Response Time</span>
                  <span className="text-sm font-bold text-blue-900">{stats.averageResponseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LawyerDashboard;
