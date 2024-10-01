// server.js
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const cors = require('cors'); // Import CORS middleware
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express application
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { // Connect to MongoDB using connection string from environment variable
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB'); // Log successful connection
}).catch((error) => {
    console.error('MongoDB connection error:', error); // Log connection error
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running'); // Response for the root route
});

// Routes
const sensorRoutes = require('./routes/sensors'); // Import sensor routes
app.use('/api/sensors', sensorRoutes); // Use sensor routes under /api/sensors

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log server startup
});
