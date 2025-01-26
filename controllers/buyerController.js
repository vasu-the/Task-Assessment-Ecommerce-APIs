const Product = require('../models/productModel');

// Controller to view all products with enhanced details
exports.viewAllProducts = async (req, res) => {
    try {
        // Fetch all products with vendor information
        const products = await Product.find().populate('vendorId', 'fullName email'); // Vendor name and email

        // Process products with float handling and discount calculations
        const processedProducts = products.map(product => {
            const discountAmount = (product.oldPrice - product.newPrice).toFixed(2); // Format to 2 decimal places
            const discountPercentage = ((discountAmount / product.oldPrice) * 100).toFixed(2); // Format to 2 decimal places

            // Calculate expiry time
            const expiryTime = Math.max(new Date(product.expireDate).getTime() - Date.now(), 0); // If expired, set to 0

            return {
                ...product._doc,
                // vendorInfo: product.vendorId,
                discountAmount: parseFloat(discountAmount), // Keep as float without rounding
                discountPercentage: parseFloat(discountPercentage),
                expiryTime,
            };
        });

        return res.status(200).json({
            message: 'Buyer:All products retrieved successfully',
            products: processedProducts,
        });
    } catch (err) {
        console.error('Error retrieving products:', err);
        return res.status(500).json({ message: 'Error retrieving products', error: err.message });
    }
};
