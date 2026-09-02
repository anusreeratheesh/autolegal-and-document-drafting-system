const express = require('express');
const {
    sendMessage,
    getHistory,
    clearHistory
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/message', sendMessage);
router.get('/history', getHistory);
router.get('/history/:documentId', getHistory);
router.delete('/history', clearHistory);
router.delete('/history/:documentId', clearHistory);

module.exports = router;
