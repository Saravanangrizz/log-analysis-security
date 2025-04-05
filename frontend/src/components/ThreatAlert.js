import React from "react";
import { detectThreats } from "../api";

export default function ThreatAlert() {
  const handleDetect = async () => {
    await detectThreats();
    alert("Threats detected & emails sent (if any).");
  };

  return (
    <button onClick={handleDetect} className="bg-red-500 text-white p-2 mt-4 rounded">
      Detect Threats
    </button>
  );
}
