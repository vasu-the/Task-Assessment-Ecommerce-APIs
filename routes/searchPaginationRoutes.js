const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/authMiddleware');
const { searchAndListProducts } = require('../controllers/searchPaginationController');
const roleCheck = require('../middlewares/checkRole');

// Search and List Products with Pagination (for all roles)
router.get('/search', jwtMiddleware, roleCheck(['admin', 'super-admin', 'staff', 'vendor', 'buyer']), searchAndListProducts);

module.exports = router;