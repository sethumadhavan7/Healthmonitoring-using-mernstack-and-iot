const express = require('express');
const router = express.Router();
const Sensor = require('../models/sensor');

// POST route to create new sensor data
router.post('/', async (req, res, next) => {
    try {
        const { pulse, gsr, sleep_state } = req.body;

        // Validate input
        if (pulse === undefined || gsr === undefined || !sleep_state) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['pulse', 'gsr', 'sleep_state']
            });
        }

        // Create new document
        const newSensorData = new Sensor({ 
            pulse: parseInt(pulse),
            gsr: parseInt(gsr),
            sleep_state 
        });

        await newSensorData.save();
        
        res.status(201).json({
            message: 'Data saved successfully',
            data: newSensorData
        });

    } catch (error) {
        next(error); // Pass to error handler
    }
});

// GET latest sensor data
router.get('/', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const sensorData = await Sensor.find()
            .sort({ createdAt: -1 })
            .limit(limit);
            
        res.json({
            count: sensorData.length,
            data: sensorData
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
