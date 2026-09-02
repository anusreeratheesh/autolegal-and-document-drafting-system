const fs = require('fs');
const path = require('path');
const embeddingService = require('./embeddingService');

class RAGService {
    constructor() {
        this.knowledgeBase = [];
        this.isInitialized = false;
        this.knowledgeDir = path.join(__dirname, '../data/legal_knowledge');
    }

    async initialize() {
        if (this.isInitialized) return;

        console.log('📚 Initializing RAG Knowledge Base...');
        try {
            if (!fs.existsSync(this.knowledgeDir)) {
                console.warn('⚠️ Knowledge base directory not found:', this.knowledgeDir);
                return;
            }

            const files = fs.readdirSync(this.knowledgeDir);
            for (const file of files) {
                if (file.endsWith('.txt')) {
                    const content = fs.readFileSync(path.join(this.knowledgeDir, file), 'utf-8');
                    const chunks = this.chunkText(content);

                    for (const chunk of chunks) {
                        if (chunk.trim().length > 50) { // Ignore small chunks
                            try {
                                const embedding = await embeddingService.getEmbedding(chunk);
                                this.knowledgeBase.push({
                                    text: chunk,
                                    embedding: embedding,
                                    source: file
                                });
                                // Add small delay to avoid rate limits
                                await new Promise(resolve => setTimeout(resolve, 200));
                            } catch (err) {
                                console.error(`Failed to embed chunk from ${file}:`, err.message);
                            }
                        }
                    }
                }
            }
            console.log(`✅ RAG Initialized with ${this.knowledgeBase.length} legal clauses.`);
            this.isInitialized = true;
        } catch (error) {
            console.error('❌ RAG Initialization failed:', error);
        }
    }

    chunkText(text) {
        // Simple chunking by double newlines (paragraphs)
        return text.split(/\n\s*\n/);
    }

    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async retrieve(query, k = 3) {
        if (!this.isInitialized) {
            console.warn('⚠️ RAG not ready yet. Skipping legal context retrieval to avoid blocking.');
            // Start initialization if not already running (this.initializing check would be better but keeping it simple)
            this.initialize();
            return '';
        }

        if (this.knowledgeBase.length === 0) return '';

        try {
            const queryEmbedding = await embeddingService.getEmbedding(query);

            const scoredChunks = this.knowledgeBase.map(item => ({
                ...item,
                score: this.cosineSimilarity(queryEmbedding, item.embedding)
            }));

            scoredChunks.sort((a, b) => b.score - a.score);

            const topChunks = scoredChunks.slice(0, k);
            return topChunks.map(chunk => `[Source: ${chunk.source}]\n${chunk.text}`).join('\n\n');
        } catch (error) {
            console.error('RAG Retrieval failed:', error);
            return '';
        }
    }
}

module.exports = new RAGService();
