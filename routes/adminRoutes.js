const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const jwtMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/checkRole');
const uploadImage = require('../middlewares/multerMiddleware'); // for handling image uploads

// Admin: Get all vendors
router.get('/vendors', jwtMiddleware, roleCheck(['admin', 'super-admin']), adminController.getAllVendors);

// Admin: Get all staff
router.get('/staffs', jwtMiddleware, roleCheck(['admin', 'super-admin']), adminController.getAllStaff);

// Admin: Get all buyers
router.get('/buyers', jwtMiddleware, roleCheck(['admin', 'super-admin']), adminController.getAllBuyers);

// Admin Routes for Product Management
router.post('/create-product', jwtMiddleware, roleCheck(['admin', 'super-admin']), uploadImage.array('images', 5), adminController.createProduct); // Create a product
router.get('/products', jwtMiddleware, roleCheck(['admin', 'super-admin']), adminController.getAllProducts); // View all products

module.exports = router;