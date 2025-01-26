const Product = require('../models/productModel');

// Search and List Products (with pagination)
exports.searchAndListProducts = async (req, res) => {
    try {
        // Get query parameters for pagination and search
        const { page = 1, limit = 10, search = '' } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Define the search filter criteria
        const searchCriteria = {
            $or: [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive search for 'name'
                { category: { $regex: search, $options: 'i' } }, // Case-insensitive search for 'category'
            ]
        };

        // Fetch products with the search criteria, and paginate the results
        const products = await Product.find(searchCriteria)
            .skip((pageNumber - 1) * limitNumber) // Skip products for the current page
            .limit(limitNumber) // Limit the number of products per page
            .populate('vendorId', 'fullName email'); // Populating vendor details

        // Count total number of matching products for pagination info
        const totalProducts = await Product.countDocuments(searchCriteria);

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Construct the response
        return res.status(200).json({
            message: 'Products retrieved successfully',
            data: {
                products,
                pagination: {
                    totalProducts,
                    totalPages,
                    currentPage: pageNumber,
                    limit: limitNumber
                }
            }
        });
    } catch (err) {
        console.error('Error retrieving products:', err);
        return res.status(500).json({ message: 'Error retrieving products', error: err.message });
    }
};
