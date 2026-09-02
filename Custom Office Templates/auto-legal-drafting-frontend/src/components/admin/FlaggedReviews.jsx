import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFlaggedReviews, approveReview, rejectReview } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';
import { FiFlag, FiCheckCircle, FiXCircle, FiUser, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';

function FlaggedReviews() {
    const dispatch = useDispatch();
    const { flaggedReviews } = useSelector((state) => state.admin);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFlaggedReviews();
    }, []);

    const fetchFlaggedReviews = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getFlaggedReviews();
            if (response.data.success) {
                dispatch(setFlaggedReviews(response.data.data));
            } else {
                // Fallback to mock data if API fails
                loadMockFlaggedReviews();
            }
        } catch (error) {
            console.error('Error fetching flagged reviews:', error);
            // Fallback to mock data on error
            loadMockFlaggedReviews();
        } finally {
            setLoading(false);
        }
    };

    const loadMockFlaggedReviews = () => {
        const mockFlaggedReviews = [
            {
                _id: 'flag_1',
                review_id: 'review_123',
                user_name: 'Rajesh Kumar',
                user_avatar: 'https://i.pravatar.cc/150?img=1',
                lawyer_name: 'Adv. Priya Sharma',
                lawyer_avatar: 'https://i.pravatar.cc/150?img=5',
                rating: 1,
                comment: 'This is completely unprofessional and terrible service!',
                flag_reason: 'inappropriate_language',
                flagged_by: 'Adv. Priya Sharma',
                flagged_at: '2024-11-29T08:30:00',
                document_type: 'NDA',
            },
            {
                _id: 'flag_2',
                review_id: 'review_124',
                user_name: 'Sneha Patel',
                user_avatar: 'https://i.pravatar.cc/150?img=2',
                lawyer_name: 'Adv. Rajesh Gupta',
                lawyer_avatar: 'https://i.pravatar.cc/150?img=6',
                rating: 5,
                comment: 'Amazing service! Contact me at 9876543210 for more work. Email: fake@spam.com',
                flag_reason: 'spam_contact_info',
                flagged_by: 'System Auto-Detection',
                flagged_at: '2024-11-28T15:45:00',
                document_type: 'Employment Agreement',
            },
            {
                _id: 'flag_3',
                review_id: 'review_125',
                user_name: 'Amit Verma',
                user_avatar: 'https://i.pravatar.cc/150?img=3',
                lawyer_name: 'Adv. Meera Patel',
                lawyer_avatar: 'https://i.pravatar.cc/150?img=7',
                rating: 1,
                comment: 'Worst lawyer ever! They are frauds and scammers. Don\'t trust them!',
                flag_reason: 'defamatory_content',
                flagged_by: 'Adv. Meera Patel',
                flagged_at: '2024-11-27T11:20:00',
                document_type: 'Lease Agreement',
            },
            {
                _id: 'flag_4',
                review_id: 'review_126',
                user_name: 'Priya Singh',
                user_avatar: 'https://i.pravatar.cc/150?img=4',
                lawyer_name: 'Adv. Vikram Singh',
                lawyer_avatar: 'https://i.pravatar.cc/150?img=8',
                rating: 2,
                comment: 'The review was okay but the lawyer asked for personal information outside the platform.',
                flag_reason: 'off_platform_solicitation',
                flagged_by: 'System Auto-Detection',
                flagged_at: '2024-11-26T09:10:00',
                document_type: 'Service Agreement',
            },
            {
                _id: 'flag_5',
                review_id: 'review_127',
                user_name: 'Karan Malhotra',
                user_avatar: 'https://i.pravatar.cc/150?img=14',
                lawyer_name: 'Adv. Anjali Desai',
                lawyer_avatar: 'https://i.pravatar.cc/150?img=9',
                rating: 1,
                comment: 'This review is fake. I never used this service.',
                flag_reason: 'fake_review',
                flagged_by: 'Adv. Anjali Desai',
                flagged_at: '2024-11-25T16:30:00',
                document_type: 'Partnership Agreement',
            },
        ];
        dispatch(setFlaggedReviews(mockFlaggedReviews));
    };

    const handleApprove = (reviewId, userName) => {
        dispatch(approveReview(reviewId));
        toast.success(`Review by ${userName} has been approved.`);
    };

    const handleReject = (reviewId, userName) => {
        dispatch(rejectReview(reviewId));
        toast.error(`Review by ${userName} has been rejected and removed.`);
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const flagged = new Date(timestamp);
        const diffMs = now - flagged;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const getFlagReasonLabel = (reason) => {
        const reasons = {
            inappropriate_language: 'Inappropriate Language',
            spam_contact_info: 'Spam/Contact Info',
            defamatory_content: 'Defamatory Content',
            off_platform_solicitation: 'Off-Platform Solicitation',
            fake_review: 'Fake Review',
        };
        return reasons[reason] || reason;
    };

    const getFlagReasonColor = (reason) => {
        const colors = {
            inappropriate_language: 'bg-red-100 text-red-700',
            spam_contact_info: 'bg-yellow-100 text-yellow-700',
            defamatory_content: 'bg-orange-100 text-orange-700',
            off_platform_solicitation: 'bg-purple-100 text-purple-700',
            fake_review: 'bg-pink-100 text-pink-700',
        };
        return colors[reason] || 'bg-gray-100 text-gray-700';
    };

    const filteredReviews = selectedFilter === 'all'
        ? flaggedReviews
        : flaggedReviews.filter(review => review.flag_reason === selectedFilter);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading flagged reviews...</p>
            </div>
        );
    }

    if (!flaggedReviews || flaggedReviews.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flagged Reviews! 🎉</h3>
                <p className="text-gray-600">All reviews are clean and compliant.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${selectedFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    All ({flaggedReviews.length})
                </button>
                {['inappropriate_language', 'spam_contact_info', 'defamatory_content', 'off_platform_solicitation', 'fake_review'].map(
                    (reason) => {
                        const count = flaggedReviews.filter(r => r.flag_reason === reason).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={reason}
                                onClick={() => setSelectedFilter(reason)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${selectedFilter === reason
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {getFlagReasonLabel(reason)} ({count})
                            </button>
                        );
                    }
                )}
            </div>

            {/* Flagged Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-red-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <FiFlag className="w-5 h-5 text-red-500" />
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getFlagReasonColor(review.flag_reason)}`}>
                                    {getFlagReasonLabel(review.flag_reason)}
                                </span>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <FiClock className="w-3 h-3" />
                                    <span>Flagged {getTimeAgo(review.flagged_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <FiAlertTriangle className="w-3 h-3" />
                                <span>Flagged by: {review.flagged_by}</span>
                            </div>
                        </div>

                        {/* User and Lawyer Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={review.user_avatar}
                                    alt={review.user_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{review.user_name}</p>
                                    <p className="text-xs text-gray-500">Reviewer</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={review.lawyer_avatar}
                                    alt={review.lawyer_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{review.lawyer_name}</p>
                                    <p className="text-xs text-gray-500">Lawyer</p>
                                </div>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-700">Rating:</span>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">• {review.document_type}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-800 italic">"{review.comment}"</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleApprove(review._id, review.user_name)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                            >
                                <FiCheckCircle className="w-4 h-4" />
                                <span>Approve Review</span>
                            </button>
                            <button
                                onClick={() => handleReject(review._id, review.user_name)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                            >
                                <FiXCircle className="w-4 h-4" />
                                <span>Reject & Remove</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredReviews.length === 0 && selectedFilter !== 'all' && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">No reviews flagged for this reason.</p>
                </div>
            )}
        </div>
    );
}

export default FlaggedReviews;
