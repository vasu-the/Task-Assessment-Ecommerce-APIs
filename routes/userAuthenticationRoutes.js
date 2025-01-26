const express = require('express');
const router = express.Router();
const userAuthenticationController = require('../controllers/userAuthenticationController');
const roleCheck = require('../middlewares/checkRole');
const jwtMiddleware = require('../middlewares/authMiddleware');

// Super-Admin route to create Super Admin is Default
router.get('/create-super-admin', async (req, res) => {
    await userAuthenticationController.createSuperAdmin();
    return res.json({ message: 'Checked and created super-admin if necessary' });
});

// Create Admin route (only super-admin can create admin)
router.post('/create-admin', jwtMiddleware, roleCheck(['super-admin', 'admin']), userAuthenticationController.createAdmin);

// Admin route to create staff
router.post('/create-staff', jwtMiddleware, roleCheck(['admin', 'super-admin']), userAuthenticationController.createStaff);

// Ensure that only 'buyer' or 'vendor' can register
router.post('/register', userAuthenticationController.registerUser);

// Login route for all roles
router.post('/login', userAuthenticationController.loginUser);

module.exports = router;