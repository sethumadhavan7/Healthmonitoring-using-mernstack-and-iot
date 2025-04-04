const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection (Using connection string directly)
mongoose.connect('mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Define a root route for the backend (Optional)
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Health Monitoring API</h1><p>Use /api/sensors to get sensor data.</p>');
});

// Routes
const sensorRoutes = require('./routes/sensors');
app.use('/api/sensors', sensorRoutes);

// Catch-all route for undefined paths
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
