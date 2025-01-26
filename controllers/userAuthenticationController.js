const User = require('../models/userAuthenticationModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Default super-admin (Only if no super-admin exists)
exports.createSuperAdmin = async () => {
    const superAdminExists = await User.findOne({ role: 'super-admin' });
    if (!superAdminExists) {
        const hashedPassword = await bcrypt.hash('super-admin123', 10);

        const superAdmin = new User({
            fullName: 'Super Admin',
            email: 'superadmin@gmail.com',
            password: hashedPassword,
            role: 'super-admin'
        });

        await superAdmin.save();
        console.log('Default Super-Admin created.');
    }
};
// Create Admin (Only super-admin or existing admin can create admin)
exports.createAdmin = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Only super-admin or existing admin can create an admin
        if (!['super-admin', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Only super-admin or admin can create admin' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new User({
            fullName,
            email,
            password: hashedPassword,
            role: 'admin', // Set the role to 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create staff (Only for admin)
exports.createStaff = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Only admin can create staff
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admin can create staff' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new staff
        const newStaff = new User({
            fullName,
            email,
            password: hashedPassword,
            role: 'staff', // Always staff for this route
        });

        await newStaff.save();
        res.status(201).json({ message: 'Staff created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

exports.registerUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {

        // Ensure that only 'buyer' or 'vendor' can register
        if (role && !['buyer', 'vendor'].includes(role)) {
            return res.status(400).json({ message: "Only 'buyer' or 'vendor' can sign up" });
        }
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'buyer',
        });

        await newUser.save();
        return res.status(201).json({ data: newUser, message: 'Registered successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};


// Login Controller
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login successful', token });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
