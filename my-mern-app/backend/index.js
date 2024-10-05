const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000; // You can still use the PORT environment variable from Vercel

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection (hardcoded connection string)
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
app.use('/api/sensors', sensorRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
