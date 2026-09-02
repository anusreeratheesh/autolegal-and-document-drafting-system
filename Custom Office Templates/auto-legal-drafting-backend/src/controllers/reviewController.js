const Review = require('../models/Review');
const Document = require('../models/Document');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { calculateSLADeadline, getPriceForTier } = require('../utils/helpers');
const { NotFoundError, ValidationError, ForbiddenError } = require('../middleware/errorHandler');

// @desc    Create review request
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { documentId, lawyerId, pricingTier = 'standard', notes } = req.body;

        // Validate document exists and belongs to user
        const document = await Document.findById(documentId);
        if (!document) {
            throw new NotFoundError('Document not found');
        }

        if (document.user.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to review this document');
        }

        // Validate lawyer exists and is active
        let lawyer;
        if (lawyerId) {
            lawyer = await User.findById(lawyerId);
            if (!lawyer) {
                throw new NotFoundError('Lawyer not found');
            }
            if (lawyer.role !== 'lawyer') {
                throw new ValidationError('Selected user is not a lawyer');
            }
            if (!lawyer.isActive) {
                throw new ValidationError('Selected lawyer is not available');
            }
        } else {
            // Fallback: Find any available lawyer
            lawyer = await User.findOne({ role: 'lawyer', isActive: true });
            if (!lawyer) {
                throw new ValidationError('No lawyers available');
            }
        }

        // Check for duplicate pending reviews
        const existingReview = await Review.findOne({
            document: documentId,
            lawyer: lawyer._id,
            status: 'pending'
        });

        if (existingReview) {
            throw new ValidationError('A pending review request already exists for this document and lawyer');
        }

        // Calculate SLA and price
        const slaDeadline = calculateSLADeadline(pricingTier);
        const price = getPriceForTier(pricingTier);

        // Create review
        const review = await Review.create({
            document: documentId,
            user: req.user.id,
            lawyer: lawyer._id,
            pricingTier,
            price,
            slaDeadline,
            status: 'pending',
            notes: notes || ''
        });

        // Populate review data
        await review.populate([
            { path: 'document', select: 'title template_id generatedContent' },
            { path: 'user', select: 'name email' },
            { path: 'lawyer', select: 'name email metadata' }
        ]);

        // Update document
        await Document.findByIdAndUpdate(documentId, {
            assignedLawyer: lawyer._id,
            status: 'pending',
            pricingTier,
            price,
            slaDeadline
        });

        // Send notification
        try {
            await notificationService.notifyReviewRequest(req.user, lawyer, document, review);
        } catch (notifErr) {
            console.error('Notification error:', notifErr);
            // Don't fail the request if notification fails
        }

        res.status(201).json({
            success: true,
            message: 'Review request sent successfully',
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
exports.getAllReviews = async (req, res, next) => {
    try {
        const { status, document, page = 1, limit = 10 } = req.query;

        let query = {};

        if (req.user.role === 'user') {
            query.user = req.user.id;
        } else if (req.user.role === 'lawyer') {
            // Lawyers can only see reviews assigned to them
            query.lawyer = req.user.id;
        }

        if (status) {
            query.status = status;
        }

        if (document) {
            query.document = document;
        }

        const reviews = await Review.find(query)
            .populate('document', 'title template_id generatedContent')
            .populate('user', 'name email')
            .populate('lawyer', 'name email rating metadata')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            data: reviews,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Private
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('document', 'title template_id generatedContent')
            .populate('user', 'name email')
            .populate('lawyer', 'name email rating metadata');

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        // Check authorization
        if (req.user.role === 'user' && review.user._id.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this review');
        }

        if (req.user.role === 'lawyer' && review.lawyer._id.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this review');
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update review status
// @route   PUT /api/reviews/:id/status
// @access  Private (Lawyer)
exports.updateReviewStatus = async (req, res, next) => {
    try {
        const { status, comments, reviewedContent } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        if (review.lawyer.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ForbiddenError('Not authorized');
        }

        review.status = status;
        if (comments) review.comments = comments;
        if (reviewedContent) review.lawyerNotes = reviewedContent;

        await review.save();

        // Update document
        const document = await Document.findById(review.document);
        if (document) {
            document.status = status === 'completed' ? 'reviewed' : 'pending';
            if (reviewedContent) {
                document.reviewedContent = reviewedContent;
            }
            await document.save();

            // Notify user if completed
            if (status === 'completed') {
                const user = await User.findById(review.user);
                const lawyer = await User.findById(review.lawyer);
                await notificationService.notifyReviewCompleted(user, lawyer, document, review);

                // Update lawyer stats
                lawyer.totalReviews += 1;
                await lawyer.save();
            }
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Accept review request
// @route   POST /api/reviews/:id/accept
// @access  Private (Lawyer)
exports.acceptReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        console.log('Accept Review Debug:', {
            reviewId: review._id,
            reviewLawyer: review.lawyer,
            currentUser: req.user.id,
            reviewStatus: review.status
        });

        // Check authorization - Only the assigned lawyer can accept the review
        if (review.lawyer && String(review.lawyer) !== String(req.user.id)) {
            console.log(`❌ Auth failed: Review lawyer ${review.lawyer} !== Current user ${req.user.id}`);
            throw new ForbiddenError('This review is assigned to another lawyer');
        }

        // If review status is not pending, cannot accept (already in progress/done)
        if (review.status !== 'pending') {
            console.log(`❌ Status check failed: Review status is '${review.status}', not 'pending'`);
            throw new ValidationError(`Cannot accept review with status: ${review.status}`);
        }

        review.status = 'in_progress';
        // Always assign to the accepting lawyer
        review.lawyer = req.user.id;

        await review.save();

        // Update document status
        const document = await Document.findById(review.document);
        if (document) {
            document.status = 'in_progress';
            if (!document.assignedLawyer) {
                document.assignedLawyer = req.user.id;
            }
            await document.save();
        }

        console.log('✅ Review accepted successfully');

        res.status(200).json({
            success: true,
            message: 'Review accepted successfully',
            data: review
        });
    } catch (err) {
        console.error('Accept Review Error:', err.message);
        next(err);
    }
};

// @desc    Reject review request
// @route   POST /api/reviews/:id/reject
// @access  Private (Lawyer)
exports.rejectReview = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        if (review.lawyer.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized');
        }

        review.status = 'rejected';
        if (reason) review.notes = reason;
        await review.save();

        // Unassign from document so it goes back to pool
        const document = await Document.findById(review.document);
        if (document) {
            document.assignedLawyer = null;
            document.status = 'pending';
            await document.save();
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Complete review with feedback
// @route   POST /api/reviews/:id/complete
// @access  Private (Lawyer)
exports.completeReview = async (req, res, next) => {
    try {
        const {
            summary,
            majorIssues,
            minorIssues,
            riskLevel,
            suggestedClauses,
            overallRating
        } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        if (review.lawyer.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to complete this review');
        }

        // Update review with feedback
        review.status = 'completed';
        review.feedbackSummary = summary;
        review.majorIssues = majorIssues;
        review.minorIssues = minorIssues;
        review.riskLevel = riskLevel;
        review.suggestedClauses = suggestedClauses;
        review.rating = overallRating;
        review.completedAt = Date.now();

        await review.save();

        // Update document status
        const document = await Document.findById(review.document);
        if (document) {
            document.status = 'reviewed';
            await document.save();

            // Notify user
            const user = await User.findById(review.user);
            const lawyer = await User.findById(review.lawyer);
            
            try {
                if (user && lawyer) {
                    await notificationService.notifyReviewCompleted(user, lawyer, document, review);
                }
            } catch (notificationError) {
                console.error('Error sending review completion notification:', notificationError);
            }

            // Update lawyer stats
            if (lawyer) {
                lawyer.totalReviews += 1;
                // Update average rating if needed (this is lawyer rating, not review rating)
                await lawyer.save();
            }
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;
