import React, { useState } from "react";
import axios from "axios";
import LiveChart from './components/LiveChart';
import "./App.css"; // Create this for custom styles

const App = () => {
  const [logInput, setLogInput] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadLog = async () => {
    if (!logInput.trim()) {
      setResponseMessage("Please enter a log line.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://log-analysis-backend.onrender.com/upload-log",
        { log: logInput }
      );
      setResponseMessage(response.data.message);
      setLogInput(""); // clear textbox after submission
    } catch (error) {
      setResponseMessage(error.response?.data?.error || "Error uploading log.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🔍 Live Log Threat Analysis</h1>

      <textarea
        placeholder="Paste log line here..."
        value={logInput}
        onChange={(e) => setLogInput(e.target.value)}
        className="log-input"
      />

      <div className="button-group">
        <button onClick={handleUploadLog} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload & Detect"}
        </button>
      </div>

      {responseMessage && (
        <div className="response-message">
          <strong>Server:</strong> {responseMessage}
        </div>
      )}

      <h2>📊 Threat Level Visualization</h2>
      <LiveChart />
    </div>
  );
};

export default App;
