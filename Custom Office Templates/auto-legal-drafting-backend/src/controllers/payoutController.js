const Payout = require('../models/Payout');
const Review = require('../models/Review');
const notificationService = require('../services/notificationService');
const { ValidationError, NotFoundError, ForbiddenError } = require('../middleware/errorHandler');

// @desc    Create payout request
// @route   POST /api/payouts
// @access  Private (Lawyer)
exports.createPayout = async (req, res, next) => {
    try {
        const { reviewIds, bankDetails, notes } = req.body;

        // Verify all reviews belong to lawyer and are completed
        const reviews = await Review.find({
            _id: { $in: reviewIds },
            lawyer: req.user.id,
            status: 'completed',
            isPaid: false
        });

        if (reviews.length !== reviewIds.length) {
            throw new ValidationError('Some reviews are invalid or already paid');
        }

        const amount = reviews.reduce((sum, review) => sum + review.price, 0);

        const payout = await Payout.create({
            lawyer: req.user.id,
            reviews: reviewIds,
            amount,
            bankDetails,
            notes,
            status: 'pending'
        });

        // Mark reviews as pending payment
        await Review.updateMany(
            { _id: { $in: reviewIds } },
            { $set: { isPaid: true } }
        );

        res.status(201).json({
            success: true,
            data: payout
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all payouts
// @route   GET /api/payouts
// @access  Private
exports.getAllPayouts = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (req.user.role === 'lawyer') {
            query.lawyer = req.user.id;
        }

        if (status) {
            query.status = status;
        }

        const payouts = await Payout.find(query)
            .populate('lawyer', 'name email')
            .populate('reviews', 'document price')
            .sort({ requestedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Payout.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            data: payouts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Process payout (Admin only)
// @route   PUT /api/payouts/:id/process
// @access  Private (Admin)
exports.processPayout = async (req, res, next) => {
    try {
        const { status, transactionId, adminNotes } = req.body;

        const payout = await Payout.findById(req.params.id);

        if (!payout) {
            throw new NotFoundError('Payout not found');
        }

        payout.status = status;
        if (transactionId) payout.transactionId = transactionId;
        if (adminNotes) payout.adminNotes = adminNotes;
        payout.processedAt = Date.now();
        payout.processedBy = req.user.id;

        await payout.save();

        // Notify lawyer
        if (status === 'completed') {
            const lawyer = await require('../models/User').findById(payout.lawyer);
            await notificationService.notifyPayment(lawyer, payout.amount, payout);
        }

        res.status(200).json({
            success: true,
            data: payout
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;
