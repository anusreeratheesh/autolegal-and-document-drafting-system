import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { approveReview, rejectReview } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

function FlaggedReviews() {
  const dispatch = useDispatch();
  const [expandedReview, setExpandedReview] = useState(null);

  // Mock flagged reviews
  const flaggedReviews = [
    {
      _id: 'review_flag_1',
      documentTitle: 'NDA - TechCorp & Innovation Labs',
      lawyerName: 'Adv. Priya Sharma',
      flagReason: 'Unusual content/potential plagiarism detected',
      similarityScore: 87,
      flaggedAt: '2024-11-28',
      reviewContent: 'This agreement appears to have content from template library...',
    },
    {
      _id: 'review_flag_2',
      documentTitle: 'Employment Agreement',
      lawyerName: 'Adv. Vikram Singh',
      flagReason: 'Feedback contains inappropriate language',
      similarityScore: 0,
      flaggedAt: '2024-11-27',
      reviewContent: 'The feedback contained some inappropriate comments...',
    },
  ];

  const handleApprove = (reviewId) => {
    dispatch(approveReview(reviewId));
    toast.success('Review approved!');
  };

  const handleReject = (reviewId) => {
    dispatch(rejectReview(reviewId));
    toast.success('Review rejected and will be resubmitted to lawyer!');
  };

  return (
    <div className="space-y-4">
      {flaggedReviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-gray-600">No flagged reviews</p>
        </div>
      ) : (
        flaggedReviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow border-l-4 border-red-600 overflow-hidden"
          >
            {/* Main Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {review.documentTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    By {review.lawyerName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    🚩 Flagged
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{review.flaggedAt}</p>
                </div>
              </div>

              {/* Flag Details */}
              <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                <p className="text-sm font-medium text-red-900 mb-2">
                  Flag Reason:
                </p>
                <p className="text-sm text-red-800">{review.flagReason}</p>
                {review.similarityScore > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600 mb-1">Similarity Score</p>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${review.similarityScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-red-700 font-medium mt-1">
                      {review.similarityScore}% match found
                    </p>
                  </div>
                )}
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setExpandedReview(expandedReview === review._id ? null : review._id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
              >
                {expandedReview === review._id ? '▼' : '▶'} View Full Content
              </button>

              {/* Expanded Content */}
              {expandedReview === review._id && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                  <p className="text-sm text-gray-700">{review.reviewContent}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(review._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  ❌ Reject & Request Resubmission
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FlaggedReviews;
