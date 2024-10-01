// routes/sensors.js
const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor'); // Adjust path to your Sensor model

// GET all sensor data
router.get('/', async (req, res) => {
    console.log('Fetching sensor data...'); // Log request to fetch sensor data
    try {
        const sensors = await Sensor.find(); // Fetch data from the database
        console.log(sensors); // Log fetched data for debugging
        res.json(sensors); // Respond with the sensor data
    } catch (error) {
        console.error('Error fetching sensor data:', error); // Log error
        res.status(500).json({ message: 'Error fetching sensor data' }); // Respond with error message
    }
});

module.exports = router; // Export the router
