from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import mysql.connector
import os
from utils.log_parser import parse_log_line
from utils.alerts import send_alert_email

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database connection
conn = mysql.connector.connect(
    host=os.environ.get("DB_HOST"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
    database=os.environ.get("DB_NAME")
)
cursor = conn.cursor(dictionary=True)

@app.route('/')
def index():
    return jsonify({"status": "API running"})

@app.route('/upload_logs', methods=['POST'])
def upload_logs():
    logs = request.json.get('logs', [])
    parsed_logs = [parse_log_line(log) for log in logs if parse_log_line(log)]
    for log in parsed_logs:
        query = "INSERT INTO logs (ip, timestamp, method, url, status, size) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (log['ip'], log['timestamp'], log['method'], log['url'], log['status'], log['size']))
    conn.commit()
    socketio.emit('new_log', parsed_logs)
    return jsonify({"message": "Logs uploaded successfully!"})

@app.route('/get_logs', methods=['GET'])
def get_logs():
    cursor.execute("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100")
    return jsonify(cursor.fetchall())

@app.route('/detect_threats', methods=['GET'])
def detect_threats():
    cursor.execute("SELECT ip, COUNT(*) as count FROM logs WHERE status = '401' GROUP BY ip HAVING count > 5")
    threats = cursor.fetchall()
    for threat in threats:
        send_alert_email(threat['ip'], threat['count'])
    return jsonify({"message": "Threat detection complete!"})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
