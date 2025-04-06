import React from "react";
import LogUploader from "./components/LogUploader";
import LogTable from "./components/LogTable";
import ThreatAlert from "./components/ThreatAlert";
import LiveChart from './components/LiveChart';
import LiveCharts from "./components/LiveCharts";

function App() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 style={{ textAlign: "center", marginTop: "1rem" }}>🛡️ Log Analysis Dashboard</h1>
      <LogUploader />
      <ThreatAlert />
      <LogTable />
      <LiveCharts />
      <LiveChart />
    </div>
  );
}

export default App;
