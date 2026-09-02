const User = require('../models/User');
const Review = require('../models/Review');
const { NotFoundError } = require('../middleware/errorHandler');

// @desc    Get all lawyers
// @route   GET /api/lawyers
// @access  Public
exports.getAllLawyers = async (req, res, next) => {
    try {
        const { specialization, minRating, page = 1, limit = 10 } = req.query;

        const query = { role: 'lawyer', isActive: true, kycStatus: 'verified' };

        if (specialization) {
            query.specialization = { $in: [specialization] };
        }

        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        const lawyers = await User.find(query)
            .select('name email specialization rating totalReviews kycStatus metadata barCouncilCertificate')
            .sort({ rating: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            data: lawyers,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single lawyer
// @route   GET /api/lawyers/:id
// @access  Public
exports.getLawyer = async (req, res, next) => {
    try {
        const lawyer = await User.findOne({
            _id: req.params.id,
            role: 'lawyer'
        }).select('-password -refreshToken');

        if (!lawyer) {
            throw new NotFoundError('Lawyer not found');
        }

        res.status(200).json({
            success: true,
            data: lawyer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get lawyer statistics
// @route   GET /api/lawyers/stats
// @access  Private (Lawyer)
exports.getLawyerStats = async (req, res, next) => {
    try {
        const totalReviews = await Review.countDocuments({
            lawyer: req.user.id
        });

        const completedReviews = await Review.countDocuments({
            lawyer: req.user.id,
            status: 'completed'
        });

        const pendingReviews = await Review.countDocuments({
            lawyer: req.user.id,
            status: { $in: ['pending', 'in_progress'] }
        });

        const totalEarnings = await Review.aggregate([
            { $match: { lawyer: req.user._id, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalReviews,
                completedReviews,
                pendingReviews,
                totalEarnings: totalEarnings[0]?.total || 0,
                rating: req.user.rating
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;
