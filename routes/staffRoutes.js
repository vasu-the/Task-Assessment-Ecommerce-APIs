const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/checkRole');
const uploadImage = require('../middlewares/multerMiddleware'); // for handling image uploads

const StaffController = require('../controllers/staffController');

// Staff Routes
// View Assigned Products for Staff
router.get('/view-products/:vendorId', jwtMiddleware, roleCheck(['staff']), StaffController.viewProducts);

// Add Product for Assigned Vendor (ByStaff)
router.post('/add-product', jwtMiddleware, roleCheck(['staff']), uploadImage.array('images', 5), StaffController.createProductForVendor);

module.exports = router;