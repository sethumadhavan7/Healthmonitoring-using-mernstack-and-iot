const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');

// POST route to create a new sensor data entry
router.post('/', async (req, res) => {
    try {
        const { pulse, temperature, humidity } = req.body;

        // Check for missing fields
        if (!pulse || !temperature || !humidity) {
            return res.status(400).json({ message: 'Missing required fields: pulse, temperature, and humidity' });
        }

        // Create new sensor data entry
        const newSensorData = new Sensor({ pulse, temperature, humidity });
        await newSensorData.save();
        res.status(201).json(newSensorData); // Return created data with 201 status code
    } catch (error) {
        console.error('Error creating sensor data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to fetch sensor data
router.get('/', async (req, res) => {
    try {
        const sensorData = await Sensor.find().sort({ createdAt: -1 }).limit(10); // Get latest 10 records
        res.json(sensorData);
    } catch (error) {
        console.error('Error fetching sensor data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
