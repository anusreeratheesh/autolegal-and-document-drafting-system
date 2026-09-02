const express = require('express');
const { createPayout, getAllPayouts, processPayout } = require('../controllers/payoutController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllPayouts)
    .post(authorize('lawyer'), createPayout);

router.put('/:id/process', authorize('admin'), processPayout);

module.exports = router;
