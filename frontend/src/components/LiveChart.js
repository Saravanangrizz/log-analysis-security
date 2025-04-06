
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import './LiveCharts.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LiveCharts = () => {
  const [logInput, setLogInput] = useState("");
  const [threatLevels, setThreatLevels] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [output, setOutput] = useState("");

  // Load data on mount
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("https://log-analysis-backend.onrender.com/get_logs");
      const logs = res.data.logs.reverse(); // show in chronological order
      setThreatLevels(logs.map(log => log.level === 'CRITICAL' ? 3 : log.level === 'ERROR' ? 2 : 1));
      setTimestamps(logs.map(log => new Date(log.timestamp).toLocaleTimeString()));
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const handleUpload = async () => {
    if (!logInput.trim()) return setOutput("❌ Please enter log data.");
    try {
      const res = await axios.post("https://log-analysis-backend.onrender.com/upload-log", {
        log: logInput,
      });
      setOutput(`✅ ${res.data.message}`);
      setLogInput("");
      fetchLogs();
    } catch (err) {
      setOutput(`❌ ${err.response?.data?.error || "Upload failed."}`);
    }
  };

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Threat Level (1=Info, 2=Error, 3=Critical)",
        data: threatLevels,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: value => ["", "Info", "Error", "Critical", ""][value],
        },
      },
    },
  };

  return (
    <div className="live-chart-container">
      <h2>📊 Live Threat Visualization</h2>

      <textarea
        value={logInput}
        onChange={e => setLogInput(e.target.value)}
        placeholder="Paste or type log line here..."
        rows={4}
        className="log-input"
      />

      <div className="button-group">
        <button onClick={handleUpload}>⬆️ Upload Log</button>
        <button onClick={fetchLogs}>🔍 Refresh & Detect</button>
      </div>

      {output && <div className="output-box">{output}</div>}

      <div className="chart-area">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LiveChart;
