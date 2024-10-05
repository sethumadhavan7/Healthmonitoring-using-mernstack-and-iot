const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Import environment variables

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Routes
const sensorRoutes = require('./routes/sensors');
app.use('/api/sensors', sensorRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
