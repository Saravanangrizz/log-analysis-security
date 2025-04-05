import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from '../api';

const LiveChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/threat-graph');
      setData(res.data.data);
    } catch (err) {
      console.error('Chart data error:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Threats Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#f87171" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
