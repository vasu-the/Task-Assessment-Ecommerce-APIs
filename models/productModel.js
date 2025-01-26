// Import mongoose to define schema
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    // Vendor and staff references (ObjectId)
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Creator information (admin, staff, or vendor)
    createdBy: { type: String, enum: ['admin', 'staff', 'vendor'], required: true },

    // Product details
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    // Dates for the product availability
    startDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },

    // Delivery options and pricing
    freeDelivery: { type: Boolean, default: false },
    deliveryAmount: { type: Number, default: 0 },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },

    // Product images and URL
    images: [{ type: String }],
    productUrl: { type: String, required: true, unique: true }
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
