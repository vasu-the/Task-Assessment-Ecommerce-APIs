const Product = require('../models/productModel');
const User = require('../models/userAuthenticationModel');

// Controller for adding a product for a vendor (Vendor role)
exports.createProductForVendor = async (req, res) => {
    const { name, description, category, startDate, freeDelivery, deliveryAmount, oldPrice, newPrice } = req.body;
    const vendorId = req.user.userId;
    // Extract vendorId from the authenticated user
    //  const vendorId = req.user.role === 'vendor' ? req.user.userId : null;
    if (!vendorId) {
        return res.status(403).json({ message: 'Unauthorized: Only vendors can create products' });
    }

    try {
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
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Product images are required' });
        }

        const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);

        // Ensure float values are formatted correctly
        const formattedDeliveryAmount = parseFloat(deliveryAmount).toFixed(2);
        const formattedOldPrice = parseFloat(oldPrice).toFixed(2);
        const formattedNewPrice = parseFloat(newPrice).toFixed(2);

        // Create the product
        const newProduct = new Product({
            vendorId,
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
            createdBy: 'vendor', // Marked as created by vendor
        });

        await newProduct.save();

        return res.status(201).json({
            message: 'Vendor: Product created successfully',
            product: {
                ...newProduct._doc,
                discountAmount: (formattedOldPrice - formattedNewPrice).toFixed(2), // Dynamic discount amount
                discountPercentage: (((formattedOldPrice - formattedNewPrice) / formattedOldPrice) * 100).toFixed(2), // Dynamic discount percentage
            },
        });
    } catch (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};

// Controller for viewing products for a specific vendor (Vendor role)
exports.viewProducts = async (req, res) => {
    try {
        const vendorId = req.user.userId; // Fetch userId from the JWT payload
        console.log("Vendor ID from JWT:", vendorId);

        // Fetch the vendor details using the userId
        const vendor = await User.findById(vendorId);

        if (!vendor || vendor.role !== "vendor") {
            console.log("Vendor not found or role mismatch");
            return res.status(404).json({ message: "Vendor not found" });
        }

        console.log("Vendor details:", vendor);

        // Fetch products created by this vendor
        const products = await Product.find({ vendorId });

        return res.status(200).json({
            message: "Vendor products retrieved successfully",
            products,
        });
    } catch (err) {
        console.error("Error retrieving products:", err);
        return res.status(500).json({ message: "Error retrieving products", error: err.message });
    }
};
