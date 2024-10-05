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
    origin: 'https://healthmonitoring-using-mernstack-and-iot-frontend.vercel.app', // Your frontend URL
}));

// MongoDB connection
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

// Sensor Schema
const sensorSchema = new mongoose.Schema({
    pulse: Number,
    temperature: Number,
    humidity: Number,
}, { timestamps: true });

const Sensor = mongoose.model('Sensor', sensorSchema);

// Route to get sensor data
app.get('/api/sensors', async (req, res) => {
    try {
        const sensorData = await Sensor.find().sort({ _id: -1 }).limit(10); // Fetch the last 10 readings
        if (sensorData.length === 0) {
            return res.status(404).json({ message: 'No sensor data available.' }); // Return a 404 if no data is found
        }
        res.json(sensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ message: 'Error fetching sensor data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
