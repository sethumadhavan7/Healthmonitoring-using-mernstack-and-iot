const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const mongoURI = 'mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// CORS options
const corsOptions = {
    origin: 'https://healthmonitoring-using-mernstack-and-iot-frontend.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Allow GET and POST requests
};

app.use(cors(corsOptions));
app.use(express.json());

// CSP Header to allow scripts
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-eval';");
    next();
});

// Define your Sensor model
const Sensor = mongoose.model('Sensor', new mongoose.Schema({
    pulse: Number,
    temperature: Number,
    humidity: Number
}));

// Define your routes
app.get('/api/sensors', async (req, res) => {
    try {
        const sensors = await Sensor.find(); // Fetch all sensor data
        res.json(sensors);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/sensors', async (req, res) => {
    try {
        const newSensor = new Sensor(req.body); // Create a new sensor record
        await newSensor.save();
        res.status(201).json(newSensor);
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
