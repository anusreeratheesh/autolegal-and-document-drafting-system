const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    lawyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    resolution: String,
    resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date
});

// Indexes
DisputeSchema.index({ status: 1, createdAt: -1 });
DisputeSchema.index({ user: 1 });
DisputeSchema.index({ lawyer: 1 });

module.exports = mongoose.model('Dispute', DisputeSchema);
