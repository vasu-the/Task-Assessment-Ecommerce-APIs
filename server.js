// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
require('dotenv').config();
require('./config/db'); // Import database connection configuration

// Set up environment variables
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

// Initialize the express application
const app = express();

// CORS middleware to handle cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Logging middleware for incoming requests
app.use(morgan('dev'));

// Middleware for parsing JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS with specific options
app.use(cors({
    origin: "*", // Allow requests from any origin
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));

// Basic route for testing the API
app.get('/', (req, res) => {
   return res.json({ msg: 'Welcome to the app' })
})

// Import route files for different user roles
const userAuthenticationRoutes = require('./routes/userAuthenticationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const searchPaginationRoutes = require('./routes/searchPaginationRoutes');

// Use the imported routes in the application
app.use('/', userAuthenticationRoutes);
app.use('/', adminRoutes);
app.use('/', staffRoutes);
app.use('/', vendorRoutes);
app.use('/', buyerRoutes);
app.use('/', searchPaginationRoutes);

// Start the server and listen on the specified port and hostname
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
});
