const express = require('express');
const {
    createReview,
    getAllReviews,
    getReview,
    updateReviewStatus,
    acceptReview,
    rejectReview,
    completeReview
} = require('../controllers/reviewController');
const {
    getMessages,
    sendMessage
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllReviews)
    .post(authorize('user'), createReview);

router.get('/:id', getReview);

router.put('/:id/status', authorize('lawyer', 'admin'), updateReviewStatus);

router.post('/:id/accept', authorize('lawyer'), acceptReview);

router.post('/:id/reject', authorize('lawyer'), rejectReview);

router.post('/:id/complete', authorize('lawyer'), completeReview);

// Chat routes
router.route('/:reviewId/chat')
    .get(getMessages)
    .post(sendMessage);

module.exports = router;
