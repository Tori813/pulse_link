const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from file:// protocol
        if (!origin || origin === 'null') {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});
app.use(express.json());
app.use(express.static('public'));

// Sync models with database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database models synced successfully');
    })
    .catch(err => {
        console.error('Error syncing models:', err);
    });

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test MySQL connection
app.get('/api/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'success', message: 'Database connection has been established successfully.' });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Unable to connect to the database.',
            error: error.message 
        });
    }
});

// Create account endpoint
app.post('/api/login', async (req, res) => {
    try {
        console.log('=== Login Request ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid email or password'
            });
        }

        // Return user data without password
        res.status(200).json({ 
            status: 'success',
            message: 'Login successful',
            user: {
                id: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role,
                username: user.username
            }
        });

    } catch (error) {
        console.error('=== Error during login ===');
        console.error('Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to login',
            error: error.message
        });
    }
});

app.post('/api/create-account', async (req, res) => {
    try {
        console.log('=== Account Creation Request ===');
        console.log('Request method:', req.method);
        console.log('Request URL:', req.url);
        console.log('Request headers:', JSON.stringify(req.headers, null, 2));
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        // Get all fields from request body
        const { firstName, lastName, email, password, phoneNumber, role, username } = req.body;

        // Log all received fields
        console.log('Received fields:');
        console.log('firstName:', firstName);
        console.log('lastName:', lastName);
        console.log('email:', email);
        console.log('phoneNumber:', phoneNumber);
        console.log('role:', role);
        console.log('username:', username);

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !phoneNumber || !username) {
            console.error('Missing required fields:', {
                firstName: !!firstName,
                lastName: !!lastName,
                email: !!email,
                password: !!password,
                phoneNumber: !!phoneNumber,
                username: !!username
            });
            return res.status(400).json({ 
                status: 'error', 
                message: 'All fields are required',
                error: 'Missing required fields'
            });
        }

        // Check if user already exists
        console.log('Checking if user exists with email:', email);
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ 
                status: 'error', 
                message: 'User with this email already exists',
                error: 'User already exists'
            });
        }

        // Hash password
        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Create new user
        console.log('Creating new user with data:', {
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            username
        });

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            phone_number: phoneNumber,
            role: role || 'patient',
            username
        };

        console.log('Attempting to create user with data:', JSON.stringify(userData, null, 2));
        
        // Add detailed logging before User.create
        console.log('User model attributes:', User.rawAttributes);
        console.log('Sequelize connection:', sequelize.config);
        
        const user = await User.create(userData, {
            logging: console.log
        });
        
        console.log('User created successfully:', user);
        console.log('User data type:', typeof user);
        console.log('User object keys:', Object.keys(user));

        // Return success response without password
        res.status(201).json({ 
            status: 'success',
            message: 'Account created successfully',
            user: {
                id: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phoneNumber: user.phone_number,
                role: user.role,
                username: user.username
            }
        });
    } catch (error) {
        console.error('=== Error creating account ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            name: error.name,
            code: error.code,
            sql: error.sql,
            sqlState: error.sqlState,
            errno: error.errno,
            sqlMessage: error.sqlMessage
        });

        // Log the request body that caused the error
        console.error('Failed request body:', JSON.stringify(req.body, null, 2));

        // Log Sequelize state
        console.error('Sequelize connection state:', sequelize.connectionManager.getConnections());
        console.error('Sequelize model state:', User);

        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to create account',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                name: error.name,
                code: error.code,
                sql: error.sql,
                sqlState: error.sqlState,
                errno: error.errno,
                sqlMessage: error.sqlMessage
            } : undefined
        });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'intro.html'));
});

app.listen(port, () => {
    console.log(`Pulse Link server is running on port ${port}`);
});
