import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import os
import psycopg2

from backend.utils.log_parser import parse_log_line
from backend.utils.alerts import send_alert_email

app = Flask(__name__)
CORS(app, origins=["https://log-analysis-frontend.onrender.com"])
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins=["https://log-analysis-frontend.onrender.com", "http://localhost:3000"])

DB_CONFIG = {
    "dbname": os.environ.get("DB_NAME"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "host": os.environ.get("DB_HOST"),
    "port": os.environ.get("DB_PORT")
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

        if parsed['level'] == 'CRITICAL':
            subject = "🚨 Security Threat Detected!"
            body = f"A critical log was detected:\n\n{log_line}"
            send_alert_email(subject, body, "recipient@example.com")

        return jsonify({'message': 'Log stored and analyzed successfully.'}), 200
    else:
        return jsonify({'error': 'Failed to parse log line.'}), 400

@app.route('/')
def index():
    return "Log Analysis App is running!"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    socketio.run(app, host='0.0.0.0', port=port)
