const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    pulse: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);
