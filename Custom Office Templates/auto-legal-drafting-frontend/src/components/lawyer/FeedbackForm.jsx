import React, { useState } from 'react';
import toast from 'react-hot-toast';

function FeedbackForm({ requestId, onSubmit }) {
  const [formData, setFormData] = useState({
    summary: '',
    majorIssues: '',
    minorIssues: '',
    riskLevel: 'medium',
    suggestedClauses: '',
    overallRating: 5,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.summary.trim()) {
      toast.error('Please provide a summary');
      return;
    }

    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Review Feedback</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Executive Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Executive Summary *
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Provide a brief overview of your review..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* Major Issues */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Major Issues Found
          </label>
          <textarea
            name="majorIssues"
            value={formData.majorIssues}
            onChange={handleChange}
            placeholder="List any critical issues or missing clauses..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* Minor Issues */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minor Issues / Suggestions
          </label>
          <textarea
            name="minorIssues"
            value={formData.minorIssues}
            onChange={handleChange}
            placeholder="List any minor improvements or formatting issues..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Risk Level
          </label>
          <div className="flex gap-4">
            {['low', 'medium', 'high'].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="riskLevel"
                  value={level}
                  checked={formData.riskLevel === level}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {level === 'low' && '🟢 Low Risk'}
                  {level === 'medium' && '🟡 Medium Risk'}
                  {level === 'high' && '🔴 High Risk'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Suggested Clauses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggested Clauses to Add
          </label>
          <textarea
            name="suggestedClauses"
            value={formData.suggestedClauses}
            onChange={handleChange}
            placeholder="Provide suggested replacement or additional clauses..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Quality Rating
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              name="overallRating"
              min="1"
              max="5"
              value={formData.overallRating}
              onChange={handleChange}
              disabled={loading}
              className="flex-1"
            />
            <span className="text-lg font-bold text-gray-900">
              {formData.overallRating}/5
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Be specific and constructive in your feedback. This
            helps clients improve their documents significantly.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {loading ? '⏳ Submitting...' : '✅ Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm;
