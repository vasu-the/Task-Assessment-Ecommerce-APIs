const express = require('express');
const router = express.Router();
const { viewAllProducts } = require('../controllers/buyerController');
const jwtMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/checkRole');

//Buyer can view all the products
router.get('/buyer-view-all-products', jwtMiddleware, roleCheck(['buyer']), viewAllProducts);

module.exports = router;