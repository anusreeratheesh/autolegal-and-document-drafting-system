import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { completeReview } from '../../store/slices/lawyerSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import { reviewAPI } from '../../utils/api';
import AnnotationTool from './AnnotationTool';
import FeedbackForm from './FeedbackForm';
import LawyerChat from './LawyerChat';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

function DocumentReview() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('document'); // 'document', 'feedback', 'chat'
  const [annotations, setAnnotations] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await reviewAPI.getReview(requestId);
        const reviewData = response.data.data;

        setReview(reviewData);
        setDocumentContent(reviewData.document?.generatedContent || 'No document content available');
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to load review';
        toast.error(errorMsg);
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchReview();
    }
  }, [requestId]);

  const handleSubmitReview = async (feedbackData) => {
    try {
      // Call backend API to complete review with feedback
      await reviewAPI.completeReview(requestId, feedbackData);

      // Update Redux state
      dispatch(completeReview(requestId));
      dispatch(
        addNotification({
          type: 'review_completed',
          title: 'Review Submitted',
          message: 'Your document review has been submitted successfully',
        })
      );

      toast.success('Review submitted successfully!');
      navigate('/lawyer/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit review';
      toast.error(errorMsg);
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading review document..." />;
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Review not found</p>
          <button
            onClick={() => navigate('/lawyer/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Document</h1>
              <p className="text-gray-600 mt-1">
                Document: {review.document?.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                From: {review.user?.name} ({review.user?.email})
              </p>
              {review.lawyer && (
                <p className="text-sm text-gray-500 mt-1">
                  Assigned Lawyer: <span className="text-gray-900 font-semibold">{review.lawyer?.name}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/lawyer/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200">
            {['document', 'feedback', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition ${activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab === 'document' && '📄 Document'}
                {tab === 'feedback' && '📝 Feedback'}
                {tab === 'chat' && '💬 Chat'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'document' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Toolbar */}
                <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                  >
                    {showPreview ? '📝 Edit' : '👁️ Preview'}
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-sm">
                    💾 Save Annotations
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-sm">
                    📥 Download
                  </button>
                </div>

                {/* Document Area */}
                <div className="p-8 bg-gray-50 min-h-96">
                  {showPreview ? (
                    <div className="prose prose-sm max-w-none bg-white p-8 rounded-lg shadow-sm prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-800 prose-strong:text-gray-900 prose-strong:font-bold prose-a:text-blue-600 prose-li:text-gray-800">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-3 mt-4" {...props} />,
                          p: ({ node, ...props }) => <p className="text-gray-800 mb-3 leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                          em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 ml-4 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 ml-4 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="text-gray-800" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-gray-200 px-2 py-1 rounded font-mono text-sm text-gray-900" {...props} />,
                          hr: ({ node, ...props }) => <hr className="my-6 border-gray-300" {...props} />,
                        }}
                      >
                        {documentContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <AnnotationTool
                      content={documentContent}
                      annotations={annotations}
                      onAddAnnotation={(annotation) => {
                        setAnnotations([...annotations, annotation]);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Annotations & Review Info */}
            <div className="space-y-6">
              {/* Review Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Review Info</h3>
                <div className="space-y-3 text-sm">
                  {review.lawyer && (
                    <div>
                      <p className="text-gray-600 font-medium">Assigned Lawyer</p>
                      <p className="text-gray-900 font-semibold">{review.lawyer?.name}</p>
                      {review.lawyer?.email && (
                        <p className="text-gray-600 text-xs mt-1">{review.lawyer?.email}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 font-medium">Pricing Tier</p>
                    <p className="text-gray-900 font-semibold capitalize">{review.pricingTier}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Price</p>
                    <p className="text-gray-900 font-semibold">₹{review.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">SLA Deadline</p>
                    <p className="text-gray-900">
                      {new Date(review.slaDeadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Status</p>
                    <p className={`font-semibold capitalize ${review.status === 'pending' ? 'text-yellow-600' :
                      review.status === 'in_progress' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                      {review.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Annotations */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Annotations</h3>
                {annotations.length === 0 ? (
                  <p className="text-gray-600 text-sm">No annotations yet</p>
                ) : (
                  <div className="space-y-3">
                    {annotations.map((annotation, i) => (
                      <div
                        key={i}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <p className="text-xs font-medium text-yellow-800 mb-1">
                          {annotation.type.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-900">{annotation.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <FeedbackForm requestId={requestId} onSubmit={handleSubmitReview} />
        )}

        {activeTab === 'chat' && <LawyerChat requestId={requestId} />}
      </div>
    </div>
  );
}

export default DocumentReview;
