const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    template_id: {
        type: String,
        required: [true, 'Please specify a document type'],
    },
    fields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'in_progress', 'reviewed', 'approved'],
        default: 'draft',
    },
    // Document content
    generatedContent: {
        type: String,
        default: ''
    },
    reviewedContent: {
        type: String,
        default: ''
    },
    // Review & Pricing
    assignedLawyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    pricingTier: {
        type: String,
        enum: ['quick', 'standard', 'premium'],
        default: 'standard'
    },
    price: {
        type: Number,
        default: 0
    },
    slaDeadline: {
        type: Date
    },
    // Versioning
    version: {
        type: Number,
        default: 1
    },
    // Audit fields
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient querying
DocumentSchema.index({ user: 1, createdAt: -1 });
DocumentSchema.index({ assignedLawyer: 1, status: 1 });
DocumentSchema.index({ status: 1, slaDeadline: 1 });

// Update timestamp on save
DocumentSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Document', DocumentSchema);
