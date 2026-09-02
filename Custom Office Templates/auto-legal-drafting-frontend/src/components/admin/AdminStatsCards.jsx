import React from 'react';
import { FiUsers, FiFileText, FiDollarSign, FiAlertCircle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

function AdminStatsCards({ stats }) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: FiUsers,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgLight: 'bg-blue-50',
        },
        {
            title: 'Total Lawyers',
            value: stats?.totalLawyers || 0,
            icon: FiUsers,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgLight: 'bg-purple-50',
        },
        {
            title: 'Documents (Today)',
            value: stats?.documentsDrafted?.today || 0,
            icon: FiFileText,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgLight: 'bg-green-50',
            subtitle: `${stats?.documentsDrafted?.week || 0} this week`,
        },
        {
            title: 'Documents (Month)',
            value: stats?.documentsDrafted?.month || 0,
            icon: FiFileText,
            color: 'bg-teal-500',
            textColor: 'text-teal-600',
            bgLight: 'bg-teal-50',
            subtitle: `${stats?.documentsDrafted?.lifetime || 0} lifetime`,
        },
        {
            title: 'Pending Verifications',
            value: stats?.pendingVerifications || 0,
            icon: FiAlertCircle,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            bgLight: 'bg-orange-50',
            alert: stats?.pendingVerifications > 10,
        },
        {
            title: 'Pending Disputes',
            value: stats?.pendingDisputes || 0,
            icon: FiAlertCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgLight: 'bg-red-50',
            alert: stats?.pendingDisputes > 5,
        },
        {
            title: 'Revenue (Today)',
            value: `₹${(stats?.platformRevenue?.today || 0).toLocaleString('en-IN')}`,
            icon: FiDollarSign,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
            subtitle: `₹${(stats?.platformRevenue?.month || 0).toLocaleString('en-IN')} this month`,
        },
        {
            title: 'Commission (Today)',
            value: `₹${(stats?.commissionEarned?.today || 0).toLocaleString('en-IN')}`,
            icon: FiTrendingUp,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600',
            bgLight: 'bg-indigo-50',
            subtitle: `₹${(stats?.commissionEarned?.month || 0).toLocaleString('en-IN')} this month`,
        },
        {
            title: 'Pending Payouts',
            value: stats?.pendingPayouts || 0,
            icon: FiDollarSign,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgLight: 'bg-yellow-50',
        },
        {
            title: 'New Signups Today',
            value: stats?.newSignupsToday || 0,
            icon: FiCheckCircle,
            color: 'bg-cyan-500',
            textColor: 'text-cyan-600',
            bgLight: 'bg-cyan-50',
        },
        {
            title: 'Flagged Reviews',
            value: stats?.flaggedReviews || 0,
            icon: FiAlertCircle,
            color: 'bg-pink-500',
            textColor: 'text-pink-600',
            bgLight: 'bg-pink-50',
            alert: stats?.flaggedReviews > 3,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${card.color} hover:shadow-lg transition-shadow duration-200 ${card.alert ? 'ring-2 ring-red-300 animate-pulse' : ''
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.bgLight}`}>
                                <Icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                            {card.alert && (
                                <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                    Alert
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                            {card.subtitle && (
                                <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AdminStatsCards;
