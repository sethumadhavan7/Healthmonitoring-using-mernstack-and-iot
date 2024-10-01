const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');

// POST route to create a new sensor data entry
router.post('/', async (req, res) => {
    try {
        const newSensorData = new Sensor(req.body);
        await newSensorData.save();
        res.status(201).json(newSensorData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET route to fetch sensor data
router.get('/', async (req, res) => {
    try {
        const sensorData = await Sensor.find().sort({ createdAt: -1 }).limit(10); // Get latest 10 records
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
