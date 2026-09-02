// AI Service Factory
// Handles selection of AI provider (Gemini, OpenAI)

const getAIService = () => {
    // Prioritize Gemini if API key is present
    if (process.env.GEMINI_API_KEY) {
        console.log('✨ Using Gemini AI Service');
        return require('./geminiLegalService');
    }

    const service = process.env.AI_SERVICE;

    switch (service) {
        case 'openai':
            // Assuming OpenAIService is defined elsewhere or imported if needed
            // For now, if openai is selected but not implemented, it will fail, which is expected as per user request to remove mocks
            try {
                return require('./openAIService');
            } catch (e) {
                throw new Error('OpenAI Service not implemented yet');
            }
        case 'gemini':
            return require('./geminiLegalService');
        default:
            throw new Error('❌ No valid AI Service configured. Please set GEMINI_API_KEY or AI_SERVICE in .env');
    }
};

module.exports = { getAIService };
