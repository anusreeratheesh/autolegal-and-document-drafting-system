import React, { useState, useEffect } from 'react';
import {
    FiX, FiUser, FiMail, FiBriefcase, FiAward, FiCalendar,
    FiCheckCircle, FiXCircle, FiExternalLink, FiFile, FiAlertCircle
} from 'react-icons/fi';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function LawyerKYCModal({ lawyer, onClose, onApprove, onReject }) {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [certError, setCertError] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log('✅ LawyerKYCModal opened with lawyer data:', lawyer);
    }, [lawyer]);

    // Defensive check: if no lawyer data, show error state
    if (!lawyer) {
        console.warn('⚠️ LawyerKYCModal: No lawyer data provided');
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 text-center">
                    <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading KYC Details</h2>
                    <p className="text-gray-600 mb-6">Could not load lawyer information. Please try again.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const certificateUrl = lawyer?.barCouncilCertificate
        ? `${BACKEND_URL}${lawyer.barCouncilCertificate}`
        : null;

    const isPDF = certificateUrl?.toLowerCase().endsWith('.pdf');
    const isImage = certificateUrl && /\.(jpg|jpeg|png)$/i.test(certificateUrl);

    const handleRejectConfirm = () => {
        onReject(rejectReason || 'KYC documents not satisfactory');
        setShowRejectInput(false);
    };

    const getKycBadge = (status) => {
        const map = {
            pending: { cls: 'bg-orange-100 text-orange-700', label: '⏳ Pending' },
            verified: { cls: 'bg-green-100 text-green-700', label: '✅ Verified' },
            rejected: { cls: 'bg-red-100 text-red-700', label: '❌ Rejected' },
            unverified: { cls: 'bg-gray-100 text-gray-600', label: '⚪ Unverified' },
        };
        const s = map[status] || map.unverified;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {lawyer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">KYC Review — {lawyer?.name}</h2>
                            <p className="text-xs text-gray-500">Lawyer Verification Details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                    {/* Lawyer Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow icon={<FiUser />} label="Full Name" value={lawyer?.name || 'N/A'} />
                        <InfoRow icon={<FiMail />} label="Email" value={lawyer?.email || 'N/A'} />
                        <InfoRow icon={<FiAward />} label="License / Bar Council No." value={lawyer?.licenseNumber || 'Not provided'} />
                        <InfoRow icon={<FiCalendar />} label="Registered On" value={lawyer?.createdAt ? new Date(lawyer.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1">
                                <FiAward className="w-3 h-3" /> KYC Status
                            </span>
                            {getKycBadge(lawyer?.kycStatus)}
                        </div>
                        {lawyer?.specialization?.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1">
                                    <FiBriefcase className="w-3 h-3" /> Specializations
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {lawyer.specialization.map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Certificate Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FiFile className="w-4 h-4 text-blue-500" />
                            Bar Council Certificate
                        </h3>

                        {!certificateUrl ? (
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700">
                                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">No certificate was uploaded by this lawyer.</p>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                {/* Preview */}
                                {isPDF && (
                                    <iframe
                                        src={certificateUrl}
                                        title="Bar Council Certificate"
                                        className="w-full h-80 border-0"
                                        onError={() => setCertError(true)}
                                    />
                                )}
                                {isImage && !certError && (
                                    <img
                                        src={certificateUrl}
                                        alt="Bar Council Certificate"
                                        className="w-full max-h-80 object-contain bg-gray-50"
                                        onError={() => setCertError(true)}
                                    />
                                )}
                                {certError && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600">
                                        <FiAlertCircle className="w-5 h-5" />
                                        <p className="text-sm">Could not load preview. Use the link below to open the file.</p>
                                    </div>
                                )}

                                {/* Open link bar */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                                    <span className="text-xs text-gray-500 truncate max-w-xs">
                                        {lawyer.barCouncilCertificate?.split('/').pop()}
                                    </span>
                                    <a
                                        href={certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Open in New Tab
                                        <FiExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reject Reason Input */}
                    {showRejectInput && (
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Rejection Reason (optional)</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="e.g. Certificate is expired, illegible, or does not match the provided details..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRejectConfirm}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                                >
                                    Confirm Rejection
                                </button>
                                <button
                                    onClick={() => setShowRejectInput(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {!showRejectInput && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                        {lawyer?.kycStatus !== 'rejected' && (
                            <button
                                onClick={() => setShowRejectInput(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                <FiXCircle className="w-4 h-4" />
                                Reject
                            </button>
                        )}
                        {lawyer?.kycStatus !== 'verified' && (
                            <button
                                onClick={onApprove}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                            >
                                <FiCheckCircle className="w-4 h-4" />
                                Approve KYC
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1">
                <span className="text-gray-400">{icon}</span>
                {label}
            </span>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    );
}

export default LawyerKYCModal;
