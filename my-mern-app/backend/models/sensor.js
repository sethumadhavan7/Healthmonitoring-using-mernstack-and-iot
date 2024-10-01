// models/Sensor.js
const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    pulse: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now } // Optional: timestamp for readings
});

module.exports = mongoose.model('Sensor', sensorSchema);
