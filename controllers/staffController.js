const Product = require('../models/productModel');
const User = require('../models/userAuthenticationModel');

// Add a product for an assigned vendor (Staff role)
exports.createProductForVendor = async (req, res) => {
    const { vendorId, name, description, category, startDate, freeDelivery, deliveryAmount, oldPrice, newPrice } = req.body;
    const staffId = req.user.userId
    try {
        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Product images are required' });
        }

        // Ensure startDate is valid
        if (!startDate) {
            return res.status(400).json({ message: 'Start date is required' });
        }

        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate)) {
            return res.status(400).json({ message: 'Invalid start date' });
        }

        // Calculate the expireDate (7 days from startDate)
        const expireDate = new Date(parsedStartDate);
        expireDate.setDate(expireDate.getDate() + 7);

        // Collect image URLs for the uploaded images
        const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);

        // Ensure float values are formatted correctly
        const formattedDeliveryAmount = parseFloat(deliveryAmount).toFixed(2);
        const formattedOldPrice = parseFloat(oldPrice).toFixed(2);
        const formattedNewPrice = parseFloat(newPrice).toFixed(2);

        // Create the product
        const newProduct = new Product({
            vendorId,
            staffId,
            name,
            description,
            category,
            startDate: parsedStartDate,
            expireDate, // Automatically calculated expire date
            freeDelivery,
            deliveryAmount: formattedDeliveryAmount,
            oldPrice: formattedOldPrice,
            newPrice: formattedNewPrice,
            images: imageUrls,
            productUrl: `/products/${Date.now()}`,
            createdBy: 'staff',
        });

        await newProduct.save();

        return res.status(201).json({
            message: 'Staff: Product created successfully for assigned vendor',
            product: {
                ...newProduct._doc,
                discountAmount: (formattedOldPrice - formattedNewPrice).toFixed(2),
                discountPercentage: (((formattedOldPrice - formattedNewPrice) / formattedOldPrice) * 100).toFixed(2),
            },
        });
    } catch (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};

// Controller for viewing products for an assigned vendor
exports.viewProducts = async (req, res) => {
    try {

        const { vendorId } = req.params; // Get vendorId from request params

        // Ensure the staff is allowed to view products for the specific vendor
        const vendor = await User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(400).json({ message: 'Invalid vendor' });
        }

        // Get products created by the vendor
        const products = await Product.find({ vendorId: vendorId });

        return res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    } catch (err) {
        console.error('Error retrieving products:', err);
        return res.status(500).json({ message: 'Error retrieving products', error: err.message });
    }
};