const express = require('express');
const {
    getDocuments,
    getDocument,
    createDocument,
    generateDocument,
    updateDocument,
    deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { generationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getDocuments)
    .post(createDocument);

router.post('/generate', generationLimiter, generateDocument);

router.route('/:id')
    .get(getDocument)
    .put(updateDocument)
    .delete(deleteDocument);

module.exports = router;
