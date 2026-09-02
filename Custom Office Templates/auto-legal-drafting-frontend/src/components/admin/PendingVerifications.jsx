import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPendingLawyers, approveLawyer, rejectLawyer } from '../../store/slices/adminSlice';
import LawyerKYCModal from './LawyerKYCModal';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiEye, FiClock, FiBriefcase, FiAward } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';

function PendingVerifications() {
    const dispatch = useDispatch();
    const { pendingLawyers } = useSelector((state) => state.admin);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [showKYCModal, setShowKYCModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingLawyers();
    }, []);

    const fetchPendingLawyers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPendingLawyers();
            dispatch(setPendingLawyers(response.data.data));
        } catch (error) {
            console.error('Error fetching pending lawyers:', error);
            toast.error('Failed to load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewKYC = (lawyer) => {
        setSelectedLawyer(lawyer);
        setShowKYCModal(true);
    };

    const handleApprove = async (lawyerId, lawyerName) => {
        try {
            await adminAPI.verifyLawyer(lawyerId);
            dispatch(approveLawyer(lawyerId));
            toast.success(`${lawyerName} has been approved and verified! 🎉`);
            setShowKYCModal(false);
            // Refresh the list
            fetchPendingLawyers();
        } catch (error) {
            console.error('Error approving lawyer:', error);
            const errorMsg = error.response?.data?.error || 'Failed to approve lawyer';
            toast.error(errorMsg);
        }
    };

    const handleReject = async (lawyerId, lawyerName, reason = 'KYC documents not satisfactory') => {
        try {
            await adminAPI.rejectLawyer(lawyerId, reason);
            dispatch(rejectLawyer(lawyerId));
            toast.error(`${lawyerName}'s application has been rejected.`);
            setShowKYCModal(false);
            // Refresh the list
            fetchPendingLawyers();
        } catch (error) {
            console.error('Error rejecting lawyer:', error);
            const errorMsg = error.response?.data?.error || 'Failed to reject lawyer';
            toast.error(errorMsg);
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const submitted = new Date(timestamp);
        const diffMs = now - submitted;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading pending verifications...</p>
            </div>
        );
    }

    if (!pendingLawyers || pendingLawyers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up! 🎉</h3>
                <p className="text-gray-600">No pending lawyer verifications at the moment.</p>
            </div>
        );
    }

    return (
        <>
            {/* Urgent Banner */}
            {pendingLawyers.length > 0 && (
                <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h3 className="font-semibold text-orange-900">
                                    {pendingLawyers.length} lawyer{pendingLawyers.length !== 1 ? 's' : ''} awaiting verification
                                </h3>
                                <p className="text-sm text-orange-700">
                                    Approve these lawyers to make them visible to users
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchPendingLawyers}
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded font-medium transition"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {pendingLawyers.map((lawyer) => (
                    <div
                        key={lawyer._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                    >
                        <div className="flex items-start justify-between">
                            {/* Lawyer Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                    {lawyer.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{lawyer.name}</h3>
                                        <span className="px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full">
                                            Pending
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{lawyer.email}</p>
                                    {lawyer.metadata?.phone && (
                                        <p className="text-sm text-gray-600 mb-3">{lawyer.metadata.phone}</p>
                                    )}

                                    {/* Specializations */}
                                    {lawyer.specialization && lawyer.specialization.length > 0 && (
                                        <div className="flex items-center space-x-2 mb-2">
                                            <FiBriefcase className="w-4 h-4 text-gray-500" />
                                            <div className="flex flex-wrap gap-2">
                                                {lawyer.specialization.map((spec, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* License & Rating */}
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        {lawyer.licenseNumber && (
                                            <div className="flex items-center space-x-1">
                                                <FiAward className="w-4 h-4" />
                                                <span>{lawyer.licenseNumber}</span>
                                            </div>
                                        )}
                                        {lawyer.rating && (
                                            <div className="flex items-center space-x-1">
                                                <span>⭐ {lawyer.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submitted Time */}
                                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                                        <FiClock className="w-3 h-3" />
                                        <span>Registered {new Date(lawyer.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2 ml-4">
                                <button
                                    onClick={() => handleViewKYC(lawyer)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                >
                                    <FiEye className="w-4 h-4" />
                                    <span>View KYC</span>
                                </button>
                                <button
                                    onClick={() => handleApprove(lawyer._id, lawyer.name)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                >
                                    <FiCheckCircle className="w-4 h-4" />
                                    <span>Approve</span>
                                </button>
                                <button
                                    onClick={() => handleReject(lawyer._id, lawyer.name)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                                >
                                    <FiXCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* KYC Modal */}
            {showKYCModal && selectedLawyer && (
                <LawyerKYCModal
                    lawyer={selectedLawyer}
                    onClose={() => setShowKYCModal(false)}
                    onApprove={() => handleApprove(selectedLawyer._id, selectedLawyer.name)}
                    onReject={(reason) => handleReject(selectedLawyer._id, selectedLawyer.name, reason)}
                />
            )}
        </>
    );
}

export default PendingVerifications;
