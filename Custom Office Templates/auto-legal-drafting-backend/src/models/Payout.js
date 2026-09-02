const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
    lawyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'rejected'],
        default: 'pending'
    },
    transactionId: String,
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'upi', 'paypal', 'other'],
        default: 'bank_transfer'
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String,
        upiId: String
    },
    notes: String,
    adminNotes: String,
    requestedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date,
    processedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

// Indexes
PayoutSchema.index({ lawyer: 1, status: 1, requestedAt: -1 });
PayoutSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model('Payout', PayoutSchema);
