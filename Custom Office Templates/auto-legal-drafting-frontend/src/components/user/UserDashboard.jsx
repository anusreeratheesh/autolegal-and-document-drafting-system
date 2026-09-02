import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDocuments } from '../../store/slices/userSlice';
import { documentAPI } from '../../utils/api';
import QuickStartCards from './QuickStartCards';
import DocumentList from './DocumentList';

function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { documents, stats } = useSelector((state) => state.user);

  useEffect(() => {
    // Load user documents from API
    const fetchDocuments = async () => {
      try {
        const response = await documentAPI.getDocuments();
        dispatch(setDocuments(response.data.data || []));
      } catch (error) {
        console.error('Error fetching documents:', error);
        dispatch(setDocuments([]));
      }
    };
    fetchDocuments();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">{user?.name}</span>! 👋
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Ready to draft your next legal document? Our AI assistant is standing by to help you create professional contracts in minutes.
              </p>
            </div>
            <div className="hidden lg:block text-8xl opacity-20 animate-pulse">⚖️</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Documents Drafted */}
          <div className="card-glass group hover-lift cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Documents Drafted</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {stats.totalDocuments}
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <span className="text-success font-bold bg-success-light px-2 py-0.5 rounded-full text-xs">+2 this week</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">📄</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-primary-500 h-1.5 rounded-full w-3/4 group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </div>

          {/* Reviewed by Lawyers */}
          <div className="card-glass group hover-lift cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Reviewed by Lawyers</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {stats.reviewedByLawyers}
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <span className="text-success font-bold bg-success-light px-2 py-0.5 rounded-full text-xs">100% completion</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">✅</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-success h-1.5 rounded-full w-full group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="card-glass group hover-lift cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Reviews</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {stats.pendingReviews}
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <span className="text-warning-dark font-bold bg-warning-light px-2 py-0.5 rounded-full text-xs">Avg. 2 days</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">⏳</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-warning h-1.5 rounded-full w-1/2 group-hover:w-3/4 transition-all duration-1000 ease-out"></div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">Popular</span>
          </div>
          <QuickStartCards />
        </div>

        {/* Recent Documents Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Documents</h2>
              <p className="text-gray-500 text-sm mt-1">Your latest legal drafts and contracts</p>
            </div>
            <button
              onClick={() => navigate('/user/my-documents')}
              className="px-5 py-2.5 bg-white text-primary-600 font-semibold rounded-xl border border-gray-200 hover:border-primary-500 hover:text-primary-700 hover:shadow-md transition-all flex items-center gap-2"
            >
              View All Documents
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {documents.length > 0 ? (
            <DocumentList documents={documents.slice(0, 5)} />
          ) : (
            <div className="card-glass p-16 text-center border-dashed border-2 border-gray-300 hover:border-primary-400 transition-colors group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start creating your first legal document now. Our AI will guide you through the process step-by-step.
              </p>
              <button
                onClick={() => navigate('/user/create-document')}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Document
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions & Certificates Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Templates & Actions</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">Library</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'Legal Notice', name: 'Legal Notice', icon: '⚖️', color: 'text-blue-500' },
              { id: 'Demand Letter', name: 'Demand Letter', icon: '📢', color: 'text-red-500' },
              { id: 'Resignation Letter', name: 'Resignation Letter', icon: '👋', color: 'text-orange-500' },
              { id: 'Professional Email', name: 'Professional Email', icon: '📧', color: 'text-indigo-500' },
              { id: 'Cold Outreach', name: 'Cold Outreach Email', icon: '🌐', color: 'text-cyan-500' },
              { id: 'Internship Certificate', name: 'Internship Certificate', icon: '🎓', color: 'text-emerald-500' },
              { id: 'Experience Certificate', name: 'Experience Certificate', icon: '⭐', color: 'text-yellow-500' },
              { id: 'Appreciation Certificate', name: 'Appreciation Certificate', icon: '🏆', color: 'text-purple-500' },
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  dispatch({ type: 'ui/setFilter', payload: { key: 'documentType', value: item.id } });
                  navigate('/user/create-document');
                }}
                className="group card hover:shadow-lg transition-all duration-300 text-left p-4 border border-transparent hover:border-gray-200 bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors block">{item.name}</span>
                    <span className="text-xs text-gray-400">Template</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gradient-to-br from-gray-900 to-primary-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Professionals Trust AutoLegal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  ⚡
                </div>
                <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
                <p className="text-gray-300 text-sm">Generate documents in minutes, not days.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  🤖
                </div>
                <h3 className="text-lg font-bold mb-2">AI Powered</h3>
                <p className="text-gray-300 text-sm">Smart suggestions & automatic clauses.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  👨‍⚖️
                </div>
                <h3 className="text-lg font-bold mb-2">Expert Review</h3>
                <p className="text-gray-300 text-sm">Verified lawyers review your drafts.</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  🔒
                </div>
                <h3 className="text-lg font-bold mb-2">Bank-Grade Security</h3>
                <p className="text-gray-300 text-sm">End-to-end encryption for all data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
