# backend/app.py
import eventlet
eventlet.monkey_patch()
from flask_cors import CORS
CORS(app, origins=["https://log-analysis-frontend.onrender.com"])

from flask_socketio import SocketIO
from flask import Flask, request, jsonify
import psycopg2
from backend.utils.log_parser import parse_log_line
from backend.utils.alerts import send_alert_email
import os

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins=["https://log-analysis-frontend.onrender.com","http://localhost:3000"])

# PostgreSQL connection settings (you can also load these from environment variables)
DB_CONFIG = {
    "dbname": "log_analysis_db",
    "user": "log_user",
    "password": "uiCHh0hvy13nx53PrzPNiLoIP2bJRllT",
    "host": "dpg-cvok1dq4d50c73bintn0-a.oregon-postgres.render.com",
    "port": "5432"
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

@app.route('/upload-log', methods=['POST'])
def upload_log():
    data = request.get_json()
    log_line = data.get('log')

    if not log_line:
        return jsonify({'error': 'No log data provided'}), 400

    parsed = parse_log_line(log_line)

    if parsed:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO logs (timestamp, level, message, source_ip)
            VALUES (%s, %s, %s, %s)
        """, (parsed['timestamp'], parsed['level'], parsed['message'], parsed['source_ip']))
        conn.commit()
        cur.close()
        conn.close()

        # Threat detection example (you can expand on this logic)
        if parsed['level'] == 'CRITICAL':
            subject = "🚨 Security Threat Detected!"
            body = f"A critical log was detected:\n\n{log_line}"
            send_email_alert(subject, body, "recipient@example.com")

        return jsonify({'message': 'Log stored and analyzed successfully.'}), 200
    else:
        return jsonify({'error': 'Failed to parse log line.'}), 400

@app.route('/')
def index():
    return "Log Analysis App is running!"

if __name__ == '__main__':
    socketio = SocketIO(app, async_mode='eventlet')
