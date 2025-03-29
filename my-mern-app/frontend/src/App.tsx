import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';
import AIChat from './AIChat';

// Define the type for sensor data
interface SensorData {
  pulse: number;
  gsr: number;
  sleep_state: string;
}

function App() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  // Fetch sensor data from backend
  const fetchSensorData = async () => {
    try {
      const response = await axios.get<SensorData[]>('https://healthmonitoring-using-mernstack-and-iot.vercel.app/api/sensors');
      const data = response.data;

      if (data.length > 0) {
        setSensorData(data);
        const latestData = data[data.length - 1];
        handleAlert(latestData);
        generateAIRecommendation(latestData);
      }
    } catch (err) {
      setError('Error fetching sensor data');
      console.error(err);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchSensorData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Display alert message based on Pulse and GSR readings
  const handleAlert = (latestData: SensorData) => {
    if (!latestData) return;
    const { pulse, gsr, sleep_state } = latestData;

    if (pulse < 50) {
      setAlertMessage('⚠️ Low BPM - Possible sleep disturbance.');
    } else if (pulse > 120) {
      setAlertMessage('⚠️ High BPM - Possible stress or REM sleep.');
    } else {
      setAlertMessage(`🛌 Sleep State: ${sleep_state}`);
    }
  };

  // Generate AI-based sleep insights
  const generateAIRecommendation = (latestData: SensorData) => {
    if (!latestData) return;

    const { pulse, gsr, sleep_state } = latestData;
    const GSR_MIN = 800, GSR_MAX = 3500;
    const gsrNormalized = Math.min(Math.max(((gsr - GSR_MIN) / (GSR_MAX - GSR_MIN)) * 100, 0), 100);

    let recommendation = '';

    if (sleep_state === "Awake") {
      if (gsrNormalized > 70) {
        recommendation = "😟 High stress detected! Try meditation or deep breathing.";
      } else if (pulse > 100) {
        recommendation = "☕ Avoid caffeine before bedtime to lower heart rate.";
      } else {
        recommendation = "📵 Reduce screen time and dim the lights for better sleep.";
      }
    } 
    else if (sleep_state === "Light Sleep") {
      recommendation = "🛏️ Improve sleep by maintaining a consistent bedtime routine.";
    } 
    else if (sleep_state === "Deep Sleep") {
      recommendation = "✅ Good deep sleep! Avoid interruptions for better rest.";
    } 
    else {
      recommendation = "🌙 Your sleep pattern looks normal. Keep a balanced routine.";
    }

    setAiRecommendation(recommendation);
  };

  // Chart Data
  const pulseData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'Pulse Rate (BPM)',
      data: sensorData.map(item => item.pulse ?? 0),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }]
  };

  const gsrData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'GSR Value',
      data: sensorData.map(item => item.gsr ?? 0),
      borderColor: 'rgba(255, 159, 64, 1)',
      fill: false,
    }]
  };

  return (
    <div className="App">
      <h1>Sleep Pattern Analysis Dashboard</h1>

      {error && <p className="error">{error}</p>}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      {/* Sensor Data Boxes */}
      <div className="sensor-boxes">
        <div className="sensor-box">
          <h2>Pulse Rate</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].pulse : '--'} BPM</p>
        </div>
        <div className="sensor-box">
          <h2>GSR Reading</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].gsr : '--'}</p>
        </div>
        <div className="sensor-box">
          <h2>Sleep State</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].sleep_state : '--'}</p>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <div className="suggestion-box">
        <h2>💡 AI Suggestion</h2>
        <p>{aiRecommendation || "No suggestion available yet."}</p>
      </div>

      {/* Charts */}
      <div className="chart-container">
        <Line data={pulseData} />
      </div>
      <div className="chart-container">
        <Line data={gsrData} />
      </div>

      {/* Doctor Consultation Section */}
      <div className="consultation-box">
        <h2>🩺 Need a Doctor Consultation?</h2>
        <p>Click below to connect with a doctor for further health analysis.</p>
        <a 
          href="https://hearttohear-frontend.onrender.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="consultation-button"
        >
          Consult a Doctor
        </a>
      </div>

      {/* AI Chat Button */}
      <button 
        className="ai-chat-button"
        onClick={() => setShowAIChat(true)}
      >
        💬 AI Chat
      </button>

      {/* AI Chat Modal */}
      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
    </div>
  );
}

export default App;
