import React, { useState } from 'react';

function AnnotationTool({ content, annotations, onAddAnnotation }) {
  const [selectedText, setSelectedText] = useState('');
  const [annotationType, setAnnotationType] = useState('issue');
  const [annotationNote, setAnnotationNote] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      setSelectedText(selection.toString());
      setShowAnnotationForm(true);
    }
  };

  const handleAddAnnotation = () => {
    if (!annotationNote.trim()) {
      return;
    }

    const newAnnotation = {
      id: `annotation_${Date.now()}`,
      text: annotationNote,
      type: annotationType,
      selectedText: selectedText,
      timestamp: new Date(),
    };

    onAddAnnotation(newAnnotation);
    setAnnotationNote('');
    setSelectedText('');
    setShowAnnotationForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 How to annotate:</strong> Select text in the document below to add
          comments, highlight issues, or suggest improvements.
        </p>
      </div>

      {/* Document with Selection Handler */}
      <div
        onMouseUp={handleTextSelection}
        className="bg-white p-6 rounded-lg border border-gray-200 min-h-96 prose prose-sm max-w-none select-text"
      >
        {content.split('\n').map((line, i) => (
          <div key={i} className="whitespace-pre-wrap text-gray-900">
            {line}
          </div>
        ))}
      </div>

      {/* Annotation Form */}
      {showAnnotationForm && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900 mb-3">
            Selected text: <span className="italic text-gray-700">"{selectedText}"</span>
          </p>

          <div className="space-y-3">
            {/* Annotation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annotation Type
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'issue', label: '⚠️ Issue' },
                  { value: 'improvement', label: '💡 Improvement' },
                  { value: 'compliment', label: '✅ Good' },
                  { value: 'question', label: '❓ Question' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnnotationType(option.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      annotationType === option.value
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Annotation Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Comment
              </label>
              <textarea
                value={annotationNote}
                onChange={(e) => setAnnotationNote(e.target.value)}
                placeholder="Add your comment or suggestion..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleAddAnnotation}
                disabled={!annotationNote.trim()}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Add Annotation
              </button>
              <button
                onClick={() => {
                  setShowAnnotationForm(false);
                  setAnnotationNote('');
                  setSelectedText('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnotationTool;
