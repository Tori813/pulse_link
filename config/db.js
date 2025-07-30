const mysql2 = require('mysql2');

// Create connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'pulse_link',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: true
});

// Create a Promise wrapper for the pool
const promisePool = pool.promise();

// Add query logging
pool.on('connection', (connection) => {
    console.log('New connection established');
});

// Test connection function
const testConnection = async () => {
    try {
        await promisePool.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// Export the pool and test function
module.exports = {
    pool,
    promisePool,
    testConnection
};

pool.on('enqueue', () => {
    console.log('Waiting for available connection');
});

pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
});

pool.on('error', (error) => {
    console.error('Pool error:', error);
});

// Initialize database and create tables
async function initializeDatabase() {
    try {
        // Create database if not exists
        await promisePool.query(`
            CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'pulse_link'}
            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);

        // Use the database
        await promisePool.query(`USE ${process.env.DB_NAME || 'pulse_link'}`);

        // Create users table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create user_logins table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS user_logins (
                login_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                ip_address VARCHAR(45),
                device_type ENUM('Desktop', 'Mobile', 'Tablet', 'Other') NOT NULL,
                browser_info VARCHAR(255),
                location VARCHAR(255),
                status ENUM('success', 'failed') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Database and tables created successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}



// Initialize database and test connection
async function initializeAndTest() {
    try {
        await initializeDatabase();
        await testConnection();
        console.log('MySQL Connected and database initialized successfully');
        return true;
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
}

// Export the pool and functions
module.exports = {
    pool,
    promisePool,
    testConnection,
    initializeDatabase,
    initializeAndTest
};
