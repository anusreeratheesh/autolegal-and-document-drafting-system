import React from 'react';

function AdminStatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Total Lawyers',
      value: stats?.totalLawyers || 0,
      icon: '👨‍⚖️',
      color: 'purple',
      change: '+5%',
    },
    {
      title: 'Documents Drafted',
      value: stats?.documentsDrafted?.lifetime || 0,
      icon: '📄',
      color: 'green',
      change: '+23%',
    },
    {
      title: 'Platform Revenue',
      value: `₹${(stats?.platformRevenue?.lifetime / 100000).toFixed(1)}L`,
      icon: '💰',
      color: 'yellow',
      change: '+18%',
    },
  ];

  const colorMap = {
    blue: 'border-blue-600 bg-blue-50',
    purple: 'border-purple-600 bg-purple-50',
    green: 'border-green-600 bg-green-50',
    yellow: 'border-yellow-600 bg-yellow-50',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`${colorMap[card.color]} rounded-lg shadow p-6 border-l-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {typeof card.value === 'number'
                  ? card.value.toLocaleString()
                  : card.value}
              </p>
              <p className="text-sm text-green-600 font-medium mt-2">{card.change}</p>
            </div>
            <div className="text-4xl opacity-20">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminStatsCards;
