const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../middleware/errorHandler');
const notificationService = require('../services/notificationService');

// @desc    Get pending lawyer verifications
// @route   GET /api/admin/lawyers/pending
// @access  Private/Admin
exports.getPendingLawyers = async (req, res, next) => {
    try {
        const pendingLawyers = await User.find({
            role: 'lawyer',
            kycStatus: 'pending'
        }).select('-password -refreshToken');

        res.status(200).json({
            success: true,
            count: pendingLawyers.length,
            data: pendingLawyers
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify/Approve lawyer
// @route   POST /api/admin/lawyers/:id/verify
// @access  Private/Admin
exports.verifyLawyer = async (req, res, next) => {
    try {
        const lawyer = await User.findById(req.params.id);

        if (!lawyer) {
            throw new NotFoundError('Lawyer not found');
        }

        if (lawyer.role !== 'lawyer') {
            throw new ForbiddenError('User is not a lawyer');
        }

        const previousStatus = lawyer.kycStatus;
        lawyer.kycStatus = 'verified';
        lawyer.isActive = true;
        await lawyer.save();

        // Send notification to lawyer
        try {
            await notificationService.sendNotification({
                userId: lawyer._id,
                type: 'KYC_APPROVED',
                title: 'KYC Verification Approved ✓',
                message: 'Congratulations! Your Bar Council Certificate has been verified. You can now access all features of the platform.',
                data: {
                    lawyerId: lawyer._id,
                    status: 'verified'
                }
            });

            // Also send email notification
            await notificationService.notifyKycApproved(lawyer.email, lawyer.name);
        } catch (notificationError) {
            console.error('Notification sending failed:', notificationError);
            // Continue even if notification fails
        }

        console.log(`✅ Lawyer ${lawyer.email} verified. Previous status: ${previousStatus}, New status: verified`);

        res.status(200).json({
            success: true,
            message: 'Lawyer verified successfully',
            data: lawyer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject lawyer verification
// @route   POST /api/admin/lawyers/:id/reject
// @access  Private/Admin
exports.rejectLawyer = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const lawyer = await User.findById(req.params.id);

        if (!lawyer) {
            throw new NotFoundError('Lawyer not found');
        }

        if (lawyer.role !== 'lawyer') {
            throw new ForbiddenError('User is not a lawyer');
        }

        const previousStatus = lawyer.kycStatus;
        lawyer.kycStatus = 'rejected';
        lawyer.isActive = false;
        
        // Store rejection reason in metadata
        if (reason) {
            lawyer.metadata = {
                ...lawyer.metadata,
                rejectionReason: reason,
                rejectionDate: new Date()
            };
        }
        await lawyer.save();

        // Send notification to lawyer
        try {
            await notificationService.sendNotification({
                userId: lawyer._id,
                type: 'KYC_REJECTED',
                title: 'KYC Verification Rejected',
                message: `Your Bar Council Certificate verification was rejected${reason ? ': ' + reason : '.'}. Please contact support for more information or to resubmit.`,
                data: {
                    lawyerId: lawyer._id,
                    status: 'rejected',
                    reason: reason || null
                }
            });

            // Also send email notification
            await notificationService.notifyKycRejected(lawyer.email, lawyer.name, reason);
        } catch (notificationError) {
            console.error('Notification sending failed:', notificationError);
            // Continue even if notification fails
        }

        console.log(`❌ Lawyer ${lawyer.email} verification rejected. Previous status: ${previousStatus}, New status: rejected, Reason: ${reason || 'Not provided'}`);

        res.status(200).json({
            success: true,
            message: 'Lawyer verification rejected',
            data: lawyer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        const Document = require('../models/Document');
        const Review = require('../models/Review');
        const Dispute = require('../models/Dispute');
        const Payout = require('../models/Payout');

        // Date calculations
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // User counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalLawyers = await User.countDocuments({ role: 'lawyer' });
        const newSignupsToday = await User.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Document counts
        const documentsTodayCount = await Document.countDocuments({
            createdAt: { $gte: startOfToday }
        });
        const documentsWeekCount = await Document.countDocuments({
            createdAt: { $gte: startOfWeek }
        });
        const documentsMonthCount = await Document.countDocuments({
            createdAt: { $gte: startOfMonth }
        });
        const documentsLifetime = await Document.countDocuments({});

        // Pending verifications
        const pendingVerifications = await User.countDocuments({
            role: 'lawyer',
            kycStatus: 'pending'
        });

        // Disputes
        const pendingDisputes = await Dispute.countDocuments({
            status: { $in: ['open', 'in_progress'] }
        });

        // Flagged/Problematic reviews
        const flaggedReviews = await Review.countDocuments({
            isReported: true
        });

        // Revenue calculations - from completed documents
        const revenueToday = await Document.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfToday },
                    status: { $in: ['reviewed', 'approved'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]);

        const revenueMonth = await Document.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth },
                    status: { $in: ['reviewed', 'approved'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]);

        // Commission calculations (20% of revenue)
        const commissionRate = 0.2;
        const commissionToday = (revenueToday[0]?.total || 0) * commissionRate;
        const commissionMonth = (revenueMonth[0]?.total || 0) * commissionRate;

        // Pending payouts
        const pendingPayouts = await Payout.countDocuments({
            status: { $in: ['pending', 'processing'] }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLawyers,
                newSignupsToday,
                documentsDrafted: {
                    today: documentsTodayCount,
                    week: documentsWeekCount,
                    month: documentsMonthCount,
                    lifetime: documentsLifetime
                },
                pendingVerifications,
                pendingDisputes,
                flaggedReviews,
                platformRevenue: {
                    today: revenueToday[0]?.total || 0,
                    month: revenueMonth[0]?.total || 0
                },
                commissionEarned: {
                    today: Math.round(commissionToday),
                    month: Math.round(commissionMonth)
                },
                pendingPayouts
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get flagged reviews
// @route   GET /api/admin/reviews/flagged
// @access  Private/Admin
exports.getFlaggedReviews = async (req, res, next) => {
    try {
        const Review = require('../models/Review');
        
        const flaggedReviews = await Review.find({ isReported: true })
            .populate('user', 'firstName lastName email')
            .populate('lawyer', 'firstName lastName email')
            .populate('reportedBy', 'firstName lastName')
            .sort({ reportedAt: -1 });

        res.status(200).json({
            success: true,
            count: flaggedReviews.length,
            data: flaggedReviews
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all verified lawyers with visibility status
// @route   GET /api/admin/lawyers/verified/all
// @access  Private/Admin
exports.getAllVerifiedLawyers = async (req, res, next) => {
    try {
        const allLawyers = await User.find({ role: 'lawyer' })
            .select('name email kycStatus isActive isBlocked specialization rating')
            .sort({ createdAt: -1 });

        // Filter into categories
        const verified = allLawyers.filter(l => l.kycStatus === 'verified');
        const verifiedAndActive = verified.filter(l => l.isActive === true);
        const verifiedButInactive = verified.filter(l => l.isActive === false);
        const notVerified = allLawyers.filter(l => l.kycStatus !== 'verified');

        res.status(200).json({
            success: true,
            summary: {
                totalLawyers: allLawyers.length,
                verifiedLawyers: verified.length,
                verifiedAndVisible: verifiedAndActive.length,
                verifiedButHidden: verifiedButInactive.length,
                notVerified: notVerified.length,
                issue: verifiedButInactive.length > 0 ? `⚠️ ${verifiedButInactive.length} verified lawyers are NOT visible to users (isActive=false)` : '✅ All verified lawyers are visible'
            },
            data: {
                visible: verifiedAndActive.map(l => ({
                    id: l._id,
                    name: l.name,
                    email: l.email,
                    status: '✅ Visible to users',
                    kycStatus: l.kycStatus,
                    isActive: l.isActive,
                    rating: l.rating
                })),
                hidden: verifiedButInactive.map(l => ({
                    id: l._id,
                    name: l.name,
                    email: l.email,
                    status: '❌ HIDDEN from users',
                    kycStatus: l.kycStatus,
                    isActive: l.isActive,
                    rating: l.rating
                }))
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Fix lawyer visibility - activate all verified lawyers
// @route   POST /api/admin/lawyers/fix-visibility
// @access  Private/Admin
exports.fixLawyerVisibility = async (req, res, next) => {
    try {
        // Find all verified lawyers that are NOT active
        const inactiveLawyers = await User.find({
            role: 'lawyer',
            kycStatus: 'verified',
            isActive: false
        });

        if (inactiveLawyers.length === 0) {
            return res.status(200).json({
                success: true,
                message: '✅ No issues found - all verified lawyers are visible',
                fixed: [],
                count: 0
            });
        }

        // Activate all verified lawyers
        const result = await User.updateMany(
            {
                role: 'lawyer',
                kycStatus: 'verified',
                isActive: false
            },
            {
                $set: { isActive: true, updatedAt: new Date() }
            }
        );

        const fixedLawyers = await User.find({
            role: 'lawyer',
            kycStatus: 'verified',
            isActive: true
        }).select('name email rating');

        console.log(`✅ Fixed lawyer visibility: ${result.modifiedCount} lawyers activated`);

        res.status(200).json({
            success: true,
            message: `✅ Fixed! ${result.modifiedCount} verified lawyers have been activated and are now visible to users`,
            fixed: fixedLawyers,
            count: result.modifiedCount
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;
