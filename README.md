# 🔍 Log Analysis for Security Threats

A full-stack cybersecurity project that analyzes system logs for suspicious activity and visualizes threats in real-time.

## 🚀 Tech Stack

- **Frontend**: ReactJS + Recharts
- **Backend**: Flask + MySQL + Matplotlib
- **Database**: MySQL
- **Deployment**: Render

## 📦 Features

- Upload system log files (CSV format)
- Parse logs & detect threats using custom logic
- Store parsed logs in MySQL
- Display live threat graph
- (Upcoming) Real-time log monitoring & email alerts

## 🛠 Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
