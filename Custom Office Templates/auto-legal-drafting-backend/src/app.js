const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
// crossOriginResourcePolicy set to 'cross-origin' so the frontend can load
// uploaded files (certificates) served from the /uploads static directory.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS - Allow both local and production frontend
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',  // Frontend sometimes runs on 3001
    'http://localhost:3006',  // Vite dev server often uses port 3006
    process.env.FRONTEND_URL || 'https://your-app.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (certificates, etc.)
// Must be declared AFTER helmet so CORP header is already set correctly.
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const documents = require('./routes/documents');
const lawyers = require('./routes/lawyers');
const reviews = require('./routes/reviews');
const payouts = require('./routes/payouts');
const notifications = require('./routes/notifications');
const chatbot = require('./routes/chatbot');
const admin = require('./routes/admin');

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/documents', documents);
app.use('/api/lawyers', lawyers);
app.use('/api/reviews', reviews);
app.use('/api/payouts', payouts);
app.use('/api/notifications', notifications);
app.use('/api/chatbot', chatbot);
app.use('/api/admin', admin);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Auto-Legal Drafting API is running',
        version: '1.0.0'
    });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize RAG Service in background
const ragService = require('./services/ragService');
ragService.initialize().catch(err => console.error('RAG Init Error:', err));

app.listen(PORT, () => {
    console.log(`\n🚀 Backend Server Ready!\n`);
    console.log(`   Local:            http://localhost:${PORT}`);
    console.log(`   Environment:      ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Database:         Connected ✅\n`);
});

module.exports = app;
