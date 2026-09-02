const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.ObjectId,
        ref: 'Document',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    lawyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'rejected'],
        default: 'pending'
    },
    pricingTier: {
        type: String,
        enum: ['quick', 'standard', 'premium'],
        default: 'standard'
    },
    price: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    lawyerNotes: {
        type: String,
        default: ''
    },
    // Structured Feedback
    feedbackSummary: String,
    majorIssues: String,
    minorIssues: String,
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    suggestedClauses: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    slaDeadline: {
        type: Date,
        required: true
    },
    startedAt: Date,
    completedAt: Date,
    isPaid: {
        type: Boolean,
        default: false
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reportReason: {
        type: String,
        enum: ['inappropriate_language', 'spam_contact_info', 'defamatory_content', 'off_platform_solicitation', 'fake_review', 'other'],
        default: null
    },
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    reportedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
ReviewSchema.index({ lawyer: 1, status: 1 });
ReviewSchema.index({ user: 1, createdAt: -1 });
ReviewSchema.index({ slaDeadline: 1, status: 1 });

// Calculate if SLA is breached
ReviewSchema.virtual('isSLABreached').get(function () {
    if (this.status === 'completed') {
        return this.completedAt > this.slaDeadline;
    }
    return Date.now() > this.slaDeadline;
});

// Update timestamp
ReviewSchema.pre('save', function () {
    this.updatedAt = Date.now();

    if (this.isModified('status')) {
        if (this.status === 'in_progress' && !this.startedAt) {
            this.startedAt = Date.now();
        }
        if (this.status === 'completed' && !this.completedAt) {
            this.completedAt = Date.now();
        }
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
