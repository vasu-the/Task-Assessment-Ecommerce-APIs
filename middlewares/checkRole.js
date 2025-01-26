// Middleware to check if the user's role is authorized
module.exports = (roles) => {
    return (req, res, next) => {
        // Check if the user's role is in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the right role' });
        }
        // Proceed to the next middleware or route handler
        next();
    };
};
