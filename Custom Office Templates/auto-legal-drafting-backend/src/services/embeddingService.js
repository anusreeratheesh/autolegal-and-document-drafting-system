const https = require('https');

class EmbeddingService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = 'models/gemini-embedding-001';
    }

    async getEmbedding(text) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const requestData = JSON.stringify({
            model: this.model,
            content: {
                parts: [{ text: text }]
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1/${this.model}:embedContent?key=${this.apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Embedding API error: ${res.statusCode} - ${data}`));
                    } else {
                        const response = JSON.parse(data);
                        if (response.embedding && response.embedding.values) {
                            resolve(response.embedding.values);
                        } else {
                            reject(new Error('Invalid embedding response format'));
                        }
                    }
                });
            });

            req.on('error', (error) => reject(error));
            req.write(requestData);
            req.end();
        });
    }
}

module.exports = new EmbeddingService();
