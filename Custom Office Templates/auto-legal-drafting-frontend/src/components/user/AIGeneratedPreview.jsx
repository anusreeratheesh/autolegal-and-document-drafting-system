import React from 'react';
import CertificateTemplate from './CertificateTemplate';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function AIGeneratedPreview({ document }) {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI-Generated Preview</h2>
        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
          <span>✨ Generated with AI</span>
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-gray-100 p-4 sm:p-8 rounded-lg border border-gray-200 overflow-x-auto flex justify-center">
        {/* Show the actual AI-generated content */}
        {document?.generatedContent ? (
          // Check if it's a certificate by looking at type, template_id, or title
          (document.type?.includes('Certificate') ||
            document.template_id?.includes('Certificate') ||
            document.title?.includes('Certificate')) ? (
            <div className="w-full max-w-[21cm]">
              <CertificateTemplate content={document.generatedContent} />
            </div>
          ) : (
            <div
              className="bg-white shadow-lg border border-gray-300 w-full max-w-[21cm] min-h-[29.7cm] p-10 sm:p-16 text-gray-900 font-serif"
              style={{
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="prose prose-slate prose-sm sm:prose-base prose-headings:font-bold prose-headings:text-gray-900 max-w-none text-justify leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.generatedContent}
                </ReactMarkdown>
              </div>
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 py-12 w-full">
            <p>No generated content available</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> This is an AI-generated preview. You can edit and customize it before downloading or sending to a lawyer for review.
        </p>
      </div>
    </div>
  );
}

export default AIGeneratedPreview;
