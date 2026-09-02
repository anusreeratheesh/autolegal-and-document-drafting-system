import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/slices/uiSlice';

function DocumentTypeSelector() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentType } = useSelector((state) => state.ui.filters);
  const [selectedCategory, setSelectedCategory] = useState('legal');

  const documentTypes = {
    legal: [
      { id: 'NDA', name: 'Non-Disclosure Agreement', icon: '🔐', desc: 'Protect confidential information' },
      { id: 'Service Agreement', name: 'Service Agreement', icon: '📋', desc: 'Outline service terms' },
      { id: 'Employment Agreement', name: 'Employment Agreement', icon: '👔', desc: 'Employment contract' },
      { id: 'Freelancer Agreement', name: 'Freelancer/Contractor Agreement', icon: '🤝', desc: 'Contractor terms' },
      { id: 'Partnership Agreement', name: 'Partnership Agreement', icon: '🤲', desc: 'Partnership terms' },
      { id: 'Vendor Agreement', name: 'Vendor Agreement', icon: '🏢', desc: 'Vendor relationship' },
      { id: 'Lease Agreement', name: 'Lease/Rental Agreement', icon: '🏠', desc: 'Property lease' },
      { id: 'Loan Agreement', name: 'Loan Agreement', icon: '💰', desc: 'Loan terms' },
    ],
    corporate: [
      { id: 'Software Development Agreement', name: 'Software Development Agreement', icon: '💻', desc: 'Dev project contract' },
      { id: 'Consulting Agreement', name: 'Consulting Agreement', icon: '👨‍💼', desc: 'Consulting services' },
      { id: 'Shareholder Agreement', name: 'Shareholder Agreement', icon: '📊', desc: 'Shareholder rights' },
      { id: 'Investment Agreement', name: 'Investment Agreement', icon: '💼', desc: 'Investment terms' },
    ],

    other: [
      { id: 'MoU', name: 'Memorandum of Understanding', icon: '📝', desc: 'MoU between parties' },
      { id: 'POA', name: 'Power of Attorney', icon: '✍️', desc: 'Legal authority' },
      { id: 'Terms & Conditions', name: 'Website/App Terms & Conditions', icon: '⚖️', desc: 'Terms for users' },
    ],
    certificates: [
      { id: 'Internship Certificate', name: 'Internship Certificate', icon: '🎓', desc: 'For interns' },
      { id: 'Experience Certificate', name: 'Experience Certificate', icon: '⭐', desc: 'For employees' },
      { id: 'Appreciation Certificate', name: 'Appreciation Certificate', icon: '🏆', desc: 'For recognition' },
    ],
  };

  const handleSelectDocument = (docId) => {
    dispatch(setFilter({ key: 'documentType', value: docId }));
    navigate('/user/create-document');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Select Document Type</h1>
          <p className="text-gray-600 mt-2">Choose the type of legal document you want to create</p>
          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes[selectedCategory].map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectDocument(doc.id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left border-2 border-transparent hover:border-blue-600"
              >
                <div className="text-5xl mb-4">{doc.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.desc}</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                  Create Now →
                </div>
              </button>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-lg border border-blue-200 p-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Not sure which one to choose?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>NDA:</strong> Use when you need to protect confidential information</li>
              <li>• <strong>Service Agreement:</strong> Use to outline terms for services you're providing or receiving</li>
              <li>• <strong>Employment Agreement:</strong> Use for hiring employees or documenting employment terms</li>
              <li>• <strong>Freelancer Agreement:</strong> Use for short-term contract work or freelance services</li>
            </ul>
          </div>
        </div>

      </div>
      );
}

      export default DocumentTypeSelector;
