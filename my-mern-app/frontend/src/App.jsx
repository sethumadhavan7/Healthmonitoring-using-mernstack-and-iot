import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://healthmonitoring-using-mernstack-and-iot.vercel.app/api/sensors');
                setSensors(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Optional: Add an interval to fetch data every X milliseconds
        const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Sensor Data</h1>
            <ul>
                {sensors.map(sensor => (
                    <li key={sensor._id}>
                        Pulse: {sensor.pulse}, Temperature: {sensor.temperature}, Humidity: {sensor.humidity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
