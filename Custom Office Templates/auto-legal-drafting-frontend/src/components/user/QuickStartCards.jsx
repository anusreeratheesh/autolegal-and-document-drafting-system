import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../store/slices/uiSlice';

function QuickStartCards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quickStartItems = [
    {
      title: 'Create NDA',
      description: 'Non-Disclosure Agreement',
      icon: '🔐',
      docType: 'NDA',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Employment Agreement',
      description: 'Employment Contract',
      icon: '👔',
      docType: 'Employment Agreement',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Service Agreement',
      description: 'Service Contract',
      icon: '📋',
      docType: 'Service Agreement',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Upload for Review',
      description: 'Send document to lawyer',
      icon: '📤',
      docType: 'upload',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const handleQuickStart = (docType) => {
    if (docType === 'upload') {
      navigate('/user/my-documents');
    } else {
      dispatch(setFilter({ key: 'documentType', value: docType }));
      navigate('/user/create-document');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickStartItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleQuickStart(item.docType)}
          className="group card-premium hover:shadow-xl transition-all duration-300 text-left hover-scale relative overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Decorative Background Gradient */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>

          <div className="relative z-10">
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>

            <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
              Start Now
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Bottom Border Gradient */}
          <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
        </button>
      ))}
    </div>
  );
}

export default QuickStartCards;
