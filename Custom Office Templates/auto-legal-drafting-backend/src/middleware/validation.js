const { validationResult } = require('express-validator');
const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

// Validation result checker middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Common validation rules
const validations = {
    email: body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    password: body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    name: body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    objectId: (field = 'id') =>
        param(field)
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage('Invalid ID format'),

    role: body('role')
        .optional()
        .isIn(['user', 'lawyer', 'admin'])
        .withMessage('Invalid role'),

    documentType: body('template_id')
        .notEmpty()
        .withMessage('Document type is required'),

    status: body('status')
        .optional()
        .isIn(['draft', 'pending', 'reviewed', 'approved'])
        .withMessage('Invalid status'),

    paginationQuery: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ]
};

module.exports = {
    validate,
    validations
};
