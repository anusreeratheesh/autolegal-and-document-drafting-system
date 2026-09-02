const express = require('express');
const {
    getPendingLawyers,
    verifyLawyer,
    rejectLawyer,
    getDashboardStats,
    getFlaggedReviews,
    getAllVerifiedLawyers,
    fixLawyerVisibility
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Lawyer verification routes
router.get('/lawyers/pending', getPendingLawyers);
router.get('/lawyers/verified/all', getAllVerifiedLawyers);
router.post('/lawyers/:id/verify', verifyLawyer);
router.post('/lawyers/:id/reject', rejectLawyer);
router.post('/lawyers/fix-visibility', fixLawyerVisibility);

// Review management routes
router.get('/reviews/flagged', getFlaggedReviews);

module.exports = router;
