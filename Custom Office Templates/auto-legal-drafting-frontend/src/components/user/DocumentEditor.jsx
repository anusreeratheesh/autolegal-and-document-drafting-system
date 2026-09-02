import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { addDocument, updateDocument } from '../../store/slices/userSlice';
import { documentAPI, reviewAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ChatbotWidget from '../common/ChatbotWidget';
import QuillEditor from '../common/QuillEditor';
import CertificateTemplate from './CertificateTemplate';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';

function DocumentEditor({ document, isNew = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const editorRef = useRef(null);

  // Mock AI-generated content
  const mockAIContent = useMemo(() => `# ${document?.template_id || 'Document'}

## PARTIES:
This Agreement is entered into as of [DATE], between:

**Party A:** ${document?.fields?.partyA_name || '[Party A Name]'}
Address: [Address]

**Party B:** ${document?.fields?.partyB_name || '[Party B Name]'}
Address: [Address]

## 1. PURPOSE:
The purpose of this agreement is to ${document?.fields?.purpose || 'define the terms and conditions'}.

## 2. TERMS AND CONDITIONS:
The parties agree to the following terms and conditions:

- [Condition 1]
- [Condition 2]
- [Condition 3]

## 3. OBLIGATIONS:
Each party shall:
- Perform their obligations in good faith
- Comply with all applicable laws
- Maintain confidentiality as required

## 4. GOVERNING LAW:
This Agreement shall be governed by the laws of ${document?.fields?.governing_law || '[Jurisdiction]'}.

## 5. ENTIRE AGREEMENT:
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations.

## 6. SIGNATURES:
IN WITNESS WHEREOF, the parties have executed this Agreement.

_________________________          _________________________
Party A Signature                  Party B Signature

_________________________          _________________________
Date                               Date
`, [document?.fields, document?.template_id]);

  const [review, setReview] = useState(null);

  useEffect(() => {
    // Generate or load document content
    let contentToLoad = '';
    if (document?.generatedContent) {
      contentToLoad = document.generatedContent;
    } else if (document?.content) {
      contentToLoad = document.content;
    } else {
      contentToLoad = mockAIContent;
    }

    // Convert Markdown to HTML if it looks like Markdown (starts with # or contains **)
    // Otherwise assume it's already HTML (if previously saved from Quill)
    if (contentToLoad.includes('# ') || contentToLoad.includes('**')) {
      try {
        setEditorContent(marked.parse(contentToLoad, { breaks: true, gfm: true }));
      } catch (e) {
        console.error("Markdown parsing error", e);
        setEditorContent(contentToLoad);
      }
    } else {
      setEditorContent(contentToLoad);
    }

    // Fetch review if document is reviewed
    const fetchReview = async () => {
      if (document?._id) {
        try {
          const response = await reviewAPI.getReviews({ document: document._id });
          if (response.data.data && response.data.data.length > 0) {
            setReview(response.data.data[0]);
          }
        } catch (error) {
          console.error('Error fetching review:', error);
        }
      }
    };
    fetchReview();
  }, [document, mockAIContent]);

  const handleSave = async () => {
    if (!editorContent.trim()) {
      toast.error('Document cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      const documentData = {
        title: document?.title || 'Untitled Document',
        template_id: document?.template_id || 'custom',
        fields: document?.fields || {},
        generatedContent: editorContent, // Save as HTML
        status: 'draft',
        pricingTier: document?.pricingTier || 'standard'
      };

      let response;
      if (isNew || !document?._id) {
        // Create new document
        response = await documentAPI.createDocument(documentData);
        dispatch(addDocument(response.data.data));
        toast.success('Document saved successfully!');
      } else {
        // Update existing document
        response = await documentAPI.updateDocument(document._id, documentData);
        dispatch(updateDocument(response.data.data));
        toast.success('Document updated successfully!');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save document';
      toast.error(errorMsg);
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (format) => {
    if (isDownloading) {
      toast.error('Download already in progress...');
      return;
    }

    setIsDownloading(true);

    try {
      if (format === 'pdf') {
        toast.loading('Preparing PDF...', { id: 'pdf-download' });

        // Use browser's print functionality for reliable PDF generation
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          // Determine if this is a certificate
          const isCertificate = document?.type?.includes('Certificate') ||
            document?.template_id?.includes('Certificate') ||
            document?.title?.includes('Certificate');

          printWindow.document.write(`
            <html>
              <head>
                <title>${document?.title || 'Document'}</title>
                <style>
                  @page {
                    size: ${isCertificate ? 'landscape' : 'portrait'};
                    margin: ${isCertificate ? '0.5in' : '0.75in'};
                  }
                  body { 
                    font-family: 'Times New Roman', Georgia, serif; 
                    font-size: ${isCertificate ? '11pt' : '12pt'}; 
                    line-height: 1.6;
                    padding: ${isCertificate ? '20px' : '40px'};
                    max-width: ${isCertificate ? '100%' : '8.5in'};
                    margin: 0 auto;
                    color: #000;
                    background: #fff;
                  }
                  h1, h2, h3, h4, h5, h6 { 
                    margin-top: 20px; 
                    margin-bottom: 10px; 
                    font-weight: bold; 
                    page-break-after: avoid;
                  }
                  p { 
                    margin-bottom: 10px;
                    page-break-inside: avoid;
                  }
                  @media print {
                    body { 
                      padding: 20px;
                    }
                    .no-print {
                      display: none;
                    }
                  }
                </style>
              </head>
              <body>
                ${editorContent}
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      setTimeout(function() {
                        window.close();
                      }, 100);
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();

          toast.success('Print dialog opened! Save as PDF from print options.', { id: 'pdf-download', duration: 4000 });
        } else {
          toast.error('Please allow popups to download PDF', { id: 'pdf-download' });
        }
      } else {
        // Download as HTML file (can be opened in Word)
        const element = window.document.createElement('a');
        const file = new Blob([editorContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `${document?.title || 'document'}.html`;
        window.document.body.appendChild(element);
        element.click();
        window.document.body.removeChild(element);
        toast.success('Document downloaded as HTML');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendReview = () => {
    if (!editorContent.trim()) {
      toast.error('Please save document first');
      return;
    }
    if (!document?._id) {
      toast.error('Please save the document before sending to a lawyer');
      return;
    }
    navigate('/user/lawyer-connect', { state: { documentId: document._id } });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {document?.title || 'New Document'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isNew ? 'AI-Generated Draft' : 'Editing'}
              </p>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden min-h-[600px]">
              {showPreview ? (
                // Check if it's a certificate by looking at type, template_id, or title
                (document?.type?.includes('Certificate') ||
                  document?.template_id?.includes('Certificate') ||
                  document?.title?.includes('Certificate')) ? (
                  <div className="p-8 bg-gray-50 min-h-[600px] flex items-center justify-center">
                    <CertificateTemplate content={editorContent} />
                  </div>
                ) : (
                  <div className="p-8 prose prose-sm max-w-none bg-white min-h-[600px] prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-800 prose-strong:text-gray-900 prose-strong:font-bold prose-a:text-blue-600 prose-li:text-gray-800">
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
                      {editorContent}
                    </ReactMarkdown>
                  </div>
                )
              ) : (
                <div className="h-[600px]">
                  <QuillEditor
                    theme="snow"
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    ref={editorRef}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Lawyer Feedback */}
            {review && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👨‍⚖️ Lawyer Feedback</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {review.rating}/5
                  </span>
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Summary</p>
                    <p className="text-gray-600 mt-1">{review.feedbackSummary || review.comments}</p>
                  </div>

                  {review.majorIssues && (
                    <div>
                      <p className="font-semibold text-red-700">⚠️ Major Issues</p>
                      <p className="text-gray-600 mt-1">{review.majorIssues}</p>
                    </div>
                  )}

                  {review.minorIssues && (
                    <div>
                      <p className="font-semibold text-yellow-700">📝 Suggestions</p>
                      <p className="text-gray-600 mt-1">{review.minorIssues}</p>
                    </div>
                  )}

                  {review.suggestedClauses && (
                    <div>
                      <p className="font-semibold text-green-700">✅ Suggested Clauses</p>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">{review.suggestedClauses}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Reviewed by {review.lawyer?.name} on {new Date(review.completedAt || review.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Document Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium text-gray-900">{document?.template_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    Draft
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {isSaving ? '💾 Saving...' : '💾 Save Draft'}
              </button>

              <button
                onClick={handleSendReview}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                👨‍⚖️ Send to Lawyer
              </button>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Download as:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload('pdf')}
                    disabled={isDownloading}
                    className="bg-red-100 hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-red-800 font-semibold py-2 px-3 rounded-lg transition text-sm"
                  >
                    {isDownloading ? '⏳ Generating...' : '📄 PDF'}
                  </button>
                  <button
                    onClick={() => handleDownload('html')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-3 rounded-lg transition text-sm"
                  >
                    📝 HTML
                  </button>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">🤖 AI Suggestions</h3>
              <ul className="space-y-2 text-xs text-blue-800">
                <li>• Add liability clause</li>
                <li>• Include termination conditions</li>
                <li>• Add payment terms section</li>
                <li>• Review confidentiality clause</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot Widget */}
      <ChatbotWidget
        documentId={document?._id}
        context="document"
        metadata={{
          documentType: document?.template_id,
          templateId: document?.template_id
        }}
      />
    </div>
  );
}

export default DocumentEditor;
