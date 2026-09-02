import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DynamicForm from '../../components/user/DynamicForm';
import DocumentEditor from '../../components/user/DocumentEditor';
import AIGeneratedPreview from '../../components/user/AIGeneratedPreview';
import Loading from '../../components/common/Loading';
import { documentAPI } from '../../utils/api';
import { addDocument } from '../../store/slices/userSlice';
import toast from 'react-hot-toast';

function CreateDocumentPage() {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'preview', 'editor'
  const [documentData, setDocumentData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormSubmit = async (data) => {
    setDocumentData(data);
    setIsGenerating(true);

    try {
      // Call AI generation endpoint
      const response = await documentAPI.generateDocument({
        template_id: data.template_id,
        title: data.title || `${data.template_id} - ${new Date().toLocaleDateString()}`,
        fields: data.fields || data,
        pricingTier: 'standard'
      });

      const generatedDoc = response.data.data;
      dispatch(addDocument(generatedDoc));
      setDocumentData(generatedDoc);
      setCurrentStep('preview');
      toast.success('Document generated with AI successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to generate document';
      toast.error(errorMsg);
      console.error('AI Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedToEditor = async () => {
    // Document already generated, just proceed to editor
    setCurrentStep('editor');
  };

  const handleGoBack = () => {
    if (currentStep === 'editor') {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('form');
    }
  };

  if (isGenerating) {
    return <Loading message="Generating your document with AI..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Form', 'Preview', 'Editor'].map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white ${(index === 0 && currentStep === 'form') ||
                      (index === 1 && currentStep === 'preview') ||
                      (index === 2 && currentStep === 'editor')
                      ? 'bg-blue-600'
                      : index < ['form', 'preview', 'editor'].indexOf(currentStep)
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{step}</span>
                {index < 2 && (
                  <div className={`w-12 h-1 mx-4 ${index < ['form', 'preview', 'editor'].indexOf(currentStep)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                    }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Step */}
        {currentStep === 'form' && (
          <DynamicForm onFormSubmit={handleFormSubmit} loading={isGenerating} />
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && documentData && (
          <div className="space-y-6">
            <AIGeneratedPreview document={documentData} />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleGoBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
              >
                ← Go Back
              </button>
              <button
                onClick={handleProceedToEditor}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Edit & Customize →
              </button>
            </div>
          </div>
        )}

        {/* Editor Step */}
        {currentStep === 'editor' && documentData && (
          <div>
            <DocumentEditor document={documentData} isNew={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateDocumentPage;
