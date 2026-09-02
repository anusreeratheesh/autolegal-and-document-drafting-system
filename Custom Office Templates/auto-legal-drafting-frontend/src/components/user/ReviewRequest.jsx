import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReviewRequest } from '../../store/slices/userSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import { reviewAPI } from '../../utils/api';
import toast from 'react-hot-toast';

function ReviewRequest({ lawyer, onClose }) {
  const dispatch = useDispatch();
  const { documents } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    documentId: '',
    pricingTier: 'standard',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentId) {
      toast.error('Please select a document');
      return;
    }

    setLoading(true);

    try {
      // Call backend API to create review
      const response = await reviewAPI.createReview({
        documentId: formData.documentId,
        lawyerId: lawyer._id,
        pricingTier: formData.pricingTier,
        notes: formData.notes
      });

      if (response.data.success) {
        toast.success('Review request sent successfully! ✅');
        
        dispatch(
          addNotification({
            type: 'review_sent',
            title: 'Review Request Sent',
            message: `Your document has been sent to ${lawyer.name} for review`,
          })
        );
        
        onClose();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to send review request';
      toast.error(errorMsg);
      console.error('Review request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const priceTierInfo = {
    quick: { 
      label: 'Quick Review', 
      time: '6 hours', 
      price: lawyer.metadata?.pricing?.quick || 500 
    },
    standard: {
      label: 'Standard Review',
      time: '24 hours',
      price: lawyer.metadata?.pricing?.standard || 1000,
    },
    premium: {
      label: 'Premium Review',
      time: '1-2 hours',
      price: lawyer.metadata?.pricing?.premium || 2000,
    },
  };

  const selectedDocument = documents.find(d => d._id === formData.documentId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lawyer Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900">
          📋 Sending to: <strong>{lawyer.name}</strong>
        </p>
        {lawyer.specialization && (
          <p className="text-xs text-blue-700 mt-1">
            Specializations: {lawyer.specialization.join(', ')}
          </p>
        )}
      </div>

      {/* Document Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Document *
        </label>
        <select
          value={formData.documentId}
          onChange={(e) =>
            setFormData({ ...formData, documentId: e.target.value })
          }
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">-- Select a document --</option>
          {documents && documents.length > 0 ? (
            documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.title} ({doc.status})
              </option>
            ))
          ) : (
            <option disabled>No documents available</option>
          )}
        </select>
        {(!documents || documents.length === 0) && (
          <p className="text-sm text-yellow-600 mt-2">
            ⚠️ No documents available. Create one first.
          </p>
        )}
      </div>

      {/* Document Preview */}
      {selectedDocument && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-600 uppercase">Document Preview</p>
          <p className="text-sm text-gray-900 mt-1 font-medium">{selectedDocument.title}</p>
          <p className="text-xs text-gray-600 mt-1">
            Status: <span className="uppercase font-semibold">{selectedDocument.status}</span>
          </p>
        </div>
      )}

      {/* Price Tier Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Review Type *
        </label>
        <div className="space-y-3">
          {Object.entries(priceTierInfo).map(([key, info]) => (
            <label
              key={key}
              className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                formData.pricingTier === key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="pricingTier"
                  value={key}
                  checked={formData.pricingTier === key}
                  onChange={(e) =>
                    setFormData({ ...formData, pricingTier: e.target.value })
                  }
                  disabled={loading}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{info.label}</p>
                  <p className="text-sm text-gray-600">
                    Response within {info.time}
                  </p>
                </div>
                <p className="font-bold text-gray-900">₹{info.price}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Instructions (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Any specific areas you'd like the lawyer to focus on?"
          rows="3"
          disabled={loading}
          maxLength="500"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500</p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✅ What happens next:</strong><br/>
          The lawyer will receive your request and review your document. You'll be notified once they respond.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.documentId}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </div>
    </form>
  );
}

export default ReviewRequest;
