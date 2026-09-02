import React, { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiCalendar, FiCheckCircle, FiXCircle, FiLock, FiUnlock, FiSearch } from 'react-icons/fi';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAllUsers({ role: 'user' });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId, currentStatus) => {
        try {
            await userAPI.updateUserStatus(userId, { isBlocked: !currentStatus });
            toast.success(currentStatus ? 'User unblocked successfully' : 'User blocked successfully');
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await userAPI.updateUserStatus(userId, { isActive: !currentStatus });
            toast.success(currentStatus ? 'User deactivated' : 'User activated');
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'active' && user.isActive && !user.isBlocked) ||
            (filterStatus === 'blocked' && user.isBlocked);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">{users.length} total users</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${filterStatus === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All ({users.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${filterStatus === 'active'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Active ({users.filter(u => u.isActive && !u.isBlocked).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('blocked')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${filterStatus === 'blocked'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Blocked ({users.filter(u => u.isBlocked).length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
                        >
                            <div className="flex items-start justify-between">
                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiMail className="w-4 h-4" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-xs text-gray-600">Status</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {user.isBlocked ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                                        🚫 Blocked
                                                    </span>
                                                ) : user.isActive ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                        ✅ Active
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                                        ⏸️ Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">KYC Status</p>
                                            <p className="font-medium text-gray-900 mt-1 capitalize">{user.kycStatus}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Joined</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <FiCalendar className="w-3 h-3 text-gray-500" />
                                                <p className="text-sm text-gray-900">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">User ID</p>
                                            <p className="text-xs text-gray-900 mt-1 font-mono">{user._id.slice(-8)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 ml-4">
                                    <button
                                        onClick={() => handleBlockUser(user._id, user.isBlocked)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${user.isBlocked
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {user.isBlocked ? (
                                            <>
                                                <FiUnlock className="w-4 h-4" />
                                                Unblock
                                            </>
                                        ) : (
                                            <>
                                                <FiLock className="w-4 h-4" />
                                                Block
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(user._id, user.isActive)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${user.isActive
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                    >
                                        {user.isActive ? (
                                            <>
                                                <FiXCircle className="w-4 h-4" />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle className="w-4 h-4" />
                                                Activate
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UserManagement;
