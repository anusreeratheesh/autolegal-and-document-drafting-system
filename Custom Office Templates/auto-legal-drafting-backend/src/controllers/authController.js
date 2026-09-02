const User = require('../models/User');
const { ValidationError, AuthenticationError } = require('../middleware/errorHandler');
const notificationService = require('../services/notificationService');
const fs = require('fs').promises;
const path = require('path');
const otpGenerator = require('otp-generator');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../services/otpEmailService');

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
    try {
        console.log('📧 sendOtp called');
        console.log('📋 Request body:', req.body);
        console.log('📋 Request headers:', req.headers);
        
        const { email } = req.body;
        console.log('📧 Email from body:', email);
        
        if (!email) {
            throw new ValidationError('Please provide an email address');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            specialChars: false,
            lowerCaseAlphabets: false, // Digits only
        });

        // Save OTP to database (upsert to handle re-sends)
        await Otp.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send Email
        await sendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to ' + email
        });
    } catch (err) {
        console.error('❌ sendOtp error:', err);
        next(err);
    }
};

// @desc    Register user / Signup
// @route   POST /api/auth/register || POST /api/auth/signup
// @access  Public
const register = async (req, res, next) => {
    try {
        console.log('✅ Register called');
        console.log('📋 Body:', { name: req.body.name, email: req.body.email, role: req.body.role });
        console.log('📄 File:', req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'None');

        const { name, email, password, role, phone, licenseNumber, specialization, otp } = req.body;

        // Validate required fields
        if (!name || !email || !password || !otp) {
            throw new ValidationError('Please provide name, email, password, and OTP');
        }

        // Validate OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            throw new ValidationError('OTP has expired or has not been sent. Please request a new one.');
        }

        if (otpRecord.otp !== otp) {
            throw new ValidationError('Invalid OTP provided');
        }

        // Block admin role registration
        if (role && role.toLowerCase() === 'admin') {
            throw new ValidationError('Admin accounts cannot be created through registration. Please contact system administrator.');
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        // Create user (only allow 'user' or 'lawyer' roles)
        const allowedRole = (role === 'lawyer') ? 'lawyer' : 'user';

        // Set kycStatus based on role
        // Lawyers need KYC verification, so set to 'pending'
        // Regular users are auto-verified
        const kycStatus = (allowedRole === 'lawyer') ? 'pending' : 'verified';

        // Handle bar council certificate upload for lawyers
        let barCouncilCertificate = undefined;
        if (allowedRole === 'lawyer') {
            if (!req.file) {
                console.warn('⚠️ Lawyer registration attempt without certificate');
                throw new ValidationError('A Bar Council Certificate document is required for lawyer registration.');
            } else {
                try {
                    // Verify file exists on disk before saving path to database
                    const uploadedFilePath = path.join(__dirname, '../../uploads/certificates', req.file.filename);
                    await fs.access(uploadedFilePath);
                    barCouncilCertificate = `/uploads/certificates/${req.file.filename}`;
                    console.log('✅ Certificate verified and will be saved:', barCouncilCertificate);
                } catch (fileError) {
                    console.error('❌ Certificate file verification failed:', fileError.message);
                    throw new ValidationError('Certificate file could not be verified. Please try uploading again.');
                }
            }
        }

        // Format specializations from comma-separated string if provided
        let specializationArray = [];
        if (specialization) {
            specializationArray = typeof specialization === 'string'
                ? specialization.split(',').map(s => s.trim()).filter(Boolean)
                : specialization;
        }

        const user = await User.create({
            name,
            email,
            password,
            role: allowedRole,
            kycStatus: kycStatus,
            ...(allowedRole === 'lawyer' && licenseNumber && { licenseNumber }),
            ...(allowedRole === 'lawyer' && specializationArray.length > 0 && { specialization: specializationArray }),
            ...(allowedRole === 'lawyer' && phone && { metadata: { phone } }),
            ...(barCouncilCertificate && { barCouncilCertificate })
        });

        console.log('✅ User created:', { id: user._id, name: user.name, role: user.role, kycStatus: user.kycStatus });

        // Delete the used OTP
        await Otp.deleteOne({ email });

        // Send welcome email
        try {
            await notificationService.notifyUserWelcome(user);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue execution even if email fails
        }

        await sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        console.log('🔐 Login endpoint called');
        const { email, password } = req.body;
        console.log('📧 Attempting login for:', email);

        // Validate email & password
        if (!email || !password) {
            throw new ValidationError('Please provide an email and password');
        }

        // Check for user
        console.log('🔍 Querying database for user...');
        const user = await User.findOne({ email }).select('+password +refreshToken');
        console.log('✅ Database query completed');

        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Check if user is blocked
        if (user.isBlocked) {
            throw new AuthenticationError('Account has been blocked. Please contact support.');
        }

        // Check KYC verification status for lawyers
        if (user.role === 'lawyer') {
            if (user.kycStatus === 'pending') {
                throw new AuthenticationError('Your account is pending admin verification. Please wait for the admin to verify your Bar Council Certificate. You will receive an email once verified.');
            }
            if (user.kycStatus === 'rejected') {
                throw new AuthenticationError('Your lawyer verification was rejected. Please contact support for more information or resubmit your application.');
            }
            if (user.kycStatus !== 'verified') {
                throw new AuthenticationError('Your account requires verification before you can access the system. Please complete the verification process.');
            }
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            throw new AuthenticationError('Invalid credentials');
        }

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        // Clear refresh token from database and invalidate session
        await User.findByIdAndUpdate(req.user.id, { 
            refreshToken: null,
            // Optional: Add lastLogout timestamp to track user sessions
            lastLogout: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully. Your session has been cleared.'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AuthenticationError('Refresh token required');
        }

        // Verify refresh token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user and verify refresh token
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Generate new tokens
        await sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus
            },
        });
};

// @desc    Send email verification link
// @route   POST /api/auth/send-verification-email
// @access  Private
const sendVerificationEmail = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            throw new ValidationError('User not found');
        }

        if (user.emailVerified) {
            throw new ValidationError('Email is already verified');
        }

        // Generate verification token
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

        user.emailVerificationToken = tokenHash;
        user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await notificationService.sendEmailVerificationEmail(user, verificationUrl);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify email with token
// @route   POST /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            throw new ValidationError('Verification token is required');
        }

        // Hash the token to match stored hash
        const crypto = require('crypto');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            emailVerificationToken: tokenHash,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ValidationError('Invalid or expired verification token');
        }

        // Mark email as verified
        user.emailVerified = true;
        user.verifiedAt = new Date();
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    signup: register,
    login,
    logout,
    refreshToken,
    getMe,
    sendOtp,
    sendVerificationEmail,
    verifyEmail
};
   