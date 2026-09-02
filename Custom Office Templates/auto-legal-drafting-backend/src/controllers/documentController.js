const Document = require('../models/Document');
const Review = require('../models/Review');
const { getAIService } = require('../services/aiService');
const notificationService = require('../services/notificationService');
const { calculateSLADeadline, getPriceForTier } = require('../utils/helpers');
const { NotFoundError, ForbiddenError, ValidationError } = require('../middleware/errorHandler');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
    try {
        const { status, template_id, page = 1, limit = 10 } = req.query;

        // Build query based on user role
        let query = {};

        if (req.user.role === 'user') {
            query.user = req.user.id;
        } else if (req.user.role === 'lawyer') {
            // Lawyers can only see documents assigned to them
            query.assignedLawyer = req.user.id;
        }
        // Admin can see all documents

        if (status) query.status = status;
        if (template_id) query.template_id = template_id;

        const documents = await Document.find(query)
            .populate('user', 'name email')
            .populate('assignedLawyer', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Document.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            data: documents,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('user', 'name email')
            .populate('assignedLawyer', 'name email rating');

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        // Check authorization
        if (req.user.role === 'user' && document.user._id.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this document');
        }

        if (req.user.role === 'lawyer' && document.assignedLawyer?._id.toString() !== req.user.id) {
            throw new ForbiddenError('Not authorized to access this document');
        }

        res.status(200).json({
            success: true,
            data: document,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new document
// @route   POST /api/documents
// @access  Private
exports.createDocument = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;
        req.body.createdBy = req.user.id;

        const document = await Document.create(req.body);

        res.status(201).json({
            success: true,
            data: document,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Generate document with AI
// @route   POST /api/documents/generate
// @access  Private
exports.generateDocument = async (req, res, next) => {
    try {
        const { template_id, title, fields, pricingTier = 'standard' } = req.body;

        if (!template_id || !fields) {
            throw new ValidationError('template_id and fields are required');
        }

        // Generate content using AI service
        const aiService = getAIService();
        const generatedContent = await aiService.generateDocument(template_id, fields);

        // Calculate SLA and price
        const slaDeadline = calculateSLADeadline(pricingTier);
        const price = getPriceForTier(pricingTier);

        // Create document
        const document = await Document.create({
            title: title || `${template_id} - ${new Date().toLocaleDateString()}`,
            template_id,
            fields,
            generatedContent,
            user: req.user.id,
            createdBy: req.user.id,
            status: 'draft',
            pricingTier,
            price,
            slaDeadline
        });

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
    try {
        let document = await Document.findById(req.params.id);

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        // Make sure user owns document
        if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ForbiddenError('Not authorized');
        }

        req.body.updatedBy = req.user.id;

        document = await Document.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: document,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            throw new NotFoundError('Document not found');
        }

        // Make sure user owns document
        if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ForbiddenError('Not authorized');
        }

        await document.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
