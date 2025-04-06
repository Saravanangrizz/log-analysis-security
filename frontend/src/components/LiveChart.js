import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const socket = io('https://log-analysis-backend.onrender.com');

function LiveChart() {
  const [logCounts, setLogCounts] = useState({});
  const [labels, setLabels] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    socket.on('new_log', (log) => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      const level = log.level;

      setLogCounts(prev => ({
        ...prev,
        [level]: [...(prev[level] || []), { x: time, y: 1 }]
      }));

      setLabels(prevLabels => {
        if (!prevLabels.includes(time)) {
          return [...prevLabels, time].slice(-10);  // keep last 10 timestamps
        }
        return prevLabels;
      });
    });

    return () => {
      socket.off('new_log');
    };
  }, []);

  const chartData = {
    labels: labels,
    datasets: Object.entries(logCounts).map(([level, data], index) => ({
      label: level,
      data: labels.map(label => data.filter(d => d.x === label).length),
      borderColor: getColor(level),
      fill: false
    }))
  };

  return (
    <div>
      <h3>📊 Live Log Threat Visualization</h3>
      <Line ref={chartRef} data={chartData} />
    </div>
  );
}

const getColor = (level) => {
  switch (level) {
    case 'INFO': return 'blue';
    case 'WARNING': return 'orange';
    case 'ERROR': return 'red';
    case 'CRITICAL': return 'purple';
    default: return 'gray';
  }
};

export default LiveChart;
