const User = require('../models/userAuthenticationModel');
const Product = require('../models/productModel');


// Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor' });
        return res.status(200).json({ message: 'All vendors fetched successfully', vendors });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching vendors', error: err.message });
    }
};

// Get all staff
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' });
        return res.status(200).json({ message: 'All staff fetched successfully', staff });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching staff', error: err.message });
    }
};

// Get all buyers
exports.getAllBuyers = async (req, res) => {
    try {
        const buyers = await User.find({ role: 'buyer' });
        return res.status(200).json({ message: 'All buyers fetched successfully', buyers });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching buyers', error: err.message });
    }
};

// Controller for creating a new product
exports.createProduct = async (req, res) => {
    const { vendorId, staffId, name, description, category, startDate, freeDelivery, deliveryAmount, oldPrice, newPrice } = req.body;

    // console.log('Request files:', req.files);
    // console.log('Request body:', req.body);   

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

        // Create a product object
        const newProduct = new Product({
            vendorId,
            staffId: staffId || null,
            name,
            description,
            category,
            startDate: parsedStartDate,
            expireDate, // Save the calculated expire date
            freeDelivery,
            deliveryAmount: formattedDeliveryAmount,
            oldPrice: formattedOldPrice,
            newPrice: formattedNewPrice,
            images: imageUrls,
            productUrl: `/products/${Date.now()}`,
            createdBy: 'admin'
        });

        await newProduct.save();

        // Return created product details with discount info
        return res.status(201).json({
            message: 'Admin: Product created successfully',
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
// Get all products (for admin view)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({message:"Get All Products",data:products });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
