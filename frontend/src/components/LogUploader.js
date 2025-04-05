import React, { useState } from "react";
import { uploadLogs } from "../api";

export default function LogUploader() {
  const [logs, setLogs] = useState("");

  const handleUpload = async () => {
    const logList = logs.trim().split("\n");
    await uploadLogs(logList);
    alert("Logs uploaded!");
    setLogs("");
  };

  return (
    <div className="p-4">
      <textarea
        rows="8"
        className="w-full border rounded p-2"
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
        placeholder="Paste log lines here..."
      />
      <button onClick={handleUpload} className="mt-2 bg-blue-500 text-white p-2 rounded">
        Upload Logs
      </button>
    </div>
  );
}
