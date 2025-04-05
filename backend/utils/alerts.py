import smtplib
from email.message import EmailMessage
import os

def send_alert_email(ip, count):
    msg = EmailMessage()
    msg.set_content(f"⚠️ Suspicious activity detected from IP: {ip}\nAttempts: {count}")
    msg['Subject'] = '🚨 Security Alert - Log Analyzer'
    msg['From'] = os.environ.get("EMAIL_FROM")
    msg['To'] = os.environ.get("EMAIL_TO")

    with smtplib.SMTP(os.environ.get("SMTP_SERVER"), 587) as server:
        server.starttls()
        server.login(os.environ.get("SMTP_USERNAME"), os.environ.get("SMTP_PASSWORD"))
        server.send_message(msg)
