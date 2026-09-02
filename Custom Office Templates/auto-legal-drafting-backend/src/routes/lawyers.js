const express = require('express');
const { getAllLawyers, getLawyer, getLawyerStats } = require('../controllers/lawyerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllLawyers);
router.get('/stats', protect, authorize('lawyer'), getLawyerStats);
router.get('/:id', getLawyer);

module.exports = router;
