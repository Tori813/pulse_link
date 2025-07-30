require('dotenv').config();
const express = require('express');
const { initializeAndTest } = require('./config/db');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/users');

// Initialize Express
const app = express();

// Middleware
console.log('Setting up middleware...');

// Request logging middleware
app.use((req, res, next) => {
    console.log('=== Request Start ===');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('=== Request End ===');
    next();
});

// Configure CORS with specific options
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', userRoutes);

// Serve static files from the root directory
app.use(express.static(__dirname));

// Basic route for testing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'intro.html'));
});

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve registration page
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Create an account.html'));
});

// Serve dashboard page
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('=== Error Start ===');
    console.error('Error details:', {
        error: err,
        message: err.message,
        stack: err.stack,
        code: err.code,
        sql: err.sql,
        sqlState: err.sqlState,
        errno: err.errno,
        requestUrl: req.url,
        requestBody: req.body,
        requestMethod: req.method,
        headers: req.headers
    });
    console.error('=== Error End ===');

    // Handle specific MySQL errors
    if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({
            message: 'Database table not found',
            error: 'The requested table does not exist in the database',
            details: err.message
        });
    } else if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            message: 'Duplicate entry',
            error: 'This record already exists',
            details: err.message
        });
    } else {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message || 'An unexpected error occurred',
            type: err.constructor.name
        });
    }
});

// Test and initialize database
async function startServer() {
    try {
        // Initialize database and test connection
        await initializeAndTest();
        console.log('Database initialized and connection successful');
        
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Visit: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
