const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000; // Port can still use the environment variable

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Ensure CORS is set to allow all origins for now

// MongoDB connection (hardcoded connection string for Vercel deployment)
mongoose.connect('mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0', {
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
app.use('/sensors', sensorRoutes); // Base route for sensors

// Export the app (for Vercel's serverless function)
module.exports = app;
