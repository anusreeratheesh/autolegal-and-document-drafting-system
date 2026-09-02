const express = require('express');
const {
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserStatus,
    downloadCertificate
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(upload.single('barCouncilCertificate'), updateProfile);

router.route('/')
    .get(authorize('admin'), getAllUsers);

router.route('/:id/status')
    .put(authorize('admin'), updateUserStatus);

router.route('/:id/certificate')
    .get(downloadCertificate);

module.exports = router;
