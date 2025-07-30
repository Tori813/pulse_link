const bcrypt = require('bcryptjs');

// User model class
class User {
    constructor(data) {
        this.user_id = data.user_id;
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phoneNumber = data.phoneNumber;
        this.role = data.role || 'user';
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    // Hash password before saving
    static async hashPassword(password) {
        console.log('Hashing password:', password);
        const hashed = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');
        return hashed;
    }

    // Compare password
    static async comparePassword(plainPassword, hashedPassword) {
        console.log('Comparing passwords:', plainPassword, hashedPassword);
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        console.log('Password match result:', match);
        return match;
    }
}

module.exports = User;
