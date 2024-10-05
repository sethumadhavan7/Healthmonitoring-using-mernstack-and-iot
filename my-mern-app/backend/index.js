const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection string (hardcoded)
const mongoUri = 'mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const port = process.env.PORT || 5000; // Use the PORT environment variable from Vercel

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://healthmonitoring-using-mernstack-and-iot-frontend.vercel.app', // Replace with your frontend URL
}));

// MongoDB connection
mongoose.connect(mongoUri, {
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
