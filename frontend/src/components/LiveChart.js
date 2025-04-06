

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LiveChart = () => {
  const [logLevels, setLogLevels] = useState({
    INFO: 0,
    WARNING: 0,
    ERROR: 0,
    CRITICAL: 0,
  });

  const fetchLogStats = async () => {
    try {
      const response = await axios.get("https://log-analysis-backend.onrender.com/get_logs");
      const logs = response.data.logs;

      const levelCounts = {
        INFO: 0,
        WARNING: 0,
        ERROR: 0,
        CRITICAL: 0,
      };

      logs.forEach((log) => {
        const level = log.level.toUpperCase();
        if (levelCounts[level] !== undefined) {
          levelCounts[level]++;
        }
      });

      setLogLevels(levelCounts);
    } catch (error) {
      console.error("Error fetching logs for chart:", error);
    }
  };

  useEffect(() => {
    fetchLogStats();

    const interval = setInterval(() => {
      fetchLogStats();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: ["INFO", "WARNING", "ERROR", "CRITICAL"],
    datasets: [
      {
        label: "Log Level Counts",
        data: [
          logLevels.INFO,
          logLevels.WARNING,
          logLevels.ERROR,
          logLevels.CRITICAL,
        ],
        backgroundColor: ["#3498db", "#f1c40f", "#e67e22", "#e74c3c"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Live Threat Log Levels",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LiveChart;
