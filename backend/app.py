from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_mail import Mail, Message
import mysql.connector
from datetime import datetime
import re
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# ------------------- CONFIG ------------------- #
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'
mail = Mail(app)

# MySQL Configuration
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Sarogrizz@18",
    database="log_analysis"
)
cursor = conn.cursor()

# ------------------- LOG PARSER ------------------- #
def parse_log_line(line):
    log_pattern = r'(\S+) - - \[(.*?)\] \"(\S+) (\S+) (\S+)\" (\d{3}) (\d+)'
    match = re.match(log_pattern, line)
    if match:
        ip, timestamp, method, url, protocol, status, size = match.groups()
        try:
            timestamp_obj = datetime.strptime(timestamp.split()[0], "%d/%b/%Y:%H:%M:%S")
        except Exception:
            return None
        return {
            'ip': ip,
            'timestamp': timestamp_obj,
            'method': method,
            'url': url,
            'status': status,
            'size': size
        }
    return None

# ------------------- EMAIL ALERT ------------------- #
def send_alert_email(ip, count):
    msg = Message(
        subject="\ud83d\udea8 Security Alert: Suspicious Activity Detected",
        sender="your-email@gmail.com",
        recipients=["admin@example.com"]
    )
    msg.body = f"Warning! IP {ip} has {count} failed login attempts."
    mail.send(msg)

# ------------------- ROUTES ------------------- #
@app.route('/upload_logs', methods=['POST'])
def upload_logs():
    logs = request.json.get('logs', [])
    parsed_logs = [parse_log_line(log) for log in logs if parse_log_line(log)]

    for log in parsed_logs:
        query = "INSERT INTO logs (ip, timestamp, method, url, status, size) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (log['ip'], log['timestamp'], log['method'], log['url'], log['status'], log['size']))
    conn.commit()

    socketio.emit('new_log', parsed_logs)  # Real-time update
    return jsonify({"message": "Logs uploaded successfully!"})

@app.route('/get_logs', methods=['GET'])
def get_logs():
    cursor.execute("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100")
    data = cursor.fetchall()
    return jsonify(data)

@app.route('/detect_threats', methods=['GET'])
def detect_threats():
    cursor.execute("SELECT ip, COUNT(*) FROM logs WHERE status = '401' GROUP BY ip HAVING COUNT(*) > 5")
    threats = cursor.fetchall()
    for threat in threats:
        send_alert_email(threat[0], threat[1])
    return jsonify({"message": "Threat detection complete!"})

# ------------------- MAIN ------------------- #
if __name__ == '__main__':
    print("Starting Flask-SocketIO server...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
