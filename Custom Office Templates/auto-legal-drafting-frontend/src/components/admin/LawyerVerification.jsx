import React, { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMail, FiCalendar, FiCheckCircle, FiXCircle, FiLock, FiUnlock, FiSearch, FiAward, FiStar, FiExternalLink, FiFile, FiEye } from 'react-icons/fi';
import LawyerKYCModal from './LawyerKYCModal';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function LawyerVerification() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending, rejected
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);

  const handleViewKYC = (lawyer) => {
    console.log('📋 View KYC clicked for lawyer:', lawyer);
    console.log('📋 Lawyer has barCouncilCertificate?', !!lawyer.barCouncilCertificate);
    console.log('📋 Lawyer data:', { name: lawyer.name, email: lawyer.email, kycStatus: lawyer.kycStatus, specialization: lawyer.specialization });
    setSelectedLawyer(lawyer);
    setShowKYCModal(true);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers({ role: 'lawyer' });
      console.log('✅ Lawyers fetched:', response.data.data);
      console.log('📊 Total lawyers:', response.data.data.length);
      console.log('📊 First lawyer sample:', response.data.data[0]);
      setLawyers(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching lawyers:', error);
      toast.error('Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockLawyer = async (lawyerId, currentStatus) => {
    try {
      await userAPI.updateUserStatus(lawyerId, { isBlocked: !currentStatus });
      toast.success(currentStatus ? 'Lawyer unblocked successfully' : 'Lawyer blocked successfully');
      fetchLawyers(); // Refresh list
    } catch (error) {
      console.error('Error updating lawyer status:', error);
      toast.error('Failed to update lawyer status');
    }
  };

  const handleToggleActive = async (lawyerId, currentStatus) => {
    try {
      await userAPI.updateUserStatus(lawyerId, { isActive: !currentStatus });
      toast.success(currentStatus ? 'Lawyer deactivated' : 'Lawyer activated');
      fetchLawyers(); // Refresh list
    } catch (error) {
      console.error('Error updating lawyer status:', error);
      toast.error('Failed to update lawyer status');
    }
  };

  const handleVerifyLawyer = async (lawyerId, newStatus) => {
    try {
      await userAPI.updateUserStatus(lawyerId, { kycStatus: newStatus });
      toast.success(newStatus === 'verified' ? 'Lawyer verified successfully!' : 'Lawyer application rejected');
      setShowKYCModal(false);
      fetchLawyers();
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error('Failed to update KYC status');
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lawyer.specialization && lawyer.specialization.some(s =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'verified' && lawyer.kycStatus === 'verified') ||
      (filterStatus === 'pending' && lawyer.kycStatus === 'pending') ||
      (filterStatus === 'rejected' && lawyer.kycStatus === 'rejected');

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading lawyers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Lawyer Management</h2>
          <p className="text-gray-600 mt-1">{lawyers.length} total lawyers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition ${filterStatus === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({lawyers.length})
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition ${filterStatus === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Verified ({lawyers.filter(l => l.kycStatus === 'verified').length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition ${filterStatus === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Pending ({lawyers.filter(l => l.kycStatus === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition ${filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Rejected ({lawyers.filter(l => l.kycStatus === 'rejected').length})
            </button>
          </div>
        </div>
      </div>

      {/* Lawyers List */}
      <div className="space-y-4">
        {filteredLawyers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredLawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 ${lawyer.kycStatus === 'verified' ? 'border-green-500' :
                lawyer.kycStatus === 'pending' ? 'border-orange-500' :
                  lawyer.kycStatus === 'rejected' ? 'border-red-500' :
                    'border-gray-500'
                }`}
            >
              <div className="flex items-start justify-between">
                {/* Lawyer Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {lawyer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{lawyer.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        {lawyer.email}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-600">KYC Status</p>
                      <div className="mt-1">
                        {lawyer.kycStatus === 'verified' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ✅ Verified
                          </span>
                        )}
                        {lawyer.kycStatus === 'pending' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                            ⏳ Pending
                          </span>
                        )}
                        {lawyer.kycStatus === 'rejected' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            ❌ Rejected
                          </span>
                        )}
                        {lawyer.kycStatus === 'unverified' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            ⚪ Unverified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Account Status</p>
                      <div className="mt-1">
                        {lawyer.isBlocked ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            🚫 Blocked
                          </span>
                        ) : lawyer.isActive ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ✅ Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            ⏸️ Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">License Number</p>
                      <p className="text-sm text-gray-900 mt-1 font-medium">
                        {lawyer.licenseNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Rating</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <p className="text-sm text-gray-900 font-medium">
                          {lawyer.rating ? lawyer.rating.toFixed(1) : '0.0'} ({lawyer.totalReviews || 0})
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Joined</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FiCalendar className="w-3 h-3 text-gray-500" />
                        <p className="text-xs text-gray-900">
                          {new Date(lawyer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bar Council Certificate</p>
                      <div className="mt-1">
                        {lawyer.barCouncilCertificate ? (
                          <a
                            href={`${BACKEND_URL}${lawyer.barCouncilCertificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition"
                          >
                            <FiFile className="w-3 h-3" />
                            View Certificate
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  {lawyer.specialization && lawyer.specialization.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-600 mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {/* View KYC Button — always visible */}
                  <button
                    onClick={() => handleViewKYC(lawyer)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <FiEye className="w-4 h-4" />
                    View KYC
                  </button>

                  {/* KYC Verification Actions */}
                  {lawyer.kycStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerifyLawyer(lawyer._id, 'verified')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Verify KYC
                      </button>
                      <button
                        onClick={() => handleVerifyLawyer(lawyer._id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <FiXCircle className="w-4 h-4" />
                        Reject KYC
                      </button>
                    </>
                  )}
                  {lawyer.kycStatus === 'rejected' && (
                    <button
                      onClick={() => handleVerifyLawyer(lawyer._id, 'verified')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      Verify KYC
                    </button>
                  )}
                  <button
                    onClick={() => handleBlockLawyer(lawyer._id, lawyer.isBlocked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${lawyer.isBlocked
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                  >
                    {lawyer.isBlocked ? (
                      <>
                        <FiUnlock className="w-4 h-4" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <FiLock className="w-4 h-4" />
                        Block
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleActive(lawyer._id, lawyer.isActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${lawyer.isActive
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    {lawyer.isActive ? (
                      <>
                        <FiXCircle className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* KYC Document Modal */}
      {showKYCModal && selectedLawyer && (
        <LawyerKYCModal
          lawyer={selectedLawyer}
          onClose={() => setShowKYCModal(false)}
          onApprove={() => handleVerifyLawyer(selectedLawyer._id, 'verified')}
          onReject={(reason) => {
            // Use adminAPI.rejectLawyer if available, else fall back to status update
            adminAPI.rejectLawyer(selectedLawyer._id, reason)
              .then(() => {
                toast.error(`${selectedLawyer.name}'s application has been rejected.`);
                setShowKYCModal(false);
                fetchLawyers();
              })
              .catch(() => handleVerifyLawyer(selectedLawyer._id, 'rejected'));
          }}
        />
      )}
    </div>
  );
}

export default LawyerVerification;
