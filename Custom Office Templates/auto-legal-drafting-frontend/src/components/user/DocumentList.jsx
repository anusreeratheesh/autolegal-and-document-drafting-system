import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { reviewAPI } from '../../utils/api';

function DocumentList({ documents }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [documents]);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getReviews();
      const reviewsData = response.data.data || [];

      // Map reviews by document ID
      const reviewsMap = {};
      reviewsData.forEach(review => {
        if (review.document && review.document._id) {
          reviewsMap[review.document._id] = review;
        }
      });
      setReviews(reviewsMap);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const getStatusBadge = (status, hasReview) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Review' },
      reviewed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Reviewed' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Approved' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        {hasReview && (
          <span className="text-green-600" title="Has lawyer feedback">
            ✅
          </span>
        )}
      </div>
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
      'Software Development Agreement': '💻',
      'Consulting Agreement': '👨‍💼',
      'MoU': '📝',
      'POA': '✍️',
      'Shareholder Agreement': '📊',
      'Terms & Conditions': '⚖️',
      'Investment Agreement': '💼',
    };
    return icons[docType] || '📄';
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-600">No documents to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => {
              const review = reviews[doc._id];
              const hasReview = review && review.status === 'completed';

              return (
                <tr
                  key={doc._id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getDocumentIcon(doc.template_id)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc._id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{doc.template_id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status, hasReview)}
                  </td>
                  <td className="px-6 py-4">
                    {hasReview ? (
                      <div className="max-w-xs">
                        {review.lawyer?.name && (
                          <p className="text-xs font-medium text-gray-900 mb-1">
                            By: {review.lawyer?.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          {review.rating && (
                            <span className="text-yellow-500 font-semibold text-sm">
                              {review.rating}⭐
                            </span>
                          )}
                          {review.riskLevel && (
                            <span className={`text-xs px-2 py-0.5 rounded ${review.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                                review.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                              {review.riskLevel} risk
                            </span>
                          )}
                        </div>
                        {review.feedbackSummary && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {review.feedbackSummary}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No feedback yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {doc.createdAt ? formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/user/edit-document/${doc._id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {hasReview ? (
                        <button
                          onClick={() => navigate(`/user/my-documents`)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View Feedback
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/user/lawyer-connect`, { state: { documentId: doc._id } })}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentList;

