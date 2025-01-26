const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
module.exports = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded user info to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If token verification fails, return an unauthorized error
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: err });
    }
};
