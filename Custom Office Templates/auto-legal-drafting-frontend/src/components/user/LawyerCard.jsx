import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import ReviewRequest from './ReviewRequest';

function LawyerCard({ lawyer }) {
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>

        {/* Profile */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="w-16 h-16 rounded-lg border-4 border-white shadow bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {lawyer.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {lawyer.name || 'Verified Lawyer'}
                  </h3>
                  {lawyer.kycStatus === 'verified' && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-semibold">
                      ✓ Verified
                    </div>
                  )}
                  {lawyer.email && (
                    <p className="text-xs text-gray-600 mt-1">{lawyer.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {lawyer.metadata?.bio || 'Legal professional with specialized expertise'}
          </p>

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {(lawyer.specialization || []).slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                >
                  {spec}
                </span>
              ))}
              {lawyer.specialization && lawyer.specialization.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded-full">
                  +{lawyer.specialization.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-200 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{lawyer.totalReviews || 0}</p>
              <p className="text-xs text-gray-600">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{lawyer.metadata?.experienceYears || 0}+</p>
              <p className="text-xs text-gray-600">Years Exp</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{lawyer.metadata?.responseTime || 'N/A'}</p>
              <p className="text-xs text-gray-600">Response</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {renderStars(lawyer.rating || 0)}
              <span className="text-sm font-semibold text-gray-900">
                {(lawyer.rating || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              ({lawyer.totalReviews || 0} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600 text-xs">Quick</p>
              <p className="font-bold text-gray-900">₹{lawyer.metadata?.pricing?.quick || 500}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600 text-xs">Standard</p>
              <p className="font-bold text-gray-900">₹{lawyer.metadata?.pricing?.standard || 1000}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600 text-xs">Premium</p>
              <p className="font-bold text-gray-900">₹{lawyer.metadata?.pricing?.premium || 2000}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Request Review
            </button>
            <button
              onClick={() => navigate(`/lawyer/${lawyer._id}`)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Review Request Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Request Document Review"
        size="md"
      >
        <ReviewRequest lawyer={lawyer} onClose={() => setShowReviewModal(false)} />
      </Modal>
    </>
  );
}

export default LawyerCard;
