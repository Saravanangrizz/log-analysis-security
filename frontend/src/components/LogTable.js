import React, { useEffect, useState } from 'react';

const LogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://log-analysis-backend.onrender.com/get_logs');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data.logs)) {
          setLogs(data.logs);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading logs...</p>;
  }

  if (error) {
    return <p>Error fetching logs: {error}</p>;
  }

  return (
    <div>
      <h2>Log Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Message</th>
            <th>Source IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.level}</td>
                <td>{log.message}</td>
                <td>{log.source_ip}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
