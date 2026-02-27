const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');

// Disable buffering so we see connection errors immediately
mongoose.set('bufferCommands', false);

const app = express();

// Rate Limiting Security
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api/', limiter); // Apply rate limiting to all API routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        dbState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.send('Password Manager API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
} else {
    console.log('Attempting to connect to MongoDB...');

    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas! ✅');
            console.log('Database Name:', mongoose.connection.db.databaseName);
        })
        .catch((err) => {
            console.error('❌ Error connecting to MongoDB:');
            console.error(err.message);
        });

    mongoose.connection.on('error', err => {
        console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test health here: http://localhost:${PORT}/health`);
});
