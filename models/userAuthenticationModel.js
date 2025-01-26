// Import mongoose to define the schema
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    // Full name of the user (required and trimmed)
    fullName: { type: String, required: true, trim: true },

    // Email (unique, required, and in lowercase)
    email: { type: String, required: true, unique: true, lowercase: true },

    // Password (required)
    password: { type: String, required: true },

    // Role of the user (buyer, vendor, staff, admin, super-admin)
    role: { type: String, enum: ['buyer', 'vendor', 'staff', 'admin', 'super-admin'], default: 'buyer' },

    // Creation date (defaults to current date)
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Export the User model
module.exports = mongoose.model('User', userSchema);
