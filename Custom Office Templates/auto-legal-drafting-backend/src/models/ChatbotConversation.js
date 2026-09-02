const mongoose = require('mongoose');

const chatbotConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        default: null,
        index: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    context: {
        type: String,
        enum: ['form', 'document', 'general'],
        default: 'general'
    },
    metadata: {
        templateId: String,
        currentField: String,
        documentType: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
chatbotConversationSchema.index({ user: 1, document: 1 });
chatbotConversationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatbotConversation', chatbotConversationSchema);
