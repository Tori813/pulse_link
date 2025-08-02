const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['email', 'password', 'firstName', 'lastName']
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const [existingUser] = await promisePool.query(
            'SELECT user_id FROM users WHERE email = ?', [email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await User.hashPassword(password);
        console.log('Password hashed successfully');

        try {
            console.log('Executing INSERT query...');
            const insertQuery = `
                INSERT INTO users (email, password, first_name, last_name, created_at, updated_at)
                VALUES (?, ?, ?, ?, NOW(), NOW())
            `;
            const insertValues = [email, hashedPassword, firstName, lastName];

            console.log('Query:', insertQuery);
            console.log('Values:', insertValues);

            const [result] = await promisePool.query(insertQuery, insertValues);

            console.log('Insert result:', result);
            const userId = result.insertId;

            // Insert default profile into user_profiles table
            await promisePool.query(
                `INSERT INTO user_profiles (
                    user_id, role_name, gender, alternative_phone_number,
                    emergency_contact_name, relationship, emergency_contact,
                    address, city, country, profile_picture_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    'user',              // default role
                    null,                // gender
                    null,                // alternative phone
                    null,                // emergency_contact_name
                    null,                // relationship
                    null,                // emergency_contact
                    null,                // address
                    null,                // city
                    null,                // country
                    null                 // profile_picture_url
                ]
            );

            console.log('Default profile created for user:', userId);

            res.status(201).json({
                message: 'User registered and profile created successfully',
                userId,
                email,
                firstName,
                lastName
            });
        } catch (error) {
            console.error('Insert error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: 'Email or username already exists',
                    error: 'Duplicate entry'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Registration error:', {
            error,
            message: error.message,
            stack: error.stack,
            type: error.constructor.name,
            request: {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: '*****'
            }
        });

        if (error.message?.includes('ER_BAD_FIELD_ERROR')) {
            return res.status(400).json({
                message: 'Invalid field in request',
                error: 'Bad field'
            });
        }

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const [users] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        // Check if user exists
        if (users.length === 0) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];
        
        // Compare passwords
        const isPasswordValid = await User.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Track login attempt
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'] || '';
        const browserInfo = userAgent.slice(0, 100); // Limit to column size
        const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
        const location = null; // Can be enhanced with GeoIP later

        try {
            await promisePool.query(
                `INSERT INTO user_logins (
                    user_id, ip_address, device_type, browser_info, location, status
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [user.user_id, ip, deviceType, browserInfo, location, 'success']
            );
        } catch (logError) {
            console.error('Error logging login attempt:', logError);
            // Don't fail the login if logging fails
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user data and token (excluding password)
        const { password: _, ...userData } = user;
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', {
            error: error.message,
            stack: error.stack,
            request: {
                email: req.body.email,
                password: '*****'
            }
        });

        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Logout user
router.post('/logout', verifyToken, (req, res) => {
    try {
        // In a real application, you might want to add the token to a blacklist
        // For now, we'll just return a success response
        // The client should remove the token from local storage
        
        res.status(200).json({
            success: true,
            message: 'Successfully logged out'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const [rows] = await promisePool.query(
            `SELECT 
                u.first_name, u.last_name, u.email,
                p.date_of_birth, p.gender, p.phone_number,
                p.alternative_phone_number, p.emergency_contact_name,
                p.relationship, p.emergency_contact,
                p.address, p.city, p.country, p.profile_picture_url
             FROM users u
             JOIN user_profiles p ON u.user_id = p.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Failed to load profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
router.put('/profile/update', verifyToken, async (req, res) => {
    const userId = req.userId;
    const {
        first_name,
        last_name,
        email,
        date_of_birth,
        gender,
        phone_number,
        alternative_phone_number,
        emergency_contact_name,
        relationship,
        emergency_contact,
        address,
        city,
        country
    } = req.body;

    // Start a transaction to ensure both updates succeed or fail together
    const connection = await promisePool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Update users table
        await connection.query(
            `UPDATE users 
             SET first_name = ?, last_name = ?, email = ?
             WHERE user_id = ?`,
            [first_name, last_name, email, userId]
        );

        // Update or insert into user_profiles table
        await connection.query(
            `INSERT INTO user_profiles 
             (user_id, date_of_birth, gender, phone_number, alternative_phone_number, 
              emergency_contact_name, relationship, emergency_contact, address, city, country)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                date_of_birth = VALUES(date_of_birth),
                gender = VALUES(gender),
                phone_number = VALUES(phone_number),
                alternative_phone_number = VALUES(alternative_phone_number),
                emergency_contact_name = VALUES(emergency_contact_name),
                relationship = VALUES(relationship),
                emergency_contact = VALUES(emergency_contact),
                address = VALUES(address),
                city = VALUES(city),
                country = VALUES(country)`,
            [
                userId, date_of_birth, gender, phone_number, alternative_phone_number,
                emergency_contact_name, relationship, emergency_contact, address, city, country
            ]
        );

        await connection.commit();
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Get user login logs
router.get('/logs', verifyToken, async (req, res) => {
    try {
        const [logs] = await promisePool.query(
            `SELECT 
                created_at as login_time, 
                status, 
                ip_address,
                device_type
             FROM user_logins 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [req.userId]
        );

        res.json({ logs });
    } catch (error) {
        console.error('Failed to load logs:', error);
        res.status(500).json({ message: 'Failed to load user logs' });
    }
});
// Change password route
router.post('/change-password', verifyToken, async (req, res) => {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    try {
        // Get the current hashed password from the database
        const [rows] = await promisePool.query(
            'SELECT password FROM users WHERE user_id = ?', 
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Compare the current password with the stored hash
        const isMatch = await User.comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await User.hashPassword(newPassword);

        // Update the password in the database
        await promisePool.query(
            'UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?',
            [hashedNewPassword, userId]
        );

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user login logs
router.get('/logs', verifyToken, async (req, res) => {
    let connection;
    try {
        console.log('Fetching logs for user ID:', req.userId);
        
        // Get a new connection from the pool
        connection = await promisePool.getConnection();
        
        // First, verify the user exists
        const [user] = await connection.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [req.userId]
        );

        if (user.length === 0) {
            console.error('User not found:', req.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User verified, querying logs...');
        
        // Debug: Show the actual query being executed
        const query = `
            SELECT 
                login_time,
                status, 
                ip_address,
                device_type,
                browser_info,
                location
             FROM user_logins 
             WHERE user_id = ? 
             ORDER BY login_time DESC`;
        console.log('Executing query:', query.replace(/\s+/g, ' ').trim());
        
        // Then fetch the logs with the connection
        const [logs] = await connection.query(query, [req.userId]);

        console.log('Successfully fetched', logs.length, 'log entries');
        res.json({ logs });
        
    } catch (error) {
        console.error('Failed to load logs:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sql: error.sql,
            stack: error.stack
        });
        
        // More specific error handling
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ 
                message: 'Database table error',
                error: 'The user_logins table does not exist or is not accessible',
                code: error.code
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to load user logs', 
            error: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        // Always release the connection back to the pool
        if (connection) {
            await connection.release();
        }
    }
});

module.exports = router;
