const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    readAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', ChatSchema);
