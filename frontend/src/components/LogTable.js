import React, { useEffect, useState } from "react";
import { getLogs } from "../api";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

export default function LogTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
    socket.on("new_log", (newLogs) => {
      setLogs((prev) => [...newLogs, ...prev].slice(0, 100));
    });
  }, []);

  const fetchLogs = async () => {
    const res = await getLogs();
    setLogs(res.data);
  };

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          <th>IP</th>
          <th>Time</th>
          <th>Method</th>
          <th>URL</th>
          <th>Status</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i} className="border-t">
            <td>{log.ip}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.method}</td>
            <td>{log.url}</td>
            <td>{log.status}</td>
            <td>{log.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
