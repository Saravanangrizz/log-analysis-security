import React from "react";
import LogUploader from "./components/LogUploader";
import LogTable from "./components/LogTable";
import ThreatAlert from "./components/ThreatAlert";
import LiveChart from './components/LiveChart';

function App() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log Analysis Dashboard</h1>
      <LogUploader />
      <ThreatAlert />
      <LogTable />
      <LiveChart />
    </div>
  );
}

export default App;
