import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { acceptReviewRequest, rejectReviewRequest } from '../../store/slices/lawyerSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import toast from 'react-hot-toast';

function PendingRequests({ requests }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPricingInfo = (tier) => {
    const info = {
      quick: { label: 'Quick Review', price: '₹500', time: '6 hours', color: 'bg-blue-100 text-blue-800' },
      standard: { label: 'Standard Review', price: '₹1000', time: '24 hours', color: 'bg-purple-100 text-purple-800' },
      premium: { label: 'Premium Review', price: '₹2000', time: '1-2 hours', color: 'bg-amber-100 text-amber-800' },
    };
    return info[tier] || info.standard;
  };

  const handleAccept = (requestId) => {
    dispatch(acceptReviewRequest(requestId))
      .unwrap()
      .then(() => {
        dispatch(
          addNotification({
            type: 'message',
            title: 'Review Request Accepted',
            message: 'You have accepted a new review request',
          })
        );
        toast.success('Review request accepted!');
        navigate(`/lawyer/review/${requestId}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to accept request');
      });
  };

  const handleReject = (requestId) => {
    if (window.confirm('Are you sure you want to decline this request?')) {
      dispatch(rejectReviewRequest({ requestId, reason: 'Declined by lawyer' }))
        .unwrap()
        .then(() => {
          toast.success('Review request declined');
        })
        .catch((err) => {
          toast.error(err || 'Failed to decline request');
        });
    }
  };

  // Filter to only show pending reviews that can be accepted
  const pendingRequests = requests.filter(req => req.status === 'pending');

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-600">No pending requests at the moment</p>
        {requests.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            You have {requests.length} request(s) that are already in progress or completed
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((request) => {
        const pricing = getPricingInfo(request.pricingTier);
        return (
          <div
            key={request._id}
            className="card-glass hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500 group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              {/* Request Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pricing.color}`}>
                    {pricing.label}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">#{request._id.substring(0, 8)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {request.document?.title || 'Untitled Document'}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span>👤 {request.user?.name}</span>
                  <span>•</span>
                  <span>📄 {request.document?.template_id}</span>
                </p>
              </div>

              {/* Pricing & SLA */}
              <div className="flex flex-col items-end justify-center">
                <p className="text-2xl font-extrabold text-gray-900">₹{request.price}</p>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <span>⏱️</span>
                  {pricing.time} SLA
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleAccept(request._id)}
                disabled={request.status !== 'pending'}
                className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Accept Request
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                ❌ Decline
              </button>
              <button
                onClick={() => navigate(`/lawyer/review/${request._id}`)}
                className="px-4 py-2 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                👁️ Preview
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PendingRequests;
