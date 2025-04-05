import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const uploadLogs = (logs) => axios.post(`${API_BASE_URL}/upload_logs`, { logs });
export const getLogs = () => axios.get(`${API_BASE_URL}/get_logs`);
export const detectThreats = () => axios.get(`${API_BASE_URL}/detect_threats`);
