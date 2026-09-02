const Chat = require('../models/Chat');
const Review = require('../models/Review');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../middleware/errorHandler');

// @desc    Get messages for a review
// @route   GET /api/reviews/:reviewId/chat
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        // Check authorization
        if (req.user.role === 'user' && review.user.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this chat');
        }

        if (req.user.role === 'lawyer' && review.lawyer.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this chat');
        }

        const messages = await Chat.find({ review: req.params.reviewId })
            .populate('sender', 'name email role')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send a message
// @route   POST /api/reviews/:reviewId/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        // Check authorization
        if (req.user.role === 'user' && review.user.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to send message in this chat');
        }

        if (req.user.role === 'lawyer' && review.lawyer.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to send message in this chat');
        }

        const chat = await Chat.create({
            review: req.params.reviewId,
            sender: req.user.id,
            message
        });

        const populatedChat = await Chat.findById(chat._id).populate('sender', 'name email role');

        res.status(201).json({
            success: true,
            data: populatedChat
        });
    } catch (err) {
        next(err);
    }
};
