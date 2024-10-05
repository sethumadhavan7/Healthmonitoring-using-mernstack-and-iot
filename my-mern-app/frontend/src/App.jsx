import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css'; // Ensure you create this file for custom styles

function App() {
    const [sensorData, setSensorData] = useState([]);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // Updated URL for fetching sensor data from the backend
    const fetchSensorData = async () => {
        try {
            const response = await axios.get('https://healthmonitoring-using-mernstack-and-iot.vercel.app/api/sensors');
            const data = response.data;
            console.log('Fetched data:', data); // Log the data fetched
            
            // Check if the fetched data is different from the current state
            if (JSON.stringify(data) !== JSON.stringify(sensorData)) {
                setSensorData(data);

                // If there is any data, call the handleAlert function
                if (data.length > 0) {
                    handleAlert(data[data.length - 1].pulse); // Call alert function for the latest pulse
                }
            }
        } catch (err) {
            setError('Error fetching sensor data');
            console.error(err);
        }
    };

    useEffect(() => {
        // Fetch data initially
        fetchSensorData();
        // Set an interval to fetch data every 5 seconds
        const interval = setInterval(fetchSensorData, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    // Function to display alert message based on pulse
    const handleAlert = (pulse) => {
        if (pulse <= 50) {
            setAlertMessage('Low BPM');
        } else if (pulse > 50 && pulse <= 120) {
            setAlertMessage('Moderate BPM');
        } else {
            setAlertMessage('High BPM');
        }
    };

    // Prepare data for charts
    const pulseData = {
        labels: sensorData.map((_, index) => `Reading ${index + 1}`),
        datasets: [{
            label: 'Pulse Rate (BPM)',
            data: sensorData.map(item => item.pulse),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    };

    const temperatureData = {
        labels: sensorData.map((_, index) => `Reading ${index + 1}`),
        datasets: [{
            label: 'Temperature (°C)',
            data: sensorData.map(item => item.temperature),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }]
    };

    const humidityData = {
        labels: sensorData.map((_, index) => `Reading ${index + 1}`),
        datasets: [{
            label: 'Humidity (%)',
            data: sensorData.map(item => item.humidity),
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
        }]
    };

    return (
        <div className="App">
            <h1>Health Monitoring Dashboard</h1>

            {error && <p className="error">{error}</p>}
            {alertMessage && <div className="alert">{alertMessage}</div>}

            <div className="sensor-boxes">
                <div className="sensor-box">
                    <h2>Pulse Rate</h2>
                    <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].pulse : '--'} BPM</p>
                </div>
                <div className="sensor-box">
                    <h2>Temperature</h2>
                    <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].temperature : '--'} °C</p>
                </div>
                <div className="sensor-box">
                    <h2>Humidity</h2>
                    <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].humidity : '--'} %</p>
                </div>
            </div>

            <div className="chart-container">
                <Line data={pulseData} />
            </div>
            <div className="chart-container">
                <Line data={temperatureData} />
            </div>
            <div className="chart-container">
                <Line data={humidityData} />
            </div>
        </div>
    );
}

export default App;
