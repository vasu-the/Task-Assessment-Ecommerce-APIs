**E-commerce Management System (Backend)**

This is a backend API for an E-commerce Management System built with Node.js, Express.js, and MongoDB.
The system features role-based access for Admin, Staff, Vendors, and Buyers, enabling seamless management of users, products, and operations.

**Features**
**User Management**
Role-based access control (Admin, Staff, Vendor, Buyer, Super Admin).
Secure authentication with JWT.
**Product Management**
CRUD operations for products.
Automatic discount calculations and product expiry management.
**Search & Pagination**
APIs for efficient product search and pagination.
**API Routing**
Modular routing for role-specific operations (Admin, Staff, Vendor, Buyer).
**Middleware**
Authorization Middleware: Ensures secure endpoints.
Role Validation Middleware: Enforces role-specific permissions.
**Technologies Used :**
Node.js & Express.js: Backend runtime and framework.
MongoDB & Mongoose: Database and schema management.
JWT: Secure token-based authentication.
Morgan & Body-Parser: HTTP logging and request parsing.

**Installation**

1.Clone the repository:
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

2.Install dependencies:
npm install

3.Set environment variables in a .env file:
PORT=3000
HOSTNAME=localhost
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret

4.Start the Server
npm start or using Nodemon - npm run dev

**API Endpoints**
User Authentication
GET /create-super-admin -Default super admin create.
POST /create-admin  -CreateAdmin by SuperAdmin.
POST /create-staff  -Create Staff (Admin or Super Admin Only).
POST /register  -Register for Buyer and Vendor.
POST /login – Authenticate users and generate JWT for all Roles.


Admin Operations
POST /create-product – Create new products.
GET /vendors – View all vendors.
GET /staffs – View all staff.
GET /buyers – View all buyers.
GET /products - View all products.

Staff Operations
GET /view-products/:vendorId – GetProductsByVendor [vendorId in ObjectId].
POST /add-product –Add Product for Vendor By Staff.

Vendor Operations
GET /vendor-products –View products for vendor.
POST /add-product-by-vendor  -Vendor AddProduct

Buyer Operations
GET /buyre-view-all-products – Buyers view all products.

Search & Pagination
GET /search – Search products with filters and pagination.

**Folder Structrue **

├── config/         # Database connection and environment configuration
├── models/         # Mongoose schemas for users and products
├── routes/         # Modular API routes for each role
├── controllers/    # API logic and request handling
├── middleware/     # Authorization and role validation middleware
├── .env            # Environment variables
├── server.js       # Entry point of the application


**Contributing**
Contributions are welcome! Please follow these steps:
1.Fork the repository.
2.Create a new feature branch: git checkout -b feature-name.
3.Commit changes: git commit -m 'Add feature-name'.
4.Push to the branch: git push origin feature-name.
5.Submit a pull request.

**License**
This project is open-source and available under the MIT License.
