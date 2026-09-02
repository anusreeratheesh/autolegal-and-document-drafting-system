import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiExternalLink } from 'react-icons/fi';

function KYCStatusAlert({ kycStatus, email, name }) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || !kycStatus) return null;

    // Pending verification
    if (kycStatus === 'pending') {
        return (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <FiClock className="w-6 h-6 text-orange-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-orange-900">KYC Verification Pending</h3>
                        <p className="text-orange-800 mt-1">
                            Your Bar Council Certificate is under review by our admin team. This typically takes 24-48 hours.
                        </p>
                        <p className="text-sm text-orange-700 mt-2 font-medium">
                            ✉️ We'll send you an email notification once the verification is complete.
                        </p>
                        <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-900 font-medium">What you can do in the meantime:</p>
                            <ul className="mt-2 space-y-1 text-sm text-orange-800">
                                <li>✓ Complete your profile with specializations and rates</li>
                                <li>✓ Review the documentation requirements</li>
                                <li>✓ Prepare additional documents if needed</li>
                            </ul>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-orange-600 hover:text-orange-800 text-lg font-bold"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    }

    // Verified status
    if (kycStatus === 'verified') {
        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <FiCheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-green-900">✅ KYC Verification Complete</h3>
                        <p className="text-green-800 mt-1">
                            Congratulations! Your account has been verified. You can now access all features of AutoLegal.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a
                                href="/lawyer/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                            >
                                <FiCheckCircle className="w-4 h-4" />
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-green-600 hover:text-green-800 text-lg font-bold"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    }

    // Rejected status
    if (kycStatus === 'rejected') {
        return (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <FiXCircle className="w-6 h-6 text-red-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900">❌ KYC Verification Rejected</h3>
                        <p className="text-red-800 mt-1">
                            Unfortunately, your Bar Council Certificate verification was not approved. Please review the rejection reason and resubmit your application.
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                            📧 Check your email for detailed information about the rejection.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a
                                href="/lawyer/settings/kyc"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                <FiExternalLink className="w-4 h-4" />
                                Resubmit Application
                            </a>
                            <a
                                href="mailto:support@autolegal.com"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition font-medium"
                            >
                                <span>📧</span>
                                Contact Support
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-red-600 hover:text-red-800 text-lg font-bold"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default KYCStatusAlert;
