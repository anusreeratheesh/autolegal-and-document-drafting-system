const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('Authorization Check:', {
            userRole: req.user.role,
            requiredRoles: roles,
            userId: req.user.id,
            userName: req.user.name
        });

        if (!roles.includes(req.user.role)) {
            console.log(`❌ Authorization failed: User role '${req.user.role}' not in required roles [${roles.join(', ')}]`);
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        console.log('✅ Authorization passed');
        next();
    };
};
