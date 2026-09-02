const { GoogleGenerativeAI } = require('@google/generative-ai');
const ragService = require('./ragService');

class ChatbotService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not found. Chatbot will not work.');
            return;
        }
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.modelName = 'gemini-3.6-flash';
    }

    parseQuotaError(errorMessage) {
        const retryMatch = errorMessage.match(/retry in ([\d.]+)s/);
        const retrySeconds = retryMatch ? parseFloat(retryMatch[1]) : null;
        const isQuotaError = errorMessage.includes('429') &&
            (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED'));
        return { isQuotaError, retrySeconds };
    }

    async retryOperation(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                const { isQuotaError, retrySeconds } = this.parseQuotaError(error.message);

                if (isQuotaError) {
                    const waitTime = retrySeconds ? Math.ceil(retrySeconds) : 60;
                    throw new Error(
                        `API quota limit exceeded. Please wait ${waitTime} seconds and try again, ` +
                        `or upgrade your Gemini API key at https://aistudio.google.com/app/apikey for higher limits.`
                    );
                }

                const isRetryable = error.message.includes('503') ||
                    error.message.includes('ECONNRESET') ||
                    error.message.includes('ECONNREFUSED') ||
                    error.message.includes('socket hang up');

                if (isRetryable && i < maxRetries - 1) {
                    const delay = Math.pow(2, i) * 2000 + Math.random() * 1000;
                    console.log(`⚠️ Network error (attempt ${i + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    async chat(userMessage, conversationHistory = [], context = {}) {
        if (!this.apiKey || !this.genAI) {
            throw new Error('Gemini API key not configured');
        }

        try {
            // Retrieve relevant legal context using RAG
            let legalContext = '';
            try {
                legalContext = await ragService.retrieve(userMessage, 2);
                if (legalContext) {
                    console.log('✅ Retrieved legal context for chatbot');
                }
            } catch (error) {
                console.warn('⚠️ RAG retrieval failed for chatbot:', error.message);
            }

            const systemPrompt = this.buildSystemPrompt(context, legalContext);

            return await this.retryOperation(async () => {
                // Build chat history for SDK
                const history = [];

                // System prompt as first exchange
                history.push({ role: 'user', parts: [{ text: systemPrompt }] });
                history.push({
                    role: 'model',
                    parts: [{ text: 'I understand. I am an AI Legal Assistant ready to help with legal documents and Indian law. How can I assist you today?' }]
                });

                // Add conversation history
                conversationHistory.forEach(msg => {
                    history.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    });
                });

                const model = this.genAI.getGenerativeModel({
                    model: this.modelName,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                });

                const chat = model.startChat({ history });
                const result = await chat.sendMessage(userMessage);
                const assistantMessage = result.response.text();

                console.log('✅ Chatbot response generated');
                return assistantMessage;
            });
        } catch (error) {
            const { isQuotaError } = this.parseQuotaError(error.message);
            if (isQuotaError) {
                console.error('❌ Gemini API Quota Exceeded (Chatbot)');
            } else {
                console.error('❌ Chatbot Error:', error.message);
            }
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    buildSystemPrompt(context, legalContext) {
        const basePrompt = `You are an AI Legal Assistant for the AutoLegal platform. Your role is to help users with legal document creation in India.

Your capabilities:
1. **Form Assistance**: Guide users on what to enter in document fields
2. **Legal Explanations**: Explain legal clauses and terms in simple, understandable language
3. **Document Q&A**: Answer questions about generated legal documents
4. **Indian Law Context**: Provide information specific to Indian legal requirements

Guidelines:
- Be helpful, clear, and concise
- Use simple language, avoid excessive legal jargon
- When explaining legal terms, provide Indian law context
- If you're unsure, recommend consulting a lawyer
- Be professional and respectful
- Keep responses focused and under 200 words when possible`;

        let contextualPrompt = basePrompt;

        if (context.context === 'form') {
            contextualPrompt += `\n\nCurrent Context: The user is filling out a ${context.templateId || 'document'} form.`;
            if (context.currentField) {
                contextualPrompt += `\nThey are currently on the field: "${context.currentField}"`;
            }
            contextualPrompt += `\nProvide specific guidance on form fields when asked.`;
        } else if (context.context === 'document') {
            contextualPrompt += `\n\nCurrent Context: The user is viewing/editing a ${context.documentType || 'legal'} document.`;
            contextualPrompt += `\nHelp them understand clauses and answer questions about the document.`;
        }

        if (legalContext) {
            contextualPrompt += `\n\nRelevant Legal Information (Indian Law):\n${legalContext}`;
            contextualPrompt += `\n\nUse this information to provide accurate legal guidance.`;
        }

        return contextualPrompt;
    }
}

module.exports = new ChatbotService();
