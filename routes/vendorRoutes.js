const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/checkRole');
const uploadImage = require('../middlewares/multerMiddleware'); // for handling image uploads

const VendorController = require('../controllers/vendorController');

// Vendor Routes
// View Own Products (Vendor)
router.get('/vendor-products', jwtMiddleware, roleCheck(['vendor']), VendorController.viewProducts);

// Add Product for Vendor
router.post('/add-product-by-vendor', jwtMiddleware, roleCheck(['vendor']), uploadImage.array('images', 5), VendorController.createProductForVendor);

module.exports = router;
