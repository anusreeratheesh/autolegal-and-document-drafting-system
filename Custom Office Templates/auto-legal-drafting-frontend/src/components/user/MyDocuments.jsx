import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDocuments } from '../../store/slices/userSlice';
import { documentAPI, reviewAPI } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

function MyDocuments() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { documents } = useSelector((state) => state.user);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedReview, setExpandedReview] = useState(null);

    useEffect(() => {
        fetchDocumentsAndReviews();
    }, []);

    const fetchDocumentsAndReviews = async () => {
        setLoading(true);
        try {
            // Fetch documents
            const docsResponse = await documentAPI.getDocuments();
            const docs = docsResponse.data.data || [];
            dispatch(setDocuments(docs));

            // Fetch reviews for all documents
            const reviewsResponse = await reviewAPI.getReviews();
            const reviewsData = reviewsResponse.data.data || [];

            // Map reviews by document ID
            const reviewsMap = {};
            reviewsData.forEach(review => {
                if (review.document && review.document._id) {
                    reviewsMap[review.document._id] = review;
                }
            });
            setReviews(reviewsMap);
        } catch (error) {
            console.error('Error fetching documents and reviews:', error);
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft', icon: '📝' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review', icon: '⏳' },
            in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Review', icon: '👨‍⚖️' },
            reviewed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Reviewed', icon: '✅' },
            approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Approved', icon: '🎉' },
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    const getDocumentIcon = (docType) => {
        const icons = {
            'NDA': '🔐',
            'Employment Agreement': '👔',
            'Service Agreement': '📋',
            'Freelancer Agreement': '🤝',
            'Partnership Agreement': '🤲',
            'Vendor Agreement': '🏢',
            'Lease Agreement': '🏠',
            'Loan Agreement': '💰',
        };
        return icons[docType] || '📄';
    };

    const getRiskBadge = (riskLevel) => {
        const riskConfig = {
            low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Low Risk' },
            medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Medium Risk' },
            high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High Risk' },
        };
        const config = riskConfig[riskLevel] || riskConfig.medium;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                {config.label}
            </span>
        );
    };

    const filteredDocuments = documents.filter(doc => {
        if (filter === 'all') return true;
        if (filter === 'reviewed') return doc.status === 'reviewed' || doc.status === 'approved';
        return doc.status === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
                    <p className="text-gray-600">Manage and review all your legal documents</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: 'all', label: 'All Documents', icon: '📚' },
                            { value: 'draft', label: 'Drafts', icon: '📝' },
                            { value: 'pending', label: 'Pending Review', icon: '⏳' },
                            { value: 'reviewed', label: 'Reviewed', icon: '✅' },
                        ].map((filterOption) => (
                            <button
                                key={filterOption.value}
                                onClick={() => setFilter(filterOption.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === filterOption.value
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="mr-2">{filterOption.icon}</span>
                                {filterOption.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Documents List */}
                {filteredDocuments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all'
                                ? "You haven't created any documents yet."
                                : `No ${filter} documents found.`}
                        </p>
                        <button
                            onClick={() => navigate('/user/create-document')}
                            className="btn-primary"
                        >
                            Create New Document
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDocuments.map((doc) => {
                            const review = reviews[doc._id];
                            const hasReview = review && review.status === 'completed';
                            const isExpanded = expandedReview === doc._id;

                            return (
                                <div key={doc._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                    {/* Document Header */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <span className="text-4xl">{getDocumentIcon(doc.template_id)}</span>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{doc.template_id}</p>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span>Created {doc.createdAt ? formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true }) : 'recently'}</span>
                                                        {hasReview && review.lawyer && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Reviewed by {review.lawyer.name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {getStatusBadge(doc.status)}
                                                {hasReview && review.rating && (
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <span className="font-bold">{review.rating}</span>
                                                        <span>⭐</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Review Summary Preview */}
                                        {hasReview && review.feedbackSummary && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-blue-600 text-lg">💬</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-blue-900 mb-1">Lawyer Feedback Summary</p>
                                                        <p className="text-sm text-blue-800 line-clamp-2">{review.feedbackSummary}</p>
                                                    </div>
                                                    {review.riskLevel && (
                                                        <div>{getRiskBadge(review.riskLevel)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/user/edit-document/${doc._id}`)}
                                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                            >
                                                📝 Edit Document
                                            </button>
                                            {hasReview && (
                                                <button
                                                    onClick={() => setExpandedReview(isExpanded ? null : doc._id)}
                                                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition"
                                                >
                                                    {isExpanded ? '👆 Hide Feedback' : '👁️ View Full Feedback'}
                                                </button>
                                            )}
                                            {!hasReview && doc.status === 'draft' && (
                                                <button
                                                    onClick={() => navigate('/user/lawyer-connect', { state: { documentId: doc._id } })}
                                                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg transition"
                                                >
                                                    👨‍⚖️ Send for Review
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Review Details */}
                                    {isExpanded && hasReview && (
                                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <span>📋</span>
                                                Detailed Lawyer Feedback
                                            </h4>

                                            <div className="space-y-4">
                                                {/* Summary */}
                                                {review.feedbackSummary && (
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <p className="font-semibold text-gray-700 mb-2">📝 Summary</p>
                                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{review.feedbackSummary}</p>
                                                    </div>
                                                )}

                                                {/* Major Issues */}
                                                {review.majorIssues && (
                                                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                                        <p className="font-semibold text-red-700 mb-2">⚠️ Major Issues</p>
                                                        <p className="text-red-600 text-sm whitespace-pre-wrap">{review.majorIssues}</p>
                                                    </div>
                                                )}

                                                {/* Minor Issues */}
                                                {review.minorIssues && (
                                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                                        <p className="font-semibold text-yellow-700 mb-2">📝 Suggestions</p>
                                                        <p className="text-yellow-600 text-sm whitespace-pre-wrap">{review.minorIssues}</p>
                                                    </div>
                                                )}

                                                {/* Suggested Clauses */}
                                                {review.suggestedClauses && (
                                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                        <p className="font-semibold text-green-700 mb-2">✅ Suggested Clauses</p>
                                                        <p className="text-green-600 text-sm whitespace-pre-wrap">{review.suggestedClauses}</p>
                                                    </div>
                                                )}

                                                {/* Review Metadata */}
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Reviewed By</p>
                                                            <p className="font-semibold text-gray-900">{review.lawyer?.name || 'Unknown'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Review Date</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {review.completedAt
                                                                    ? new Date(review.completedAt).toLocaleDateString()
                                                                    : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Risk Level</p>
                                                            <div>{getRiskBadge(review.riskLevel || 'medium')}</div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Overall Rating</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {review.rating ? `${review.rating}/5 ⭐` : 'Not rated'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyDocuments;
