const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['review_request', 'review_completed', 'payment', 'message', 'alert', 'approval'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedDocument: {
        type: mongoose.Schema.ObjectId,
        ref: 'Document'
    },
    relatedReview: {
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000 // 30 days in seconds
    }
});

// Indexes
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
