const mongoose = require("mongoose");
require("dotenv").config();

// Disable strict query mode for mongoose
mongoose.set("strictQuery", false);

// Establish connection to MongoDB using the URL from environment variables
mongoose.connect(process.env.MONGODB_URL, {
  // Options to ensure connection is successful
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    // Log success message if connection is successful
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    // Log error message if connection fails
    console.log(err, "Error");
  });
