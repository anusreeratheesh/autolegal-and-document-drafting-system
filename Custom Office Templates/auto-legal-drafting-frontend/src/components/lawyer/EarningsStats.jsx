import React, { useState } from 'react';

function EarningsStats({ earnings, stats }) {
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'year'

  const getEarningsData = () => {
    const data = {
      week: {
        total: 3500,
        reviews: 7,
        averagePerReview: 500,
        trend: '+15%',
      },
      month: {
        total: 14200,
        reviews: 28,
        averagePerReview: 507,
        trend: '+22%',
      },
      year: {
        total: 156800,
        reviews: 312,
        averagePerReview: 502,
        trend: '+8%',
      },
    };
    return data[timeframe];
  };

  const data = getEarningsData();

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : 'This Year'}
          </button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Total Earnings</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ₹{data.total.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-2">
            <span className="font-semibold">{data.trend}</span> from last period
          </p>
        </div>

        {/* Reviews Completed */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Reviews Completed</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{data.reviews}</p>
          <p className="text-sm text-blue-600 mt-2">
            Avg: ₹{data.averagePerReview.toLocaleString()}/review
          </p>
        </div>

        {/* Pending Payout */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium">Pending Payout</p>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            ₹{earnings?.pendingPayout?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-yellow-600 mt-2">Next payout: 5 Dec 2024</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Earnings Breakdown</h3>
        <div className="space-y-3">
          {[
            { tier: 'Quick Reviews', count: 12, amount: 2388 },
            { tier: 'Standard Reviews', count: 14, amount: 6986 },
            { tier: 'Premium Reviews', count: 2, amount: 1998 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.tier}</p>
                <p className="text-sm text-gray-600">{item.count} reviews</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {((item.amount / data.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {[
            { date: 'Nov 28', desc: 'NDA Review - TechCorp', amount: 499 },
            { date: 'Nov 27', desc: 'Employment Agreement', amount: 999 },
            { date: 'Nov 26', desc: 'Service Agreement Review', amount: 199 },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{tx.desc}</p>
                <p className="text-xs text-gray-600">{tx.date}</p>
              </div>
              <p className="font-medium text-green-600">+ ₹{tx.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EarningsStats;
