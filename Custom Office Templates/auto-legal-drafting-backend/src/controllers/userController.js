const User = require('../models/User');
const { NotFoundError, ForbiddenError, ValidationError } = require('../middleware/errorHandler');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        // Get current user
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Normalize specialization: flatten nested arrays, handle comma strings, strip empties
        let specialization = req.body.specialization;
        if (specialization !== undefined) {
            // If it's a string (e.g. "Criminal Law,Civil Law"), split it
            if (typeof specialization === 'string') {
                specialization = specialization.split(',').map(s => s.trim());
            }
            // Flatten in case of nested arrays like [['Criminal Law','Civil Law'],'Labour Law']
            specialization = [].concat(...specialization)
                .map(s => (typeof s === 'string' ? s.trim() : String(s)))
                .filter(Boolean);
        }

        const fieldsToUpdate = {
            name: req.body.name,
            metadata: req.body.metadata,
            specialization,
            licenseNumber: req.body.licenseNumber
        };

        // Handle certificate upload for lawyers
        if (user.role === 'lawyer' && req.file) {
            try {
                // Verify file exists on disk
                const uploadedFilePath = path.join(__dirname, '../../uploads/certificates', req.file.filename);
                await fs.access(uploadedFilePath); // Throws error if file doesn't exist
                
                fieldsToUpdate.barCouncilCertificate = `/uploads/certificates/${req.file.filename}`;
                console.log('✅ Certificate uploaded and saved:', fieldsToUpdate.barCouncilCertificate);
            } catch (fileError) {
                console.error('❌ Certificate file verification failed:', fileError.message);
                throw new ValidationError('Certificate file could not be verified. Please try uploading again.');
            }
        }

        // Remove undefined keys so we don't overwrite existing fields with undefined
        Object.keys(fieldsToUpdate).forEach(
            key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};


// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, kycStatus, page = 1, limit = 10 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (kycStatus) query.kycStatus = kycStatus;

        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-password -refreshToken');

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Download certificate (Admin only or lawyer viewing own)
// @route   GET /api/users/:id/certificate
// @access  Private
exports.downloadCertificate = async (req, res, next) => {
    try {
        const receivingUserId = req.params.id;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        // Check authorization: Admin can download any cert, lawyer can only download their own
        if (requestingUserRole !== 'admin' && requestingUserId !== receivingUserId) {
            throw new ForbiddenError('You do not have permission to download this certificate');
        }

        const user = await User.findById(receivingUserId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!user.barCouncilCertificate) {
            throw new NotFoundError('No certificate found for this user');
        }

        const certificatePath = path.join(__dirname, '../../uploads', user.barCouncilCertificate);
        
        // Verify file exists
        try {
            await fs.access(certificatePath);
        } catch {
            throw new NotFoundError('Certificate file not found on server');
        }

        res.download(certificatePath);
    } catch (err) {
        next(err);
    }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
    try {
        const { isActive, isBlocked, kycStatus } = req.body;

        const updateData = {};
        if (typeof isActive !== 'undefined') updateData.isActive = isActive;
        if (typeof isBlocked !== 'undefined') updateData.isBlocked = isBlocked;
        if (kycStatus) updateData.kycStatus = kycStatus;

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password -refreshToken');

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;
