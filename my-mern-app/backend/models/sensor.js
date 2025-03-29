const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    pulse: { type: Number, required: true },
    gsr: { type: Number, required: true },  // GSR sensor reading
    sleep_state: { type: String, required: true, enum: ["Awake", "Light Sleep", "Deep Sleep"] }, // Sleep state classification
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);