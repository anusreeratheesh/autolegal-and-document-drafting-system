const ChatbotConversation = require('../models/ChatbotConversation');
const chatbotService = require('../services/chatbotService');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { message, documentId, context, metadata } = req.body;

        if (!message || !message.trim()) {
            throw new ValidationError('Message is required');
        }

        // Find or create conversation
        let conversation = await ChatbotConversation.findOne({
            user: req.user.id,
            document: documentId || null
        });

        if (!conversation) {
            conversation = await ChatbotConversation.create({
                user: req.user.id,
                document: documentId || null,
                context: context || 'general',
                metadata: metadata || {},
                messages: []
            });
        }

        // Add user message to conversation
        conversation.messages.push({
            role: 'user',
            content: message.trim()
        });

        // Get chatbot response
        const conversationHistory = conversation.messages.slice(-10); // Last 10 messages for context
        const contextData = {
            context: conversation.context,
            ...conversation.metadata,
            ...metadata
        };

        const botResponse = await chatbotService.chat(message, conversationHistory, contextData);

        // Add bot response to conversation
        conversation.messages.push({
            role: 'assistant',
            content: botResponse
        });

        // Update context and metadata if provided
        if (context) conversation.context = context;
        if (metadata) conversation.metadata = { ...conversation.metadata, ...metadata };

        await conversation.save();

        res.status(200).json({
            success: true,
            data: {
                message: botResponse,
                conversationId: conversation._id
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get conversation history
// @route   GET /api/chatbot/history/:documentId?
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        const conversation = await ChatbotConversation.findOne({
            user: req.user.id,
            document: documentId || null
        });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                data: {
                    messages: []
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                messages: conversation.messages,
                context: conversation.context,
                metadata: conversation.metadata
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Clear conversation history
// @route   DELETE /api/chatbot/history/:documentId?
// @access  Private
exports.clearHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        await ChatbotConversation.deleteOne({
            user: req.user.id,
            document: documentId || null
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
