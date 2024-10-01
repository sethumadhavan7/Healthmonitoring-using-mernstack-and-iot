const express = require('express');
const router = express.Router();
const SensorData = require('../models/sensorData'); // Ensure this is your model

// Get all sensor data
router.get('/', async (req, res) => {
    try {
        const data = await SensorData.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
