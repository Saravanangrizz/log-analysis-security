import React, { useState } from 'react';
import axios from '../api';

const LogUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('logfile', file);

    try {
      const res = await axios.post('/upload', formData);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
        Upload Log
      </button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default LogUploader;
